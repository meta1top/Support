import { createZodDto } from "nestjs-zod";

import { PresignedDownloadUrlRequestSchema, PresignedDownloadUrlResponseSchema } from "@meta-1/nest-types";

/**
 * 预签名下载 URL 请求参数
 */
export class PresignedDownloadUrlRequestDto extends createZodDto(PresignedDownloadUrlRequestSchema) {}

/**
 * 预签名下载 URL 响应
 */
export class PresignedDownloadUrlResponseDto extends createZodDto(PresignedDownloadUrlResponseSchema) {}
