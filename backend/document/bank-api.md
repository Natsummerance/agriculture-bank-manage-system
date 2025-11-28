# 银行模块前端接口实现文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 银行模块前端接口对接

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

### 1.1 贷款产品管理
- 创建/编辑/删除贷款产品
- 产品列表查询
- 产品详情查看

### 1.2 审批管理
- 待审批列表查询
- 审批详情查看
- 批准/拒绝申请
- 信用评分计算

### 1.3 合同管理
- 合同生成
- 合同预览
- 合同签署

### 1.4 放款管理
- 放款列表查询
- 放款操作
- 放款记录查看

### 1.5 贷后管理
- 贷后监控
- 逾期管理
- 逾期统计
- 逾期提醒

### 1.6 对账管理
- 对账操作
- 对账列表查询
- 对账统计
- 对账单导出

### 1.7 其他功能
- 仪表盘统计
- 客户管理
- 风控管理
- 申请资料管理

---

## 2. 前端API需求

### 2.1 当前前端API (`api/bank.ts`)

#### 2.1.1 已定义但未实现的接口
- ❌ `bankApprovalList()` - 获取审批列表（占位函数）
- ❌ `getBankLoanProducts()` - 获取贷款产品列表（占位函数）

#### 2.1.2 需要新增的接口
根据后端已实现的接口，前端需要实现以下功能模块的API：

1. **产品管理API**
2. **审批管理API**
3. **合同管理API**
4. **放款管理API**
5. **逾期管理API**
6. **对账管理API**
7. **统计API**

---

## 3. 后端接口状态

### 3.1 已实现的后端接口

#### 3.1.1 产品管理接口
- ✅ `POST /api/bank/loan/products` - 创建贷款产品
- ✅ `PUT /api/bank/loan/products/{id}` - 更新贷款产品
- ✅ `DELETE /api/bank/loan/products/{id}` - 删除贷款产品
- ✅ `GET /api/bank/loan/products` - 获取产品列表
- ✅ `GET /api/bank/loan/products/{id}` - 获取产品详情

#### 3.1.2 审批管理接口
- ✅ `GET /api/bank/loan/approvals/pending` - 获取待审批列表
- ✅ `POST /api/bank/loan/approvals` - 审批申请
- ✅ `POST /api/bank/loan/credit-score/calculate` - 计算信用评分

#### 3.1.3 合同管理接口
- ✅ `POST /api/bank/loan/contracts/generate` - 生成合同
- ✅ `POST /api/bank/loan/contracts/{contractId}/sign` - 银行签署合同

#### 3.1.4 放款管理接口
- ✅ `POST /api/bank/loan/disburse` - 放款
- ✅ `GET /api/bank/loan/disbursements` - 获取放款列表

#### 3.1.5 统计接口
- ✅ `GET /api/bank/loan/statistics/approval` - 获取审批统计
- ✅ `GET /api/bank/loan/statistics/disbursement` - 获取放款统计

#### 3.1.6 逾期管理接口
- ✅ `POST /api/bank/loan/overdue/check` - 手动触发逾期检测
- ✅ `GET /api/bank/loan/overdue/statistics` - 获取逾期统计
- ✅ `GET /api/bank/loan/overdue/list` - 获取逾期列表
- ✅ `POST /api/bank/loan/overdue/{financingId}/alert` - 发送逾期提醒
- ✅ `GET /api/bank/loan/overdue/{financingId}/penalty` - 计算逾期罚息

#### 3.1.7 对账管理接口
- ✅ `POST /api/bank/loan/reconciliation/reconcile` - 对账（按日期）
- ✅ `GET /api/bank/loan/reconciliation/list` - 获取对账列表
- ✅ `GET /api/bank/loan/reconciliation/statistics` - 获取对账统计
- ✅ `POST /api/bank/loan/reconciliation/export` - 导出对账单
- ✅ `POST /api/bank/loan/reconciliation/export-t1` - 导出T+1文件

#### 3.1.8 贷后监控接口
- ✅ `GET /api/bank/loan/post-loan/monitoring/{financingId}` - 获取贷后监控数据
- ✅ `GET /api/bank/loan/post-loan/monitoring` - 获取所有贷后监控列表

#### 3.1.9 其他功能接口
- ✅ `GET /api/bank/dashboard/statistics` - 获取仪表盘统计
- ✅ `POST /api/bank/customers/search` - 搜索客户
- ✅ `GET /api/bank/customers/{relationId}` - 获取客户详情
- ✅ `GET /api/bank/risk/dashboard` - 获取风控仪表盘
- ✅ `GET /api/bank/risk/alerts` - 获取风险预警列表
- ✅ `POST /api/bank/documents/upload` - 上传申请资料
- ✅ `POST /api/bank/documents/verify` - 审核申请资料

