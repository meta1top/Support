import { DynamicModule, Global, Module } from "@nestjs/common";

import { AiConfig } from "@meta-1/nest-types";
import { AgentService, AiConfigService, McpService, ModelService, VectorStoreService } from "./service";
import { AI_MODULE_OPTIONS } from "./shared";

@Global()
@Module({})
export class AiModule {
  /**
   * 创建 AI 模块
   *
   * @param config AI 配置
   * @param global 是否为全局模块，默认为 true
   * @returns DynamicModule
   *
   * @example
   * ```typescript
   * // 在 AppModule 中导入
   * @Module({
   *   imports: [
   *     AiModule.forRoot({
   *       provider: 'deepseek',
   *       apiKey: 'your-api-key',
   *       baseUrl: 'https://api.deepseek.com',
   *       model: {
   *         chat: 'deepseek-chat',
   *         embeddings: 'deepseek-embeddings'
   *       },
   *       vectorStore: {
   *         type: 'qdrant',
   *         url: 'http://localhost:6333',
   *         collectionName: 'my-collection'
   *       }
   *     })
   *   ]
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(config: AiConfig, global = true): DynamicModule {
    return {
      global,
      module: AiModule,
      providers: [
        {
          provide: AI_MODULE_OPTIONS,
          useValue: config,
        },
        AiConfigService,
        McpService,
        ModelService,
        VectorStoreService,
        AgentService,
      ],
      exports: [AiConfigService, McpService, ModelService, VectorStoreService, AgentService],
    };
  }
}
