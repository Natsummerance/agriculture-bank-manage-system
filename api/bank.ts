// 银行相关 API

import { get, post, put, del } from './client';

/**
 * 贷款产品
 */
export interface LoanProduct {
  id: string;
  name: string;
  rate: number;           // 年利率（%）
  minAmount: number;      // 最小金额
  maxAmount: number;      // 最大金额
  termMonths: number;     // 期限（月）
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 贷款产品请求
 */
export interface LoanProductRequest {
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number;
  description?: string;
}

/**
 * 融资申请（用于审批列表）
 */
export interface FinancingApplication {
  id: string;
  farmerId: string;
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
  createdAt: string;
  updatedAt: string;
}

/**
 * 审批请求
 */
export interface ApprovalRequest {
  financingId: string;
  action: 'APPROVE' | 'REJECT';
  reviewComment?: string;
  creditScore?: number;
  interestRate?: number;
}

/**
 * 信用评分请求
 */
export interface CreditScoreRequest {
  financingId: string;
  creditHistoryScore?: number;
  income: number;
  assets: number;
  debtRatio: number;
  industryExperience?: number;
}

/**
 * 信用评分响应
 */
export interface CreditScore {
  id: string;
  financingId: string;
  farmerId: string;
  creditHistoryScore?: number;
  incomeScore: number;
  assetScore: number;
  debtRatioScore: number;
  experienceScore?: number;
  totalScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  suggestedAmount?: number;
  reviewedAt: string;
}

/**
 * 获取贷款产品列表
 * @returns 贷款产品列表
 */
export async function getBankLoanProducts(): Promise<LoanProduct[]> {
  return get<LoanProduct[]>('/bank/loan/products');
}

/**
 * 获取贷款产品详情
 * @param id 产品ID
 * @returns 产品详情
 */
export async function getLoanProduct(id: string): Promise<LoanProduct> {
  return get<LoanProduct>(`/bank/loan/products/${id}`);
}

/**
 * 创建贷款产品
 * @param request 产品信息
 * @returns 创建的产品
 */
export async function createLoanProduct(
  request: LoanProductRequest
): Promise<LoanProduct> {
  return post<LoanProduct>('/bank/loan/products', request);
}

/**
 * 更新贷款产品
 * @param id 产品ID
 * @param request 产品信息
 * @returns 更新后的产品
 */
export async function updateLoanProduct(
  id: string,
  request: LoanProductRequest
): Promise<LoanProduct> {
  return put<LoanProduct>(`/bank/loan/products/${id}`, request);
}

/**
 * 删除贷款产品
 * @param id 产品ID
 */
export async function deleteLoanProduct(id: string): Promise<void> {
  return del(`/bank/loan/products/${id}`);
}

/**
 * 获取待审批列表
 * @returns 待审批申请列表
 */
export async function bankApprovalList(): Promise<FinancingApplication[]> {
  return get<FinancingApplication[]>('/bank/loan/approvals/pending');
}

/**
 * 审批申请
 * @param request 审批请求
 * @returns 审批后的申请
 */
export async function approveApplication(
  request: ApprovalRequest
): Promise<FinancingApplication> {
  return post<FinancingApplication>('/bank/loan/approvals', request);
}

/**
 * 计算信用评分
 * @param request 评分请求
 * @returns 信用评分结果
 */
export async function calculateCreditScore(
  request: CreditScoreRequest
): Promise<CreditScore> {
  return post<CreditScore>('/bank/loan/credit-score/calculate', request);
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
 * 合同生成请求
 */
export interface ContractGenerateRequest {
  financingId: string;
  bankName?: string;
  bankAccount?: string;
}

/**
 * 放款请求
 */
export interface DisbursementRequest {
  financingId: string;
  contractId: string;
  amount: number;
  bankAccount?: string;
  farmerAccount?: string;
  remark?: string;
}

/**
 * 放款记录
 */
export interface Disbursement {
  id: string;
  financingId: string;
  contractId?: string;
  amount: number;
  bankAccount?: string;
  farmerAccount?: string;
  transactionId?: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  disbursedBy?: string;
  disbursedAt?: string;
  remark?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 生成合同
 * @param request 合同生成请求
 * @returns 生成的合同
 */
export async function generateContract(
  request: ContractGenerateRequest
): Promise<Contract> {
  return post<Contract>('/bank/loan/contracts/generate', request);
}

/**
 * 银行签署合同
 * @param contractId 合同ID
 * @param signatureUrl 签名图片URL
 * @returns 签署后的合同
 */
export async function signContractByBank(
  contractId: string,
  signatureUrl: string
): Promise<Contract> {
  return post<Contract>(
    `/bank/loan/contracts/${contractId}/sign?signatureUrl=${encodeURIComponent(signatureUrl)}`,
    null
  );
}

/**
 * 放款
 * @param request 放款请求
 * @returns 放款记录
 */
export async function disburseLoan(
  request: DisbursementRequest
): Promise<Disbursement> {
  return post<Disbursement>('/bank/loan/disburse', request);
}

/**
 * 获取放款列表
 * @param status 放款状态（可选）
 * @returns 放款列表
 */
export async function getDisbursements(
  status?: string
): Promise<Disbursement[]> {
  const params = status ? `?status=${status}` : '';
  return get<Disbursement[]>(`/bank/loan/disbursements${params}`);
}

/**
 * 获取审批统计
 * @returns 审批统计数据
 */
export async function getApprovalStatistics(): Promise<any> {
  return get<any>('/bank/loan/statistics/approval');
}

/**
 * 获取放款统计
 * @param startDate 开始日期（可选）
 * @param endDate 结束日期（可选）
 * @returns 放款统计数据
 */
export async function getDisbursementStatistics(
  startDate?: string,
  endDate?: string
): Promise<any> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return get<any>(
    `/bank/loan/statistics/disbursement${query ? `?${query}` : ''}`
  );
}

/**
 * 逾期项
 */
export interface OverdueItem {
  financingId: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  overdueDays: number;
  overdueAmount: number;
  penalty: number;
  lastContactDate?: string;
}

/**
 * 逾期统计
 */
export interface OverdueStatistics {
  totalOverdueCount: number;
  totalOverdueAmount: number;
  overdueByDays: {
    days: number;
    count: number;
    amount: number;
  }[];
}

/**
 * 对账记录
 */
export interface ReconciliationRecord {
  id: string;
  reconcileDate: string;
  totalTransactions: number;
  totalAmount: number;
  matchedCount: number;
  unmatchedCount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
}

/**
 * 对账导出请求
 */
export interface ReconciliationExportRequest {
  startDate?: string;
  endDate?: string;
  format?: 'xlsx' | 'csv';
}

/**
 * 贷后监控数据
 */
export interface PostLoanMonitoring {
  financingId: string;
  farmerId: string;
  farmerName: string;
  amount: number;
  disbursedAt: string;
  remainingPrincipal: number;
  nextPaymentDate?: string;
  nextPaymentAmount?: number;
  overdueCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastPaymentDate?: string;
}

/**
 * 手动触发逾期检测
 * @returns 更新的逾期记录数
 */
export async function checkOverdue(): Promise<number> {
  return post<number>('/bank/loan/overdue/check', {});
}

/**
 * 获取逾期统计
 * @returns 逾期统计数据
 */
export async function getOverdueStatistics(): Promise<OverdueStatistics> {
  return get<OverdueStatistics>('/bank/loan/overdue/statistics');
}

/**
 * 获取逾期列表
 * @returns 逾期列表
 */
export async function getOverdueList(): Promise<OverdueItem[]> {
  return get<OverdueItem[]>('/bank/loan/overdue/list');
}

/**
 * 发送逾期提醒
 * @param financingId 融资申请ID
 */
export async function sendOverdueAlert(
  financingId: string
): Promise<void> {
  return post(`/bank/loan/overdue/${financingId}/alert`, {});
}

/**
 * 计算逾期罚息
 * @param financingId 融资申请ID
 * @returns 逾期罚息金额
 */
export async function calculateOverduePenalty(
  financingId: string
): Promise<number> {
  return get<number>(`/bank/loan/overdue/${financingId}/penalty`);
}

/**
 * 对账
 * @param date 对账日期（可选，默认为昨天）
 * @returns 处理的对账记录数
 */
export async function reconcile(date?: string): Promise<number> {
  const params = date ? `?date=${date}` : '';
  return post<number>(`/bank/loan/reconciliation/reconcile${params}`, {});
}

/**
 * 获取对账列表
 * @param startDate 开始日期（可选）
 * @param endDate 结束日期（可选）
 * @returns 对账记录列表
 */
export async function getReconciliationList(
  startDate?: string,
  endDate?: string
): Promise<ReconciliationRecord[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return get<ReconciliationRecord[]>(
    `/bank/loan/reconciliation/list${query ? `?${query}` : ''}`
  );
}

/**
 * 获取对账统计
 * @param startDate 开始日期（可选）
 * @param endDate 结束日期（可选）
 * @returns 对账统计数据
 */
export async function getReconciliationStatistics(
  startDate?: string,
  endDate?: string
): Promise<any> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return get<any>(
    `/bank/loan/reconciliation/statistics${query ? `?${query}` : ''}`
  );
}

/**
 * 导出对账单
 * @param request 导出请求
 * @returns 文件下载URL
 */
export async function exportReconciliation(
  request: ReconciliationExportRequest
): Promise<string> {
  return post<string>('/bank/loan/reconciliation/export', request);
}

/**
 * 导出T+1文件
 * @param request 导出请求
 * @returns 文件下载URL
 */
export async function exportT1File(
  request: ReconciliationExportRequest
): Promise<string> {
  return post<string>('/bank/loan/reconciliation/export-t1', request);
}

/**
 * 获取贷后监控数据
 * @param financingId 融资申请ID
 * @returns 贷后监控数据
 */
export async function getPostLoanMonitoring(
  financingId: string
): Promise<PostLoanMonitoring> {
  return get<PostLoanMonitoring>(
    `/bank/loan/post-loan/monitoring/${financingId}`
  );
}

/**
 * 获取所有贷后监控列表
 * @returns 贷后监控列表
 */
export async function getAllPostLoanMonitoring(): Promise<PostLoanMonitoring[]> {
  return get<PostLoanMonitoring[]>('/bank/loan/post-loan/monitoring');
}


