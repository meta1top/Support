import { createHash } from "node:crypto";
import { get } from "lodash";

export const md5 = (text: string): string => {
  return createHash("md5").update(text).digest("hex");
};

/**
 * 生成动态键名
 * 支持多种占位符格式：
 * - #{3}：索引直接取值
 * - #{1.book.title}：按路径读取属性
 * - #{user.id}：等同于 #{0.user.id}，0 可以省略
 *
 * @param pattern - 键名模板，支持占位符
 * @param args - 方法参数数组
 * @returns 替换占位符后的键名
 *
 * @example
 * ```typescript
 * // 索引直接取值
 * generateKey('user:#{0}', ['123']) // 'user:123'
 *
 * // 第一个参数的属性（省略索引，等同于 #{0.user.id}）
 * generateKey('order:#{user.id}', [{ user: { id: '456' } }]) // 'order:456'
 *
 * // 指定参数的路径属性
 * generateKey('lock:#{1.book.title}', ['ignored', { book: { title: 'Test' } }]) // 'lock:Test'
 *
 * // 深度路径
 * generateKey('cache:#{user.profile.name}', [{ user: { profile: { name: 'John' } } }]) // 'cache:John'
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: generic key generation
export function generateKey(pattern: string, args: any[]): string {
  let key = pattern;

  // 1. 处理带索引的路径占位符：#{数字.路径}（如 #{1.book.title}）
  // 匹配 #{数字.路径} 格式
  const indexedPathRegex = /#\{(\d+)\.([^}]+)\}/g;
  key = key.replace(indexedPathRegex, (match, indexStr, path) => {
    const index = Number.parseInt(indexStr, 10);
    if (index >= 0 && index < args.length) {
      const value = get(args[index], path);
      return value !== undefined && value !== null ? String(value) : match;
    }
    return match;
  });

  // 2. 处理不带索引的路径占位符：#{路径}（默认从第一个参数获取，等同于 #{0.路径}）
  // 匹配 #{路径} 格式，但不匹配 #{数字} 格式
  const pathRegex = /#\{([^}]+)\}/g;
  key = key.replace(pathRegex, (match, content) => {
    // 如果已经是纯数字（索引占位符），跳过，稍后处理
    if (/^\d+$/.test(content)) {
      return match;
    }

    // 从第一个参数获取路径值（等同于 #{0.路径}）
    if (args.length > 0) {
      const value = get(args[0], content);
      return value !== undefined && value !== null ? String(value) : match;
    }
    return match;
  });

  // 3. 处理简单的索引占位符：#{0}, #{1} 等（直接取值）
  // 这些占位符在步骤2中会被跳过，现在处理它们
  args.forEach((arg, index) => {
    const indexRegex = new RegExp(`#\\{${index}\\}`, "g");
    key = key.replace(indexRegex, () => String(arg));
  });

  return key;
}

/**
 * ## Key 占位符使用说明
 *
 * 在 `@WithLock` 和 `@Cacheable` 装饰器中，`key` 参数支持动态占位符。
 *
 * ### 语法规则
 *
 * 1. **`#{3}`** - 索引直接取值
 *    ```typescript
 *    @WithLock({ key: 'lock:user:#{0}' })
 *    async createOrder(userId: string) { }
 *    ```
 *
 * 2. **`#{1.book.title}`** - 按路径读取属性
 *    ```typescript
 *    @WithLock({ key: 'lock:order:#{1.book.title}' })
 *    async processOrder(orderId: string, book: { title: string }) { }
 *    ```
 *
 * 3. **`#{user.id}`** - 等同于 `#{0.user.id}`，0 可以省略
 *    ```typescript
 *    @Cacheable({ key: 'cache:user:#{user.id}' })
 *    async getUserProfile(data: { user: { id: string } }) { }
 *    ```
 *
 * ### 示例
 *
 * ```typescript
 * // 混合使用
 * @WithLock({ key: 'lock:order:#{0}:#{status}:#{1.user.id}' })
 * async processOrder(
 *   orderId: string,
 *   order: { status: string },
 *   user: { id: string }
 * ) { }
 * ```
 *
 * ### 注意事项
 *
 * - 路径解析使用 lodash 的 `get` 方法，支持嵌套属性访问
 * - 如果值为 `undefined` 或 `null`，占位符不会被替换
 * - `@WithLock` 和 `@Cacheable` 装饰器会自动添加 `lock:` 和 `cache:` 前缀
 */
