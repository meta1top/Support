import { Global, Module, OnModuleInit } from "@nestjs/common";
import { get } from "lodash";

import { NacosConfigService } from "@meta-1/nest-nacos";
import { AiConfig } from "@meta-1/nest-types";
import { AgentService, AiConfigService, McpService, ModelService, VectorStoreService } from "./service";
import { AI_CONFIG_KEY } from "./shared";

@Global()
@Module({
  providers: [McpService, AiConfigService, ModelService, VectorStoreService, AgentService],
  exports: [McpService, AiConfigService, ModelService, VectorStoreService, AgentService],
})
export class AiModule implements OnModuleInit {
  constructor(
    private readonly nacosConfigService: NacosConfigService,
    private readonly aiConfigService: AiConfigService,
    private readonly mcpService: McpService,
    private readonly modelService: ModelService,
    private readonly vectorStoreService: VectorStoreService,
    private readonly agentService: AgentService,
  ) {}

  async onModuleInit() {
    this.nacosConfigService.subscribe<unknown>((all) => {
      const getConfig = get(all, AI_CONFIG_KEY);
      if (getConfig) {
        const config = getConfig as AiConfig;
        this.aiConfigService.set(config);
        this.mcpService.resetServer();
        this.modelService.resetModel();
        this.modelService.resetEmbeddings();
        this.vectorStoreService.resetStore();
        this.agentService.resetAgent();
      }
    });
  }
}
