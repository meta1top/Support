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
import { CommonModule } from "@meta-1/nest-common";
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
          watch: process.env.NODE_ENV === "development",
        },
        logging: true,
        resolvers: [
          { use: QueryResolver, options: ["lang"] },
          new HeaderResolver(["x-lang"]),
          new AcceptLanguageResolver(),
        ],
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
