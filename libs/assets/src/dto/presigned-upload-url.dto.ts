import { createZodDto } from "nestjs-zod";

import { PresignedUploadUrlRequestSchema, PresignedUploadUrlResponseSchema } from "@meta-1/nest-types";

/**
 * 预签名上传 URL 请求参数
 */
export class PresignedUploadUrlRequestDto extends createZodDto(PresignedUploadUrlRequestSchema) {}

/**
 * 预签名上传 URL 响应
 */
export class PresignedUploadUrlResponseDto extends createZodDto(PresignedUploadUrlResponseSchema) {}
