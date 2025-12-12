import * as path from "node:path";
import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscoveryModule } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@nestjs-modules/ioredis";
import { AcceptLanguageResolver, HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from "nestjs-i18n";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { AiModule } from "@meta-1/nest-ai";
import { AssetsModule } from "@meta-1/nest-assets";
import { CommonModule, getI18nCollector, initI18nCollector } from "@meta-1/nest-common";
import { MessageModule } from "@meta-1/nest-message";
import { SecurityModule } from "@meta-1/nest-security";
import { AppController, AssetsController, MailCodeController, TestLockController } from "./controller";
import { TestLockService } from "./service";
import { AppConfig } from "./shared";

@Module({})
export class AppModule {
  static forRoot(preloadedConfig: AppConfig | null): DynamicModule {
    const logger = new Logger(AppModule.name);
    const i18nPath = path.join(__dirname, "i18n");
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      // 开发环境下初始化 I18n 缺失键收集器
      // locales 目录在项目根目录
      const localesDir = path.join(process.cwd(), "locales");
      initI18nCollector(localesDir);
      logger.log("I18n 缺失键收集器已启动");
    }

    const imports: DynamicModule["imports"] = [
      DiscoveryModule,
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: "apps/server-demo/.env",
      }),
      I18nModule.forRoot({
        fallbackLanguage: "zh-CN",
        loader: I18nJsonLoader,
        loaderOptions: {
          path: i18nPath,
          watch: isDevelopment,
        },
        logging: isDevelopment,
        resolvers: [
          { use: QueryResolver, options: ["lang"] },
          new HeaderResolver(["x-lang"]),
          new AcceptLanguageResolver(),
        ],
        // 开发环境下启用缺失翻译的监听
        ...(isDevelopment && {
          missingKeyHandler: (key: string) => {
            const collector = getI18nCollector();
            if (collector) {
              if (key.includes(".")) {
                const actualKey = key.split(".").slice(1).join(".");
                collector.add(actualKey);
              } else {
                collector.add(key);
              }
            }
          },
        }),
      }),
      CommonModule,
    ];

    if (preloadedConfig?.database) {
      logger.log("Initializing TypeORM with preloaded config");
      imports.push(
        TypeOrmModule.forRoot({
          type: "mysql",
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          ...preloadedConfig.database,
        }),
      );
    } else {
      logger.warn("Database config not found, skipping TypeORM initialization");
    }

    if (preloadedConfig?.redis) {
      logger.log("Initializing Redis with preloaded config (global)");
      imports.push({
        ...RedisModule.forRoot({
          ...preloadedConfig.redis,
        }),
        global: true,
      });
    } else {
      logger.warn("Redis config not found, skipping Redis initialization");
    }

    if (preloadedConfig?.assets) {
      logger.log("Initializing Assets with preloaded config");
      imports.push(AssetsModule.forRoot(preloadedConfig.assets));
    } else {
      logger.warn("Assets config not found, skipping Assets initialization");
    }

    if (preloadedConfig?.message) {
      logger.log("Initializing Message with preloaded config");
      imports.push(MessageModule.forRoot(preloadedConfig.message));
    } else {
      logger.warn("Message config not found, skipping Message initialization");
    }

    if (preloadedConfig?.security) {
      logger.log("Initializing Security with preloaded config");
      imports.push(SecurityModule.forRoot(preloadedConfig.security));
    } else {
      logger.warn("Security config not found, skipping Security initialization");
    }

    if (preloadedConfig?.ai) {
      logger.log("Initializing AI with preloaded config");
      imports.push(AiModule.forRoot(preloadedConfig.ai));
    } else {
      logger.warn("AI config not found, skipping AI initialization");
    }

    return {
      module: AppModule,
      imports,
      controllers: [AppController, AssetsController, MailCodeController, TestLockController],
      providers: [TestLockService],
    };
  }
}