---

## 4. 未实现接口列表

### 4.1 前端需要实现的接口

#### 4.1.1 产品管理接口

**文件**: `api/bank.ts`

**需要实现的接口**:

1. **获取产品列表**
```typescript
export interface LoanProduct {
  id: string;
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export async function getBankLoanProducts(): Promise<LoanProduct[]> {
  return get<LoanProduct[]>('/bank/loan/products');
}
```

2. **创建产品**
```typescript
export interface LoanProductRequest {
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number;
  description?: string;
}

export async function createLoanProduct(
  request: LoanProductRequest
): Promise<LoanProduct> {
  return post<LoanProduct>('/bank/loan/products', request);
}
```

3. **更新产品**
```typescript
export async function updateLoanProduct(
  id: string,
  request: LoanProductRequest
): Promise<LoanProduct> {
  return put<LoanProduct>(`/bank/loan/products/${id}`, request);
}
```

4. **删除产品**
```typescript
export async function deleteLoanProduct(id: string): Promise<void> {
  return del(`/bank/loan/products/${id}`);
}
```

5. **获取产品详情**
```typescript
export async function getLoanProduct(id: string): Promise<LoanProduct> {
  return get<LoanProduct>(`/bank/loan/products/${id}`);
}
```

#### 4.1.2 审批管理接口

**需要实现的接口**:

1. **获取待审批列表**
```typescript
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
  createdAt: string;
  updatedAt: string;
}

export async function bankApprovalList(): Promise<FinancingApplication[]> {
  return get<FinancingApplication[]>('/bank/loan/approvals/pending');
}
```

2. **审批申请**
```typescript
export interface ApprovalRequest {
  financingId: string;
  action: 'APPROVE' | 'REJECT';
  reviewComment?: string;
  creditScore?: number;
  interestRate?: number;
}

export async function approveApplication(
  request: ApprovalRequest
): Promise<FinancingApplication> {
  return post<FinancingApplication>('/bank/loan/approvals', request);
}
```

3. **计算信用评分**
```typescript
export interface CreditScoreRequest {
  financingId: string;
  creditHistoryScore?: number;
  income: number;
  assets: number;
  debtRatio: number;
  industryExperience?: number;
}

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

export async function calculateCreditScore(
  request: CreditScoreRequest
): Promise<CreditScore> {
  return post<CreditScore>('/bank/loan/credit-score/calculate', request);
}
```

#### 4.1.3 合同管理接口

**需要实现的接口**:

1. **生成合同**
```typescript
export interface ContractGenerateRequest {
  financingId: string;
  bankName?: string;
  bankAccount?: string;
}

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

export async function generateContract(
  request: ContractGenerateRequest
): Promise<Contract> {
  return post<Contract>('/bank/loan/contracts/generate', request);
}
```

2. **银行签署合同**
```typescript
export async function signContractByBank(
  contractId: string,
  signatureUrl: string
): Promise<Contract> {
  return post<Contract>(
    `/bank/loan/contracts/${contractId}/sign`,
    { signatureUrl }
  );
}
```

#### 4.1.4 放款管理接口

**需要实现的接口**:

1. **放款**
```typescript
export interface DisbursementRequest {
  financingId: string;
  contractId: string;
  amount: number;
  bankAccount?: string;
  farmerAccount?: string;
  remark?: string;
}

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

export async function disburse(
  request: DisbursementRequest
): Promise<Disbursement> {
  return post<Disbursement>('/bank/loan/disburse', request);
}
```

2. **获取放款列表**
```typescript
export async function getDisbursements(
  status?: string
): Promise<Disbursement[]> {
  const params = status ? `?status=${status}` : '';
  return get<Disbursement[]>(`/bank/loan/disbursements${params}`);
}
```

#### 4.1.5 逾期管理接口

**需要实现的接口**:

1. **获取逾期列表**
```typescript
export async function getOverdueList(): Promise<any[]> {
  return get<any[]>('/bank/loan/overdue/list');
}
```

2. **获取逾期统计**
```typescript
export async function getOverdueStatistics(): Promise<any> {
  return get<any>('/bank/loan/overdue/statistics');
}
```

3. **发送逾期提醒**
```typescript
export async function sendOverdueAlert(
  financingId: string
): Promise<void> {
  return post(`/bank/loan/overdue/${financingId}/alert`, {});
}
```

