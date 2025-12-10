import { existsSync } from "node:fs";
import * as path from "node:path";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";

import { ConfigLoader, ConfigSourceType, syncLocales } from "@meta-1/nest-common";
import { AppModule } from "./app.module";
import type { AppConfig } from "./shared";
import { setupSwagger } from "./shared";

const nodeEnv = process.env.NODE_ENV;
const devEnvPath = path.join(process.cwd(), "apps/server-demo/.env");
const hasDevEnvFile = existsSync(devEnvPath);
const isDevelopment = nodeEnv === "development" || (!nodeEnv && hasDevEnvFile);

const envPath = isDevelopment ? devEnvPath : path.join(process.cwd(), ".env");
config({
  path: envPath,
});

async function bootstrap() {
  const loader = new ConfigLoader<AppConfig>({
    type: ConfigSourceType.NACOS,
    server: process.env.NACOS_SERVER!,
    dataId: process.env.APP_NAME!,
  });
  const config = await loader.load();
  if (!config) {
    throw new Error("Failed to load configuration");
  }
  const logger = new Logger("Main");
  // 同步 locales 文件（启动时同步 + 开发模式下监听）
  const isDevelopment = process.env.NODE_ENV === "development";
  logger.log(`Syncing locales in ${isDevelopment ? "development" : "production"} mode`);
  syncLocales({
    sourceDir: path.join(process.cwd(), "locales"),
    targetDir: path.join(process.cwd(), "dist/apps/server-demo/i18n"),
    watch: isDevelopment,
  });
  const app = await NestFactory.create(AppModule.forRoot(config));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3100);
  logger.log(`Server is running on port ${process.env.PORT ?? 3100}`);
}
bootstrap();
