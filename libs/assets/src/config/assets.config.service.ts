import { Inject, Injectable } from "@nestjs/common";

import { ASSETS_MODULE_OPTIONS, type AssetsConfig } from "../shared";

/**
 * 资源配置服务
 * 用于读取 AssetsModule 的配置
 */
@Injectable()
export class AssetsConfigService {
  constructor(@Inject(ASSETS_MODULE_OPTIONS) private readonly config: AssetsConfig) {}

  /**
   * 获取当前配置
   */
  get(): AssetsConfig {
    return this.config;
  }
}
