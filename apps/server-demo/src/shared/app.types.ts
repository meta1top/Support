import { RedisClusterOptions, RedisSingleOptions } from "@nestjs-modules/ioredis";

import { AssetsConfig } from "@meta-1/nest-assets";
import { MessageConfig } from "@meta-1/nest-message";
import { SecurityConfig } from "@meta-1/nest-security";
import { AiConfig } from "@meta-1/nest-types";

export type DatabaseConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize?: boolean;
  logging?: boolean;
};

export type RedisConfig = RedisSingleOptions | RedisClusterOptions;

export type AppConfig = {
  database?: DatabaseConfig;
  redis?: RedisConfig;
  assets?: AssetsConfig;
  message?: MessageConfig;
  security?: SecurityConfig;
  ai?: AiConfig;
};
