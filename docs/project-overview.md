# Support - Project Overview

**Date:** 2025-12-03  
**Type:** Monorepo (多部分项目)  
**Architecture:** 分层架构 + App Router + 模块化设计

## Executive Summary

Support 是一个基于 NestJS、Next.js 和 React 构建的企业级全栈开发 Monorepo 项目，提供完整的后端服务、前端应用和 UI 组件库。项目采用 Monorepo 架构，使用 pnpm workspace 管理多个应用程序和共享库，支持配置中心化管理、向量存储和 AI 能力扩展。

## Project Classification

- **Repository Type:** Monorepo
- **Project Type(s):** Backend + Web + Library
- **Primary Language(s):** TypeScript 5.9.3
- **Architecture Pattern:** 分层架构（后端）+ App Router（前端）+ 模块化设计（库）

## Multi-Part Structure

This project consists of 6 distinct parts:

### Server-Demo

- **Type:** Backend (NestJS)
- **Location:** `apps/server-demo/`
- **Purpose:** NestJS 演示后端服务，提供 API 接口和业务逻辑演示
- **Tech Stack:** NestJS 11 + TypeORM + MySQL + Redis + Nacos

### Web-Design

- **Type:** Web (Next.js)
- **Location:** `apps/web-design/`
- **Purpose:** 设计系统展示平台，用于预览和测试 UI 组件
- **Tech Stack:** Next.js 16 + React 19 + Tailwind CSS

### Web-Editor

- **Type:** Web (Next.js)
- **Location:** `apps/web-editor/`
- **Purpose:** 富文本编辑器展示平台，用于预览和测试编辑器功能
- **Tech Stack:** Next.js 16 + React 19 + Tiptap

### Libs

- **Type:** Library (NestJS Modules)
- **Location:** `libs/`
- **Purpose:** NestJS 模块库集合，提供通用功能模块
- **Tech Stack:** NestJS 11 + TypeScript

### Design

- **Type:** Library (React Components)
- **Location:** `packages/design/`
- **Purpose:** React UI 组件库，基于 Radix UI 和 Tailwind CSS
- **Tech Stack:** React 19 + Radix UI + Tailwind CSS

### Editor

- **Type:** Library (React Components)
- **Location:** `packages/editor/`
- **Purpose:** React 富文本编辑器组件库，基于 Tiptap
- **Tech Stack:** React 19 + Tiptap

### How Parts Integrate

- **后端 ↔ 前端**: 通过 REST API 通信（HTTP/HTTPS，JSON 格式，JWT Token 认证）
- **前端 ↔ 组件库**: 通过 npm workspace 包导入使用
- **后端 ↔ 库**: 通过 NestJS 模块系统依赖注入
- **共享资源**: 类型定义（`libs/types/`）和国际化文件（`locales/`）前后端共享

## Technology Stack Summary

### Server-Demo Stack

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **运行时** | Node.js | >= 18 | JavaScript 运行时环境 |
| **语言** | TypeScript | 5.9.3 | 类型安全的 JavaScript 超集 |
| **框架** | NestJS | 11.1.8 | 企业级 Node.js 框架 |
| **数据库** | MySQL | >= 8.0 | 关系型数据库 |
| **ORM** | TypeORM | 0.3.27 | 数据库 ORM 框架 |
| **缓存** | Redis | >= 6.0 | 缓存和会话存储 |
| **配置管理** | Nacos | >= 2.0 | 配置中心和服务发现 |
| **国际化** | nestjs-i18n | 10.5.1 | 多语言支持 |
| **API文档** | Swagger | 11.2.1 | API 文档自动生成 |

### Web-Design & Web-Editor Stack

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **框架** | Next.js | 16.0.4 | React 应用框架 |
| **UI库** | React | 19.2.0 | UI 库 |
| **语言** | TypeScript | 5.9.3 | 类型安全 |
| **CSS框架** | Tailwind CSS | 4.1.4 | 原子化 CSS 框架 |
| **UI基础组件** | Radix UI | - | 无障碍 UI 基础组件 |
| **状态管理** | Recoil | 0.7.7 | 状态管理库 |

