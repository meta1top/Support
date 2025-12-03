# Support - Source Tree Analysis

**Date:** 2025-12-03

## Overview

Support 是一个 Monorepo 项目，使用 pnpm workspace 管理多个应用程序和库。项目包含后端服务、前端应用和共享库，采用分层架构和模块化设计。

## Multi-Part Structure

This project is organized into 6 distinct parts:

- **server-demo** (`apps/server-demo/`): NestJS 后端演示服务，提供 API 接口和业务逻辑
- **web-design** (`apps/web-design/`): Next.js 设计系统展示平台，用于预览和测试 UI 组件
- **web-editor** (`apps/web-editor/`): Next.js 富文本编辑器展示平台
- **libs** (`libs/`): NestJS 库集合，提供通用功能模块
- **design** (`packages/design/`): React UI 组件库，基于 Radix UI 和 Tailwind CSS
- **editor** (`packages/editor/`): React 富文本编辑器组件库，基于 Tiptap

## Complete Directory Structure

```
support/
├── apps/                        # 应用程序
│   ├── server-demo/            # NestJS 后端演示服务
│   │   ├── src/
│   │   │   ├── controller/     # API 控制器
│   │   │   │   ├── app.controller.ts
│   │   │   │   ├── assets.controller.ts
│   │   │   │   ├── mail-code.controller.ts
│   │   │   │   ├── test-lock.controller.ts
│   │   │   │   └── index.ts
│   │   │   ├── service/        # 业务服务
│   │   │   │   ├── test-lock.service.ts
│   │   │   │   └── index.ts
│   │   │   ├── shared/         # 共享模块
│   │   │   │   ├── app.swagger.ts
│   │   │   │   ├── app.types.ts
│   │   │   │   └── index.ts
│   │   │   ├── app.module.ts   # 主模块
│   │   │   └── main.ts         # 应用入口
│   │   └── tsconfig.app.json
│   ├── web-design/             # 设计系统展示应用
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router
│   │   │   │   ├── demo/       # 组件演示页面
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/     # 应用组件
│   │   │   ├── assets/         # 静态资源
│   │   │   └── plugin/         # 插件配置
│   │   ├── next.config.ts
│   │   └── package.json
│   └── web-editor/             # 编辑器展示应用
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── assets/
│       │   └── plugin/
│       ├── next.config.ts
│       └── package.json
├── libs/                        # NestJS 库
│   ├── ai/                     # AI 模块
│   │   ├── src/
│   │   │   ├── dto/
│   │   │   ├── service/
│   │   │   ├── shared/
│   │   │   ├── ai.module.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── assets/                 # 资源管理模块
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── dto/
│   │   │   ├── oss/
│   │   │   ├── s3/
│   │   │   ├── shared/
│   │   │   ├── assets.module.ts
│   │   │   ├── assets.service.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── common/                 # 通用工具模块
│   │   ├── src/
│   │   │   ├── cache/
│   │   │   ├── decorators/
│   │   │   ├── dto/
│   │   │   ├── errors/
│   │   │   ├── i18n/
│   │   │   ├── interceptors/
│   │   │   ├── shared/
│   │   │   ├── swagger/
│   │   │   ├── common.module.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── message/                # 邮件服务模块
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── mail/
│   │   │   ├── mail-code/
│   │   │   ├── shared/
│   │   │   ├── message.module.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── nacos/                  # Nacos 集成模块
│   │   ├── src/
│   │   │   ├── nacos.module.ts
│   │   │   ├── nacos.service.config.ts
│   │   │   ├── nacos.service.naming.ts
│   │   │   └── index.ts
│   │   └── package.json
│   ├── security/                # 安全认证模块
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── decorators/
│   │   │   ├── interceptors/
│   │   │   ├── otp/
│   │   │   ├── security/
│   │   │   ├── session/
│   │   │   ├── token/
│   │   │   ├── shared/
│   │   │   ├── security.module.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── types/                  # 类型定义模块
│       ├── src/
│       │   ├── ai/
│       │   ├── assets/
│       │   ├── common/
│       │   ├── message/
│       │   └── index.ts
│       └── package.json
├── packages/                    # 前端包
│   ├── design/                 # UI 组件库
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── ui/         # UI 基础组件
│   │   │   │   ├── uix/        # UIX 高级组件
│   │   │   │   └── icons/      # 图标组件
│   │   │   ├── lib/            # 工具库
│   │   │   ├── hooks/          # React Hooks
│   │   │   └── assets/         # 静态资源
│   │   ├── components.json
│   │   └── package.json
│   └── editor/                 # 富文本编辑器库
│       ├── src/
│       │   ├── locales/
│       │   └── [editor components]
│       └── package.json
├── docs/                        # 文档目录
│   ├── bmm-workflow-status.yaml
│   ├── project-scan-report.json
│   ├── api-contracts-server.md
│   ├── ui-component-inventory-web.md
│   └── sprint-artifacts/
├── locales/                     # 国际化文件
│   ├── en.json
│   └── zh-CN.json
├── scripts/                     # 工具脚本
│   ├── copy-dist.ts
│   └── sync-locales-cli.ts
├── dist/                        # 构建输出目录
├── node_modules/                # 依赖包
├── package.json                 # 根 package.json
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── nest-cli.json                # NestJS CLI 配置
├── tsconfig.json                # TypeScript 根配置
├── tsconfig.build.json          # 构建配置
├── tsconfig.web.json            # Web 项目配置
├── biome.json                   # Biome 代码检查配置
├── webpack.config.js            # Webpack 配置
└── README.md                    # 项目说明文档
```

