import { createI18nZodDto } from "@meta-1/nest-common";
import { AddDocumentSchema, DeleteDocumentSchema, SearchDocumentSchema } from "@meta-1/nest-types";

/**
 * 添加文档请求 DTO
 */
export class AddDocumentDto extends createI18nZodDto(AddDocumentSchema) {}

/**
 * 删除文档请求 DTO
 */
export class DeleteDocumentDto extends createI18nZodDto(DeleteDocumentSchema) {}

/**
 * 搜索文档请求 DTO
 */
export class SearchDocumentDto extends createI18nZodDto(SearchDocumentSchema) {}
