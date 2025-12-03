# API 合约文档 - Server Demo

**生成日期**: 2025-12-03  
**项目部分**: server-demo (Backend)  
**基础路径**: `http://localhost:3100`

## 概述

Server Demo 是基于 NestJS 11 构建的演示后端服务，提供资源管理、邮件服务、分布式锁测试等 API 接口。所有 API 支持 Swagger 文档自动生成，访问 `/api` 路径查看完整文档。

## 认证

大部分 API 端点需要认证（Bearer Token），部分端点标记为 `@Public()` 可公开访问。

---

## API 端点

### 1. 欢迎页面

**GET** `/`

测试国际化功能的欢迎页面。

**认证**: 不需要

**响应示例**:
```json
{
  "message": "欢迎使用 Prime Developer Server",
  "hello": "你好，世界！",
  "currentLang": "zh-CN"
}
```

---

### 2. 资源服务 API

**基础路径**: `/api/assets`

#### 2.1 生成预签名上传 URL

**POST** `/api/assets/pre-sign/upload`

获取文件上传的预签名 URL，支持 S3 和 OSS。

**认证**: 不需要 (`@Public()`)

**请求体**:
```typescript
{
  // PresignedUploadUrlRequestDto
  // 具体字段请参考 @meta-1/nest-assets 模块
}
```

**响应**:
```typescript
// PresignedUploadUrlResponseDto
{
  url: string;
  // 其他字段请参考模块定义
}
```

#### 2.2 生成预签名下载 URL

**POST** `/api/assets/pre-sign/download`

获取私有文件的预签名下载 URL，支持 S3 和 OSS。

**认证**: 不需要 (`@Public()`)

**请求体**:
```typescript
{
  // PresignedDownloadUrlRequestDto
  // 具体字段请参考 @meta-1/nest-assets 模块
}
```

**响应**:
```typescript
// PresignedDownloadUrlResponseDto
{
  url: string;
  // 其他字段请参考模块定义
}
```

---

### 3. 邮件服务 API

**基础路径**: `/api/mail/code`

#### 3.1 发送验证码

**POST** `/api/mail/code/send`

发送邮件验证码。

**认证**: 不需要 (`@Public()`)

**请求体**:
```typescript
{
  // SendCodeDto
  // 具体字段请参考 @meta-1/nest-message 模块
}
```

**响应**: 无响应体（204 No Content）

---

### 4. 分布式锁测试 API

**基础路径**: `/test/lock`

这些 API 用于测试 `@WithLock` 装饰器的分布式锁功能。

#### 4.1 创建订单（测试分布式锁）

**POST** `/test/lock/order`

测试基础分布式锁功能，防止用户重复创建订单。

**认证**: 需要

**请求体**:
```json
{
  "userId": "user123",
  "productId": "product456",
  "quantity": 2
}
```

**响应** (200):
```json
{
  "success": true,
  "message": "订单创建成功",
  "data": {
    "orderId": "order_1_1234567890",
    "userId": "user123",
    "productId": "product456",
    "quantity": 2,
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**响应** (409):
```json
{
  "success": false,
  "message": "订单创建中，请稍后重试"
}
```

#### 4.2 处理支付（测试零等待锁）

**POST** `/test/lock/payment`

测试零等待时间的分布式锁，防止重复支付。

**认证**: 需要

**请求体**:
```json
{
  "orderId": "order_1_1234567890"
}
```

**响应** (200):
```json
{
  "success": true,
  "message": "支付成功",
  "data": {
    "orderId": "order_1_1234567890",
    "transactionId": "txn_1234567890"
  }
}
```

**响应** (409):
```json
{
  "success": false,
  "message": "订单正在支付中，请勿重复提交"
}
```

#### 4.3 初始化库存

**POST** `/test/lock/inventory/init`

初始化商品库存，用于测试库存扣减功能。

**认证**: 需要

**请求体**:
```json
{
  "productId": "product789",
  "quantity": 100
}
```

**响应**:
```json
{
  "message": "库存初始化成功",
  "productId": "product789",
  "quantity": 100
}
```

#### 4.4 扣减库存（测试防超卖）

**POST** `/test/lock/inventory/reduce/:productId`

测试分布式锁防止库存超卖。

**认证**: 需要

**路径参数**:
- `productId` (string): 商品ID

**请求体**:
```json
{
  "quantity": 1
}
```

**响应** (200):
```json
{
  "success": true,
  "message": "库存扣减成功",
  "data": {
    "productId": "product789",
    "newInventory": 99
  }
}
```

**响应** (400):
库存不足

#### 4.5 查询库存

**GET** `/test/lock/inventory/:productId`

查询商品当前库存数量。

**认证**: 需要

**路径参数**:
- `productId` (string): 商品ID

**响应**:
```json
{
  "success": true,
  "data": {
    "productId": "product789",
    "inventory": 100
  }
}
```

#### 4.6 并发测试

**GET** `/test/lock/concurrent-test/:type`

服务端自动发起 10 个并发请求，测试分布式锁的并发控制效果。

**认证**: 需要

**路径参数**:
- `type` (enum): 测试类型，可选值: `order` | `payment` | `inventory`

**响应**:
```json
{
  "success": true,
  "message": "并发测试完成",
  "data": {
    "type": "order",
    "total": 10,
    "success": 1,
    "failed": 9,
    "duration": 2345,
    "results": [
      { "success": true, "duration": 2123 },
      { "success": false, "message": "订单创建中，请稍后重试", "duration": 234 }
    ]
  }
}
```

#### 4.7 清理测试数据

**POST** `/test/lock/cleanup`

清理所有测试订单、库存数据和 Redis 锁。

**认证**: 需要

**响应**:
```json
{
  "message": "测试数据已清理"
}
```

#### 4.8 获取测试说明

**GET** `/test/lock/help`

获取所有测试接口的使用说明和测试方法。

**认证**: 需要

**响应**:
```json
{
  "title": "分布式锁测试 API",
  "description": "使用以下接口测试 @WithLock 装饰器的功能",
  "tests": [
    {
      "name": "测试 1: 防止重复创建订单",
      "endpoint": "POST /test-lock/order",
      "body": {
        "userId": "user123",
        "productId": "product456",
        "quantity": 2
      },
      "howToTest": "同时发送多个请求，观察只有一个成功"
    }
    // ... 更多测试说明
  ],
  "notes": [
    "所有测试数据都存储在内存中，重启服务会丢失",
    "可以使用 Postman、curl 或其他工具进行测试",
    "建议使用 Postman 的 Collection Runner 进行并发测试"
  ]
}
```

---

## 响应格式

所有 API 响应使用统一的响应格式（通过 `ResponseInterceptor` 自动格式化）：

```typescript
{
  code: number;        // 状态码，0 表示成功
  success: boolean;    // 是否成功
  message: string;     // 消息
  data?: any;          // 数据（可选）
  timestamp: string;   // 时间戳
}
```

---

## Swagger 文档

访问 `http://localhost:3100/api` 查看完整的 Swagger API 文档，包括：
- 所有端点的详细说明
- 请求/响应 Schema
- 在线测试功能

---

## 错误处理

API 使用全局异常过滤器 (`ErrorsFilter`) 处理错误，错误响应格式：

```json
{
  "code": 404,
  "success": false,
  "message": "User not found",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

