import { Injectable, Logger } from "@nestjs/common";
import { createAgent } from "langchain";

import { AppError } from "@meta-1/nest-common";
import { ErrorCode } from "../shared";
import { ModelService } from "./model.service";

/**
 * Agent 基础服务
 * 提供通用的 Agent 能力，不包含具体业务逻辑
 */
@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private agent: ReturnType<typeof createAgent> | null = null;
  private isInitializing = false;
  private systemPrompt: string | null = null;
  // biome-ignore lint/suspicious/noExplicitAny: LangChain tool type
  private tools: any[] = [];

  constructor(private readonly modelService: ModelService) {}

  /**
   * 设置 Agent 配置（提示词和工具）
   * 不立即初始化，等到首次调用 invoke 时再初始化
   * @param systemPrompt 系统提示词
   * @param tools 工具列表
   */
  // biome-ignore lint/suspicious/noExplicitAny: LangChain tool type
  setAgentConfig(systemPrompt: string, tools: any[] = []) {
    this.systemPrompt = systemPrompt;
    this.tools = tools;
    this.logger.log("Agent 配置已设置（延迟初始化）");
  }

  /**
   * 重置 Agent 实例
   * 用于配置更新后重新创建 Agent
   */
  resetAgent() {
    this.agent = null;
    this.logger.log("Agent 实例已重置");
  }

  /**
   * 内部初始化 Agent
   * 在首次调用或配置更新时执行
   */
  private async ensureAgentInitialized() {
    // 如果已初始化，直接返回
    if (this.agent) {
      return;
    }

    // 如果没有配置，抛出错误
    if (!this.systemPrompt) {
      throw new AppError(ErrorCode.AGENT_CONFIG_NOT_SET);
    }

    // 如果正在初始化，等待
    if (this.isInitializing) {
      this.logger.log("Agent 正在初始化中，等待完成...");
      // 简单的轮询等待
      while (this.isInitializing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return;
    }

    this.isInitializing = true;

    try {
      // 从 ModelService 获取模型实例
      const model = this.modelService.getModel();

      // 创建 Agent
      this.agent = createAgent({
        model,
        tools: this.tools,
        systemPrompt: this.systemPrompt,
      });

      this.logger.log("Agent 初始化成功");
    } catch (error) {
      this.logger.error("Agent 初始化失败:", error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  /**
   * 调用 Agent 处理消息
   * 首次调用时会自动初始化 Agent
   * @param message 用户输入的消息
   * @returns Agent 的响应
   */
  async invoke(message: string): Promise<string> {
    // 确保 Agent 已初始化
    await this.ensureAgentInitialized();

    const result = await this.agent!.invoke({
      messages: [{ role: "user", content: message }],
    });

    // 获取最后一条消息作为响应
    const lastMessage = result.messages[result.messages.length - 1];
    const response = lastMessage.content as string;

    this.logger.log(`Agent 响应: ${response}`);
    return response;
  }
}

