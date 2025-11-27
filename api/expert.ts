// 专家相关 API

import { get, post, put, del } from './client';
import { Page } from './types';

/**
 * 问题
 */
export interface ExpertQuestion {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  content: string;
  bounty?: number;
  status: 'PENDING' | 'ANSWERED' | 'ADOPTED';
  createdAt: string;
}

/**
 * 问题搜索请求
 */
export interface QuestionSearchRequest {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}


/**
 * 回答请求
 */
export interface AnswerRequest {
  questionId: string;
  content: string;
}

/**
 * 回答
 */
export interface ExpertAnswer {
  id: string;
  questionId: string;
  expertId: string;
  expertName: string;
  content: string;
  isAdopted: boolean;
  createdAt: string;
}

/**
 * 可用时段请求
 */
export interface AvailableSlotRequest {
  date: string;  // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;  // HH:mm
}

/**
 * 可用时段
 */
export interface ExpertAvailableSlot {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
}

/**
 * 预约
 */
export interface ExpertAppointment {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  topic?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

/**
 * 预约状态更新请求
 */
export interface AppointmentStatusUpdateRequest {
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  remark?: string;
}

/**
 * 仪表盘统计响应
 */
export interface ExpertDashboardStatisticsResponse {
  totalQuestions: number;
  pendingQuestions: number;
  answeredQuestions: number;
  totalAppointments: number;
  todayAppointments: number;
  weekAppointments: number;
  totalEarnings: number;
  monthlyEarnings: number;
  totalContents: number;
  publishedContents: number;
  trendData: {
    date: string;
    questions: number;
    appointments: number;
    earnings: number;
  }[];
}

/**
 * 搜索问题
 * @param request 搜索请求
 * @returns 问题列表
 */
export async function getExpertQuestions(
  request?: QuestionSearchRequest
): Promise<Page<ExpertQuestion>> {
  if (request) {
    return post<Page<ExpertQuestion>>('/expert/qa/questions/search', request);
  }
  // 默认获取待回答问题
  return get<Page<ExpertQuestion>>('/expert/qa/questions/pending?page=0&size=20');
}

/**
 * 获取待回答问题列表
 * @param page 页码
 * @param size 每页数量
 * @returns 问题列表
 */
export async function getPendingQuestions(
  page: number = 0,
  size: number = 20
): Promise<Page<ExpertQuestion>> {
  return get<Page<ExpertQuestion>>(
    `/expert/qa/questions/pending?page=${page}&size=${size}`
  );
}

/**
 * 获取问题详情
 * @param questionId 问题ID
 * @returns 问题详情
 */
export async function getQuestionDetail(
  questionId: string
): Promise<ExpertQuestion> {
  return get<ExpertQuestion>(`/expert/qa/questions/${questionId}`);
}

/**
 * 回答问题
 * @param request 回答请求
 * @returns 回答
 */
export async function answerQuestion(
  request: AnswerRequest
): Promise<ExpertAnswer> {
  return post<ExpertAnswer>('/expert/qa/answers', request);
}

/**
 * 获取我的回答列表
 * @param page 页码
 * @param size 每页数量
 * @returns 回答列表
 */
export async function getMyAnswers(
  page: number = 0,
  size: number = 20
): Promise<Page<ExpertAnswer>> {
  return get<Page<ExpertAnswer>>(
    `/expert/qa/my-answers?page=${page}&size=${size}`
  );
}

/**
 * 添加可用时段
 * @param request 时段请求
 * @returns 可用时段
 */
export async function addAvailableSlot(
  request: AvailableSlotRequest
): Promise<ExpertAvailableSlot> {
  return post<ExpertAvailableSlot>('/expert/appointments/slots', request);
}

/**
 * 获取可用时段列表
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 可用时段列表
 */
export async function getAvailableSlots(
  startDate?: string,
  endDate?: string
): Promise<ExpertAvailableSlot[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);
  const query = params.toString();
  return get<ExpertAvailableSlot[]>(
    `/expert/appointments/slots${query ? `?${query}` : ''}`
  );
}

