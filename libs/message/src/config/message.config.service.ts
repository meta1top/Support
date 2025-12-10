import { Inject, Injectable } from "@nestjs/common";

import { MESSAGE_MODULE_OPTIONS, type MessageConfig } from "../shared";

/**
 * 消息配置服务
 * 用于读取 MessageModule 的配置
 */
@Injectable()
export class MessageConfigService {
  constructor(@Inject(MESSAGE_MODULE_OPTIONS) private readonly config: MessageConfig) {}

  /**
   * 获取当前配置
   */
  get(): MessageConfig {
    return this.config;
  }
}
