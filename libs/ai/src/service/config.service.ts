import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppError } from "@meta-1/nest-common";
import { AiConfig } from "@meta-1/nest-types";
import { AI_CONFIG, ErrorCode } from "../shared";

/**
 * AI 配置服务
 * 用于读取和保存 AI 模块的配置
 */
@Injectable()
export class AiConfigService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 保存配置
   */
  set(config: AiConfig) {
    this.configService.set(AI_CONFIG, config);
  }

  /**
   * 获取当前配置
   */
  get(): AiConfig {
    const config = this.configService.get<AiConfig>(AI_CONFIG);
    if (!config) {
      throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND);
    }
    return config;
  }
}
