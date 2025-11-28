// 农户相关 API

import { get, post } from './client';

/**
 * 商品列表项
 */
export interface FarmerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  status: 'on' | 'off';
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 商品列表响应
 */
export interface ProductListResponse {
  products: FarmerProduct[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 商品列表查询参数
 */
export interface ProductListParams {
  search?: string;      // 搜索关键词（商品名称或产地）
  status?: string;      // 状态筛选：all-全部, on-已上架, off-已下架
  page?: number;        // 页码（从1开始）
  pageSize?: number;   // 每页数量
}

/**
 * 商品上下架请求
 */
export interface ToggleStatusRequest {
  productId: string;
  status: 'on' | 'off';
}

/**
 * 创建商品请求
 */
export interface CreateProductRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
}

/**
 * 热门商品
 */
export interface TopProduct {
  id: string;
  name: string;
  viewCount: number;
  favoriteCount: number;
  shareCount: number;
}

/**
 * 趋势数据
 */
export interface TrendData {
  name: string;   // 日期名称，如"近5天前"、"今天"
  value: number; // 浏览量
}

/**
 * 商品数据看板响应
 */
export interface ProductDashboardResponse {
  totalView: number;        // 总浏览量
  totalFavorite: number;    // 总收藏数
  totalShare: number;       // 总分享数
  avgView: number;         // 平均浏览量
  topProducts: TopProduct[]; // 热门商品TOP5
  trendData: TrendData[];   // 近7日浏览趋势数据
}

/**
 * 获取农户商品列表
 * @param params 查询参数
 * @returns 商品列表响应
 */
export async function getFarmerProducts(
  params?: ProductListParams
): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.status) {
    queryParams.append('status', params.status);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/farmer/products/list${queryString ? `?${queryString}` : ''}`;
  
  return get<ProductListResponse>(endpoint);
}

/**
 * 商品上下架
 * @param request 上下架请求
 * @returns 操作结果
 */
export async function toggleProductStatus(
  request: ToggleStatusRequest
): Promise<void> {
  return post<void>('/farmer/products/toggle-status', request);
}

/**
 * 创建农户商品
 * @param request 创建商品请求
 * @returns 创建后的商品数据
 */
export async function createFarmerProduct(
  request: CreateProductRequest
): Promise<FarmerProduct> {
  return post<FarmerProduct>('/farmer/products/create', request);
}

/**
 * 获取商品数据看板
 * @returns 数据看板响应
 */
export async function getProductDashboard(): Promise<ProductDashboardResponse> {
  return get<ProductDashboardResponse>('/farmer/products/dashboard');
}

/**
 * 融资申请请求
 */
export interface FinancingApplicationRequest {
  amount: number;
  termMonths: number;
  purpose: string;
  productId?: string;
}

/**
 * 融资申请响应
 */
export interface FinancingApplicationResponse {
  id: string;
  farmerId: string;
  productId?: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: string;
  interestRate?: number;
  creditScore?: number;
  contractId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 提交农户融资申请
 * @param request 融资申请请求
 * @returns 融资申请响应
 * @throws {Error} 如果金额低于最低额度，错误消息为 'APPLY_JOINT_LOAN'
 */
export async function submitFarmerFinanceApp(
  request: FinancingApplicationRequest
): Promise<FinancingApplicationResponse> {
  try {
    const response = await post<FinancingApplicationResponse>(
      '/farmer/finance/apply',
      request
    );
    return response;
  } catch (error: any) {
    // 处理金额低于最低额度的情况（错误码2001）
    if (error.code === 2001 || error.message?.includes('拼单')) {
      const jointLoanError = new Error('APPLY_JOINT_LOAN');
      (jointLoanError as any).code = 2001;
      throw jointLoanError;
    }
    throw error;
  }
}

/**
 * 融资申请详情响应
 */
export interface FinancingApplicationDetailResponse {
  id: string;
  farmerId: string;
  farmerName?: string;
  productId?: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: string;
  interestRate?: number;
  creditScore?: number;
  reviewerId?: string;
  reviewedAt?: string;
  reviewComment?: string;
  contractId?: string;
  signedAt?: string;
  disbursedAt?: string;
  disbursedAmount?: number;
  createdAt: string;
  updatedAt: string;
  timeline?: any[];
  repaymentSchedules?: RepaymentSchedule[];
  repaymentSummary?: RepaymentSummaryResponse;
}

/**
 * 还款计划
 */
export interface RepaymentSchedule {
  id: string;
  financingId: string;
  installmentNumber: number;
  dueDate: string;
  principal: number;
  interest: number;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAt?: string;
  paidAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 还款记录
 */
export interface RepaymentRecord {
  id: string;
  financingId: string;
  scheduleId?: string;
  repaymentType: 'NORMAL' | 'EARLY' | 'OVERDUE';
  amount: number;
  principal: number;
  interest: number;
  penalty: number;
  paymentMethod: string;
  transactionId?: string;
  paidAt: string;
  createdAt: string;
}

/**
 * 还款请求
 */
export interface RepaymentRequest {
  financingId: string;
  scheduleId?: string;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
}

/**
 * 提前还款试算请求
 */
export interface EarlyRepaymentCalculateRequest {
  financingId: string;
  amount: number;
  repaymentDate: string;  // YYYY-MM-DD
}

/**
 * 提前还款试算响应
 */
export interface EarlyRepaymentCalculateResponse {
  totalAmount: number;
  principal: number;
  interest: number;
  penalty?: number;
  savedInterest?: number;
}

/**
 * 还款汇总响应
 */
export interface RepaymentSummaryResponse {
  totalInstallments: number;
  paidInstallments: number;
  pendingInstallments: number;
  overdueInstallments: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  paidPrincipal: number;
  paidInterest: number;
}

/**
 * 合同
 */
export interface Contract {
  id: string;
  financingId: string;
  contractNo: string;
  farmerId: string;
  farmerName: string;
  bankName: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  repaymentMethod?: string;
  status: 'DRAFT' | 'SIGNED' | 'CANCELLED';
  farmerSignatureUrl?: string;
  bankSignatureUrl?: string;
  farmerSignedAt?: string;
  bankSignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 获取我的融资申请列表
 * @param status 申请状态筛选（可选）
 * @returns 融资申请列表
 */
export async function getMyFinancingApplications(
  status?: string
): Promise<FinancingApplicationResponse[]> {
  const params = status ? `?status=${status}` : '';
  return get<FinancingApplicationResponse[]>(`/farmer/finance/applications${params}`);
}

/**
 * 获取融资申请详情
 * @param id 申请ID
 * @returns 融资申请详情
 */
export async function getFinancingApplicationDetail(
  id: string
): Promise<FinancingApplicationDetailResponse> {
  return get<FinancingApplicationDetailResponse>(`/farmer/finance/applications/${id}`);
}

/**
 * 还款
 * @param request 还款请求
 * @returns 还款记录
 */
export async function repayLoan(
  request: RepaymentRequest
): Promise<RepaymentRecord> {
  return post<RepaymentRecord>('/farmer/finance/repay', request);
}

/**
 * 提前还款试算
 * @param request 提前还款试算请求
 * @returns 试算结果
 */
export async function calculateEarlyRepayment(
  request: EarlyRepaymentCalculateRequest
): Promise<EarlyRepaymentCalculateResponse> {
  return post<EarlyRepaymentCalculateResponse>('/farmer/finance/early-repay/calculate', request);
}

/**
 * 获取还款计划列表
 * @param id 融资申请ID
 * @returns 还款计划列表
 */
export async function getRepaymentSchedules(
  id: string
): Promise<RepaymentSchedule[]> {
  return get<RepaymentSchedule[]>(`/farmer/finance/applications/${id}/schedules`);
}

/**
 * 获取还款记录列表
 * @param id 融资申请ID
 * @returns 还款记录列表
 */
export async function getRepaymentRecords(
  id: string
): Promise<RepaymentRecord[]> {
  return get<RepaymentRecord[]>(`/farmer/finance/applications/${id}/records`);
}

/**
 * 签署合同
 * @param contractId 合同ID
 * @param signatureUrl 签名图片URL
 * @returns 签署后的合同
 */
export async function signContract(
  contractId: string,
  signatureUrl: string
): Promise<Contract> {
  return post<Contract>(
    `/farmer/finance/contracts/${contractId}/sign?signatureUrl=${encodeURIComponent(signatureUrl)}`,
    null
  );
}

/**
 * 获取还款汇总
 * @param id 融资申请ID
 * @returns 还款汇总
 */
export async function getRepaymentSummary(
  id: string
): Promise<RepaymentSummaryResponse> {
  return get<RepaymentSummaryResponse>(`/farmer/finance/applications/${id}/repayment-summary`);
}


