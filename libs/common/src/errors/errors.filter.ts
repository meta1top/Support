import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { I18nContext as RawI18nContext } from "nestjs-i18n";
import { ZodValidationException } from "nestjs-zod";

import { I18nContext } from "../i18n/i18n.wrapper";
import { AppError } from "./app.error";

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  private logger = new Logger(ErrorsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取 I18n 上下文
    const rawI18nContext = RawI18nContext.current(host);
    const i18n = rawI18nContext ? new I18nContext(rawI18nContext, "common") : null;

    // 默认值
    let code = 0;
    let message = "Server Error";
    // biome-ignore lint/suspicious/noExplicitAny: dynamic error data
    let data: any = null;

    if (exception instanceof AppError) {
      code = exception.code;
      message = exception.message;
      data = exception.data;

      if (i18n) {
        // AppError 的 message 是国际化 key，需要翻译
        message = i18n.t(message);
      }
    } else if (exception instanceof ZodValidationException) {
      // biome-ignore lint/suspicious/noExplicitAny: <getResponse>
      const res = exception.getResponse() as any;
      message = res.message || "Validation failed";
      data = res.errors || null;

      if (i18n) {
        // ZodValidationException 的 message 是国际化 key，需要翻译
        message = i18n.t(message);

        // 翻译 Zod 验证错误中的每个字段的 message
        if (data && Array.isArray(data)) {
          // biome-ignore lint/suspicious/noExplicitAny: validation errors
          data = data.map((error: any) => ({
            ...error,
            message: error.message ? i18n.t(error.message) : error.message,
          }));
        }
      }
    } else if (exception instanceof HttpException) {
      const res = exception.getResponse();
      // biome-ignore lint/suspicious/noExplicitAny: res
      message = typeof res === "string" ? res : (res as any).message;
      // HttpException 原样输出，不翻译
    } else if (exception instanceof Error) {
      message = exception.message;
      // 普通 Error 原样输出，不翻译
    }

    const error = {
      code,
      success: false,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(200).json(error);
  }
}
