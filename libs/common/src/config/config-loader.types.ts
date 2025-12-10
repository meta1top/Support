/**
 * 配置加载源类型
 */
export enum ConfigSourceType {
  /**
   * 本地 YAML 文件
   */
  LOCAL_YAML = "local_yaml",
  /**
   * Nacos 配置中心
   */
  NACOS = "nacos",
}

/**
 * 本地 YAML 配置选项
 */
export interface LocalYamlConfig {
  /**
   * 配置源类型
   */
  type: ConfigSourceType.LOCAL_YAML;
  /**
   * YAML 文件路径
   */
  filePath: string;
}

/**
 * Nacos 配置选项
 */
export interface NacosConfig {
  /**
   * 配置源类型
   */
  type: ConfigSourceType.NACOS;
  /**
   * Nacos 服务器地址
   * @example "127.0.0.1:8848"
   */
  server: string;
  /**
   * 配置 DataId
   */
  dataId: string;
  /**
   * 配置分组
   * @default "DEFAULT_GROUP"
   */
  group?: string;
  /**
   * 命名空间 ID
   * @default "public"
   */
  namespace?: string;
  /**
   * 用户名（如需认证）
   */
  username?: string;
  /**
   * 密码（如需认证）
   */
  password?: string;
}

/**
 * 配置加载选项
 */
export type ConfigLoaderOptions = LocalYamlConfig | NacosConfig;
