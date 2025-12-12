import { defineErrorCode } from "@meta-1/nest-common";

/**
 * Security 模块错误码定义
 * 每个错误码包含 code 和 message 两个字段
 *
 * 错误码范围：0-999
 */
export const ErrorCode = defineErrorCode({
  DECRYPT_ERROR: { code: 100, message: "Decrypt error" },
  AES_ENCRYPT_ERROR: { code: 101, message: "AES encrypt error" },
  AES_DECRYPT_ERROR: { code: 102, message: "AES decrypt error" },
  TOKEN_SECRET_REQUIRED: { code: 200, message: "Token secret is required" },
  TOKEN_CREATE_ERROR: { code: 201, message: "Token creation failed" },
  TOKEN_EXPIRED: { code: 202, message: "Token has expired" },
  TOKEN_INVALID: { code: 203, message: "Token is invalid" },
  TOKEN_PARSE_ERROR: { code: 204, message: "Token parse error" },
});
