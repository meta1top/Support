/**
 * REST API 通用类型定义
 * 这些类型用于前后端的 HTTP 通信
 */

/**
 * REST 响应结果
 */
export type RestResult<T> = {
  success?: boolean;
  code?: number;
  message?: string;
  data?: T;
};

/**
 * 分页数据
 */
export type PageData<T> = {
  total: number;
  data: T[];
};

/**
 * 分页响应结果
 */
export type PageResult<T> = RestResult<PageData<T>>;

/**
 * 分页请求参数
 */
export type PageRequest<T = unknown> = {
  page: number;
  size: number;
  keyword?: string;
} & T;
