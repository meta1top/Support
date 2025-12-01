import { Logger } from "@nestjs/common";
import type { Redis } from "ioredis";

import { generateKey } from "../common.utils";
import { AppError } from "../errors/app.error";
import { LockErrorCode } from "../errors/lock.error-code";

const REDIS_INSTANCE_KEY = Symbol("REDIS_INSTANCE");

/**
 * 分布式锁装饰器配置选项
 */
export interface WithLockOptions {
  /**
   * 锁的键名，支持占位符
   * - 会自动添加 `lock:` 前缀（如果 key 已以 `lock:` 开头则不会重复添加）
   * - #{3}：索引直接取值
   * - #{1.book.title}：按路径读取属性
   * - #{user.id}：等同于 #{0.user.id}，0 可以省略
   *
   * @example
   * 'user:#{0}' - 会自动变成 'lock:user:#{0}'
   * 'order:#{id}' - 会自动变成 'lock:order:#{id}'
   * 'lock:payment:#{0}' - 保持原样，不会重复添加前缀
   */
  key: string;

  /**
   * 锁的过期时间（毫秒）
   * 防止死锁，默认 30 秒
   *
   * @default 30000
   */
  ttl?: number;

  /**
   * 等待锁的超时时间（毫秒）
   * 如果在此时间内无法获取锁，则抛出错误
   * 设置为 0 表示不等待，立即失败
   *
   * @default 5000
   */
  waitTimeout?: number;

  /**
   * 重试获取锁的间隔（毫秒）
   *
   * @default 100
   */
  retryInterval?: number;

  /**
   * 获取锁失败时的错误提示
   *
   * @default '操作正在处理中，请稍后重试'
   */
  errorMessage?: string;
}

/**
 * 分布式锁装饰器
 *
 * 基于 Redis 实现的分布式锁，确保同一时刻只有一个实例能执行被装饰的方法。
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class OrderService {
 *   @WithLock({
 *     key: 'order:create:#{0}', // 会自动添加 'lock:' 前缀，最终为 'lock:order:create:#{0}'
 *     ttl: 10000,
 *     waitTimeout: 3000
 *   })
 *   async createOrder(userId: string, items: OrderItem[]) {
 *     // 此方法同一时刻只能有一个实例执行
 *     // 同一用户的订单创建操作会被加锁
 *   }
 *
 *   @WithLock({
 *     key: 'lock:payment:#{0}', // 已包含 'lock:' 前缀，不会重复添加
 *     ttl: 30000,
 *     waitTimeout: 0, // 不等待，立即失败
 *     errorMessage: '订单正在支付中，请勿重复提交'
 *   })
 *   async processPayment(orderId: string) {
 *     // 防止重复支付
 *   }
 * }
 * ```
 *
 * 使用步骤：
 * 1. 确保项目中已安装并配置 Redis
 * 2. 使用 @WithLock 装饰需要加锁的方法
 * 3. 方法所属的类会自动注入 Redis 实例
 *
 * 注意事项：
 * - 锁会在方法执行完毕后自动释放
 * - 如果方法执行时间可能超过 ttl，请适当增加 ttl 值
 * - 锁的 key 要能唯一标识业务场景，避免不同业务使用相同的 key
 * - 建议为关键业务操作（如支付、库存扣减）使用此装饰器
 */
export function WithLock(options: WithLockOptions): MethodDecorator {
  // biome-ignore lint/suspicious/noExplicitAny: decorator target type
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;

    // biome-ignore lint/suspicious/noExplicitAny: method arguments
    descriptor.value = async function (...args: any[]) {
      const redis: Redis = Reflect.getMetadata(REDIS_INSTANCE_KEY, this);
      const logger = new Logger(`${className}:${String(propertyKey)}`);

      if (!redis) {
        throw new AppError(LockErrorCode.REDIS_NOT_INJECTED);
      }

      const generatedKey = generateKey(options.key, args);
      const lockKey = generatedKey.startsWith("lock:") ? generatedKey : `lock:${generatedKey}`;
      const ttl = options.ttl || 30000; // 默认 30 秒
      const waitTimeout = options.waitTimeout ?? 5000; // 默认等待 5 秒
      const retryInterval = options.retryInterval || 100; // 默认 100ms 重试一次
      const errorMessage = options.errorMessage || "操作正在处理中，请稍后重试";

      // 生成唯一的锁值（用于释放锁时验证）
      const lockValue = `${process.pid}-${Date.now()}-${Math.random()}`;
      let acquired = false;

      logger.debug(`Attempting to acquire lock: ${lockKey}`);

      try {
        // 尝试获取锁（带重试）
        acquired = await acquireLock(redis, lockKey, lockValue, ttl, waitTimeout, retryInterval, logger);

        if (!acquired) {
          logger.warn(`Failed to acquire lock: ${lockKey}`);
          throw new AppError(LockErrorCode.LOCK_ACQUIRE_FAILED, { lockKey, message: errorMessage });
        }

        logger.debug(`Lock acquired: ${lockKey}`);

        // 执行原方法
        const result = await originalMethod.apply(this, args);

        return result;
      } finally {
        // 释放锁（只有当前持有者才能释放）
        if (acquired) {
          const released = await releaseLock(redis, lockKey, lockValue, logger);
          if (released) {
            logger.debug(`Lock released: ${lockKey}`);
          } else {
            logger.warn(`Failed to release lock (may have expired): ${lockKey}`);
          }
        }
      }
    };

    return descriptor;
  };
}

/**
 * 尝试获取分布式锁
 * 使用 SET NX EX 原子操作
 */
async function acquireLock(
  redis: Redis,
  lockKey: string,
  lockValue: string,
  ttl: number,
  waitTimeout: number,
  retryInterval: number,
  logger: Logger,
): Promise<boolean> {
  const startTime = Date.now();

  while (true) {
    try {
      // SET key value NX PX milliseconds
      // NX: 只在键不存在时设置
      // PX: 设置过期时间（毫秒）
      const result = await redis.set(lockKey, lockValue, "PX", ttl, "NX");

      if (result === "OK") {
        return true;
      }
    } catch (error) {
      logger.error(`Error acquiring lock: ${error}`);
      throw new AppError(LockErrorCode.LOCK_ACQUIRE_ERROR, { error: String(error) });
    }

    // 检查是否超时
    const elapsed = Date.now() - startTime;
    if (elapsed >= waitTimeout) {
      return false;
    }

    // 等待一段时间后重试
    await sleep(retryInterval);
  }
}

/**
 * 释放分布式锁
 * 使用 Lua 脚本确保只有锁的持有者才能释放锁
 */
async function releaseLock(redis: Redis, lockKey: string, lockValue: string, logger: Logger): Promise<boolean> {
  try {
    // Lua 脚本：检查锁的值是否匹配，匹配则删除
    const luaScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await redis.eval(luaScript, 1, lockKey, lockValue);
    return result === 1;
  } catch (error) {
    logger.error(`Error releasing lock: ${error}`);
    return false;
  }
}

/**
 * 工具函数：注入 Redis 实例到服务
 * 由初始化器调用
 */
// biome-ignore lint/suspicious/noExplicitAny: service instance
export function injectRedisForLock(instance: any, redis: Redis) {
  Reflect.defineMetadata(REDIS_INSTANCE_KEY, redis, instance);
}


/**
 * 睡眠函数
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