## Critical Directories

### `apps/server-demo/src/`

**Purpose:** NestJS 后端演示服务的源代码目录

**Contains:** 
- Controller 层：API 端点定义
- Service 层：业务逻辑实现
- 共享模块：Swagger 配置、类型定义

**Entry Points:** `main.ts` - 应用启动入口

**Integration:** 
- 使用 `@meta-1/nest-*` 库模块
- 通过 REST API 提供服务

### `apps/web-design/src/app/`

**Purpose:** Next.js App Router 页面和路由

**Contains:**
- `demo/` - 组件演示页面（24+ 个组件演示）
- `layout.tsx` - 根布局组件
- `page.tsx` - 首页

**Entry Points:** `layout.tsx` - 应用根布局

**Integration:** 
- 使用 `@meta-1/design` 组件库
- 通过 API 路由调用后端服务

### `libs/common/src/`

**Purpose:** NestJS 通用工具和装饰器

**Contains:**
- `cache/` - 缓存装饰器（@Cacheable, @CacheEvict）
- `decorators/` - 自定义装饰器（@Snowflake, @WithLock）
- `dto/` - 数据传输对象
- `errors/` - 错误处理
- `i18n/` - 国际化工具
- `interceptors/` - 响应拦截器
- `swagger/` - Swagger 工具

**Integration:** 被所有 NestJS 应用和库使用

### `packages/design/src/components/`

**Purpose:** React UI 组件库的核心组件

**Contains:**
- `ui/` - 32 个 UI 基础组件（基于 Radix UI）
- `uix/` - 42 个 UIX 高级业务组件
- `icons/` - 图标组件

**Integration:** 
- 被 web-design 和 web-editor 应用使用
- 可通过 npm 包发布供外部使用

### `libs/`

**Purpose:** NestJS 模块库集合

**Contains:**
- `ai/` - AI 能力封装
- `assets/` - 资源管理（S3/OSS）
- `common/` - 通用工具
- `message/` - 邮件服务
- `nacos/` - Nacos 集成
- `security/` - 安全认证
- `types/` - 类型定义

**Integration:** 
- 通过 `@meta-1/nest-*` 命名空间导入
- 在 server-demo 应用中组合使用

## Part-Specific Trees

### Server-Demo Structure

```
apps/server-demo/
├── src/
│   ├── controller/            # API 控制器层
│   │   ├── app.controller.ts         # 欢迎页面
│   │   ├── assets.controller.ts      # 资源服务 API
│   │   ├── mail-code.controller.ts   # 邮件验证码 API
│   │   └── test-lock.controller.ts   # 分布式锁测试 API
│   ├── service/                # 业务服务层
│   │   └── test-lock.service.ts      # 分布式锁测试服务
│   ├── shared/                 # 共享模块
│   │   ├── app.swagger.ts            # Swagger 配置
│   │   └── app.types.ts              # 应用类型定义
│   ├── app.module.ts          # 主模块（动态配置）
│   └── main.ts                # 应用入口（启动逻辑）
└── tsconfig.app.json
```

**Key Directories:**
- `controller/`: REST API 端点定义，使用 NestJS 装饰器
- `service/`: 业务逻辑实现，可注入依赖
- `shared/`: 应用级共享代码（配置、类型）

### Web-Design Structure

```
apps/web-design/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── demo/               # 组件演示页面
│   │   │   ├── action/
│   │   │   ├── alert/
│   │   │   ├── avatar/
│   │   │   ├── [24+ component demos]
│   │   │   └── uploader/
│   │   ├── layout.tsx          # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # 应用组件
│   │   ├── layout/
│   │   └── theme-switcher/
│   ├── assets/                # 静态资源
│   │   └── globals.css
│   └── plugin/                # 插件配置
│       └── formatters.ts
├── next.config.ts
└── package.json
```

**Key Directories:**
- `app/demo/`: 24+ 个组件演示页面，展示 @meta-1/design 组件库的使用
- `components/`: 应用级组件（布局、主题切换等）

### Packages/Design Structure

```
packages/design/
├── src/
│   ├── components/
│   │   ├── ui/                # UI 基础组件（32个）
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── [29 more UI components]
│   │   │   └── tooltip.tsx
│   │   ├── uix/               # UIX 高级组件（42个）
│   │   │   ├── action/
│   │   │   ├── alert/
│   │   │   ├── [40 more UIX components]
│   │   │   └── value-formatter/
│   │   └── icons/             # 图标组件
│   │       ├── Empty.tsx
│   │       ├── Spin.tsx
│   │       └── index.ts
│   ├── lib/                   # 工具库
│   ├── hooks/                 # React Hooks
│   └── assets/                # 静态资源（样式、本地化）
├── components.json            # shadcn/ui 配置
└── package.json
```

