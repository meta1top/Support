import { DynamicModule, Module } from "@nestjs/common";

import { AssetsService } from "./assets.service";
import { AssetsConfigService } from "./config";
import { OSSService } from "./oss";
import { S3Service } from "./s3";
import { ASSETS_MODULE_OPTIONS, type AssetsConfig } from "./shared";

@Module({})
export class AssetsModule {
  /**
   * 创建 Assets 模块
   *
   * @param config 资源配置
   * @param global 是否为全局模块，默认为 true
   * @returns DynamicModule
   *
   * @example
   * ```typescript
   * // 在 AppModule 中导入 - S3 配置
   * @Module({
   *   imports: [
   *     AssetsModule.forRoot({
   *       storage: {
   *         provider: StorageProvider.S3,
   *         publicBucket: 'my-public-bucket',
   *         privateBucket: 'my-private-bucket',
   *         expiresIn: '30m'
   *       },
   *       s3: {
   *         region: 'us-east-1',
   *         accessKeyId: 'your-access-key',
   *         secretAccessKey: 'your-secret-key'
   *       }
   *     })
   *   ]
   * })
   * export class AppModule {}
   * ```
   *
   * @example
   * ```typescript
   * // 在 AppModule 中导入 - OSS 配置
   * @Module({
   *   imports: [
   *     AssetsModule.forRoot({
   *       storage: {
   *         provider: StorageProvider.OSS,
   *         publicBucket: 'my-public-bucket',
   *         privateBucket: 'my-private-bucket',
   *         expiresIn: '30m'
   *       },
   *       oss: {
   *         region: 'oss-cn-hangzhou',
   *         accessKeyId: 'your-access-key',
   *         accessKeySecret: 'your-secret-key'
   *       }
   *     })
   *   ]
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(config: AssetsConfig, global = true): DynamicModule {
    return {
      global,
      module: AssetsModule,
      providers: [
        {
          provide: ASSETS_MODULE_OPTIONS,
          useValue: config,
        },
        AssetsConfigService,
        S3Service,
        OSSService,
        AssetsService,
      ],
      exports: [AssetsConfigService, AssetsService],
    };
  }
}