4. **计算逾期罚息**
```typescript
export async function calculateOverduePenalty(
  financingId: string
): Promise<number> {
  return get<number>(`/bank/loan/overdue/${financingId}/penalty`);
}
```

5. **手动触发逾期检测**
```typescript
export async function checkOverdue(): Promise<number> {
  return post<number>('/bank/loan/overdue/check', {});
}
```

#### 4.1.6 对账管理接口

**需要实现的接口**:

1. **对账**
```typescript
export async function reconcile(date?: string): Promise<number> {
  const params = date ? `?date=${date}` : '';
  return post<number>(`/bank/loan/reconciliation/reconcile${params}`, {});
}
```

2. **获取对账列表**
```typescript
export interface ReconciliationRecord {
  id: string;
  reconcileDate: string;
  totalAmount: number;
  matchedCount: number;
  unmatchedCount: number;
  status: string;
  createdAt: string;
}

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
```

3. **获取对账统计**
```typescript
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
```

4. **导出对账单**
```typescript
export interface ReconciliationExportRequest {
  startDate?: string;
  endDate?: string;
  format?: 'xlsx' | 'csv';
}

export async function exportReconciliation(
  request: ReconciliationExportRequest
): Promise<string> {
  return post<string>('/bank/loan/reconciliation/export', request);
}
```

#### 4.1.7 统计接口

**需要实现的接口**:

1. **获取审批统计**
```typescript
export async function getApprovalStatistics(): Promise<any> {
  return get<any>('/bank/loan/statistics/approval');
}
```

2. **获取放款统计**
```typescript
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
```

#### 4.1.8 贷后监控接口

**需要实现的接口**:

1. **获取贷后监控数据**
```typescript
export async function getPostLoanMonitoring(
  financingId: string
): Promise<any> {
  return get<any>(`/bank/loan/post-loan/monitoring/${financingId}`);
}
```

2. **获取所有贷后监控列表**
```typescript
export async function getAllPostLoanMonitoring(): Promise<any[]> {
  return get<any[]>('/bank/loan/post-loan/monitoring');
}
```

---

## 5. 实现步骤

### 5.1 第一阶段：核心功能接口对接（P0）

#### 5.1.1 产品管理接口
**优先级**: P0  
**预计工作量**: 4小时

**步骤**:
1. 在 `api/bank.ts` 中实现产品管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 添加错误处理

#### 5.1.2 审批管理接口
**优先级**: P0  
**预计工作量**: 6小时

**步骤**:
1. 在 `api/bank.ts` 中实现审批管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 实现审批详情查看功能
5. 添加错误处理

#### 5.1.3 信用评分接口
**优先级**: P0  
**预计工作量**: 4小时

**步骤**:
1. 实现信用评分计算接口
2. 定义评分请求和响应类型
3. 对接后端接口
4. 实现评分结果展示

### 5.2 第二阶段：合同和放款接口对接（P1）

#### 5.2.1 合同管理接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现合同生成接口
2. 实现合同签署接口
3. 实现合同预览功能
4. 实现合同下载功能

#### 5.2.2 放款管理接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现放款操作接口
2. 实现放款列表查询接口
3. 实现放款详情查看
4. 添加放款状态跟踪

### 5.3 第三阶段：贷后管理接口对接（P1）

#### 5.3.1 逾期管理接口
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 实现逾期列表查询接口
2. 实现逾期统计接口
3. 实现逾期提醒发送接口
4. 实现逾期罚息计算接口

#### 5.3.2 对账管理接口
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 实现对账列表查询接口
2. 实现对账统计接口
3. 实现对账单导出接口
4. 实现T+1文件导出接口

#### 5.3.3 贷后监控接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现贷后监控数据查询接口
2. 实现贷后监控列表查询接口
3. 实现监控数据可视化

---

## 6. 接口对接说明

### 6.1 产品管理接口对接

#### 6.1.1 获取产品列表

**前端实现**:
```typescript
// api/bank.ts

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

export async function getBankLoanProducts(): Promise<LoanProduct[]> {
  return get<LoanProduct[]>('/bank/loan/products');
}
```

**后端接口**: `GET /api/bank/loan/products`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "product-uuid",
      "name": "农户小额贷款",
      "rate": 5.50,
      "minAmount": 200000.00,
      "maxAmount": 1000000.00,
      "termMonths": 12,
      "description": "面向农户的小额贷款产品",
      "status": "ACTIVE",
      "createdAt": "2025-01-XX 10:00:00",
      "updatedAt": "2025-01-XX 10:00:00"
    }
  ]
}
```

#### 6.1.2 创建贷款产品

**前端实现**:
```typescript
export interface LoanProductRequest {
  name: string;
  rate: number;
  minAmount: number;
  maxAmount: number;
  termMonths: number;
  description?: string;
}

