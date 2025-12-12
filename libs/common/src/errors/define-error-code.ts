import { getI18nCollector } from "../i18n/i18n-collector";

/**
 * 错误代码定义配置
 */
export type ErrorCodeDefinition = Record<string, { code: number; message: string }>;

/**
 * 待采集的错误码注册表
 * 用于在 collector 初始化前暂存错误码定义
 */
const pendingErrorCodes: ErrorCodeDefinition[] = [];

/**
 * 错误代码代理处理器
 * 在访问时自动采集 i18n key
 */
function createErrorCodeProxy<T extends ErrorCodeDefinition>(definition: T): Readonly<T> {
  // 记录已采集的 message,避免重复采集
  const collectedMessages = new Set<string>();

  const proxy = new Proxy(definition, {
    get(target, prop: string) {
      const errorCode = target[prop];

      if (!errorCode || typeof errorCode !== "object") {
        return errorCode;
      }

      // 为每个错误代码创建代理,拦截 message 访问
      return new Proxy(errorCode, {
        get(errorTarget, errorProp: string) {
          const value = errorTarget[errorProp as keyof typeof errorTarget];

          // 当访问 message 时,自动采集 i18n key
          if (errorProp === "message" && typeof value === "string" && !collectedMessages.has(value)) {
            const collector = getI18nCollector();

            if (collector) {
              // 使用 message 的值作为 i18n key
              collector.add(value);
              collectedMessages.add(value);
            }
          }

          return value;
        },
      });
    },
  });

  return Object.freeze(proxy) as Readonly<T>;
}

/**
 * 定义错误代码
 * 自动为所有错误代码添加 i18n 支持并采集 key
 *
 * @param definition - 错误代码定义对象
 * @returns 冻结的错误代码对象
 *
 * @example
 * ```ts
 * export const ErrorCode = defineErrorCode({
 *   SERVER_ERROR: { code: 500, message: "Server Error" },
 *   NOT_FOUND: { code: 404, message: "Not Found" },
 * });
 * ```
 */
export function defineErrorCode<T extends ErrorCodeDefinition>(definition: T): Readonly<T> {
  // 注册到待采集列表,等 collector 初始化后统一采集
  pendingErrorCodes.push(definition);

  return createErrorCodeProxy(definition);
}

/**
 * 采集错误码的 i18n key
 */
function collectErrorCodes(definition: ErrorCodeDefinition) {
  const collector = getI18nCollector();
  if (!collector) return;

  for (const key of Object.keys(definition)) {
    const errorCode = definition[key];
    // 使用 message 的值作为 i18n key
    collector.add(errorCode.message);
  }
}

/**
 * 处理所有待采集的错误码
 * 在 i18n collector 初始化后调用
 * @internal 此函数由 initI18nCollector 自动调用,无需手动调用
 */
export function flushPendingErrorCodes() {
  const collector = getI18nCollector();
  if (!collector) return;

  for (const definition of pendingErrorCodes) {
    collectErrorCodes(definition);
  }

  // 清空待采集列表
  pendingErrorCodes.length = 0;
}
