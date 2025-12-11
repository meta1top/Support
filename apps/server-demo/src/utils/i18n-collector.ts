import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Logger } from "@nestjs/common";

/**
 * 后端 I18n 缺失键收集器
 * 仅在开发环境工作
 *
 * 功能：
 * 1. 收集缺失的翻译键
 * 2. 批量写入到项目根目录的 locales 文件
 * 3. 按字符排序，最小化 Git 冲突
 */
export class I18nCollectorServer {
  private readonly logger = new Logger(I18nCollectorServer.name);
  private readonly pendingKeys = new Set<string>();
  private readonly localesDir: string;
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly flushInterval = 30000; // 30秒批量写入一次
  private readonly fileLocks = new Map<string, Promise<void>>();

  constructor(localesDir: string) {
    this.localesDir = localesDir;

    // 确保 locales 目录存在
    if (!existsSync(this.localesDir)) {
      mkdirSync(this.localesDir, { recursive: true });
    }

    // 启动定时写入
    this.startFlushWorker();
  }

  /**
   * 添加缺失的翻译键
   */
  add(namespace: string, key: string) {
    const fullKey = namespace ? `${namespace}:${key}` : key;

    if (this.pendingKeys.has(fullKey)) {
      return;
    }

    this.pendingKeys.add(fullKey);
    this.logger.warn(`发现缺失翻译键: ${fullKey}`);
  }

  /**
   * 启动定时写入 Worker
   */
  private startFlushWorker() {
    // 进程退出时写入
    process.on("beforeExit", () => {
      this.flushNow();
    });

    // 定时写入
    this.flushTimer = setInterval(() => {
      this.flushNow();
    }, this.flushInterval);
  }

  /**
   * 立即写入所有缺失的键到文件
   */
  async flushNow() {
    if (this.pendingKeys.size === 0) {
      return;
    }

    const keys = Array.from(this.pendingKeys);
    this.logger.log(`正在写入 ${keys.length} 个缺失的翻译键...`);

    try {
      await this.writeToLocales(keys);
      this.pendingKeys.clear();
      this.logger.log(`成功写入 ${keys.length} 个翻译键`);
    } catch (error) {
      this.logger.error("写入翻译键失败:", error);
    }
  }

  /**
   * 写入到 locales 文件（并发安全）
   */
  private async writeToLocales(keys: string[]) {
    const languages = ["en", "zh-CN"];

    await Promise.all(languages.map((lang) => this.writeToLanguageFile(lang, keys)));
  }

  /**
   * 写入单个语言文件（原子操作 + 文件锁）
   */
  private async writeToLanguageFile(lang: string, keys: string[]): Promise<void> {
    const langFile = `${lang}.json`;
    const filePath = join(this.localesDir, langFile);
    const tempFilePath = join(this.localesDir, `.${langFile}.tmp`);

    // 获取文件锁
    const releaseLock = await this.acquireLock(filePath);

    try {
      // 读取现有内容
      let content: Record<string, string> = {};
      if (existsSync(filePath)) {
        try {
          const fileContent = readFileSync(filePath, "utf-8");
          content = JSON.parse(fileContent);
        } catch (error) {
          this.logger.warn(`读取 ${langFile} 失败:`, error);
        }
      }

      let added = 0;

      // 添加缺失的键
      for (const fullKey of keys) {
        // fullKey 格式: "namespace:key" 或 "key"
        const key = fullKey.includes(":") ? fullKey.split(":").slice(1).join(":") : fullKey;

        // 检查是否已存在（不覆盖已有翻译）
        if (!content[key]) {
          // value 等于 key，标记为未翻译状态
          content[key] = key;
          added++;
        }
      }

      // 如果没有新增内容，跳过写入
      if (added === 0) {
        return;
      }

      // 按键名字符排序（Unicode 排序）
      const sortedContent = Object.keys(content)
        .sort((a, b) => a.localeCompare(b, "zh-CN"))
        .reduce(
          (acc, key) => {
            acc[key] = content[key];
            return acc;
          },
          {} as Record<string, string>,
        );

      // 写入临时文件
      const jsonContent = JSON.stringify(sortedContent, null, 2);
      writeFileSync(tempFilePath, jsonContent, "utf-8");

      // 原子重命名（覆盖原文件）
      renameSync(tempFilePath, filePath);

      this.logger.log(`${langFile}: 新增 ${added} 个翻译键`);
    } catch (error) {
      this.logger.error(`写入 ${langFile} 失败:`, error);
      throw error;
    } finally {
      // 释放锁
      releaseLock();
    }
  }

  /**
   * 获取文件锁
   */
  private async acquireLock(filePath: string): Promise<() => void> {
    // 等待当前文件的锁释放
    while (this.fileLocks.has(filePath)) {
      await this.fileLocks.get(filePath);
    }

    // 创建新锁
    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.fileLocks.set(filePath, lockPromise);

    // 返回释放锁的函数
    return () => {
      this.fileLocks.delete(filePath);
      releaseLock!();
    };
  }

  /**
   * 停止 Worker（用于清理）
   */
  stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // 停止前写入一次
    this.flushNow();
  }
}

// 全局单例（仅在开发环境创建）
let collectorInstance: I18nCollectorServer | null = null;

/**
 * 初始化收集器
 */
export function initI18nCollector(localesDir: string) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!collectorInstance) {
    collectorInstance = new I18nCollectorServer(localesDir);
  }

  return collectorInstance;
}

/**
 * 获取收集器实例
 */
export function getI18nCollector(): I18nCollectorServer | null {
  return collectorInstance;
}
