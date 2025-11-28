// 通用类型定义

/**
 * 分页响应
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

/**
 * API响应基础结构
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}


