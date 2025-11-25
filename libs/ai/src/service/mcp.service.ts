import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { Injectable, Logger } from "@nestjs/common";
import { Request, Response } from "express";

import { AiConfigService } from "./config.service";

/**
 * MCP 基础服务
 * 提供 MCP Server 的初始化和管理
 * 具体的 tools 和 resources 注册由业务模块实现
 */
@Injectable()
export class McpService {
  private readonly logger = new Logger(McpService.name);
  private server: McpServer | null = null;

  constructor(private readonly aiConfigService: AiConfigService) {}

  /**
   * 获取服务器实例（懒加载）
   * 如果服务器已创建，则返回缓存的实例；否则创建新实例
   */
  private getServer(): McpServer {
    if (this.server) {
      return this.server;
    }

    const config = this.aiConfigService.get();
    const mcpConfig = config.mcp ?? { name: "mcp-server", version: "1.0.0" };

    this.server = new McpServer({
      name: mcpConfig.name,
      version: mcpConfig.version,
    });

    this.logger.log(`MCP 服务器实例已创建: ${mcpConfig.name} v${mcpConfig.version}`);
    return this.server;
  }

  /**
   * 处理 MCP HTTP 请求
   */

  // biome-ignore lint/suspicious/noExplicitAny: handleRequest
  async handleRequest(req: Request, res: Response, body: any) {
    // 为每个请求创建新的 transport，防止请求 ID 冲突
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      // 当响应关闭时，关闭 transport
      res.on("close", () => {
        transport.close();
      });

      // 连接服务器和 transport
      await this.getServer().connect(transport);

      // 处理请求
      await transport.handleRequest(req, res, body);
    } catch (error) {
      // 确保发生错误时也关闭 transport
      transport.close();
      throw error;
    }
  }

  /**
   * 获取服务器实例（用于测试或扩展）
   */
  getServerInstance(): McpServer {
    return this.getServer();
  }

  /**
   * 重置服务器实例
   * 用于配置更新后重新创建服务器
   */
  resetServer() {
    this.server = null;
    this.logger.log("MCP 服务器实例已重置");
  }
}
