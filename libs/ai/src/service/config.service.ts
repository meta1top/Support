import { Inject, Injectable } from "@nestjs/common";

import type { AiConfig } from "@meta-1/nest-types";
import { AI_MODULE_OPTIONS } from "../shared";

/**
 * AI 配置服务
 * 用于读取 AI 模块的配置
 */
@Injectable()
export class AiConfigService {
  constructor(@Inject(AI_MODULE_OPTIONS) private readonly config: AiConfig) {}

  /**
   * 获取当前配置
   */
  get(): AiConfig {
    return this.config;
  }
}
