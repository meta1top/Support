import { Injectable, Logger, OnModuleInit } from "@nestjs/common";

import { AppError, ErrorCode as CommonErrorCode } from "@meta-1/nest-common";
import { StorageProvider } from "@meta-1/nest-types";
import { AssetsConfigService } from "./config";
import {
  PresignedDownloadUrlRequestDto,
  PresignedDownloadUrlResponseDto,
  PresignedUploadUrlRequestDto,
  PresignedUploadUrlResponseDto,
} from "./dto";
import { OSSService } from "./oss";
import { S3Service } from "./s3";
import { ErrorCode as AssetsErrorCode } from "./shared";

/**
 * 资源服务
 * 提供统一的资源管理接口，内部根据配置选择 S3 或 OSS
 */
@Injectable()
export class AssetsService implements OnModuleInit {
  private readonly logger = new Logger(AssetsService.name);

  constructor(
    private readonly assetsConfigService: AssetsConfigService,
    private readonly s3Service: S3Service,
    private readonly ossService: OSSService,
  ) {}

  onModuleInit() {
    const config = this.assetsConfigService.get();
    const { storage, s3, oss } = config;
    const expiresIn = storage.expiresIn || "30m"; // 默认 30 分钟

    if (storage.provider === StorageProvider.S3) {
      if (!s3) {
        throw new AppError(CommonErrorCode.CONFIG_INVALID);
      }
      this.s3Service.initialize(s3, storage.publicBucket, storage.privateBucket, expiresIn);
      this.logger.log("已初始化 S3 存储");
    } else if (storage.provider === StorageProvider.OSS) {
      if (!oss) {
        throw new AppError(CommonErrorCode.CONFIG_INVALID);
      }
      this.ossService.initialize(oss, storage.publicBucket, storage.privateBucket, expiresIn);
      this.logger.log("已初始化 OSS 存储");
    } else {
      throw new AppError(AssetsErrorCode.PROVIDER_NOT_SUPPORTED);
    }
  }

  /**
   * 获取当前配置的存储提供商
   */
  private getCurrentProvider(): StorageProvider {
    const config = this.assetsConfigService.get();
    return config.storage.provider;
  }

  /**
   * 生成预签名上传 URL
   */
  async generatePresignedUploadUrl(request: PresignedUploadUrlRequestDto): Promise<PresignedUploadUrlResponseDto> {
    const provider = this.getCurrentProvider();

    if (provider === StorageProvider.S3) {
      if (!this.s3Service.isConfigured()) {
        throw new AppError(AssetsErrorCode.S3_NOT_CONFIGURED);
      }
      return this.s3Service.generatePresignedUploadUrl(request);
    } else if (provider === StorageProvider.OSS) {
      if (!this.ossService.isConfigured()) {
        throw new AppError(AssetsErrorCode.OSS_NOT_CONFIGURED);
      }
      return this.ossService.generatePresignedUploadUrl(request);
    }

    throw new AppError(AssetsErrorCode.PROVIDER_NOT_SUPPORTED);
  }

  /**
   * 生成预签名下载 URL（用于私桶）
   */
  async generatePresignedDownloadUrl(
    request: PresignedDownloadUrlRequestDto,
  ): Promise<PresignedDownloadUrlResponseDto> {
    const provider = this.getCurrentProvider();

    if (provider === StorageProvider.S3) {
      if (!this.s3Service.isConfigured()) {
        throw new AppError(AssetsErrorCode.S3_NOT_CONFIGURED);
      }
      return this.s3Service.generatePresignedDownloadUrl(request);
    } else if (provider === StorageProvider.OSS) {
      if (!this.ossService.isConfigured()) {
        throw new AppError(AssetsErrorCode.OSS_NOT_CONFIGURED);
      }
      return this.ossService.generatePresignedDownloadUrl(request);
    }

    throw new AppError(AssetsErrorCode.PROVIDER_NOT_SUPPORTED);
  }

  /**
   * 检查服务是否已配置
   */
  isConfigured(): boolean {
    try {
      const config = this.assetsConfigService.get();
      const provider = config.storage.provider;

      if (provider === StorageProvider.S3) {
        return this.s3Service.isConfigured();
      } else if (provider === StorageProvider.OSS) {
        return this.ossService.isConfigured();
      }

      return false;
    } catch {
      return false;
    }
  }
}
