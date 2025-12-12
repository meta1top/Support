import { createZodDto } from "nestjs-zod";
import type { ZodSchema } from "zod";

import { getI18nCollector } from "../i18n/i18n-collector";

/**
 * 待采集的 Schema 注册表
 * 用于在 collector 初始化前暂存 Schema
 */
const pendingSchemas: ZodSchema[] = [];

/**
 * 通用的递归遍历对象,提取所有 message 字段
 */

// biome-ignore lint/suspicious/noExplicitAny: extractMessagesFromObject
function extractMessagesFromObject(obj: any, messages: Set<string>, visited = new WeakSet()): void {
  // 避免循环引用
  if (obj === null || obj === undefined) return;
  if (typeof obj !== "object") return;
  if (visited.has(obj)) return;

  visited.add(obj);

  // 如果当前对象有 message 字段且是字符串,添加到集合
  if (obj.message && typeof obj.message === "string") {
    messages.add(obj.message);
  }

  // 递归处理数组
  if (Array.isArray(obj)) {
    for (const item of obj) {
      extractMessagesFromObject(item, messages, visited);
    }
    return;
  }

  // 特殊处理: ZodEffects (superRefine/refine/transform) - 需要处理内部 schema
  if (obj.typeName === "ZodEffects" && obj.schema) {
    // 递归处理内部 schema
    extractMessagesFromObject(obj.schema._def, messages, visited);

    // 尝试执行 refinement 来提取动态生成的错误消息
    if (obj.effect?.type === "refinement" && typeof obj.effect.refinement === "function") {
      try {
        // 使用不同的测试数据来触发不同的错误分支
        const testCases = [
          {},
          { password: "a", password2: "b" },
          { password: "test", passwordConfirm: "different" },
          { originPassword: "a", password: "b", passwordConfirm: "c" },
        ];

        for (const testData of testCases) {
          obj.effect.refinement(testData, {
            // biome-ignore lint/suspicious/noExplicitAny: issue
            addIssue: (issue: any) => {
              if (issue.message && typeof issue.message === "string") {
                messages.add(issue.message);
              }
            },
          });
        }
      } catch {
        // 忽略执行错误
      }
    }
  }

  // 特殊处理: 如果是 Zod Object,需要调用 shape() 获取字段
  if (obj.shape && typeof obj.shape === "function") {
    try {
      const shape = obj.shape();
      for (const key in shape) {
        if (Object.hasOwn(shape, key)) {
          // 递归处理每个字段的 _def
          extractMessagesFromObject(shape[key]?._def, messages, visited);
        }
      }
    } catch {
      // 忽略错误
    }
  }

  // 递归处理对象的所有属性
  try {
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        const value = obj[key];
        extractMessagesFromObject(value, messages, visited);
      }
    }
  } catch {
    // 忽略访问错误
  }
}

/**
 * 从 Zod Schema 中提取所有的错误消息
 * 通用方案: 递归遍历整个 _def 对象,提取所有 message 字段
 */
function extractErrorMessages(schema: ZodSchema, messages: Set<string> = new Set()): Set<string> {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: schemaDef
    const schemaDef = (schema as any)._def;
    if (!schemaDef) return messages;

    // 递归遍历整个 _def 对象,提取所有 message
    extractMessagesFromObject(schemaDef, messages);
  } catch {
    // 忽略任何错误
  }

  return messages;
}

/**
 * 采集 Schema 中的所有错误消息到 i18n collector
 */
function collectSchemaMessages(schema: ZodSchema) {
  const collector = getI18nCollector();

  if (!collector) {
    // collector 未初始化,注册到待采集列表
    pendingSchemas.push(schema);
    return;
  }

  const messages = extractErrorMessages(schema);
  for (const message of messages) {
    collector.add(message);
  }
}

/**
 * 处理所有待采集的 Schema
 * 在 i18n collector 初始化后调用
 * @internal 此函数由 initI18nCollector 自动调用,无需手动调用
 */
export function flushPendingSchemas() {
  const collector = getI18nCollector();
  if (!collector) return;

  for (const schema of pendingSchemas) {
    const messages = extractErrorMessages(schema);
    for (const message of messages) {
      collector.add(message);
    }
  }

  // 清空待采集列表
  pendingSchemas.length = 0;
}

/**
 * 创建支持国际化的 Zod DTO
 * 自动采集 Schema 中的所有验证错误消息
 *
 * @param schema - Zod Schema
 * @returns DTO 类
 *
 * @example
 * ```ts
 * import { createI18nZodDto } from '@meta-1/nest-common';
 * import { SendCodeSchema } from '@meta-1/nest-types';
 *
 * export class SendCodeDto extends createI18nZodDto(SendCodeSchema) {}
 * ```
 */
export function createI18nZodDto<T extends ZodSchema>(schema: T) {
  // 采集 Schema 中的错误消息
  collectSchemaMessages(schema);

  // 返回标准的 Zod DTO
  return createZodDto(schema);
}