export async function createLoanProduct(
  request: LoanProductRequest
): Promise<LoanProduct> {
  return post<LoanProduct>('/bank/loan/products', request);
}
```

**后端接口**: `POST /api/bank/loan/products`

#### 6.1.3 更新贷款产品

**前端实现**:
```typescript
export async function updateLoanProduct(
  id: string,
  request: LoanProductRequest
): Promise<LoanProduct> {
  return put<LoanProduct>(`/bank/loan/products/${id}`, request);
}
```

**后端接口**: `PUT /api/bank/loan/products/{id}`

#### 6.1.4 删除贷款产品

**前端实现**:
```typescript
export async function deleteLoanProduct(id: string): Promise<void> {
  return del(`/bank/loan/products/${id}`);
}
```

**后端接口**: `DELETE /api/bank/loan/products/{id}`

### 6.2 审批管理接口对接

#### 6.2.1 获取待审批列表

**前端实现**:
```typescript
// api/bank.ts

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

export async function bankApprovalList(): Promise<FinancingApplication[]> {
  return get<FinancingApplication[]>('/bank/loan/approvals/pending');
}
```

**后端接口**: `GET /api/bank/loan/approvals/pending`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "id": "application-uuid",
      "farmerId": "farmer-uuid",
      "amount": 200000.00,
      "termMonths": 12,
      "purpose": "购买农资设备",
      "status": "APPLIED",
      "createdAt": "2025-01-XX 10:00:00",
      "updatedAt": "2025-01-XX 10:00:00"
    }
  ]
}
```

#### 6.2.2 审批申请

**前端实现**:
```typescript
export interface ApprovalRequest {
  financingId: string;
  action: 'APPROVE' | 'REJECT';
  reviewComment?: string;
  creditScore?: number;
  interestRate?: number;
}

export async function approveApplication(
  request: ApprovalRequest
): Promise<FinancingApplication> {
  return post<FinancingApplication>('/bank/loan/approvals', request);
}
```

**后端接口**: `POST /api/bank/loan/approvals`

#### 6.2.3 计算信用评分

**前端实现**:
```typescript
export interface CreditScoreRequest {
  financingId: string;
  creditHistoryScore?: number;
  income: number;
  assets: number;
  debtRatio: number;
  industryExperience?: number;
}

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

export async function calculateCreditScore(
  request: CreditScoreRequest
): Promise<CreditScore> {
  return post<CreditScore>('/bank/loan/credit-score/calculate', request);
}
```

**后端接口**: `POST /api/bank/loan/credit-score/calculate`

### 6.3 合同管理接口对接

#### 6.3.1 生成合同

**前端实现**:
```typescript
export interface ContractGenerateRequest {
  financingId: string;
  bankName?: string;
  bankAccount?: string;
}

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

export async function generateContract(
  request: ContractGenerateRequest
): Promise<Contract> {
  return post<Contract>('/bank/loan/contracts/generate', request);
}
```

**后端接口**: `POST /api/bank/loan/contracts/generate`

#### 6.3.2 银行签署合同

**前端实现**:
```typescript
export async function signContractByBank(
  contractId: string,
  signatureUrl: string
): Promise<Contract> {
  return post<Contract>(
    `/bank/loan/contracts/${contractId}/sign`,
    null,
    { signatureUrl }
  );
}
```

**后端接口**: `POST /api/bank/loan/contracts/{contractId}/sign?signatureUrl={url}`

### 6.4 放款管理接口对接

#### 6.4.1 放款操作

**前端实现**:
```typescript
export interface DisbursementRequest {
  financingId: string;
  contractId: string;
  amount: number;
  bankAccount?: string;
  farmerAccount?: string;
  remark?: string;
}

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

export async function disburseLoan(
  request: DisbursementRequest
): Promise<Disbursement> {
  return post<Disbursement>('/bank/loan/disburse', request);
}
```

**后端接口**: `POST /api/bank/loan/disburse`

#### 6.4.2 获取放款列表

**前端实现**:
```typescript
export async function getDisbursements(
  status?: string
): Promise<Disbursement[]> {
  const params = status ? { status } : {};
  return get<Disbursement[]>('/bank/loan/disbursements', params);
}
```

**后端接口**: `GET /api/bank/loan/disbursements?status={status}`

### 6.5 逾期管理接口对接

#### 6.5.1 获取逾期列表

