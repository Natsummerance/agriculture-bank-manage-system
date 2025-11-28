// 管理员相关 API

import { get, post, put } from './client';
import { Page } from './types';

/**
 * 用户
 */
export interface AdminUser {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户搜索请求
 */
export interface UserSearchRequest {
  keyword?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}


/**
 * 用户状态更新请求
 */
export interface UserStatusUpdateRequest {
  userId: string;
  status: 'ACTIVE' | 'INACTIVE';
  reason?: string;
}

/**
 * 用户角色更新请求
 */
export interface UserRoleUpdateRequest {
  userId: string;
  role: string;
}

/**
 * 用户统计响应
 */
export interface UserStatisticsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    role: string;
    count: number;
  }[];
  todayNewUsers: number;
  weekNewUsers: number;
  monthNewUsers: number;
}

/**
 * 商品审核
 */
export interface AdminProductAudit {
  id: string;
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  auditComment?: string;
  auditorId?: string;
  auditedAt?: string;
  createdAt: string;
}

/**
 * 内容审核
 */
export interface AdminContentAudit {
  id: string;
  contentId: string;
  contentTitle: string;
  expertId: string;
  expertName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  auditComment?: string;
  auditorId?: string;
  auditedAt?: string;
  createdAt: string;
}

/**
 * 专家审核
 */
export interface AdminExpertAudit {
  id: string;
  expertId: string;
  expertName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  auditComment?: string;
  auditorId?: string;
  auditedAt?: string;
  createdAt: string;
}

/**
 * 商品审核请求
 */
export interface ProductAuditRequest {
  productId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

/**
 * 内容审核请求
 */
export interface ContentAuditRequest {
  contentId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

/**
 * 专家审核请求
 */
export interface ExpertAuditRequest {
  expertId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

/**
 * 订单
 */
export interface Order {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 订单搜索请求
 */
export interface OrderSearchRequest {
  keyword?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

/**
 * 订单统计响应
 */
export interface OrderStatisticsResponse {
  totalOrders: number;
  totalAmount: number;
  todayOrders: number;
  todayAmount: number;
  ordersByStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  trendData: {
    date: string;
    count: number;
    amount: number;
  }[];
}

/**
 * 融资监控响应
 */
export interface FinanceMonitorResponse {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalAmount: number;
  approvedAmount: number;
  applications: any[];
}

/**
 * 仪表盘统计响应
 */
export interface AdminDashboardStatisticsResponse {
  totalUsers: number;
  totalOrders: number;
  totalAmount: number;
  totalProducts: number;
  pendingAudits: number;
  todayPV: number;
  todayUV: number;
  trendData: {
    date: string;
    users: number;
    orders: number;
    amount: number;
  }[];
}

/**
 * 搜索用户
 * @param request 搜索请求
 * @returns 用户列表
 */
export async function adminUserList(
  request: UserSearchRequest
): Promise<Page<AdminUser>> {
  return post<Page<AdminUser>>('/admin/users/search', request);
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户详情
 */
export async function getUserDetail(
  userId: string
): Promise<AdminUser> {
  return get<AdminUser>(`/admin/users/${userId}`);
}

/**
 * 更新用户状态
 * @param request 状态更新请求
 * @returns 更新后的用户
 */
export async function updateUserStatus(
  request: UserStatusUpdateRequest
): Promise<AdminUser> {
  return put<AdminUser>('/admin/users/status', request);
}

/**
 * 更新用户角色
 * @param request 角色更新请求
 * @returns 更新后的用户
 */
export async function updateUserRole(
  request: UserRoleUpdateRequest
): Promise<AdminUser> {
  return put<AdminUser>('/admin/users/role', request);
}

/**
 * 获取用户统计
 * @returns 用户统计数据
 */
export async function getUserStatistics(): Promise<UserStatisticsResponse> {
  return get<UserStatisticsResponse>('/admin/users/statistics');
}

/**
 * 获取待审核商品列表
 * @returns 待审核商品列表
 */
export async function adminProductAuditList(): Promise<AdminProductAudit[]> {
  return get<AdminProductAudit[]>('/admin/audit/products/pending');
}

/**
 * 审核商品
 * @param request 审核请求
 * @returns 审核结果
 */
export async function auditProduct(
  request: ProductAuditRequest
): Promise<AdminProductAudit> {
  return post<AdminProductAudit>('/admin/audit/product', request);
}

/**
 * 获取待审核内容列表
 * @returns 待审核内容列表
 */
export async function getPendingContentAudits(): Promise<AdminContentAudit[]> {
  return get<AdminContentAudit[]>('/admin/audit/contents/pending');
}

/**
 * 审核内容
 * @param request 审核请求
 * @returns 审核结果
 */
export async function auditContent(
  request: ContentAuditRequest
): Promise<AdminContentAudit> {
  return post<AdminContentAudit>('/admin/audit/content', request);
}

/**
 * 获取待审核专家列表
 * @returns 待审核专家列表
 */
export async function getPendingExpertAudits(): Promise<AdminExpertAudit[]> {
  return get<AdminExpertAudit[]>('/admin/audit/experts/pending');
}

/**
 * 审核专家
 * @param request 审核请求
 * @returns 审核结果
 */
export async function auditExpert(
  request: ExpertAuditRequest
): Promise<AdminExpertAudit> {
  return post<AdminExpertAudit>('/admin/audit/expert', request);
}

/**
 * 获取订单统计
 * @returns 订单统计数据
 */
export async function getOrderStatistics(): Promise<OrderStatisticsResponse> {
  return get<OrderStatisticsResponse>('/admin/orders/statistics');
}

/**
 * 搜索订单
 * @param request 搜索请求
 * @returns 订单列表
 */
export async function searchOrders(
  request: OrderSearchRequest
): Promise<Page<Order>> {
  return post<Page<Order>>('/admin/orders/search', request);
}

/**
 * 获取订单详情
 * @param orderId 订单ID
 * @returns 订单详情
 */
export async function getOrderDetail(
  orderId: string
): Promise<Order> {
  return get<Order>(`/admin/orders/${orderId}`);
}

/**
 * 获取融资监控数据
 * @returns 融资监控数据
 */
export async function getFinanceMonitor(): Promise<FinanceMonitorResponse> {
  return get<FinanceMonitorResponse>('/admin/finance/monitor');
}

/**
 * 获取仪表盘统计
 * @returns 仪表盘统计数据
 */
export async function getDashboardStatistics(): Promise<AdminDashboardStatisticsResponse> {
  return get<AdminDashboardStatisticsResponse>('/admin/dashboard/statistics');
}

/**
 * 系统配置
 */
export interface AdminSystemConfig {
  id: string;
  configKey: string;
  configValue: string;
  configType?: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  category?: string;
  description?: string;
  isEditable?: boolean;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 系统配置请求
 */
export interface SystemConfigRequest {
  configKey: string;
  configValue?: string;
  configType?: string;
  category?: string;
  description?: string;
}

/**
 * 获取系统配置
 * @param category 配置分类（可选）
 * @returns 系统配置列表
 */
export async function getSystemConfigs(
  category?: string
): Promise<AdminSystemConfig[]> {
  const params = category ? `?category=${category}` : '';
  return get<AdminSystemConfig[]>(`/admin/config${params}`);
}

/**
 * 设置系统配置
 * @param request 配置请求
 * @returns 更新后的配置
 */
export async function setSystemConfig(
  request: SystemConfigRequest
): Promise<AdminSystemConfig> {
  return post<AdminSystemConfig>('/admin/config', request);
}


