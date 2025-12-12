import { createI18nZodDto } from "@meta-1/nest-common";
import { PresignedUploadUrlRequestSchema, PresignedUploadUrlResponseSchema } from "@meta-1/nest-types";

/**
 * 预签名上传 URL 请求参数
 */
export class PresignedUploadUrlRequestDto extends createI18nZodDto(PresignedUploadUrlRequestSchema) {}

/**
 * 预签名上传 URL 响应
 */
export class PresignedUploadUrlResponseDto extends createI18nZodDto(PresignedUploadUrlResponseSchema) {}
