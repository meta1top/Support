import { createI18nZodDto } from "@meta-1/nest-common";
import { InvokeAgentSchema } from "@meta-1/nest-types";

/**
 * Agent 调用请求 DTO
 */
export class InvokeAgentDto extends createI18nZodDto(InvokeAgentSchema) {}
