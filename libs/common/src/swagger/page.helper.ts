import { getSchemaPath } from "@nestjs/swagger";
import type { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

import { PageDataDto } from "../dto/page.dto";

// biome-ignore lint/complexity/noBannedTypes: DTO class type needed for reflection
type DtoClass = Function;

/**
 * 创建分页响应的 Swagger Schema
 * @param itemDto 数据项的 DTO 类
 * @returns OpenAPI Schema Object
 */
export function createPageSchema(itemDto: DtoClass): SchemaObject {
  return {
    allOf: [
      { $ref: getSchemaPath(PageDataDto) },
      {
        properties: {
          data: {
            type: "array",
            items: { $ref: getSchemaPath(itemDto) },
          },
        },
      },
    ],
  };
}

/**
 * 创建 ApiExtraModels 装饰器所需的模型数组
 * @param itemDto 数据项的 DTO 类
 * @returns 包含 PageDataDto 和 itemDto 的数组
 */
export function createPageModels(itemDto: DtoClass): DtoClass[] {
  return [PageDataDto, itemDto];
}