**前端实现**:
```typescript
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

export async function getOverdueList(): Promise<OverdueItem[]> {
  return get<OverdueItem[]>('/bank/loan/overdue/list');
}
```

**后端接口**: `GET /api/bank/loan/overdue/list`

#### 6.5.2 获取逾期统计

**前端实现**:
```typescript
export interface OverdueStatistics {
  totalOverdueCount: number;
  totalOverdueAmount: number;
  overdueByDays: {
    days: number;
    count: number;
    amount: number;
  }[];
}

export async function getOverdueStatistics(): Promise<OverdueStatistics> {
  return get<OverdueStatistics>('/bank/loan/overdue/statistics');
}
```

**后端接口**: `GET /api/bank/loan/overdue/statistics`

#### 6.5.3 发送逾期提醒

**前端实现**:
```typescript
export async function sendOverdueAlert(
  financingId: string
): Promise<void> {
  return post(`/bank/loan/overdue/${financingId}/alert`, {});
}
```

**后端接口**: `POST /api/bank/loan/overdue/{financingId}/alert`

#### 6.5.4 计算逾期罚息

**前端实现**:
```typescript
export async function calculateOverduePenalty(
  financingId: string
): Promise<number> {
  return get<number>(`/bank/loan/overdue/${financingId}/penalty`);
}
```

**后端接口**: `GET /api/bank/loan/overdue/{financingId}/penalty`

### 6.6 对账管理接口对接

#### 6.6.1 获取对账列表

**前端实现**:
```typescript
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

export async function getReconciliationList(
  startDate?: string,
  endDate?: string
): Promise<ReconciliationRecord[]> {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return get<ReconciliationRecord[]>('/bank/loan/reconciliation/list', params);
}
```

**后端接口**: `GET /api/bank/loan/reconciliation/list?startDate={date}&endDate={date}`

#### 6.6.2 获取对账统计

**前端实现**:
```typescript
export interface ReconciliationStatistics {
  totalReconcileCount: number;
  totalAmount: number;
  successCount: number;
  failedCount: number;
  unmatchedAmount: number;
}

export async function getReconciliationStatistics(
  startDate?: string,
  endDate?: string
): Promise<ReconciliationStatistics> {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return get<ReconciliationStatistics>(
    '/bank/loan/reconciliation/statistics',
    params
  );
}
```

**后端接口**: `GET /api/bank/loan/reconciliation/statistics?startDate={date}&endDate={date}`

#### 6.6.3 执行对账

**前端实现**:
```typescript
export async function reconcile(date?: string): Promise<number> {
  const params = date ? { date } : {};
  return post<number>('/bank/loan/reconciliation/reconcile', params);
}
```

**后端接口**: `POST /api/bank/loan/reconciliation/reconcile?date={date}`

#### 6.6.4 导出对账单

**前端实现**:
```typescript
export interface ReconciliationExportRequest {
  startDate?: string;
  endDate?: string;
  format?: 'excel' | 'csv';
}

export async function exportReconciliation(
  request: ReconciliationExportRequest
): Promise<string> {
  // 返回文件下载URL
  return post<string>('/bank/loan/reconciliation/export', request);
}
```

**后端接口**: `POST /api/bank/loan/reconciliation/export`

### 6.7 贷后监控接口对接

#### 6.7.1 获取贷后监控数据

**前端实现**:
```typescript
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

export async function getPostLoanMonitoring(
  financingId: string
): Promise<PostLoanMonitoring> {
  return get<PostLoanMonitoring>(
    `/bank/loan/post-loan/monitoring/${financingId}`
  );
}
```

**后端接口**: `GET /api/bank/loan/post-loan/monitoring/{financingId}`

#### 6.7.2 获取所有贷后监控列表

**前端实现**:
```typescript
export async function getAllPostLoanMonitoring(): Promise<PostLoanMonitoring[]> {
  return get<PostLoanMonitoring[]>('/bank/loan/post-loan/monitoring');
}
```

**后端接口**: `GET /api/bank/loan/post-loan/monitoring`

---

## 7. 统计接口对接

### 7.1 审批统计

**前端实现**:
```typescript
export interface ApprovalStatistics {
  totalApplications: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  approvalRate: number;
  averageAmount: number;
}

export async function getApprovalStatistics(): Promise<ApprovalStatistics> {
  return get<ApprovalStatistics>('/bank/loan/statistics/approval');
}
```

**后端接口**: `GET /api/bank/loan/statistics/approval`

### 7.2 放款统计

