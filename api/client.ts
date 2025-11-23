/**
 * API 客户端工具
 * 统一处理 HTTP 请求/响应、错误处理、token管理等
 */

export class ApiError extends Error {
  constructor(
    public code: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  success: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * 获取 Authorization 头
 */
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
}

/**
 * 处理响应
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    // 处理错误响应
    let errorData: any = {};
    try {
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = await response.text();
      }
    } catch (e) {
      // 无法解析响应体
    }

    const errorMessage = 
      typeof errorData === 'object' && errorData.message
        ? errorData.message
        : `请求失败: ${response.statusText}`;

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // 处理成功响应
  if (!contentType?.includes('application/json')) {
    throw new ApiError(500, '响应格式错误: 期望 JSON');
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success && data.code !== 0) {
    throw new ApiError(data.code, data.message, data.data);
  }

  return data.data as T;
}

/**
 * GET 请求
 */
export async function get<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * POST 请求
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * PUT 请求
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * DELETE 请求
 */
export async function del<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options?.headers,
    },
    ...options,
  });

  return handleResponse<T>(response);
}

/**
 * 刷新 Token
 */
export async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new ApiError(401, '没有刷新令牌');
  }

  const response = await post<{ token: string; refreshToken: string }>(
    '/auth/refresh',
    { refreshToken }
  );

  localStorage.setItem('auth_token', response.token);
  if (response.refreshToken) {
    localStorage.setItem('refresh_token', response.refreshToken);
  }

  return response.token;
}

/**
 * 清除认证信息
 */
export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
}
