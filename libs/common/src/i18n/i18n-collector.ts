import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
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
  private readonly existingKeys = new Set<string>(); // 已存在的 key 集合
  private readonly localesDir: string;
  private flushTimer: NodeJS.Timeout | null = null;
  private readonly flushInterval = 10000; // 10秒批量写入一次
  private readonly fileLocks = new Map<string, Promise<void>>();
  private languages: string[] = [];

  constructor(localesDir: string) {
    this.localesDir = localesDir;

    if (!existsSync(this.localesDir)) {
      mkdirSync(this.localesDir, { recursive: true });
    }

    // 扫描 locales 目录,获取所有语言文件
    this.scanLanguages();

    // 加载已存在的 keys
    this.loadExistingKeys();

    this.startFlushWorker();
  }

  /**
   * 扫描 locales 目录,获取所有 JSON 语言文件
   */
  private scanLanguages() {
    try {
      const files = readdirSync(this.localesDir);
      this.languages = files
        .filter((file) => file.endsWith(".json") && !file.startsWith("."))
        .map((file) => file.replace(".json", ""));

      if (this.languages.length === 0) {
        this.logger.warn("未找到任何语言文件,将使用默认语言: en, zh-CN");
        this.languages = ["en", "zh-CN"];
      } else {
        this.logger.log(`检测到 ${this.languages.length} 个语言文件: ${this.languages.join(", ")}`);
      }
    } catch (error) {
      this.logger.error("扫描语言文件失败:", error);
      this.languages = ["en", "zh-CN"];
    }
  }

  /**
   * 加载所有已存在的 keys (从第一个语言文件加载即可)
   */
  private loadExistingKeys() {
    if (this.languages.length === 0) return;

    try {
      const firstLang = this.languages[0];
      const filePath = join(this.localesDir, `${firstLang}.json`);

      if (existsSync(filePath)) {
        const content = readFileSync(filePath, "utf-8");
        const data = JSON.parse(content);

        // 提取所有 key (不包括 namespace 前缀)
        for (const key of Object.keys(data)) {
          this.existingKeys.add(key);
        }

        this.logger.log(`从 ${firstLang}.json 加载了 ${this.existingKeys.size} 个已存在的 key`);
      }
    } catch (error) {
      this.logger.warn("加载已存在 keys 失败,将标记所有 key 为缺失:", error);
    }
  }

  /**
   * 添加缺失的翻译键
   */
  add(key: string) {
    if (this.existingKeys.has(key)) {
      return;
    }

    if (this.pendingKeys.has(key)) {
      return;
    }

    this.pendingKeys.add(key);
    this.logger.warn(`发现缺失翻译键: ${key}`);
  }

  /**
   * 启动定时写入 Worker
   */
  private startFlushWorker() {
    process.on("beforeExit", () => {
      this.flushNow();
    });

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

      // 写入成功后,将这些 key 添加到 existingKeys 中
      for (const key of keys) {
        this.existingKeys.add(key);
      }

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
    await Promise.all(this.languages.map((lang) => this.writeToLanguageFile(lang, keys)));
  }

  /**
   * 写入单个语言文件（原子操作 + 文件锁）
   */
  private async writeToLanguageFile(lang: string, keys: string[]): Promise<void> {
    const langFile = `${lang}.json`;
    const filePath = join(this.localesDir, langFile);
    const tempFilePath = join(this.localesDir, `.${langFile}.tmp`);

    const releaseLock = await this.acquireLock(filePath);

    try {
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

      for (const key of keys) {
        if (!content[key]) {
          content[key] = key;
          added++;
        }
      }

      if (added === 0) {
        return;
      }

      const sortedContent = Object.keys(content)
        .sort((a, b) => a.localeCompare(b, "zh-CN"))
        .reduce(
          (acc, key) => {
            acc[key] = content[key];
            return acc;
          },
          {} as Record<string, string>,
        );

      const jsonContent = JSON.stringify(sortedContent, null, 2);
      writeFileSync(tempFilePath, jsonContent, "utf-8");

      renameSync(tempFilePath, filePath);

      this.logger.log(`${langFile}: 新增 ${added} 个翻译键`);
    } catch (error) {
      this.logger.error(`写入 ${langFile} 失败:`, error);
      throw error;
    } finally {
      releaseLock();
    }
  }

  /**
   * 获取文件锁
   */
  private async acquireLock(filePath: string): Promise<() => void> {
    while (this.fileLocks.has(filePath)) {
      await this.fileLocks.get(filePath);
    }

    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.fileLocks.set(filePath, lockPromise);

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

    // 初始化后立即采集所有待处理的内容
    // 使用动态导入避免循环依赖
    setImmediate(() => {
      try {
        // 采集错误码
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { flushPendingErrorCodes } = require("../errors/define-error-code");
        flushPendingErrorCodes();
      } catch (_error) {
        // 忽略错误,可能 define-error-code 还未加载
      }

      try {
        // 采集 Zod Schema 验证消息
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { flushPendingSchemas } = require("../validation/create-i18n-zod-dto");
        flushPendingSchemas();
      } catch (_error) {
        // 忽略错误,可能 create-i18n-zod-dto 还未加载
      }
    });
  }

  return collectorInstance;
}

/**
 * 获取收集器实例
 */
export function getI18nCollector(): I18nCollectorServer | null {
  return collectorInstance;
}
