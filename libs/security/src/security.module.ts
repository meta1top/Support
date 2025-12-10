import { DynamicModule, Global, Module } from "@nestjs/common";
import { APP_INTERCEPTOR, DiscoveryModule } from "@nestjs/core";

import { SecurityConfigService } from "./config/security.config.service";
import { AuthInterceptor } from "./interceptors";
import { OTPService } from "./otp";
import { EncryptService } from "./security";
import { SessionService } from "./session";
import { SECURITY_MODULE_OPTIONS, type SecurityConfig } from "./shared";
import { TokenService } from "./token";

@Global()
@Module({})
export class SecurityModule {
  /**
   * 创建 Security 模块
   *
   * @param config 安全配置
   * @param global 是否为全局模块，默认为 true
   * @returns DynamicModule
   *
   * @example
   * ```typescript
   * // 在 AppModule 中导入
   * @Module({
   *   imports: [
   *     SecurityModule.forRoot({
   *       jwt: {
   *         secret: 'your-jwt-secret-key',
   *         expiresIn: '7d'
   *       },
   *       otp: {
   *         issuer: 'YourApp',
   *         debug: false,
   *         code: 123456,
   *         expiresIn: '5m'
   *       }
   *     })
   *   ]
   * })
   * export class AppModule {}
   * ```
   */
  static forRoot(config: SecurityConfig, global = true): DynamicModule {
    return {
      global,
      module: SecurityModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: SECURITY_MODULE_OPTIONS,
          useValue: config,
        },
        SecurityConfigService,
        EncryptService,
        TokenService,
        SessionService,
        OTPService,
        {
          provide: APP_INTERCEPTOR,
          useClass: AuthInterceptor,
        },
      ],
      exports: [SecurityConfigService, EncryptService, TokenService, SessionService, OTPService],
    };
  }
}
