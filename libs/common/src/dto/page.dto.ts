import { ApiProperty } from "@nestjs/swagger";

import { PageRequestSchema } from "@meta-1/nest-types";
import { createI18nZodDto } from "../validation";

/**
 * 分页请求 DTO
 * 从 Schema 生成，用于 Controller 参数验证和 Swagger 文档
 */
export class PageRequestDto extends createI18nZodDto(PageRequestSchema) {}

/**
 * 分页响应 DTO（泛型类）
 * 用于运行时实例化，对应 Java 的 PageResult<T>
 */
export class PageDataDto<T> {
  @ApiProperty({ description: "总数", example: 10 })
  total: number;

  @ApiProperty({ description: "数据列表", isArray: true })
  data: T[];

  constructor(total: number, data: T[]) {
    this.total = total;
    this.data = data;
  }

  /**
   * 静态工厂方法
   */
  static of<T>(total: number, data: T[]): PageDataDto<T> {
    return new PageDataDto(total, data);
  }
}
