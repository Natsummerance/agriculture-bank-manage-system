/**
 * 认证相关API接口
 * 包含注册、登录、验证码等功能
 */

import { post, get, ApiError } from './client';

// 角色类型
export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

// 登录请求参数
export interface LoginRequest {
  phone: string;
  password: string;
  role?: RoleType;
}

// 注册请求参数
export interface RegisterRequest {
  phone: string;
  email: string; // 邮箱（必填）
  code: string; // 验证码
  password: string; // 密码
  role: RoleType;
  inviteCode?: string; // 邀请码（农户专属）
  name?: string; // 姓名
  company?: string; // 公司名称
  location?: string; // 地址
}

// 发送验证码请求参数
export interface SendCodeRequest {
  phone: string;
  email: string; // 邮箱（必填）
  type: 'register' | 'login' | 'reset'; // 验证码类型
  role?: RoleType;
}

// 用户信息
export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: RoleType;
  avatar?: string;
  company?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserInfo;
  expiresIn?: number; // token过期时间（秒）
}

// 注册响应
export interface RegisterResponse {
  token: string;
  refreshToken?: string;
  user: UserInfo;
  expiresIn?: number;
}

// 验证码响应
export interface SendCodeResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // 验证码有效期（秒）
}

/**
 * 用户登录
 * @param data 登录信息
 * @returns 登录响应，包含token和用户信息
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await post<LoginResponse>('/auth/login', data);
    
    // 保存token到localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // 可以根据不同的错误码做特殊处理
      if (error.code === 401) {
        throw new Error('手机号或密码错误');
      }
      throw new Error(error.message);
    }
    throw error;
  }
}

/**
 * 用户注册
 * @param data 注册信息
 * @returns 注册响应，包含token和用户信息
 */
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  try {
    const response = await post<RegisterResponse>('/auth/register', data);
    
    // 保存token到localStorage
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
    }
    
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // 可以根据不同的错误码做特殊处理
      if (error.code === 400) {
        throw new Error('注册信息不完整或格式错误');
      }
      if (error.code === 409) {
        throw new Error('该手机号已被注册');
      }
      throw new Error(error.message);
    }
    throw error;
  }
}

/**
 * 发送验证码
 * @param data 验证码请求信息
 * @returns 发送结果
 */
export async function sendVerificationCode(data: SendCodeRequest): Promise<SendCodeResponse> {
  try {
    return await post<SendCodeResponse>('/auth/send-code', data);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 429) {
        throw new Error('发送过于频繁，请稍后再试');
      }
      throw new Error(error.message || '发送验证码失败');
    }
    throw error;
  }
}

/**
 * 验证验证码
 * @param email 邮箱
 * @param code 验证码
 * @param type 验证码类型
 * @returns 验证结果
 */
export async function verifyCode(
  email: string,
  code: string,
  type: 'register' | 'login' | 'reset' = 'register'
): Promise<{ valid: boolean; message?: string }> {
  try {
    return await post<{ valid: boolean; message?: string }>('/auth/verify-code', {
      email,
      code,
      type,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 400) {
        throw new Error('验证码错误或已过期');
      }
      throw new Error(error.message || '验证失败');
    }
    throw error;
  }
}

/**
 * 刷新token
 * @returns 新的token信息
 */
export async function refreshAuthToken(): Promise<{ token: string; refreshToken?: string }> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('未找到刷新token');
    }
    
    const response = await post<{ token: string; refreshToken?: string }>('/auth/refresh', {
      refreshToken,
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }
    }
    
    return response;
  } catch (error) {
    // 刷新失败，清除所有token
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  try {
    await post('/auth/logout');
  } catch (error) {
    // 即使请求失败，也清除本地token
    console.error('退出登录失败:', error);
  } finally {
    // 清除本地存储的token
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export async function getCurrentUser(): Promise<UserInfo> {
  return await get<UserInfo>('/auth/me');
}

/**
 * 检查手机号是否已注册
 * @param phone 手机号
 * @param role 角色类型
 * @returns 是否已注册
 */
export async function checkPhoneExists(phone: string, role?: RoleType): Promise<boolean> {
  try {
    const queryString = role ? `?phone=${phone}&role=${role}` : `?phone=${phone}`;
    const response = await get<{ exists: boolean }>(`/auth/check-phone${queryString}`);
    return response.exists;
  } catch (error) {
    console.error('检查手机号失败:', error);
    return false;
  }
}

/**
 * 重置密码请求
 * @param phone 手机号
 * @param code 验证码
 * @param newPassword 新密码
 * @returns 重置结果
 */
export async function resetPassword(
  phone: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    return await post<{ success: boolean; message: string }>('/auth/reset-password', {
      phone,
      code,
      newPassword,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error((error as ApiError).message || '重置密码失败');
    }
    throw error;
  }
}

