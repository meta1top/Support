import { createZodDto } from "nestjs-zod";

import { AddDocumentSchema, DeleteDocumentSchema, SearchDocumentSchema } from "@meta-1/nest-types";

/**
 * 添加文档请求 DTO
 */
export class AddDocumentDto extends createZodDto(AddDocumentSchema) {}

/**
 * 删除文档请求 DTO
 */
export class DeleteDocumentDto extends createZodDto(DeleteDocumentSchema) {}

/**
 * 搜索文档请求 DTO
 */
export class SearchDocumentDto extends createZodDto(SearchDocumentSchema) {}
