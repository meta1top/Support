# UI 组件清单 - Web Applications

**生成日期**: 2025-12-03  
**项目部分**: web-design, web-editor, packages/design

## 概述

本项目包含两个前端应用和一个 UI 组件库：

- **web-design**: 设计系统展示平台，用于预览和测试 UI 组件
- **web-editor**: 富文本编辑器展示平台
- **packages/design**: React UI 组件库（基于 Radix UI 和 Tailwind CSS）

---

## Packages/Design 组件库

### UI 基础组件 (`components/ui/`)

基于 Radix UI 的无障碍基础组件：

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Alert Dialog | `components/ui/alert-dialog.tsx` | 确认对话框 |
| Alert | `components/ui/alert.tsx` | 警告提示 |
| Avatar | `components/ui/avatar.tsx` | 头像组件 |
| Badge | `components/ui/badge.tsx` | 徽章 |
| Breadcrumb | `components/ui/breadcrumb.tsx` | 面包屑导航 |
| Button | `components/ui/button.tsx` | 按钮 |
| Calendar | `components/ui/calendar.tsx` | 日历 |
| Card | `components/ui/card.tsx` | 卡片 |
| Checkbox | `components/ui/checkbox.tsx` | 复选框 |
| Command | `components/ui/command.tsx` | 命令面板 |
| Context Menu | `components/ui/context-menu.tsx` | 右键菜单 |
| Dialog | `components/ui/dialog.tsx` | 对话框 |
| Dropdown Menu | `components/ui/dropdown-menu.tsx` | 下拉菜单 |
| Form | `components/ui/form.tsx` | 表单（基于 react-hook-form） |
| Hover Card | `components/ui/hover-card.tsx` | 悬停卡片 |
| Input | `components/ui/input.tsx` | 输入框 |
| Input OTP | `components/ui/input-otp.tsx` | OTP 输入框 |
| Label | `components/ui/label.tsx` | 标签 |
| Navigation Menu | `components/ui/navigation-menu.tsx` | 导航菜单 |
| Pagination | `components/ui/pagination.tsx` | 分页 |
| Popover | `components/ui/popover.tsx` | 弹出框 |
| Progress | `components/ui/progress.tsx` | 进度条 |
| Radio Group | `components/ui/radio-group.tsx` | 单选组 |
| Resizable | `components/ui/resizable.tsx` | 可调整大小面板 |
| Scroll Area | `components/ui/scroll-area.tsx` | 滚动区域 |
| Select | `components/ui/select.tsx` | 选择器 |
| Separator | `components/ui/separator.tsx` | 分隔符 |
| Sheet | `components/ui/sheet.tsx` | 侧边栏 |
| Skeleton | `components/ui/skeleton.tsx` | 骨架屏 |
| Sonner | `components/ui/sonner.tsx` | Toast 通知 |
| Switch | `components/ui/switch.tsx` | 开关 |
| Table | `components/ui/table.tsx` | 表格 |
| Tabs | `components/ui/tabs.tsx` | 标签页 |
| Textarea | `components/ui/textarea.tsx` | 多行输入 |
| Tooltip | `components/ui/tooltip.tsx` | 工具提示 |

### UIX 高级组件 (`components/uix/`)

基于 UI 基础组件构建的高级业务组件：

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Action | `components/uix/action/index.tsx` | 操作按钮组 |
| Alert | `components/uix/alert/index.tsx` | 警告提示（增强版） |
| Alert Dialog | `components/uix/alert-dialog/index.tsx` | 确认对话框（增强版） |
| Avatar | `components/uix/avatar/index.tsx` | 头像（增强版） |
| Badge | `components/uix/badge/index.tsx` | 徽章（增强版） |
| Breadcrumbs | `components/uix/breadcrumbs/index.tsx` | 面包屑导航（增强版） |
| Broadcast Channel Context | `components/uix/broadcast-channel-context/index.tsx` | 跨标签页通信 |
| Button | `components/uix/button/index.tsx` | 按钮（增强版） |
| Card | `components/uix/card/index.tsx` | 卡片（增强版） |
| Checkbox | `components/uix/checkbox/index.tsx` | 复选框（增强版） |
| Checkbox Group | `components/uix/checkbox-group/index.tsx` | 复选框组 |
| Combo Select | `components/uix/combo-select/index.tsx` | 组合选择器 |
| Config Provider | `components/uix/config-provider/index.tsx` | 配置提供者 |
| Data Table | `components/uix/data-table/index.tsx` | 数据表格（基于 TanStack Table） |
| Date Picker | `components/uix/date-picker/index.tsx` | 日期选择器 |
| Date Range Picker | `components/uix/date-range-picker/index.tsx` | 日期范围选择器 |
| Dialog | `components/uix/dialog/index.tsx` | 对话框（增强版） |
| Divider | `components/uix/divider/index.tsx` | 分隔符（增强版） |
| Dropdown | `components/uix/dropdown/index.tsx` | 下拉菜单（增强版） |
| Empty | `components/uix/empty/index.tsx` | 空状态 |
| Filters | `components/uix/filters/index.tsx` | 过滤器组件 |
| Form | `components/uix/form/index.tsx` | 表单（增强版） |
| Image | `components/uix/image/index.tsx` | 图片组件 |
| Loading | `components/uix/loading/index.tsx` | 加载状态 |
| Message | `components/uix/message/index.tsx` | 消息提示 |
| Pagination | `components/uix/pagination/index.tsx` | 分页（增强版） |
| Radio Group | `components/uix/radio-group/index.tsx` | 单选组（增强版） |
| Result | `components/uix/result/index.tsx` | 结果页 |
| Select | `components/uix/select/index.tsx` | 选择器（增强版） |
| Space | `components/uix/space/index.tsx` | 间距组件 |
| Spin | `components/uix/spin/index.tsx` | 加载旋转器 |
| Steps | `components/uix/steps/index.tsx` | 步骤条 |
| Switch | `components/uix/switch/index.tsx` | 开关（增强版） |
| Tags Input | `components/uix/tags-input/index.tsx` | 标签输入 |
| Tooltip | `components/uix/tooltip/index.tsx` | 工具提示（增强版） |
| Tree | `components/uix/tree/index.tsx` | 树形组件 |
| Tree Select | `components/uix/tree-select/index.tsx` | 树形选择器 |
| Tree Table | `components/uix/tree-table/index.tsx` | 树形表格 |
| Uploader | `components/uix/uploader/index.tsx` | 文件上传 |
| Value Formatter | `components/uix/value-formatter/index.tsx` | 值格式化器 |

