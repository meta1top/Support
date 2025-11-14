/**
 * 存储提供商类型
 */
export enum StorageProvider {
  S3 = "s3",
  OSS = "oss",
}

/**
 * 桶类型
 */
export enum BucketType {
  /** 私有桶 - 需要签名访问 */
  PRIVATE = "private",
  /** 公共桶 - 可直接访问 */
  PUBLIC = "public",
}
