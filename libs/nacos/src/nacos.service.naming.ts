import os from "node:os";
import { format } from "node:util";
import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Hosts, NacosNamingClient } from "nacos";
import { v4 as uuidv4 } from "uuid";

import { NACOS_MODULE_OPTIONS } from "./nacos.const";
import type { NacosModuleOptions } from "./nacos.types";

@Injectable()
export class NacosNamingService implements OnModuleInit, OnModuleDestroy {
  private client: NacosNamingClient;
  private readonly logger = new Logger(NacosNamingService.name);
  private readonly instanceId: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NACOS_MODULE_OPTIONS) private readonly options: NacosModuleOptions,
  ) {
    // 初始化时生成唯一的 instanceId，整个生命周期保持不变
    this.instanceId = uuidv4();
  }

  async onModuleInit() {
    this.client = new NacosNamingClient({
      logger: {
        info: (...args: unknown[]) => this.logger.log(format(...args)),
        warn: (...args: unknown[]) => this.logger.warn(format(...args)),
        error: (...args: unknown[]) => this.logger.error(format(...args)),
        debug: (...args: unknown[]) => this.logger.debug(format(...args)),
      } as typeof console,
      serverList: this.options.server,
      namespace: this.options.namespace || "public",
      username: this.options.username,
      password: this.options.password,
    });
    await this.client.ready();
    await this.register();
    this.logger.log("NacosNamingService initialized");
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.deregisterInstance(this.options.naming.serviceName, {
          instanceId: this.instanceId,
          healthy: this.options.naming.healthy ?? true,
          enabled: this.options.naming.enabled ?? true,
          ip: this.options.naming.ip ?? this.getCurrentIp(),
          port: this.configService.get<number>("PORT") ?? 3000,
        });
        this.logger.log("Successfully deregistered from Nacos");
      } catch (error) {
        this.logger.error("Failed to deregister from Nacos", error);
      }
    }
    this.logger.log("NacosNamingService destroyed");
  }

  private async register() {
    const ip = this.options.naming.ip ?? this.getCurrentIp();
    const port = this.configService.get<number>("PORT") ?? 3000;

    this.logger.log(
      `Registering instance: ${this.options.naming.serviceName} at ${ip}:${port} with instanceId: ${this.instanceId}`,
    );

    await this.client.registerInstance(this.options.naming.serviceName, {
      instanceId: this.instanceId,
      healthy: this.options.naming.healthy ?? true,
      enabled: this.options.naming.enabled ?? true,
      ip,
      port,
    });

    this.logger.log("Successfully registered to Nacos");
  }

  private getCurrentIp() {
    return os.networkInterfaces().en0?.[0]?.address ?? "127.0.0.1";
  }

  subscribe(serviceName: string, listener: (instances: Hosts) => void) {
    this.client.subscribe(serviceName, listener);
  }
}
