import { z } from "zod";

/**
 * 添加文档请求 Schema
 */
export const AddDocumentSchema = z.object({
  id: z.string().min(1, "文档 ID 不能为空").describe("文档唯一标识"),
  content: z.string().min(1, "文档内容不能为空").describe("文档内容"),
  metadata: z.record(z.unknown()).optional().describe("文档元数据"),
});

export type AddDocument = z.infer<typeof AddDocumentSchema>;

/**
 * 删除文档请求 Schema
 */
export const DeleteDocumentSchema = z.object({
  documentId: z.string().min(1, "文档 ID 不能为空").describe("要删除的文档 ID"),
});

export type DeleteDocument = z.infer<typeof DeleteDocumentSchema>;

/**
 * 搜索文档请求 Schema
 */
export const SearchDocumentSchema = z.object({
  message: z.string().min(1, "查询消息不能为空").describe("查询消息内容"),
  k: z.number().int().positive().optional().default(4).describe("返回的文档数量，默认为 4"),
});

export type SearchDocument = z.infer<typeof SearchDocumentSchema>;

/**
 * 搜索结果 Schema
 */
export const SearchResultSchema = z.object({
  id: z.string().describe("文档 ID"),
  chunkId: z.string().describe("Chunk ID"),
  content: z.string().describe("文档内容"),
  metadata: z.record(z.unknown()).describe("文档元数据"),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;
