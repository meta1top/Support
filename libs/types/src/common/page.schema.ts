import { z } from "zod";

/**
 * 分页请求 Schema
 * 对应 Java 的 PageRequest
 * 使用 coerce 自动将查询参数的字符串转换为数字
 */
export const PageRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).describe("页码"),
  size: z.coerce.number().int().min(1).max(100).default(20).describe("每页数量"),
  keyword: z.string().optional().describe("关键词搜索"),
});

export type PageRequestData = z.infer<typeof PageRequestSchema>;

/**
 * 分页响应 Schema（用于定义结构）
 */
export const PageDataSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    total: z.number().int().min(0).describe("总数"),
    data: z.array(itemSchema).describe("数据列表"),
  });
