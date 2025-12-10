import { Inject, Injectable } from "@nestjs/common";

import { SECURITY_MODULE_OPTIONS, type SecurityConfig } from "../shared";

/**
 * 安全配置服务
 * 用于读取 SecurityModule 的配置
 */
@Injectable()
export class SecurityConfigService {
  constructor(@Inject(SECURITY_MODULE_OPTIONS) private readonly config: SecurityConfig) {}

  /**
   * 获取当前配置
   */
  get(): SecurityConfig {
    return this.config;
  }
}
