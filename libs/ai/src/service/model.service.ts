import { AlibabaTongyiEmbeddings } from "@langchain/community/embeddings/alibaba_tongyi";
import type { Embeddings } from "@langchain/core/embeddings";
import { ChatDeepSeek } from "@langchain/deepseek";
import { Injectable, Logger } from "@nestjs/common";

import { AppError } from "@meta-1/nest-common";
import { ErrorCode } from "../shared";
import { AiConfigService } from "./config.service";

/**
 * 模型服务
 * 用于获取和管理 AI 模型实例
 */
@Injectable()
export class ModelService {
  private readonly logger = new Logger(ModelService.name);
  private model: ChatDeepSeek | null = null;
  private embeddings: Embeddings | null = null;

  constructor(private readonly aiConfigService: AiConfigService) {}

  /**
   * 获取模型实例
   * 如果模型已创建，则返回缓存的实例；否则创建新实例
   * @returns ChatDeepSeek 模型实例
   */
  getModel(): ChatDeepSeek {
    if (this.model) {
      return this.model;
    }

    const config = this.aiConfigService.get();

    if (!config.model) {
      throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND);
    }

    this.model = new ChatDeepSeek({
      apiKey: config.model.apiKey,
      temperature: config.model.temperature ?? 0.1,
      model: config.model.name,
      maxTokens: config.model.maxTokens,
      topP: config.model.topP,
      frequencyPenalty: config.model.frequencyPenalty,
      presencePenalty: config.model.presencePenalty,
      ...(config.model.apiBaseUrl && { baseURL: config.model.apiBaseUrl }),
    });

    this.logger.log(`模型实例已创建: ${config.model.name}`);
    return this.model;
  }

  /**
   * 获取嵌入模型实例
   * 如果嵌入模型已创建，则返回缓存的实例；否则创建新实例
   * @returns Embeddings 嵌入模型实例
   */
  getEmbeddings(): Embeddings {
    if (this.embeddings) {
      return this.embeddings;
    }

    const config = this.aiConfigService.get();

    if (!config.embeddings) {
      throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND);
    }

    switch (config.embeddings.name) {
      case "alibaba_tongyi":
        this.embeddings = new AlibabaTongyiEmbeddings({
          apiKey: config.embeddings.apiKey,
          ...(config.embeddings.apiBaseUrl && { baseURL: config.embeddings.apiBaseUrl }),
        });
        break;
      default:
        throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND, `不支持的嵌入模型: ${config.embeddings.name}`);
    }

    this.logger.log(`嵌入模型实例已创建: ${config.embeddings.name}`);
    return this.embeddings;
  }

  /**
   * 重置模型实例
   * 用于配置更新后重新创建模型
   */
  resetModel() {
    this.model = null;
    this.logger.log("模型实例已重置");
  }

  /**
   * 重置嵌入模型实例
   * 用于配置更新后重新创建嵌入模型
   */
  resetEmbeddings() {
    this.embeddings = null;
    this.logger.log("嵌入模型实例已重置");
  }
}
