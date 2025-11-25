import type { AppErrorCode } from "@meta-1/nest-common";

export const ErrorCode: Record<string, AppErrorCode> = {
  AI_CONFIG_NOT_FOUND: { code: 3000, message: "AI 配置未找到，请检查 Nacos 配置是否已加载" },
  AGENT_CONFIG_NOT_SET: { code: 3001, message: "Agent 配置未设置，请先调用 setAgentConfig" },
  AGENT_NOT_INITIALIZED: { code: 3002, message: "Agent 未正确初始化" },
};