### 图标组件 (`components/icons/`)

| 组件 | 文件路径 | 说明 |
|------|----------|------|
| Empty | `components/icons/Empty.tsx` | 空状态图标 |
| Spin | `components/icons/Spin.tsx` | 加载旋转图标 |

---

## Web-Design 应用组件演示

Web-design 应用提供了以下组件的演示页面：

| 组件 | 演示路径 | 说明 |
|------|----------|------|
| Action | `/demo/action` | 操作按钮组演示 |
| Alert | `/demo/alert` | 警告提示演示 |
| Avatar | `/demo/avatar` | 头像演示 |
| Badge | `/demo/badge` | 徽章演示 |
| Card | `/demo/card` | 卡片演示 |
| Checkbox | `/demo/checkbox` | 复选框演示 |
| Checkbox Group | `/demo/checkbox-group` | 复选框组演示 |
| Combo Select | `/demo/combo-select` | 组合选择器演示 |
| Data Table | `/demo/data-table` | 数据表格演示 |
| Date Picker | `/demo/date-picker` | 日期选择器演示 |
| Dialog | `/demo/dialog` | 对话框演示 |
| Divider | `/demo/divider` | 分隔符演示 |
| Form | `/demo/form` | 表单演示 |
| Formatters | `/demo/formatters` | 格式化器演示 |
| Message | `/demo/message` | 消息提示演示 |
| Navigation Menu | `/demo/navigation-menu` | 导航菜单演示 |
| Select | `/demo/select` | 选择器演示 |
| Sheet | `/demo/sheet` | 侧边栏演示 |
| Tags Input | `/demo/tags-input` | 标签输入演示 |
| Tooltip | `/demo/tooltip` | 工具提示演示 |
| Tree | `/demo/tree` | 树形组件演示 |
| Tree Select | `/demo/tree-select` | 树形选择器演示 |
| Tree Table | `/demo/tree-table` | 树形表格演示 |
| Uploader | `/demo/uploader` | 文件上传演示 |

---

## Web-Editor 应用

Web-editor 应用提供富文本编辑器展示，基于 Tiptap 构建。

---

## 组件分类

### 布局组件
- Card
- Sheet
- Divider
- Space
- Resizable

### 表单组件
- Input
- Textarea
- Select
- Combo Select
- Checkbox / Checkbox Group
- Radio Group
- Date Picker / Date Range Picker
- Tags Input
- Uploader
- Form

### 数据展示
- Table
- Data Table
- Tree
- Tree Table
- Tree Select
- Pagination
- Avatar
- Badge
- Empty
- Result

### 反馈组件
- Alert
- Alert Dialog
- Dialog
- Message
- Tooltip
- Popover
- Sonner (Toast)
- Loading / Spin
- Skeleton
- Progress

### 导航组件
- Navigation Menu
- Breadcrumbs
- Tabs
- Steps

### 其他
- Button
- Action
- Command
- Calendar
- Filters
- Value Formatter

---

## 设计系统

### 主题系统
- 支持明暗主题切换（通过 `next-themes`）
- 基于 Tailwind CSS 4 的原子化设计

### 无障碍访问
- 所有组件基于 Radix UI，符合 WCAG 标准
- 完整的键盘导航支持
- 屏幕阅读器友好

### 类型安全
- 完整的 TypeScript 支持
- 所有组件都有类型定义

---

## 使用方式

### 安装

```bash
pnpm add @meta-1/design
```

### 导入组件

```typescript
// UI 基础组件
import { Button } from '@meta-1/design/components/ui/button';
import { Card } from '@meta-1/design/components/ui/card';

// UIX 高级组件
import { DataTable } from '@meta-1/design/components/uix/data-table';
import { DatePicker } from '@meta-1/design/components/uix/date-picker';
```

### 主题样式

```typescript
import '@meta-1/design/theme.css';
```

---

## 组件统计

- **UI 基础组件**: 32 个
- **UIX 高级组件**: 42 个
- **图标组件**: 2 个
- **总计**: 76 个组件

