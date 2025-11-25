import { createZodDto } from "nestjs-zod";

import { InvokeAgentSchema } from "@meta-1/nest-types";

/**
 * Agent 调用请求 DTO
 */
export class InvokeAgentDto extends createZodDto(InvokeAgentSchema) {}
