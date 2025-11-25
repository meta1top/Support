import { randomUUID } from "crypto";
import { QdrantVectorStore } from "@langchain/qdrant";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Injectable, Logger } from "@nestjs/common";

import type { SearchDocument, SearchResult, TextSplitterConfig } from "@meta-1/nest-types";
import { AddDocumentDto } from "../dto";
import { AiConfigService, VectorStoreService } from "./";

/**
 * RAG 服务
 * 提供检索增强生成（RAG）相关功能
 */
@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  constructor(
    private readonly vectorStoreService: VectorStoreService,
    private readonly aiConfigService: AiConfigService,
  ) {}
  /**
   * 添加文档到向量存储
   * @param document 文档信息
   * @param textSplitterConfig 可选的文本分割配置，如果提供则使用此配置，否则使用全局配置
   */
  async addDocument(document: AddDocumentDto, textSplitterConfig?: TextSplitterConfig): Promise<void> {
    const config = this.aiConfigService.get();
    const finalTextSplitterConfig = textSplitterConfig || config.textSplitter || { chunkSize: 1000, chunkOverlap: 100 };
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: finalTextSplitterConfig.chunkSize,
      chunkOverlap: finalTextSplitterConfig.chunkOverlap,
    });
    const texts = await splitter.splitText(document.content);
    this.logger.log(`分割后的文本数量: ${texts.length}`);
    for (const text of texts) {
      this.logger.log(`文本: ${text}`);
    }

    const vectorStore = await this.vectorStoreService.getStore();
    await this.deleteDocument(document.id);
    await vectorStore.addDocuments(
      texts.map((text) => ({
        pageContent: text,
        id: randomUUID(),
        metadata: {
          __document_id: document.id,
          ...document.metadata,
        },
      })),
    );
  }

  /**
   * 根据 documentId 删除文档的所有 chunks
   * @param documentId 文档 ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    const vectorStore = await this.vectorStoreService.getStore();

    if (!(vectorStore instanceof QdrantVectorStore)) {
      throw new Error("当前向量存储不支持按 documentId 删除");
    }

    await vectorStore.delete({
      filter: {
        must: [
          {
            key: "metadata.__document_id",
            match: {
              value: documentId,
            },
          },
        ],
      },
    });

    this.logger.log(`已删除文档的所有 chunks: ${documentId}`);
  }

  /**
   * 根据 message 进行向量匹配搜索
   * @param searchParams 搜索参数
   * @returns 匹配的文档列表
   */
  async searchDocuments(searchParams: SearchDocument): Promise<SearchResult[]> {
    const vectorStore = await this.vectorStoreService.getStore();

    const documents = await vectorStore.similaritySearch(searchParams.message, searchParams.k);

    this.logger.log(`搜索 "${searchParams.message}"，找到 ${documents.length} 个匹配文档`);

    return documents.map((doc) => {
      const documentId = (doc.metadata?.__document_id as string | undefined) || "";
      const chunkId = doc.id || "";

      const { __document_id, ...metadataWithoutDocumentId } = doc.metadata || {};

      return {
        id: documentId,
        chunkId,
        content: doc.pageContent,
        metadata: metadataWithoutDocumentId,
      };
    });
  }
}
