# 专家模块前端接口实现文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 专家模块前端接口对接

---

## 📋 目录

1. [功能概述](#1-功能概述)
2. [前端API需求](#2-前端api需求)
3. [后端接口状态](#3-后端接口状态)
4. [未实现接口列表](#4-未实现接口列表)
5. [实现步骤](#5-实现步骤)
6. [接口对接说明](#6-接口对接说明)
7. [DTO设计](#7-dto设计)
8. [实现优先级](#8-实现优先级)
9. [测试计划](#9-测试计划)
10. [注意事项](#10-注意事项)

---

## 1. 功能概述

### 1.1 问答管理
- 问题搜索和筛选
- 待回答问题列表
- 问题详情查看
- 回答问题
- 我的回答列表

### 1.2 预约管理
- 可用时段设置
- 预约列表查询
- 预约详情查看
- 预约状态更新（确认/取消/完成）

### 1.3 内容管理
- 内容发布
- 内容编辑
- 内容列表查询
- 内容详情查看
- 内容删除
- 内容状态更新

### 1.4 收入管理
- 收入统计查看
- 收入明细查询
- 提现申请
- 提现记录查询

### 1.5 资料管理
- 专家资料查看
- 服务价格设置
- 农户评价查看

### 1.6 仪表盘
- 统计数据查看
- 趋势分析

---

## 2. 前端API需求

### 2.1 当前前端API (`api/expert.ts`)

#### 2.1.1 已定义但未实现的接口
- ❌ `getExpertQuestions()` - 获取专家问答列表（占位函数）
- ❌ `getExpertCalendar()` - 获取专家日历（占位函数）

#### 2.1.2 需要新增的接口
根据后端已实现的接口，前端需要实现以下功能模块的API：

1. **问答管理API**
2. **预约管理API**
3. **内容管理API**
4. **收入管理API**
5. **资料管理API**
6. **仪表盘API**

---

## 3. 后端接口状态

### 3.1 已实现的后端接口

#### 3.1.1 问答管理接口
- ✅ `POST /api/expert/qa/questions/search` - 搜索问题
- ✅ `GET /api/expert/qa/questions/pending` - 获取待回答问题列表
- ✅ `GET /api/expert/qa/questions/{questionId}` - 获取问题详情
- ✅ `POST /api/expert/qa/answers` - 回答问题
- ✅ `GET /api/expert/qa/my-answers` - 获取我的回答列表

#### 3.1.2 预约管理接口
- ✅ `POST /api/expert/appointments/slots` - 添加可用时段
- ✅ `GET /api/expert/appointments/slots` - 获取可用时段列表
- ✅ `DELETE /api/expert/appointments/slots/{slotId}` - 删除时段
- ✅ `GET /api/expert/appointments` - 获取预约列表
- ✅ `GET /api/expert/appointments/{appointmentId}` - 获取预约详情
- ✅ `PUT /api/expert/appointments/{appointmentId}/status` - 更新预约状态

#### 3.1.3 内容管理接口
- ✅ `POST /api/expert/contents` - 发布内容
- ✅ `PUT /api/expert/contents/{contentId}` - 更新内容
- ✅ `GET /api/expert/contents` - 获取内容列表
- ✅ `GET /api/expert/contents/{contentId}` - 获取内容详情
- ✅ `DELETE /api/expert/contents/{contentId}` - 删除内容
- ✅ `PUT /api/expert/contents/{contentId}/status` - 更新内容状态

#### 3.1.4 收入管理接口
- ✅ `GET /api/expert/income/statistics` - 获取收入统计
- ✅ `GET /api/expert/income/records` - 获取收入明细
- ✅ `POST /api/expert/income/withdraw` - 申请提现
- ✅ `GET /api/expert/income/withdrawals` - 获取提现记录
- ✅ `GET /api/expert/income/withdrawals/{withdrawalId}` - 获取提现详情

#### 3.1.5 资料管理接口
- ✅ `GET /api/expert/profile` - 获取专家资料
- ✅ `PUT /api/expert/profile/service-price` - 更新服务价格
- ✅ `GET /api/expert/profile/reviews` - 获取农户评价

#### 3.1.6 仪表盘接口
- ✅ `GET /api/expert/dashboard/statistics` - 获取仪表盘统计

---

## 4. 未实现接口列表

### 4.1 前端需要实现的接口

#### 4.1.1 问答管理接口

**文件**: `api/expert.ts`

**需要实现的接口**:

1. **搜索问题**
```typescript
export interface QuestionSearchRequest {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

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

export async function searchQuestions(
  request: QuestionSearchRequest
): Promise<Page<ExpertQuestion>> {
  return post<Page<ExpertQuestion>>('/expert/qa/questions/search', request);
}
```

2. **获取待回答问题列表**
```typescript
export async function getPendingQuestions(
  page: number = 0,
  size: number = 20
): Promise<Page<ExpertQuestion>> {
  return get<Page<ExpertQuestion>>(
    `/expert/qa/questions/pending?page=${page}&size=${size}`
  );
}
```

3. **获取问题详情**
```typescript
export async function getQuestionDetail(
  questionId: string
): Promise<ExpertQuestion> {
  return get<ExpertQuestion>(`/expert/qa/questions/${questionId}`);
}
```

4. **回答问题**
```typescript
export interface AnswerRequest {
  questionId: string;
  content: string;
}

export interface ExpertAnswer {
  id: string;
  questionId: string;
  expertId: string;
  expertName: string;
  content: string;
  isAdopted: boolean;
  createdAt: string;
}

export async function answerQuestion(
  request: AnswerRequest
): Promise<ExpertAnswer> {
  return post<ExpertAnswer>('/expert/qa/answers', request);
}
```

5. **获取我的回答列表**
```typescript
export async function getMyAnswers(
  page: number = 0,
  size: number = 20
): Promise<Page<ExpertAnswer>> {
  return get<Page<ExpertAnswer>>(
    `/expert/qa/my-answers?page=${page}&size=${size}`
  );
}
```

#### 4.1.2 预约管理接口

**需要实现的接口**:

1. **添加可用时段**
```typescript
export interface AvailableSlotRequest {
  date: string;  // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;  // HH:mm
}

export interface ExpertAvailableSlot {
  id: string;
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
}

export async function addAvailableSlot(
  request: AvailableSlotRequest
): Promise<ExpertAvailableSlot> {
  return post<ExpertAvailableSlot>('/expert/appointments/slots', request);
}
```

2. **获取可用时段列表**
```typescript
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
```

3. **删除时段**
```typescript
export async function deleteSlot(slotId: string): Promise<void> {
  return del(`/expert/appointments/slots/${slotId}`);
}
```

4. **获取预约列表**
```typescript
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

export async function getAppointments(
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
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertAppointment>>(
    `/expert/appointments${query ? `?${query}` : ''}`
  );
}
```

5. **获取预约详情**
```typescript
export async function getAppointmentDetail(
  appointmentId: string
): Promise<ExpertAppointment> {
  return get<ExpertAppointment>(`/expert/appointments/${appointmentId}`);
}
```

6. **更新预约状态**
```typescript
export interface AppointmentStatusUpdateRequest {
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  remark?: string;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  request: AppointmentStatusUpdateRequest
): Promise<ExpertAppointment> {
  return put<ExpertAppointment>(
    `/expert/appointments/${appointmentId}/status`,
    request
  );
}
```

#### 4.1.3 内容管理接口

**需要实现的接口**:

1. **发布内容**
```typescript
export interface ContentPublishRequest {
  title: string;
  content: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'AUDIO';
  category?: string;
  tags?: string[];
  coverImage?: string;
}

export interface ExpertContent {
  id: string;
  expertId: string;
  title: string;
  content: string;
  contentType: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  viewCount: number;
  likeCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export async function publishContent(
  request: ContentPublishRequest
): Promise<ExpertContent> {
  return post<ExpertContent>('/expert/contents', request);
}
```

2. **更新内容**
```typescript
export async function updateContent(
  contentId: string,
  request: ContentPublishRequest
): Promise<ExpertContent> {
  return put<ExpertContent>(`/expert/contents/${contentId}`, request);
}
```

3. **获取内容列表**
```typescript
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
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertContent>>(
    `/expert/contents${query ? `?${query}` : ''}`
  );
}
```

4. **获取内容详情**
```typescript
export async function getContentDetail(
  contentId: string
): Promise<ExpertContent> {
  return get<ExpertContent>(`/expert/contents/${contentId}`);
}
```

5. **删除内容**
```typescript
export async function deleteContent(contentId: string): Promise<void> {
  return del(`/expert/contents/${contentId}`);
}
```

6. **更新内容状态**
```typescript
export async function updateContentStatus(
  contentId: string,
  status: string
): Promise<ExpertContent> {
  return put<ExpertContent>(
    `/expert/contents/${contentId}/status?status=${status}`,
    null
  );
}
```

#### 4.1.4 收入管理接口

**需要实现的接口**:

1. **获取收入统计**
```typescript
export interface IncomeStatisticsResponse {
  totalEarnings: number;
  qaEarnings: number;
  appointmentEarnings: number;
  withdrawTotal: number;
  withdrawableBalance: number;
  monthlyEarnings: {
    month: string;
    amount: number;
  }[];
}

export async function getIncomeStatistics(): Promise<IncomeStatisticsResponse> {
  return get<IncomeStatisticsResponse>('/expert/income/statistics');
}
```

2. **获取收入明细**
```typescript
export interface ExpertIncomeRecord {
  id: string;
  expertId: string;
  incomeType: 'QA' | 'APPOINTMENT';
  amount: number;
  sourceId: string;  // 问题ID或预约ID
  description?: string;
  createdAt: string;
}

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
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertIncomeRecord>>(
    `/expert/income/records${query ? `?${query}` : ''}`
  );
}
```

3. **申请提现**
```typescript
export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
}

export interface ExpertWithdrawal {
  id: string;
  expertId: string;
  amount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  remark?: string;
  createdAt: string;
  processedAt?: string;
}

export async function applyWithdrawal(
  request: WithdrawalRequest
): Promise<ExpertWithdrawal> {
  return post<ExpertWithdrawal>('/expert/income/withdraw', request);
}
```

4. **获取提现记录**
```typescript
export async function getWithdrawals(
  params?: {
    status?: string;
    page?: number;
    size?: number;
  }
): Promise<Page<ExpertWithdrawal>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.size) queryParams.append('size', params.size.toString());
  const query = queryParams.toString();
  return get<Page<ExpertWithdrawal>>(
    `/expert/income/withdrawals${query ? `?${query}` : ''}`
  );
}
```

5. **获取提现详情**
```typescript
export async function getWithdrawalDetail(
  withdrawalId: string
): Promise<ExpertWithdrawal> {
  return get<ExpertWithdrawal>(`/expert/income/withdrawals/${withdrawalId}`);
}
```

#### 4.1.5 资料管理接口

**需要实现的接口**:

1. **获取专家资料**
```typescript
export interface ExpertProfile {
  id: string;
  expertId: string;
  name: string;
  title?: string;
  specialization?: string;
  experience?: number;
  education?: string;
  certification?: string[];
  introduction?: string;
  qaPrice: number;
  appointmentPrice: number;
  rating: number;
  totalAnswers: number;
  totalAppointments: number;
  createdAt: string;
  updatedAt: string;
}

export async function getExpertProfile(): Promise<ExpertProfile> {
  return get<ExpertProfile>('/expert/profile');
}
```

2. **更新服务价格**
```typescript
export interface ServicePriceUpdateRequest {
  qaPrice?: number;
  appointmentPrice?: number;
}

export async function updateServicePrice(
  request: ServicePriceUpdateRequest
): Promise<ExpertProfile> {
  return put<ExpertProfile>('/expert/profile/service-price', request);
}
```

3. **获取农户评价**
```typescript
export interface FarmerReview {
  id: string;
  expertId: string;
  farmerId: string;
  farmerName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export async function getFarmerReviews(
  page: number = 0,
  size: number = 20
): Promise<Page<FarmerReview>> {
  return get<Page<FarmerReview>>(
    `/expert/profile/reviews?page=${page}&size=${size}`
  );
}
```

#### 4.1.6 仪表盘接口

**需要实现的接口**:

1. **获取仪表盘统计**
```typescript
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

export async function getExpertQuestions(): Promise<ExpertDashboardStatisticsResponse> {
  return get<ExpertDashboardStatisticsResponse>('/expert/dashboard/statistics');
}
```

---

## 5. 实现步骤

### 5.1 第一阶段：核心功能接口对接（P0）

#### 5.1.1 问答管理接口
**优先级**: P0  
**预计工作量**: 6小时

**步骤**:
1. 在 `api/expert.ts` 中实现问答管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 实现问题搜索和筛选功能
5. 实现回答功能

#### 5.1.2 预约管理接口
**优先级**: P0  
**预计工作量**: 6小时

**步骤**:
1. 在 `api/expert.ts` 中实现预约管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 实现可用时段管理功能
5. 实现预约状态更新功能

#### 5.1.3 仪表盘接口
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 实现仪表盘统计接口
2. 对接后端接口
3. 实现统计数据展示

### 5.2 第二阶段：内容管理接口对接（P1）

#### 5.2.1 内容管理接口
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 实现内容发布接口
2. 实现内容编辑接口
3. 实现内容列表查询接口
4. 实现内容删除接口
5. 实现内容状态更新接口

### 5.3 第三阶段：收入管理接口对接（P1）

#### 5.3.1 收入管理接口
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 实现收入统计接口
2. 实现收入明细查询接口
3. 实现提现申请接口
4. 实现提现记录查询接口

### 5.4 第四阶段：资料管理接口对接（P1）

#### 5.4.1 资料管理接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现专家资料查询接口
2. 实现服务价格更新接口
3. 实现农户评价查询接口

---

## 6. 接口对接说明

### 6.1 问答管理接口对接

#### 6.1.1 搜索问题

**前端实现**:
```typescript
// api/expert.ts

export interface QuestionSearchRequest {
  keyword?: string;
  status?: string;
  page?: number;
  size?: number;
}

export async function searchQuestions(
  request: QuestionSearchRequest
): Promise<Page<ExpertQuestion>> {
  return post<Page<ExpertQuestion>>('/expert/qa/questions/search', request);
}
```

**后端接口**: `POST /api/expert/qa/questions/search`

**响应示例**:
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "content": [
      {
        "id": "question-uuid",
        "farmerId": "farmer-uuid",
        "farmerName": "张农户",
        "title": "水稻病虫害防治",
        "content": "请问如何防治水稻病虫害？",
        "bounty": 50.00,
        "status": "PENDING",
        "createdAt": "2025-01-XX 10:00:00"
      }
    ],
    "totalElements": 10,
    "totalPages": 1,
    "page": 0,
    "size": 20
  }
}
```

#### 6.1.2 回答问题

**前端实现**:
```typescript
export interface AnswerRequest {
  questionId: string;
  content: string;
}

export async function answerQuestion(
  request: AnswerRequest
): Promise<ExpertAnswer> {
  return post<ExpertAnswer>('/expert/qa/answers', request);
}
```

**后端接口**: `POST /api/expert/qa/answers`

**请求体示例**:
```json
{
  "questionId": "question-uuid",
  "content": "水稻病虫害防治需要..."
}
```

### 6.2 预约管理接口对接

#### 6.2.1 添加可用时段

**前端实现**:
```typescript
export interface AvailableSlotRequest {
  date: string;  // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;  // HH:mm
}

export async function addAvailableSlot(
  request: AvailableSlotRequest
): Promise<ExpertAvailableSlot> {
  return post<ExpertAvailableSlot>('/expert/appointments/slots', request);
}
```

**后端接口**: `POST /api/expert/appointments/slots`

#### 6.2.2 获取预约列表

**前端实现**:
```typescript
export async function getExpertCalendar(): Promise<Page<ExpertAppointment>> {
  return get<Page<ExpertAppointment>>('/expert/appointments');
}
```

**后端接口**: `GET /api/expert/appointments?status={status}&startDate={date}&endDate={date}&page={page}&size={size}`

### 6.3 内容管理接口对接

#### 6.3.1 发布内容

**前端实现**:
```typescript
export interface ContentPublishRequest {
  title: string;
  content: string;
  contentType: 'ARTICLE' | 'VIDEO' | 'AUDIO';
  category?: string;
  tags?: string[];
  coverImage?: string;
}

export async function publishContent(
  request: ContentPublishRequest
): Promise<ExpertContent> {
  return post<ExpertContent>('/expert/contents', request);
}
```

**后端接口**: `POST /api/expert/contents`

### 6.4 收入管理接口对接

#### 6.4.1 获取收入统计

**前端实现**:
```typescript
export async function getIncomeStatistics(): Promise<IncomeStatisticsResponse> {
  return get<IncomeStatisticsResponse>('/expert/income/statistics');
}
```

**后端接口**: `GET /api/expert/income/statistics`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalEarnings": 5000.00,
    "qaEarnings": 3000.00,
    "appointmentEarnings": 2000.00,
    "withdrawTotal": 2000.00,
    "withdrawableBalance": 3000.00,
    "monthlyEarnings": [
      {
        "month": "2025-01",
        "amount": 5000.00
      }
    ]
  }
}
```

#### 6.4.2 申请提现

**前端实现**:
```typescript
export interface WithdrawalRequest {
  amount: number;
  bankName: string;
  bankAccount: string;
  accountName: string;
}

export async function applyWithdrawal(
  request: WithdrawalRequest
): Promise<ExpertWithdrawal> {
  return post<ExpertWithdrawal>('/expert/income/withdraw', request);
}
```

**后端接口**: `POST /api/expert/income/withdraw`

---

## 7. DTO设计

### 7.1 前端DTO

#### 7.1.1 ExpertQuestion
```typescript
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
```

#### 7.1.2 ExpertAppointment
```typescript
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
```

#### 7.1.3 ExpertContent
```typescript
export interface ExpertContent {
  id: string;
  expertId: string;
  title: string;
  content: string;
  contentType: string;
  category?: string;
  tags?: string[];
  coverImage?: string;
  viewCount: number;
  likeCount: number;
  status: 'DRAFT' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}
```

#### 7.1.4 IncomeStatisticsResponse
```typescript
export interface IncomeStatisticsResponse {
  totalEarnings: number;
  qaEarnings: number;
  appointmentEarnings: number;
  withdrawTotal: number;
  withdrawableBalance: number;
  monthlyEarnings: {
    month: string;
    amount: number;
  }[];
}
```

### 7.2 后端DTO

后端DTO已在 `com.agriverse.expert.dto` 包中定义，前端需要确保类型匹配。

---

## 8. 实现优先级

### 8.1 高优先级（P0）

1. **问答管理接口对接**
   - 影响范围：专家核心功能
   - 预计工作量：6小时
   - 依赖：无

2. **预约管理接口对接**
   - 影响范围：专家核心功能
   - 预计工作量：6小时
   - 依赖：无

3. **仪表盘接口对接**
   - 影响范围：数据展示
   - 预计工作量：2小时
   - 依赖：无

### 8.2 中优先级（P1）

4. **内容管理接口对接**
   - 影响范围：内容发布功能
   - 预计工作量：6小时
   - 依赖：无

5. **收入管理接口对接**
   - 影响范围：收入查看和提现
   - 预计工作量：6小时
   - 依赖：无

6. **资料管理接口对接**
   - 影响范围：资料管理
   - 预计工作量：4小时
   - 依赖：无

---

## 9. 测试计划

### 9.1 单元测试

#### 9.1.1 前端API测试
- 测试问答管理接口调用
- 测试预约管理接口调用
- 测试内容管理接口调用
- 测试收入管理接口调用
- 测试异常情况处理

#### 9.1.2 接口响应测试
- 测试各种响应格式
- 测试错误处理
- 测试数据格式验证

### 9.2 集成测试

#### 9.2.1 端到端测试
1. **问答流程**
   - 搜索问题
   - 查看待回答问题列表
   - 查看问题详情
   - 回答问题
   - 查看我的回答列表

2. **预约流程**
   - 添加可用时段
   - 查看可用时段列表
   - 查看预约列表
   - 查看预约详情
   - 更新预约状态（确认/取消/完成）

3. **内容管理流程**
   - 发布内容
   - 编辑内容
   - 查看内容列表
   - 查看内容详情
   - 删除内容
   - 更新内容状态

4. **收入管理流程**
   - 查看收入统计
   - 查看收入明细
   - 申请提现
   - 查看提现记录
   - 查看提现详情

### 9.3 性能测试

- 大量问题搜索性能
- 预约列表查询性能
- 内容列表查询性能
- 收入明细查询性能

---

## 10. 注意事项

### 10.1 数据一致性

- 回答问题后需要更新问题状态
- 预约状态更新需要验证状态流转规则
- 内容状态更新需要验证状态流转规则
- 提现申请需要验证余额是否充足

### 10.2 异常处理

- 问题不存在时，返回友好提示
- 预约时段冲突时，提示用户
- 内容审核被拒绝时，提示用户原因
- 提现金额超过可提现余额时，提示用户

### 10.3 权限控制

- 所有接口需要JWT认证
- 专家只能查看和操作自己的数据
- 预约详情需要验证预约归属
- 内容操作需要验证内容归属

### 10.4 业务规则

- 预约状态流转：PENDING → CONFIRMED → COMPLETED 或 CANCELLED
- 内容状态流转：DRAFT → PUBLISHED 或 REJECTED
- 提现申请需要审核，不能立即到账
- 已回答的问题不能重复回答

### 10.5 性能优化

- 问题列表查询使用分页
- 预约列表查询使用分页
- 内容列表查询使用分页
- 收入明细查询使用分页

### 10.6 安全考虑

- 敏感信息加密传输
- 操作日志完整记录
- 提现操作需要二次确认
- 内容发布需要审核

---

## 11. 扩展功能（后续实现）

### 11.1 问答功能增强

1. **问题推荐**
   - 基于专家专长推荐问题
   - 智能匹配问题与专家

2. **回答质量评估**
   - 回答质量评分
   - 回答采纳率统计

3. **问题分类管理**
   - 问题分类标签
   - 分类统计

### 11.2 预约功能增强

1. **预约提醒**
   - 预约前提醒
   - 预约开始提醒

2. **预约统计**
   - 预约趋势分析
   - 预约完成率统计

3. **预约评价**
   - 预约后评价
   - 评价统计

### 11.3 内容功能增强

1. **内容推荐**
   - 内容推荐算法
   - 热门内容推荐

2. **内容互动**
   - 内容点赞
   - 内容评论
   - 内容分享

3. **内容分析**
   - 内容阅读量统计
   - 内容传播分析

### 11.4 收入功能增强

1. **收入预测**
   - 收入趋势预测
   - 收入目标设置

2. **提现优化**
   - 提现手续费计算
   - 提现到账时间优化

3. **收入报表**
   - 收入报表生成
   - 收入报表导出

---

## 12. 接口汇总表

### 12.1 问答管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/expert/qa/questions/search` | 搜索问题 | ✅ 后端已实现 |
| GET | `/api/expert/qa/questions/pending` | 获取待回答问题列表 | ✅ 后端已实现 |
| GET | `/api/expert/qa/questions/{questionId}` | 获取问题详情 | ✅ 后端已实现 |
| POST | `/api/expert/qa/answers` | 回答问题 | ✅ 后端已实现 |
| GET | `/api/expert/qa/my-answers` | 获取我的回答列表 | ✅ 后端已实现 |

### 12.2 预约管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/expert/appointments/slots` | 添加可用时段 | ✅ 后端已实现 |
| GET | `/api/expert/appointments/slots` | 获取可用时段列表 | ✅ 后端已实现 |
| DELETE | `/api/expert/appointments/slots/{slotId}` | 删除时段 | ✅ 后端已实现 |
| GET | `/api/expert/appointments` | 获取预约列表 | ✅ 后端已实现 |
| GET | `/api/expert/appointments/{appointmentId}` | 获取预约详情 | ✅ 后端已实现 |
| PUT | `/api/expert/appointments/{appointmentId}/status` | 更新预约状态 | ✅ 后端已实现 |

### 12.3 内容管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/expert/contents` | 发布内容 | ✅ 后端已实现 |
| PUT | `/api/expert/contents/{contentId}` | 更新内容 | ✅ 后端已实现 |
| GET | `/api/expert/contents` | 获取内容列表 | ✅ 后端已实现 |
| GET | `/api/expert/contents/{contentId}` | 获取内容详情 | ✅ 后端已实现 |
| DELETE | `/api/expert/contents/{contentId}` | 删除内容 | ✅ 后端已实现 |
| PUT | `/api/expert/contents/{contentId}/status` | 更新内容状态 | ✅ 后端已实现 |

### 12.4 收入管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/expert/income/statistics` | 获取收入统计 | ✅ 后端已实现 |
| GET | `/api/expert/income/records` | 获取收入明细 | ✅ 后端已实现 |
| POST | `/api/expert/income/withdraw` | 申请提现 | ✅ 后端已实现 |
| GET | `/api/expert/income/withdrawals` | 获取提现记录 | ✅ 后端已实现 |
| GET | `/api/expert/income/withdrawals/{withdrawalId}` | 获取提现详情 | ✅ 后端已实现 |

### 12.5 资料管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/expert/profile` | 获取专家资料 | ✅ 后端已实现 |
| PUT | `/api/expert/profile/service-price` | 更新服务价格 | ✅ 后端已实现 |
| GET | `/api/expert/profile/reviews` | 获取农户评价 | ✅ 后端已实现 |

### 12.6 仪表盘接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/expert/dashboard/statistics` | 获取仪表盘统计 | ✅ 后端已实现 |

---

## 13. 前端实现检查清单

### 13.1 问答管理模块

- [ ] 实现搜索问题接口
- [ ] 实现获取待回答问题列表接口
- [ ] 实现获取问题详情接口
- [ ] 实现回答问题接口
- [ ] 实现获取我的回答列表接口
- [ ] 实现问题列表页面
- [ ] 实现问题详情页面
- [ ] 实现回答编辑页面

### 13.2 预约管理模块

- [ ] 实现添加可用时段接口
- [ ] 实现获取可用时段列表接口
- [ ] 实现删除时段接口
- [ ] 实现获取预约列表接口
- [ ] 实现获取预约详情接口
- [ ] 实现更新预约状态接口
- [ ] 实现可用时段管理页面
- [ ] 实现预约列表页面
- [ ] 实现预约详情页面

### 13.3 内容管理模块

- [ ] 实现发布内容接口
- [ ] 实现更新内容接口
- [ ] 实现获取内容列表接口
- [ ] 实现获取内容详情接口
- [ ] 实现删除内容接口
- [ ] 实现更新内容状态接口
- [ ] 实现内容发布/编辑页面
- [ ] 实现内容列表页面
- [ ] 实现内容详情页面

### 13.4 收入管理模块

- [ ] 实现获取收入统计接口
- [ ] 实现获取收入明细接口
- [ ] 实现申请提现接口
- [ ] 实现获取提现记录接口
- [ ] 实现获取提现详情接口
- [ ] 实现收入统计页面
- [ ] 实现收入明细页面
- [ ] 实现提现申请页面
- [ ] 实现提现记录页面

### 13.5 资料管理模块

- [ ] 实现获取专家资料接口
- [ ] 实现更新服务价格接口
- [ ] 实现获取农户评价接口
- [ ] 实现专家资料页面
- [ ] 实现服务价格设置页面
- [ ] 实现农户评价页面

### 13.6 仪表盘模块

- [ ] 实现获取仪表盘统计接口
- [ ] 实现仪表盘页面
- [ ] 实现统计数据可视化

---

## 14. 常见问题

### 14.1 接口调用问题

**Q: 如何获取当前登录专家的ID？**  
A: 从JWT token中解析用户信息，后端会自动获取当前用户信息。

**Q: 预约时段冲突怎么办？**  
A: 后端会验证时段冲突，如果冲突会返回错误提示。

**Q: 提现申请后多久到账？**  
A: 提现需要管理员审核，审核通过后才会到账，具体时间根据平台规则。

### 14.2 数据格式问题

**Q: 日期时间字段使用什么格式？**  
A: 使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss` 或 `YYYY-MM-DD`。

**Q: 金额字段使用什么类型？**  
A: 前端使用 `number` 类型，后端使用 `BigDecimal`，注意精度处理。

### 14.3 业务逻辑问题

**Q: 已回答的问题可以修改回答吗？**  
A: 可以，但需要确认业务规则，可能需要重新审核。

**Q: 预约可以取消吗？**  
A: 可以，但需要确认预约状态，已完成的预约不能取消。

**Q: 内容审核被拒绝后可以重新发布吗？**  
A: 可以，修改后可以重新提交审核。

**Q: 提现金额有限制吗？**  
A: 有，不能超过可提现余额，具体限制根据平台规则。

---

## 15. 代码示例

### 15.1 问答管理使用示例

```typescript
// roles/expert/pages/QuestionList.tsx
import { searchQuestions, getPendingQuestions } from '../../../api/expert';
import { useState, useEffect } from 'react';

export default function ExpertQuestionList() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPendingQuestions();
  }, []);

  const loadPendingQuestions = async () => {
    setLoading(true);
    try {
      const response = await getPendingQuestions(0, 20);
      setQuestions(response.content);
    } catch (error) {
      toast.error('获取问题列表失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {questions.map(question => (
        <QuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
```

### 15.2 预约管理使用示例

```typescript
// roles/expert/pages/AppointmentCalendar.tsx
import { getAppointments, updateAppointmentStatus } from '../../../api/expert';
import { useState, useEffect } from 'react';

export default function ExpertAppointmentCalendar() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await getAppointments({
        page: 0,
        size: 50
      });
      setAppointments(response.content);
    } catch (error) {
      toast.error('获取预约列表失败');
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, {
        status: 'CONFIRMED'
      });
      toast.success('预约已确认');
      loadAppointments();
    } catch (error) {
      toast.error('确认预约失败');
    }
  };

  return (
    <CalendarView 
      appointments={appointments}
      onConfirm={handleConfirmAppointment}
    />
  );
}
```

### 15.3 收入管理使用示例

```typescript
// roles/expert/pages/IncomePage.tsx
import { getIncomeStatistics, applyWithdrawal } from '../../../api/expert';
import { useState, useEffect } from 'react';

export default function ExpertIncomePage() {
  const [statistics, setStatistics] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await getIncomeStatistics();
      setStatistics(data);
    } catch (error) {
      toast.error('获取收入统计失败');
    }
  };

  const handleWithdraw = async () => {
    if (withdrawAmount > statistics.withdrawableBalance) {
      toast.error('提现金额超过可提现余额');
      return;
    }

    try {
      await applyWithdrawal({
        amount: withdrawAmount,
        bankName: '中国银行',
        bankAccount: '6222****1234',
        accountName: '张三'
      });
      toast.success('提现申请已提交');
      loadStatistics();
    } catch (error) {
      toast.error('提现申请失败');
    }
  };

  return (
    <div>
      <IncomeStatistics statistics={statistics} />
      <WithdrawalForm 
        balance={statistics?.withdrawableBalance}
        onSubmit={handleWithdraw}
      />
    </div>
  );
}
```

---

## 16. 后续开发规划

### 16.1 短期计划（1-2周）

#### 16.1.1 核心接口对接（P0）
- [ ] **问答管理接口对接**
  - 实现 `getExpertQuestions()` 函数
  - 实现问题搜索、详情、回答接口
  - 实现我的回答列表接口
  - 实现问答列表和详情页面

- [ ] **预约管理接口对接**
  - 实现 `getExpertCalendar()` 函数
  - 实现可用时段管理接口
  - 实现预约列表和详情接口
  - 实现预约状态更新接口
  - 实现预约日历页面

- [ ] **仪表盘接口对接**
  - 实现仪表盘统计接口
  - 实现统计数据展示
  - 实现仪表盘页面

#### 16.1.2 内容管理接口对接（P1）
- [ ] **内容管理功能**
  - 实现内容发布接口
  - 实现内容编辑接口
  - 实现内容列表查询接口
  - 实现内容删除和状态更新接口

### 16.2 中期计划（1个月）

#### 16.2.1 收入管理功能
- [ ] **收入统计和提现**
  - 实现收入统计接口
  - 实现收入明细查询接口
  - 实现提现申请接口
  - 实现提现记录查询接口
  - 实现收入管理页面

#### 16.2.2 资料管理功能
- [ ] **专家资料管理**
  - 实现专家资料查询接口
  - 实现服务价格更新接口
  - 实现农户评价查询接口
  - 实现资料管理页面

#### 16.2.3 问答功能增强
- [ ] **问答质量提升**
  - 实现问题推荐功能
  - 实现回答质量评估
  - 实现问题分类管理

### 16.3 长期计划（3个月）

#### 16.3.1 预约功能增强
- [ ] **预约管理优化**
  - 实现预约提醒功能
  - 实现预约统计功能
  - 实现预约评价功能

#### 16.3.2 内容功能增强
- [ ] **内容互动功能**
  - 实现内容推荐功能
  - 实现内容点赞和评论
  - 实现内容分享功能
  - 实现内容分析功能

#### 16.3.3 收入功能增强
- [ ] **收入分析功能**
  - 实现收入预测功能
  - 实现提现优化功能
  - 实现收入报表功能

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。  
> 最后更新：2025-01-XX