/**
 * 删除时段
 * @param slotId 时段ID
 */
export async function deleteSlot(slotId: string): Promise<void> {
  return del(`/expert/appointments/slots/${slotId}`);
}

/**
 * 获取预约列表（专家日历）
 * @param params 查询参数
 * @returns 预约列表
 */
export async function getExpertCalendar(
  params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<ExpertAppointment>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.startDate) queryParams.append('startDate', params.startDate);
  if (params?.endDate) queryParams.append('endDate', params.endDate);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertAppointment>>(
    `/expert/appointments${query ? `?${query}` : ''}`
  );
}

/**
 * 获取预约详情
 * @param appointmentId 预约ID
 * @returns 预约详情
 */
export async function getAppointmentDetail(
  appointmentId: string
): Promise<ExpertAppointment> {
  return get<ExpertAppointment>(`/expert/appointments/${appointmentId}`);
}

/**
 * 更新预约状态
 * @param appointmentId 预约ID
 * @param request 状态更新请求
 * @returns 更新后的预约
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  request: AppointmentStatusUpdateRequest
): Promise<ExpertAppointment> {
  return put<ExpertAppointment>(
    `/expert/appointments/${appointmentId}/status`,
    request
  );
}

/**
 * 获取仪表盘统计
 * @returns 仪表盘统计数据
 */
export async function getExpertDashboardStatistics(): Promise<ExpertDashboardStatisticsResponse> {
  return get<ExpertDashboardStatisticsResponse>('/expert/dashboard/statistics');
}

/**
 * 内容
 */