**前端实现**:
```typescript
export interface DisbursementStatistics {
  totalDisbursed: number;
  totalCount: number;
  successCount: number;
  failedCount: number;
  averageAmount: number;
  trendData: {
    date: string;
    amount: number;
    count: number;
  }[];
}

export async function getDisbursementStatistics(
  startDate?: string,
  endDate?: string
): Promise<DisbursementStatistics> {
  const params: any = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  return get<DisbursementStatistics>(
    '/bank/loan/statistics/disbursement',
    params
  );
}
```

**后端接口**: `GET /api/bank/loan/statistics/disbursement?startDate={date}&endDate={date}`

---

## 8. 实现优先级

### 8.1 高优先级（P0）

1. **产品管理接口对接**
   - 影响范围：银行核心功能
   - 预计工作量：4小时
   - 依赖：无

2. **审批管理接口对接**
   - 影响范围：银行核心功能
   - 预计工作量：6小时
   - 依赖：无

3. **信用评分接口对接**
   - 影响范围：审批流程
   - 预计工作量：4小时
   - 依赖：审批管理接口

### 8.2 中优先级（P1）

4. **合同管理接口对接**
   - 影响范围：合同签署流程
   - 预计工作量：4小时
   - 依赖：审批管理接口

5. **放款管理接口对接**
   - 影响范围：放款流程
   - 预计工作量：4小时
   - 依赖：合同管理接口

6. **逾期管理接口对接**
   - 影响范围：贷后管理
   - 预计工作量：6小时
   - 依赖：放款管理接口

7. **对账管理接口对接**
   - 影响范围：对账功能
   - 预计工作量：6小时
   - 依赖：放款管理接口

8. **贷后监控接口对接**
   - 影响范围：贷后监控
   - 预计工作量：4小时
   - 依赖：放款管理接口

---

## 9. 测试计划

### 9.1 单元测试

#### 9.1.1 前端API测试
- 测试产品管理接口调用
- 测试审批管理接口调用
- 测试异常情况处理

#### 9.1.2 接口响应测试
- 测试各种响应格式
- 测试错误处理
- 测试数据格式验证

### 9.2 集成测试

#### 9.2.1 端到端测试
1. **产品管理流程**
   - 创建产品
   - 更新产品
   - 删除产品
   - 查询产品列表

2. **审批流程**
   - 查看待审批列表
   - 查看申请详情
   - 计算信用评分
   - 审批申请（批准/拒绝）

3. **合同和放款流程**
   - 生成合同
   - 银行签署合同
   - 执行放款
   - 查看放款记录

4. **贷后管理流程**
   - 查看逾期列表
   - 发送逾期提醒
   - 计算逾期罚息
   - 执行对账
   - 查看对账统计

### 9.3 性能测试

- 大量审批列表查询性能
- 对账操作性能
- 逾期检测性能
- 统计查询性能

---

## 10. 注意事项

### 10.1 数据一致性

- 审批操作需要保证事务一致性
- 放款操作需要验证合同状态
- 对账操作需要保证数据准确性

### 10.2 异常处理

- 产品删除时，需要检查是否有正在使用的申请
- 审批时，需要验证申请状态
- 放款时，需要验证合同签署状态
- 对账时，需要处理数据不一致的情况

### 10.3 权限控制

- 所有接口需要JWT认证
- 银行角色权限验证
- 操作日志记录

### 10.4 业务规则

- 产品状态为INACTIVE时，不允许创建新申请
- 只有已审批通过的申请才能生成合同
- 只有已签署的合同才能放款
- 逾期检测需要定时任务支持

### 10.5 性能优化

- 大量数据查询使用分页
- 统计查询考虑缓存
- 对账操作考虑异步处理

### 10.6 安全考虑

- 敏感数据加密传输
- 操作日志完整记录
- 审批操作需要二次确认

---

## 11. 扩展功能（后续实现）

### 11.1 高级审批功能

1. **批量审批**
   - 支持批量批准/拒绝申请
   - 批量设置利率和信用评分

2. **审批流程**
   - 多级审批流程
   - 审批权限分级

3. **审批模板**
   - 保存常用审批意见模板
   - 快速应用审批模板

### 11.2 智能风控

1. **自动风险评估**
   - 基于历史数据自动评估风险
   - 风险预警自动推送

2. **风控模型**
   - 机器学习风控模型
   - 动态调整风控策略

### 11.3 报表分析

1. **业务报表**
   - 放款趋势分析
   - 逾期率分析
   - 产品收益分析

2. **数据可视化**
   - 图表展示
   - 数据导出

### 11.4 消息通知

1. **审批通知**
   - 新申请通知
   - 审批结果通知

