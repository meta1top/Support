import { DynamicModule, Module } from "@nestjs/common";

import { MessageConfigService } from "./config";
import { MailService } from "./mail";
import { MailCodeService } from "./mail-code";
import type { MessageConfig } from "./shared";
import { MESSAGE_MODULE_OPTIONS } from "./shared";

@Module({})
export class MessageModule {
  /**
   * 创建 Message 模块
   *
   * @param config 消息配置
   * @param global 是否为全局模块，默认为 true
   * @returns DynamicModule
   *
   * @example
   * ```typescript
   * // 在 AppModule 中导入
   * @Module({
   *   imports: [
   *     MessageModule.forRoot({
   *       debug: false,
   *       mail: {
   *         type: 'aws-ses',
   *         ses: {
   *           accessKeyId: 'your-access-key',
   *           accessKeySecret: 'your-secret-key',
   *           region: 'us-east-1',
   *           fromEmail: 'noreply@example.com'
   *         }
   *       }
   *     })
   *   ]
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(config: MessageConfig, global = true): DynamicModule {
    return {
      global,
      module: MessageModule,
      providers: [
        {
          provide: MESSAGE_MODULE_OPTIONS,
          useValue: config,
        },
        MessageConfigService,
        MailService,
        MailCodeService,
      ],
      exports: [MessageConfigService, MailService, MailCodeService],
    };
  }
}