**Key Directories:**
- `components/ui/`: Radix UI 基础组件，提供无障碍访问支持
- `components/uix/`: 基于 UI 组件构建的高级业务组件

## Integration Points

### Server-Demo → Libs

- **Location:** `apps/server-demo/src/app.module.ts`
- **Type:** 模块导入和依赖注入
- **Details:** 
  - 导入 `@meta-1/nest-common`, `@meta-1/nest-assets`, `@meta-1/nest-message`, `@meta-1/nest-security`
  - 通过 NestJS 模块系统进行依赖注入
  - 使用 Nacos 配置中心动态加载配置

### Web-Design → Packages/Design

- **Location:** `apps/web-design/src/app/demo/`
- **Type:** 组件导入和使用
- **Details:** 
  - 通过 `@meta-1/design` 包导入组件
  - 在演示页面中使用组件并展示功能
  - 支持主题切换和响应式设计

### Libs → Types

- **Location:** `libs/types/src/`
- **Type:** 类型定义共享
- **Details:** 
  - 所有库共享类型定义
  - 通过 `@meta-1/nest-types` 包导出
  - 前后端可共享类型（通过 Zod Schema）

## Entry Points

### Server-Demo

- **Entry Point:** `apps/server-demo/src/main.ts`
- **Bootstrap:** 
  - 加载环境变量
  - 同步国际化文件
  - 加载 Nacos 配置
  - 创建 NestJS 应用实例
  - 配置 CORS 和 Swagger
  - 启动 HTTP 服务器（默认端口 3100）

### Web-Design

- **Entry Point:** `apps/web-design/src/app/layout.tsx`
- **Bootstrap:** 
  - Next.js App Router 根布局
  - 配置主题提供者
  - 加载全局样式

### Web-Editor

- **Entry Point:** `apps/web-editor/src/app/layout.tsx`
- **Bootstrap:** 
  - Next.js App Router 根布局
  - 配置编辑器相关设置

## File Organization Patterns

### NestJS 应用模式
- **Controller**: `*.controller.ts` - API 端点定义
- **Service**: `*.service.ts` - 业务逻辑
- **Module**: `*.module.ts` - 模块定义
- **DTO**: `*.dto.ts` - 数据传输对象
- **Entity**: `*.entity.ts` - 数据库实体（如果使用）

### Next.js 应用模式
- **Page**: `page.tsx` - 页面组件
- **Layout**: `layout.tsx` - 布局组件
- **Route Handler**: `route.ts` - API 路由处理
- **Component**: `*.tsx` - React 组件

### 库模块模式
- **Module**: `*.module.ts` - NestJS 模块导出
- **Service**: `*.service.ts` - 服务类
- **Index**: `index.ts` - 公共 API 导出

## Key File Types

### TypeScript 配置文件
- **Pattern:** `tsconfig*.json`
- **Purpose:** TypeScript 编译配置
- **Examples:** `tsconfig.json`, `tsconfig.build.json`, `tsconfig.web.json`, `tsconfig.app.json`

### Package 配置文件
- **Pattern:** `package.json`
- **Purpose:** 包依赖和脚本定义
- **Examples:** 根目录、apps、libs、packages 各有一个

### 构建配置文件
- **Pattern:** `*.config.*`
- **Purpose:** 构建工具配置
- **Examples:** `next.config.ts`, `nest-cli.json`, `webpack.config.js`, `biome.json`

## Configuration Files

- **`package.json`**: 根 package.json，定义 workspace 脚本和依赖
- **`pnpm-workspace.yaml`**: pnpm workspace 配置，定义包路径
- **`nest-cli.json`**: NestJS CLI 配置，定义 monorepo 项目结构
- **`tsconfig.json`**: TypeScript 根配置
- **`biome.json`**: Biome 代码检查和格式化配置
- **`next.config.ts`**: Next.js 应用配置（web-design, web-editor）
- **`components.json`**: shadcn/ui 组件配置（packages/design）

## Notes for Development

### Monorepo 管理
- 使用 pnpm workspace 管理多个包
- 共享依赖在根目录 `node_modules`
- 包之间通过 workspace 协议引用（`workspace:*`）

### 开发命令
- `pnpm run dev:server` - 启动后端服务（端口 3100）
- `pnpm run dev:web-design` - 启动设计系统展示（端口 5700）
- `pnpm run dev:web-editor` - 启动编辑器展示（端口 5701）
- `pnpm run build:libs` - 构建所有库
- `pnpm run sync:locales` - 同步国际化文件

### 代码组织原则
- **后端**: 分层架构（Controller → Service → Repository）
- **前端**: 组件化设计，按功能模块组织
- **库**: 模块化导出，单一职责原则

### 配置管理
- 后端配置通过 Nacos 配置中心管理
- 环境变量仅配置 Nacos 连接信息
- 支持配置热更新和环境隔离

---

_Generated using BMAD Method `document-project` workflow_

