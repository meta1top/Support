import { z } from "zod";

/**
 * Agent 调用请求 Schema
 */
export const InvokeAgentSchema = z.object({
  message: z.string().min(1, "消息内容不能为空").describe("用户输入的消息内容"),
});

export type InvokeAgent = z.infer<typeof InvokeAgentSchema>;

/**
 * AI 配置 Schema
 */
export const AiConfigSchema = z.object({
  model: z.object({
    name: z.string().describe("模型名称"),
    apiKey: z.string().describe("API 密钥"),
    apiBaseUrl: z.string().optional().describe("API 基础 URL"),
    temperature: z.number().optional().describe("温度参数"),
    maxTokens: z.number().optional().describe("最大 token 数"),
    topP: z.number().optional().describe("Top P 参数"),
    frequencyPenalty: z.number().optional().describe("频率惩罚"),
    presencePenalty: z.number().optional().describe("存在惩罚"),
  }),
  vectorStore: z
    .discriminatedUnion("name", [
      z.object({
        name: z.literal("qdrant").describe("向量存储名称"),
        collectionName: z.string().describe("集合名称"),
        options: z
          .object({
            url: z.string().describe("Qdrant 服务 URL"),
            apiKey: z.string().optional().describe("Qdrant API 密钥"),
          })
          .describe("Qdrant 配置选项"),
      }),
    ])
    .describe("向量存储配置"),
  embeddings: z.object({
    name: z.string().describe("嵌入模型名称"),
    apiKey: z.string().describe("API 密钥"),
    apiBaseUrl: z.string().optional().describe("API 基础 URL"),
  }),
  textSplitter: z
    .object({
      chunkSize: z.number().int().positive().default(1000).describe("文本块大小"),
      chunkOverlap: z.number().int().nonnegative().default(100).describe("文本块重叠大小"),
    })
    .optional()
    .default({ chunkSize: 1000, chunkOverlap: 100 })
    .describe("文本分割配置"),
  mcp: z
    .object({
      name: z.string().default("mcp-server").describe("MCP 服务器名称"),
      version: z.string().default("1.0.0").describe("MCP 服务器版本"),
    })
    .optional()
    .default({ name: "mcp-server", version: "1.0.0" })
    .describe("MCP 服务器配置"),
});

export type AiConfig = z.infer<typeof AiConfigSchema>;

/**
 * 文本分割配置类型
 */
export type TextSplitterConfig = {
  chunkSize: number;
  chunkOverlap: number;
};