2. **逾期通知**
   - 逾期预警通知
   - 逾期提醒通知

### 11.5 移动端支持

1. **移动审批**
   - 移动端审批功能
   - 移动端查看统计

2. **消息推送**
   - 移动端消息推送
   - 审批提醒推送

---

## 12. 接口汇总表

### 12.1 产品管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/bank/loan/products` | 获取产品列表 | ✅ 后端已实现 |
| GET | `/api/bank/loan/products/{id}` | 获取产品详情 | ✅ 后端已实现 |
| POST | `/api/bank/loan/products` | 创建产品 | ✅ 后端已实现 |
| PUT | `/api/bank/loan/products/{id}` | 更新产品 | ✅ 后端已实现 |
| DELETE | `/api/bank/loan/products/{id}` | 删除产品 | ✅ 后端已实现 |

### 12.2 审批管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/bank/loan/approvals/pending` | 获取待审批列表 | ✅ 后端已实现 |
| POST | `/api/bank/loan/approvals` | 审批申请 | ✅ 后端已实现 |
| POST | `/api/bank/loan/credit-score/calculate` | 计算信用评分 | ✅ 后端已实现 |

### 12.3 合同管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/bank/loan/contracts/generate` | 生成合同 | ✅ 后端已实现 |
| POST | `/api/bank/loan/contracts/{contractId}/sign` | 银行签署合同 | ✅ 后端已实现 |

### 12.4 放款管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/bank/loan/disburse` | 放款 | ✅ 后端已实现 |
| GET | `/api/bank/loan/disbursements` | 获取放款列表 | ✅ 后端已实现 |

### 12.5 逾期管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/bank/loan/overdue/list` | 获取逾期列表 | ✅ 后端已实现 |
| GET | `/api/bank/loan/overdue/statistics` | 获取逾期统计 | ✅ 后端已实现 |
| POST | `/api/bank/loan/overdue/{financingId}/alert` | 发送逾期提醒 | ✅ 后端已实现 |
| GET | `/api/bank/loan/overdue/{financingId}/penalty` | 计算逾期罚息 | ✅ 后端已实现 |
| POST | `/api/bank/loan/overdue/check` | 手动触发逾期检测 | ✅ 后端已实现 |

### 12.6 对账管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/bank/loan/reconciliation/reconcile` | 对账 | ✅ 后端已实现 |
| GET | `/api/bank/loan/reconciliation/list` | 获取对账列表 | ✅ 后端已实现 |
| GET | `/api/bank/loan/reconciliation/statistics` | 获取对账统计 | ✅ 后端已实现 |
| POST | `/api/bank/loan/reconciliation/export` | 导出对账单 | ✅ 后端已实现 |
| POST | `/api/bank/loan/reconciliation/export-t1` | 导出T+1文件 | ✅ 后端已实现 |

### 12.7 贷后监控接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/bank/loan/post-loan/monitoring/{financingId}` | 获取贷后监控数据 | ✅ 后端已实现 |
| GET | `/api/bank/loan/post-loan/monitoring` | 获取所有贷后监控列表 | ✅ 后端已实现 |

### 12.8 统计接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/bank/loan/statistics/approval` | 获取审批统计 | ✅ 后端已实现 |
| GET | `/api/bank/loan/statistics/disbursement` | 获取放款统计 | ✅ 后端已实现 |

---

## 13. 前端实现检查清单

### 13.1 产品管理模块

- [ ] 实现获取产品列表接口
- [ ] 实现创建产品接口
- [ ] 实现更新产品接口
- [ ] 实现删除产品接口
- [ ] 实现获取产品详情接口
- [ ] 实现产品列表页面
- [ ] 实现产品创建/编辑页面
- [ ] 实现产品详情页面

### 13.2 审批管理模块

- [ ] 实现获取待审批列表接口
- [ ] 实现审批申请接口
- [ ] 实现计算信用评分接口
- [ ] 实现审批列表页面
- [ ] 实现审批详情页面
- [ ] 实现信用评分页面
- [ ] 实现审批操作确认对话框

### 13.3 合同管理模块

- [ ] 实现生成合同接口
- [ ] 实现银行签署合同接口
- [ ] 实现合同预览功能
- [ ] 实现合同下载功能
- [ ] 实现合同签署页面

### 13.4 放款管理模块

- [ ] 实现放款接口
- [ ] 实现获取放款列表接口
- [ ] 实现放款列表页面
- [ ] 实现放款操作页面
- [ ] 实现放款详情页面

### 13.5 逾期管理模块

