import { createI18nZodDto } from "@meta-1/nest-common";
import { PresignedDownloadUrlRequestSchema, PresignedDownloadUrlResponseSchema } from "@meta-1/nest-types";

/**
 * 预签名下载 URL 请求参数
 */
export class PresignedDownloadUrlRequestDto extends createI18nZodDto(PresignedDownloadUrlRequestSchema) {}

/**
 * 预签名下载 URL 响应
 */
export class PresignedDownloadUrlResponseDto extends createI18nZodDto(PresignedDownloadUrlResponseSchema) {}
