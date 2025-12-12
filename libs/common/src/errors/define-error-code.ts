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
 * 采集单个错误码定义的 i18n key
 */
function collectErrorCodeDefinition<T extends ErrorCodeDefinition>(definition: T): void {
  const collector = getI18nCollector();
  if (!collector) {
    return;
  }

  for (const errorCode of Object.values(definition)) {
    collector.add(errorCode.message);
  }
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
  const collector = getI18nCollector();
  if (collector) {
    collectErrorCodeDefinition(definition);
  } else {
    pendingErrorCodes.push(definition);
  }

  return Object.freeze(definition) as Readonly<T>;
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
    collectErrorCodeDefinition(definition);
  }

  pendingErrorCodes.length = 0;
}