### Design & Editor Stack

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **UI库** | React | 19.2.0 | UI 库 |
| **UI基础组件** | Radix UI | - | 无障碍 UI 基础组件 |
| **CSS框架** | Tailwind CSS | 3.4.0 / 4.1.4 | 原子化 CSS 框架 |
| **富文本编辑器** | Tiptap | 2.9.1 | 富文本编辑器框架（Editor） |

## Key Features

### 后端特性
- 🏗️ NestJS 框架 - 企业级 Node.js 框架
- ⚙️ Nacos 集成 - 配置管理和服务发现
- 💾 Redis 缓存 - 高性能缓存支持
- 🗄️ TypeORM - 数据库 ORM 支持
- 🌍 国际化 - 多语言支持（中英文）
- 📝 Swagger 文档 - 自动生成 API 文档
- 🔒 类型安全 - 完整的 TypeScript 支持
- ⚡ 统一响应 - 标准化的 API 响应格式
- 🚨 错误处理 - 全局异常过滤器
- ❄️ 分布式 ID - Snowflake ID 生成器

### 前端特性
- 📚 组件展示 - 所有 @meta-1/design 组件的实时预览
- 🎨 主题切换 - 明暗主题支持
- 📱 响应式设计 - 适配各种屏幕尺寸
- 🎮 交互式演示 - 实时调整组件参数
- ✏️ 富文本编辑 - 基于 Tiptap 的现代编辑器

### 组件库特性
- 🎨 现代设计 - 美观、易用的 UI 组件
- ♿ 无障碍访问 - 符合 WCAG 标准
- 🎯 类型安全 - 完整的 TypeScript 支持
- 🌗 主题系统 - 支持明暗主题切换
- 📦 模块化 - 按需导入，减小包体积

## Architecture Highlights

### 后端架构
- **分层架构**: Controller → Service → Repository
- **模块化设计**: 基于 NestJS Module 系统
- **依赖注入**: NestJS DI 容器
- **配置驱动**: Nacos 配置中心管理配置

### 前端架构
- **App Router**: Next.js 16 App Router 架构
- **组件化设计**: 可复用的 React 组件
- **状态管理**: Recoil 客户端状态管理
- **主题系统**: 基于 next-themes 的明暗主题

### 库架构
- **模块化导出**: 单一职责原则
- **类型安全**: 完整的 TypeScript 类型定义
- **按需导入**: Tree-shaking 支持

## Development Overview

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- Redis >= 6.0（用于缓存和会话）
- MySQL >= 8.0（可选，用于数据库）
- Nacos >= 2.0（可选，用于配置管理）

### Getting Started

```bash
# 克隆仓库
git clone <repository-url>
cd support

# 安装依赖
pnpm install
```

### Key Commands

#### Server-Demo

- **Install:** `pnpm install`
- **Dev:** `pnpm run dev:server`
- **Build:** `pnpm run build:server`

#### Web-Design

- **Install:** `pnpm install`
- **Dev:** `pnpm run dev:web-design`

#### Web-Editor

- **Install:** `pnpm install`
- **Dev:** `pnpm run dev:web-editor`

#### Libs

- **Build:** `pnpm run build:libs`

## Repository Structure

```
support/
├── apps/                    # 应用程序
│   ├── server-demo/        # NestJS 后端服务
│   ├── web-design/         # 设计系统展示
│   └── web-editor/         # 编辑器展示
├── libs/                    # NestJS 库
│   ├── ai/                 # AI 模块
│   ├── assets/             # 资源管理
│   ├── common/             # 通用工具
│   ├── message/            # 邮件服务
│   ├── nacos/              # Nacos 集成
│   ├── security/           # 安全认证
│   └── types/              # 类型定义
├── packages/                # 前端包
│   ├── design/             # UI 组件库
│   └── editor/             # 富文本编辑器
├── docs/                    # 文档目录
├── locales/                 # 国际化文件
└── scripts/                 # 工具脚本
```

## Documentation Map

For detailed information, see:

- [index.md](./index.md) - Master documentation index
- [source-tree-analysis.md](./source-tree-analysis.md) - Directory structure
- [api-contracts-server.md](./api-contracts-server.md) - API endpoints documentation
- [ui-component-inventory-web.md](./ui-component-inventory-web.md) - UI components catalog

---

_Generated using BMAD Method `document-project` workflow_

