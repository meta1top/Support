import type { I18nContext as RawI18nContext, TranslateOptions } from "nestjs-i18n";

import { getI18nCollector } from "./i18n-collector";

export class I18nContext {
  constructor(
    private readonly context: RawI18nContext,
    private readonly namespace: string = "common",
  ) {}

  t(key: string, options?: TranslateOptions): string {
    if (process.env.NODE_ENV === "development") {
      const collector = getI18nCollector();
      if (collector) {
        collector.add(this.namespace, key);
      }
    }

    const fullKey = this.addNamespace(key);
    return this.context.t(fullKey, options);
  }

  translate(key: string, options?: TranslateOptions): string {
    return this.t(key, options);
  }

  get lang(): string {
    return this.context.lang;
  }

  get raw(): RawI18nContext {
    return this.context;
  }

  private addNamespace(key: string): string {
    if (key.includes(".")) {
      return key;
    }
    return `${this.namespace}.${key}`;
  }
}

export function createI18nContext(context: RawI18nContext, namespace: string = "common"): I18nContext {
  return new I18nContext(context, namespace);
}

export type { RawI18nContext };
export type { I18nValidationError, I18nValidationException, TranslateOptions } from "nestjs-i18n";
export { I18nService } from "nestjs-i18n";