export interface ExpertContent {
  id: string;
  expertId: string;
  title: string;
  summary?: string;
  content?: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'IMAGE';
  coverUrl?: string;
  videoUrl?: string;
  images?: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'OFFLINE';
  auditStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 内容发布请求
 */
export interface ContentPublishRequest {
  title: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'IMAGE';
  summary?: string;
  content?: string;
  coverUrl?: string;
  videoUrl?: string;
  images?: string[];
}

/**
 * 收入统计响应
 */
export interface IncomeStatisticsResponse {
  qaIncome: number;
  appointmentIncome: number;
  adoptionIncome: number;
  totalIncome: number;
  withdrawTotal: number;
  withdrawableBalance: number;
}

/**
 * 收入记录
 */
export interface ExpertIncomeRecord {
  id: string;
  expertId: string;
  incomeType: 'QA' | 'APPOINTMENT' | 'ADOPTION';
  sourceId?: string;
  amount: number;
  description?: string;
  status: 'PENDING' | 'SETTLED' | 'CANCELLED';
  settledAt?: string;
  createdAt: string;
}

/**
 * 提现请求
 */
export interface WithdrawalRequest {
  amount: number;
  bankAccount: string;
  accountName: string;
}

/**
 * 提现记录
 */
export interface ExpertWithdrawal {
  id: string;
  expertId: string;
  amount: number;
  bankAccount: string;
  accountName: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  transactionId?: string;
  remark?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 发布内容
 * @param request 内容发布请求
 * @returns 发布的内容
 */
export async function publishContent(
  request: ContentPublishRequest
): Promise<ExpertContent> {
  return post<ExpertContent>('/expert/contents', request);
}

/**
 * 更新内容
 * @param contentId 内容ID
 * @param request 内容更新请求
 * @returns 更新后的内容
 */
export async function updateContent(
  contentId: string,
  request: ContentPublishRequest
): Promise<ExpertContent> {
  return put<ExpertContent>(`/expert/contents/${contentId}`, request);
}

/**
 * 获取内容列表
 * @param params 查询参数
 * @returns 内容列表
 */
export async function getContents(
  params?: {
    contentType?: string;
    status?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<ExpertContent>> {
  const queryParams = new URLSearchParams();
  if (params?.contentType) queryParams.append('contentType', params.contentType);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertContent>>(
    `/expert/contents${query ? `?${query}` : ''}`
  );
}

/**
 * 获取内容详情
 * @param contentId 内容ID
 * @returns 内容详情
 */
export async function getContentDetail(
  contentId: string
): Promise<ExpertContent> {
  return get<ExpertContent>(`/expert/contents/${contentId}`);
}

/**
 * 删除内容
 * @param contentId 内容ID
 */
export async function deleteContent(contentId: string): Promise<void> {
  return del(`/expert/contents/${contentId}`);
}

/**
 * 更新内容状态
 * @param contentId 内容ID
 * @param status 状态
 * @returns 更新后的内容
 */
export async function updateContentStatus(
  contentId: string,
  status: string
): Promise<ExpertContent> {
  return put<ExpertContent>(
    `/expert/contents/${contentId}/status?status=${status}`,
    null
  );
}

/**
 * 获取收入统计
 * @returns 收入统计数据
 */
export async function getIncomeStatistics(): Promise<IncomeStatisticsResponse> {
  return get<IncomeStatisticsResponse>('/expert/income/statistics');
}

/**
 * 获取收入明细
 * @param params 查询参数
 * @returns 收入明细列表
 */
export async function getIncomeRecords(
  params?: {
    incomeType?: string;
    startTime?: string;
    endTime?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<ExpertIncomeRecord>> {
  const queryParams = new URLSearchParams();
  if (params?.incomeType) queryParams.append('incomeType', params.incomeType);
  if (params?.startTime) queryParams.append('startTime', params.startTime);
  if (params?.endTime) queryParams.append('endTime', params.endTime);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertIncomeRecord>>(
    `/expert/income/records${query ? `?${query}` : ''}`
  );
}

/**
 * 申请提现
 * @param request 提现请求
 * @returns 提现记录
 */
export async function applyWithdrawal(
  request: WithdrawalRequest
): Promise<ExpertWithdrawal> {
  return post<ExpertWithdrawal>('/expert/income/withdraw', request);
}

/**
 * 获取提现记录
 * @param params 查询参数
 * @returns 提现记录列表
 */
export async function getWithdrawals(
  params?: {
    status?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<ExpertWithdrawal>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertWithdrawal>>(
    `/expert/income/withdrawals${query ? `?${query}` : ''}`
  );
}

/**
 * 获取提现详情
 * @param withdrawalId 提现ID
 * @returns 提现详情
 */
export async function getWithdrawalDetail(
  withdrawalId: string
): Promise<ExpertWithdrawal> {
  return get<ExpertWithdrawal>(`/expert/income/withdrawals/${withdrawalId}`);
}

/**
 * 专家资料
 */
export interface ExpertProfile {
  id: string;
  expertId: string;
  specialty?: string;
  qualification?: string;
  experience?: string;
  servicePrice: number;
  qaPrice: number;
  rating: number;
  totalConsultations: number;
  totalIncome: number;
  withdrawableBalance: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

/**
 * 服务价格更新请求
 */
export interface ServicePriceUpdateRequest {
  servicePrice?: number;
  qaPrice?: number;
}

/**
 * 农户评价
 */
export interface FarmerReview {
  id: string;
  expertId: string;
  farmerId: string;
  farmerName?: string;
  appointmentId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

/**
 * 获取专家资料
 * @returns 专家资料
 */
export async function getExpertProfile(): Promise<ExpertProfile> {
  return get<ExpertProfile>('/expert/profile');
}

/**
 * 更新服务价格
 * @param request 服务价格更新请求
 * @returns 更新后的专家资料
 */
export async function updateServicePrice(
  request: ServicePriceUpdateRequest
): Promise<ExpertProfile> {
  return put<ExpertProfile>('/expert/profile/service-price', request);
}

/**
 * 获取农户评价
 * @param page 页码
 * @param size 每页数量
 * @returns 农户评价列表
 */
export async function getFarmerReviews(
  page: number = 0,
  size: number = 20
): Promise<Page<FarmerReview>> {
  return get<Page<FarmerReview>>(
    `/expert/profile/reviews?page=${page}&size=${size}`
  );
}


