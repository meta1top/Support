import { defineErrorCode } from "@meta-1/nest-common";

/**
 * Assets 模块错误码定义
 * 每个错误码包含 code 和 message 两个字段
 *
 * 错误码范围：3100-3299
 */
export const ErrorCode = defineErrorCode({
  PROVIDER_NOT_SUPPORTED: { code: 3100, message: "Storage provider not supported" },
  S3_NOT_CONFIGURED: { code: 3101, message: "S3 service is not configured" },
  OSS_NOT_CONFIGURED: { code: 3102, message: "OSS service is not configured" },
  S3_INIT_ERROR: { code: 3103, message: "S3 service initialization failed" },
  OSS_INIT_ERROR: { code: 3104, message: "OSS service initialization failed" },
  UPLOAD_URL_GENERATE_ERROR: { code: 3200, message: "Failed to generate upload URL" },
  DOWNLOAD_URL_GENERATE_ERROR: { code: 3201, message: "Failed to generate download URL" },
});
