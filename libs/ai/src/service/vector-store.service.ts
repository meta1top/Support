import type { VectorStore } from "@langchain/core/vectorstores";
import { QdrantVectorStore } from "@langchain/qdrant";
import { Injectable, Logger } from "@nestjs/common";

import { AppError } from "@meta-1/nest-common";
import { ErrorCode } from "../shared";
import { AiConfigService } from "./config.service";
import { ModelService } from "./model.service";

/**
 * 向量存储服务
 * 用于获取和管理向量存储实例
 */
@Injectable()
export class VectorStoreService {
  private readonly logger = new Logger(VectorStoreService.name);
  private vectorStore: VectorStore | null = null;

  constructor(
    private readonly aiConfigService: AiConfigService,
    private readonly modelService: ModelService,
  ) {}

  /**
   * 获取向量存储实例
   * 如果向量存储已创建，则返回缓存的实例；否则创建新实例
   * @returns VectorStore 向量存储实例
   */
  async getStore(): Promise<VectorStore> {
    if (this.vectorStore) {
      return this.vectorStore;
    }

    const config = this.aiConfigService.get();

    if (!config.vectorStore) {
      throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND);
    }

    const embeddings = this.modelService.getEmbeddings();

    switch (config.vectorStore.name) {
      case "qdrant":
        this.vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
          url: config.vectorStore.options.url,
          apiKey: config.vectorStore.options.apiKey,
          collectionName: config.vectorStore.collectionName,
        });
        break;
      default:
        throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND, `不支持的向量存储: ${config.vectorStore.name}`);
    }

    if (!this.vectorStore) {
      throw new AppError(ErrorCode.AI_CONFIG_NOT_FOUND, "向量存储实例创建失败");
    }

    this.logger.log(`向量存储实例已创建: ${config.vectorStore.name} - ${config.vectorStore.collectionName}`);
    return this.vectorStore;
  }

  /**
   * 重置向量存储实例
   * 用于配置更新后重新创建向量存储
   */
  resetStore() {
    this.vectorStore = null;
    this.logger.log("向量存储实例已重置");
  }
}
