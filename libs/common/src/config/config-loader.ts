import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { Logger } from "@nestjs/common";
import { NacosConfigClient } from "nacos";
import yaml from "yaml";

import {
  type ConfigLoaderOptions,
  ConfigSourceType,
  type LocalYamlConfig,
  type NacosConfig,
} from "./config-loader.types";

/**
 * 配置加载器（工具类）
 *
 * 支持从本地 YAML 文件或 Nacos 配置中心加载配置
 *
 * @template T 配置对象的类型
 *
 * @example
 * ```typescript
 * // 加载本地 YAML 配置
 * const loader = new ConfigLoader<AppConfig>({
 *   type: ConfigSourceType.LOCAL_YAML,
 *   filePath: './config/app.yaml'
 * });
 * const config = await loader.load();
 * ```
 *
 * @example
 * ```typescript
 * // 加载 Nacos 配置
 * const loader = new ConfigLoader<AppConfig>({
 *   type: ConfigSourceType.NACOS,
 *   server: '127.0.0.1:8848',
 *   dataId: 'app-config',
 *   group: 'DEFAULT_GROUP',
 *   namespace: 'public'
 * });
 * const config = await loader.load();
 * ```
 */
export class ConfigLoader<T = Record<string, unknown>> {
  private readonly logger = new Logger(ConfigLoader.name);

  constructor(private readonly options: ConfigLoaderOptions) {}

  /**
   * 加载配置
   *
   * @returns Promise<T> 返回加载的配置对象
   * @throws 配置加载失败时抛出错误
   */
  async load(): Promise<T> {
    switch (this.options.type) {
      case ConfigSourceType.LOCAL_YAML:
        return this.loadFromLocalYaml(this.options);
      case ConfigSourceType.NACOS:
        return this.loadFromNacos(this.options);
      default:
        throw new Error(`不支持的配置源类型: ${(this.options as { type: string }).type}`);
    }
  }

  /**
   * 从本地 YAML 文件加载配置
   */
  private async loadFromLocalYaml(options: LocalYamlConfig): Promise<T> {
    const absolutePath = path.resolve(options.filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`配置文件不存在: ${absolutePath}`);
    }

    try {
      const content = fs.readFileSync(absolutePath, "utf-8");
      const config = this.parseYaml<T>(content);

      this.logger.log(`已从本地文件加载配置: ${absolutePath}`);

      return config;
    } catch (error) {
      this.logger.error(`加载本地配置文件失败: ${absolutePath}`, error);
      throw error;
    }
  }

  /**
   * 从 Nacos 加载配置
   */
  private async loadFromNacos(options: NacosConfig): Promise<T> {
    let nacosClient: NacosConfigClient | undefined;
    let tempCacheDir: string | undefined;

    try {
      // 创建临时缓存目录（禁用快照功能）
      tempCacheDir = path.join(os.tmpdir(), `nacos-nocache-${Date.now()}`);

      nacosClient = new NacosConfigClient({
        serverAddr: options.server,
        namespace: options.namespace ?? "public",
        username: options.username,
        password: options.password,
        cacheDir: tempCacheDir, // 使用临时目录，避免读取旧缓存
      });

      const content = await nacosClient.getConfig(options.dataId, options.group ?? "DEFAULT_GROUP");

      if (!content) {
        throw new Error(`从 Nacos 获取配置为空: dataId=${options.dataId}, group=${options.group}`);
      }

      const config = this.parseYaml<T>(content);

      this.logger.log(
        `已从 Nacos 加载配置: server=${options.server}, dataId=${options.dataId}, group=${options.group}`,
      );

      return config;
    } catch (error) {
      this.logger.error("从 Nacos 加载配置失败", error);
      throw error;
    } finally {
      if (nacosClient) {
        nacosClient.close();
        this.logger.log("Nacos 客户端已关闭");
      }
      // 清理临时缓存目录
      if (tempCacheDir && fs.existsSync(tempCacheDir)) {
        try {
          fs.rmSync(tempCacheDir, { recursive: true, force: true });
        } catch (err) {
          this.logger.warn(`清理临时缓存目录失败: ${tempCacheDir}`, err);
        }
      }
    }
  }

  /**
   * 解析 YAML 内容
   */
  private parseYaml<T>(content: string): T {
    try {
      const parsed = yaml.parse(content);
      if (parsed === null || parsed === undefined) {
        throw new Error("解析的配置内容为空");
      }
      return parsed as T;
    } catch (error) {
      this.logger.error("解析 YAML 失败", error);
      throw new Error(`YAML 解析错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
