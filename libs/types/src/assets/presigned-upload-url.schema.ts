import { z } from "zod";

import { BucketType } from "./assets-consts";

/**
 * 预签名上传 URL 请求参数 Schema
 */
export const PresignedUploadUrlRequestSchema = z.object({
  fileName: z.string().min(1, { message: "文件名不能为空" }).describe("文件名"),
  headers: z.record(z.string()).optional().describe("HTTP 请求头（可选，如 Content-Type、Content-Length 等）"),
  bucketType: z.nativeEnum(BucketType).describe("桶类型"),
  prefix: z.string().optional().describe("文件路径前缀（可选）"),
});

export type PresignedUploadUrlRequestData = z.infer<typeof PresignedUploadUrlRequestSchema>;

/**
 * 预签名上传 URL 响应 Schema
 */
export const PresignedUploadUrlResponseSchema = z.object({
  fileName: z.string().describe("文件名"),
  signedUrl: z.string().describe("预签名上传 URL"),
  url: z.string().describe("文件访问 URL（上传成功后的访问地址）"),
  fileKey: z.string().describe("文件 Key"),
  expiresAt: z.number().describe("过期时间（Unix 时间戳，毫秒）"),
});

export type PresignedUploadUrlResponseData = z.infer<typeof PresignedUploadUrlResponseSchema>;