- [ ] 实现获取逾期列表接口
- [ ] 实现获取逾期统计接口
- [ ] 实现发送逾期提醒接口
- [ ] 实现计算逾期罚息接口
- [ ] 实现逾期列表页面
- [ ] 实现逾期统计页面

### 13.6 对账管理模块

- [ ] 实现对账接口
- [ ] 实现获取对账列表接口
- [ ] 实现获取对账统计接口
- [ ] 实现导出对账单接口
- [ ] 实现对账列表页面
- [ ] 实现对账统计页面

### 13.7 贷后监控模块

- [ ] 实现获取贷后监控数据接口
- [ ] 实现获取所有贷后监控列表接口
- [ ] 实现贷后监控列表页面
- [ ] 实现贷后监控详情页面

### 13.8 统计模块

- [ ] 实现获取审批统计接口
- [ ] 实现获取放款统计接口
- [ ] 实现统计图表展示
- [ ] 实现统计报表导出

---

## 14. 常见问题

### 14.1 接口调用问题

**Q: 如何获取当前登录用户的银行ID？**  
A: 从JWT token中解析用户信息，后端会自动获取当前用户信息。

**Q: 审批时如何传递签名图片？**  
A: 先上传签名图片获取URL，然后将URL传递给签署接口。

**Q: 对账操作是同步还是异步？**  
A: 对账操作是同步的，但处理大量数据时可能需要较长时间，建议添加加载提示。

### 14.2 数据格式问题

**Q: 金额字段使用什么类型？**  
A: 前端使用 `number` 类型，后端使用 `BigDecimal`，注意精度处理。

**Q: 日期字段使用什么格式？**  
A: 使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss` 或 `YYYY-MM-DD`。

### 14.3 业务逻辑问题

**Q: 产品删除后，已创建的申请会受影响吗？**  
A: 不会，产品删除只是将状态改为INACTIVE，已创建的申请不受影响。

**Q: 审批拒绝后，申请可以重新提交吗？**  
A: 可以，农户可以修改后重新提交申请。

**Q: 放款失败后可以重试吗？**  
A: 可以，检查失败原因后可以重新执行放款操作。

---

## 15. 后续开发规划

### 15.1 短期计划（1-2周）

#### 15.1.1 核心接口对接（P0）
- [ ] **产品管理接口对接**
  - 实现 `getBankLoanProducts()` 函数
  - 实现产品创建、更新、删除接口
  - 对接所有产品管理相关接口
  - 实现产品列表和详情页面

- [ ] **审批管理接口对接**
  - 实现 `bankApprovalList()` 函数
  - 对接审批列表、详情、操作接口
  - 实现信用评分计算接口
  - 实现审批操作确认对话框

- [ ] **合同管理接口对接**
  - 实现合同生成接口
  - 实现合同签署接口
  - 实现合同预览和下载功能

#### 15.1.2 功能完善
- [ ] **放款管理功能**
  - 实现放款操作接口
  - 实现放款列表查询
  - 实现放款详情查看

- [ ] **逾期管理功能**
  - 实现逾期列表查询
  - 实现逾期统计展示
  - 实现逾期提醒发送

### 15.2 中期计划（1个月）

#### 15.2.1 高级审批功能
- [ ] **批量审批**
  - 支持批量批准/拒绝申请
  - 批量设置利率和信用评分
  - 实现批量操作确认

- [ ] **审批流程优化**
  - 多级审批流程
  - 审批权限分级
  - 审批模板管理

#### 15.2.2 智能风控
- [ ] **自动风险评估**
  - 基于历史数据自动评估风险
  - 风险预警自动推送
  - 风险等级可视化

- [ ] **风控模型集成**
  - 机器学习风控模型
  - 动态调整风控策略
  - 风控数据可视化

#### 15.2.3 报表分析
- [ ] **业务报表**
  - 放款趋势分析
  - 逾期率分析
  - 产品收益分析
  - 报表导出功能

### 15.3 长期计划（3个月）

#### 15.3.1 对账系统优化
- [ ] **对账自动化**
  - 自动对账任务调度
  - 对账结果自动通知
  - 对账异常自动处理

- [ ] **对账数据分析**
  - 对账准确率统计
  - 对账异常分析
  - 对账趋势预测

#### 15.3.2 移动端支持
- [ ] **移动审批**
  - 移动端审批功能
  - 移动端查看统计
  - 移动端消息推送

#### 15.3.3 系统集成
- [ ] **第三方系统集成**
  - 征信系统对接
  - 支付系统对接
  - 电子签章系统对接

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。  
> 最后更新：2025-01-XX