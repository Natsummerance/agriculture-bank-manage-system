# 农户模块前端接口实现文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 农户模块前端接口对接

---

## 📋 目录

1. [功能概述](#1-功能概述)
2. [前端API需求](#2-前端api需求)
3. [后端接口状态](#3-后端接口状态)
4. [未实现接口列表](#4-未实现接口列表)
5. [实现步骤](#5-实现步骤)
6. [接口对接说明](#6-接口对接说明)

---

## 1. 功能概述

### 1.1 农户商品管理
- 商品列表查询
- 商品上下架
- 商品数据看板

### 1.2 农户融资管理
- 融资申请提交
- 融资申请列表查询
- 融资申请详情查看
- 还款管理
- 合同签署
- 智能拼单

### 1.3 农户融资匹配
- 启动匹配
- 获取匹配候选
- 加入/退出拼单
- 查看匹配详情

---

## 2. 前端API需求

### 2.1 商品管理接口 (`api/farmer.ts`)

#### 2.1.1 已实现接口
- ✅ `getFarmerProducts()` - 获取商品列表
- ✅ `toggleProductStatus()` - 商品上下架
- ✅ `getProductDashboard()` - 获取商品数据看板

#### 2.1.2 未实现接口
- ❌ `submitFarmerFinanceApp()` - 提交融资申请（占位函数，需要对接后端）

### 2.2 融资匹配接口 (`api/farmerFinanceMatch.ts`)

#### 2.2.1 接口定义
```typescript
// 启动匹配
startMatch(data: StartMatchRequest) 
// 路径: POST /api/farmer/match/start

// 获取匹配候选
getMatchCandidates(amount: number)
// 路径: GET /api/farmer/match/candidates?amount={amount}

// 获取匹配详情
getMatchDetail(matchId: string)
// 路径: GET /api/farmer/match/detail/{matchId}

// 加入拼单
joinMatch(matchId: string, amount: number)
// 路径: POST /api/farmer/match/join

// 退出拼单
quitMatch(matchId: string)
// 路径: POST /api/farmer/match/quit

// 创建拼单
createMatch(payload: { targetAmount: number; note?: string; waitHours: number })
// 路径: POST /api/farmer/match/create

// 获取匹配结果
getMatchResult(matchId: string)
// 路径: GET /api/farmer/match/result/{matchId}
```

---

## 3. 后端接口状态

### 3.1 已实现的后端接口

#### 3.1.1 商品管理接口
- ✅ `GET /api/farmer/products/list` - 获取商品列表
- ✅ `POST /api/farmer/products/toggle-status` - 商品上下架
- ✅ `GET /api/farmer/products/dashboard` - 获取商品数据看板

#### 3.1.2 融资管理接口
- ✅ `POST /api/farmer/finance/apply` - 提交融资申请
- ✅ `GET /api/farmer/finance/applications` - 获取融资申请列表
- ✅ `GET /api/farmer/finance/applications/{id}` - 获取融资申请详情
- ✅ `POST /api/farmer/finance/repay` - 还款
- ✅ `POST /api/farmer/finance/early-repay/calculate` - 提前还款试算
- ✅ `GET /api/farmer/finance/applications/{id}/schedules` - 获取还款计划列表
- ✅ `GET /api/farmer/finance/applications/{id}/records` - 获取还款记录列表
- ✅ `POST /api/farmer/finance/contracts/{contractId}/sign` - 签署合同
- ✅ `POST /api/farmer/finance/joint-loan/create` - 创建拼单组
- ✅ `POST /api/farmer/finance/joint-loan/{groupId}/join` - 加入拼单组
- ✅ `POST /api/farmer/finance/joint-loan/{groupId}/confirm` - 确认拼单
- ✅ `GET /api/farmer/finance/joint-loan/{groupId}` - 获取拼单组详情
- ✅ `GET /api/farmer/finance/statistics` - 获取融资统计
- ✅ `GET /api/farmer/finance/applications/{id}/repayment-summary` - 获取还款汇总

#### 3.1.3 融资匹配接口（后端未实现）
- ❌ `POST /api/farmer/match/start` - 启动匹配
- ❌ `GET /api/farmer/match/candidates` - 获取匹配候选
- ❌ `GET /api/farmer/match/detail/{matchId}` - 获取匹配详情
- ❌ `POST /api/farmer/match/join` - 加入拼单
- ❌ `POST /api/farmer/match/quit` - 退出拼单
- ❌ `POST /api/farmer/match/create` - 创建拼单
- ❌ `GET /api/farmer/match/result/{matchId}` - 获取匹配结果

---

## 4. 未实现接口列表

### 4.1 前端需要对接的接口

#### 4.1.1 融资申请接口对接
**文件**: `api/farmer.ts`

**当前状态**:
```typescript
export async function submitFarmerFinanceApp() {
  // TODO: 调用后端农户融资申请接口
  return { success: true };
}
```

**需要实现**:
```typescript
export interface FinancingApplicationRequest {
  amount: number;
  termMonths: number;
  purpose: string;
  productId?: string;
}

export async function submitFarmerFinanceApp(
  request: FinancingApplicationRequest
): Promise<FinancingApplicationResponse> {
  return post<FinancingApplicationResponse>('/farmer/finance/apply', request);
}
```

**后端接口**: `POST /api/farmer/finance/apply`

---

### 4.2 后端需要实现的接口

#### 4.2.1 融资匹配接口

**说明**: 前端定义的融资匹配接口与后端实现的智能拼单接口路径不一致，需要统一或实现新的匹配接口。

**前端需求路径**:
- `POST /api/farmer/match/start`
- `GET /api/farmer/match/candidates`
- `GET /api/farmer/match/detail/{matchId}`
- `POST /api/farmer/match/join`
- `POST /api/farmer/match/quit`
- `POST /api/farmer/match/create`
- `GET /api/farmer/match/result/{matchId}`

**后端已有路径**:
- `POST /api/farmer/finance/joint-loan/create`
- `POST /api/farmer/finance/joint-loan/{
    **后端已有路径**:
- `POST /api/farmer/finance/joint-loan/create` - 创建拼单组
- `POST /api/farmer/finance/joint-loan/{groupId}/join` - 加入拼单组
- `POST /api/farmer/finance/joint-loan/{groupId}/confirm` - 确认拼单
- `GET /api/farmer/finance/joint-loan/{groupId}` - 获取拼单组详情

**解决方案**:
1. **方案一（推荐）**: 修改前端API，统一使用后端已有的智能拼单接口路径
2. **方案二**: 在后端新增匹配接口，映射到现有的智能拼单服务

---

## 5. 实现步骤

### 5.1 第一阶段：前端接口对接

#### 5.1.1 对接融资申请接口

**步骤**:
1. 在 `api/farmer.ts` 中完善 `submitFarmerFinanceApp` 函数
2. 定义请求和响应类型接口
3. 调用后端 `POST /api/farmer/finance/apply` 接口
4. 处理异常情况（如金额低于最低额度，引导进入拼单流程）

**代码实现**:
```typescript
// api/farmer.ts

export interface FinancingApplicationRequest {
  amount: number;
  termMonths: number;
  purpose: string;
  productId?: string;
}

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
    // 处理金额低于最低额度的情况
    if (error.code === 2001 || error.message?.includes('拼单')) {
      throw new Error('APPLY_JOINT_LOAN');
    }
    throw error;
  }
}
```

#### 5.1.2 统一融资匹配接口

**步骤**:
1. 修改 `api/farmerFinanceMatch.ts`，将接口路径统一为后端已有路径
2. 或者在后端新增匹配接口Controller，映射到现有服务

**方案一：修改前端（推荐）**
```typescript
// api/farmerFinanceMatch.ts

export async function startMatch(data: StartMatchRequest) {
  // 映射到后端的创建拼单组接口
  return await post('/farmer/finance/joint-loan/create', {
    amount: data.applyAmount
  });
}

export async function getMatchCandidates(amount: number) {
  // 需要后端新增接口：获取可加入的拼单组列表
  return await get<MatchCandidate[]>(
    `/farmer/finance/joint-loan/candidates?amount=${amount}`
  );
}

export async function getMatchDetail(matchId: string) {
  // 映射到后端的获取拼单组详情接口
  return await get<MatchDetail>(
    `/farmer/finance/joint-loan/${matchId}`
  );
}

export async function joinMatch(matchId: string, amount: number) {
  // 映射到后端的加入拼单组接口
  return await post(`/farmer/finance/joint-loan/${matchId}/join`, {
    amount,
    purpose: '' // 需要从上下文获取
  });
}

export async function quitMatch(matchId: string) {
  // 需要后端新增接口：退出拼单组
  return await post(`/farmer/finance/joint-loan/${matchId}/quit`, {});
}

export async function createMatch(payload: {
  targetAmount: number;
  note?: string;
  waitHours: number;
}) {
  // 映射到后端的创建拼单组接口
  return await post('/farmer/finance/joint-loan/create', {
    amount: payload.targetAmount
  });
}

export async function getMatchResult(matchId: string) {
  // 需要后端新增接口：获取匹配结果
  return await get<{
    matchId: string;
    status: 'success' | 'failed';
    mergedAmount: number;
  }>(`/farmer/finance/joint-loan/${matchId}/result`);
}
```

### 5.2 第二阶段：后端接口补充

#### 5.2.1 新增匹配候选查询接口

**路径**: `GET /api/farmer/finance/joint-loan/candidates`

**功能**: 根据金额查询可加入的拼单组列表

**实现位置**: `FarmerFinanceController.java`

```java
@GetMapping("/joint-loan/candidates")
public ResponseEntity<ApiResponse<List<MatchCandidateResponse>>> getMatchCandidates(
        @RequestParam BigDecimal amount,
        Principal principal) {
    try {
        String farmerId = principal.getName();
        List<MatchCandidateResponse> candidates = 
            jointLoanService.findMatchCandidates(amount, farmerId);
        return ResponseEntity.ok(ApiResponse.success("获取成功", candidates));
    } catch (Exception e) {
        log.error("获取匹配候选异常", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(500, "获取失败，请稍后重试"));
    }
}
```

#### 5.2.2 新增退出拼单接口

**路径**: `POST /api/farmer/finance/joint-loan/{groupId}/quit`

**功能**: 农户退出拼单组

**实现位置**: `FarmerFinanceController.java`

```java
@PostMapping("/joint-loan/{groupId}/quit")
public ResponseEntity<ApiResponse<Object>> quitJointLoanGroup(
        @PathVariable String groupId,
        Principal principal) {
    try {
        String farmerId = principal.getName();
        jointLoanService.quitGroup(groupId, farmerId);
        return ResponseEntity.ok(ApiResponse.success("退出成功", null));
    } catch (Exception e) {
        log.error("退出拼单组异常", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(500, "退出失败，请稍后重试"));
    }
}
```

#### 5.2.3 新增匹配结果查询接口

**路径**: `GET /api/farmer/finance/joint-loan/{groupId}/result`

**功能**: 获取拼单组的匹配结果

**实现位置**: `FarmerFinanceController.java`

```java
@GetMapping("/joint-loan/{groupId}/result")
public ResponseEntity<ApiResponse<MatchResultResponse>> getMatchResult(
        @PathVariable String groupId) {
    try {
        MatchResultResponse result = jointLoanService.getMatchResult(groupId);
        return ResponseEntity.ok(ApiResponse.success("获取成功", result));
    } catch (Exception e) {
        log.error("获取匹配结果异常", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error(500, "获取失败，请稍后重试"));
    }
}
```

### 5.3 第三阶段：Service层扩展

#### 5.3.1 扩展JointLoanService

**需要新增的方法**:

1. **findMatchCandidates** - 查找匹配候选
   ```java
   public List<MatchCandidateResponse> findMatchCandidates(
           BigDecimal amount, String farmerId) {
       // 查询状态为MATCHING的拼单组
       // 计算匹配度
       // 返回候选列表
   }
   ```

2. **quitGroup** - 退出拼单组
   ```java
   public void quitGroup(String groupId, String farmerId) {
       // 查找成员记录
       // 更新成员状态为CANCELLED
       // 更新拼单组状态和金额
   }
   ```

3. **getMatchResult** - 获取匹配结果
   ```java
   public MatchResultResponse getMatchResult(String groupId) {
       // 查询拼单组信息
       // 计算总金额
       // 返回匹配结果
   }
   ```

---

## 6. 接口对接说明

### 6.1 融资申请接口对接

#### 6.1.1 请求参数

**接口**: `POST /api/farmer/finance/apply`

**请求体**:
```json
{
  "amount": 150000.00,
  "termMonths": 12,
  "purpose": "购买农资设备",
  "productId": "optional-product-id"
}
```

**参数说明**:
- `amount` (必需): 申请金额，单位：元
- `termMonths` (必需): 期限，单位：月，范围：1-120
- `purpose` (必需): 资金用途，最大长度：500字符
- `productId` (可选): 产品ID，如果选择特定产品

#### 6.1.2 响应格式

**成功响应**:
```json
{
  "code": 200,
  "message": "申请提交成功",
  "data": {
    "id": "uuid",
    "farmerId": "farmer-uuid",
    "amount": 150000.00,
    "termMonths": 12,
    "purpose": "购买农资设备",
    "status": "APPLIED",
    "createdAt": "2025-01-XX 10:00:00",
    "updatedAt": "2025-01-XX 10:00:00"
  }
}
```

**特殊响应（金额低于最低额度）**:
```json
{
  "code": 2001,
  "message": "申请金额低于最低额度，建议使用智能拼单",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 400,
  "message": "参数错误：申请金额必须大于0",
  "data": null
}
```

#### 6.1.3 前端处理逻辑

```typescript
async function handleSubmitApplication(request: FinancingApplicationRequest) {
  try {
    const response = await submitFarmerFinanceApp(request);
    // 申请成功，跳转到申请列表或详情页
    navigateToApplicationDetail(response.id);
  } catch (error: any) {
    if (error.message === 'APPLY_JOINT_LOAN') {
      // 引导用户进入智能拼单流程
      showJointLoanDialog();
    } else {
      // 显示错误提示
      toast.error(error.message || '申请提交失败');
    }
  }
}
```

### 6.2 智能拼单接口对接

#### 6.2.1 创建拼单组

**接口**: `POST /api/farmer/finance/joint-loan/create`

**请求参数**:
```typescript
{
  amount: number; // 拼单金额
}
```

**响应**:
```json
{
  "code": 200,
  "message": "拼单组创建成功",
  "data": {
    "id": "group-uuid",
    "groupName": "智能拼单组-20250101100000",
    "totalAmount": 150000.00,
    "minAmount": 200000.00,
    "status": "MATCHING",
    "matchedCount": 1,
    "targetCount": 1,
    "createdAt": "2025-01-XX 10:00:00"
  }
}
```

#### 6.2.2 获取匹配候选

**接口**: `GET /api/farmer/finance/joint-loan/candidates?amount={amount}`

**响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": [
    {
      "groupId": "group-uuid",
      "groupName": "智能拼单组-20250101100000",
      "currentAmount": 150000.00,
      "targetAmount": 200000.00,
      "matchedCount": 1,
      "matchScore": 85.5,
      "createdAt": "2025-01-XX 10:00:00"
    }
  ]
}
```

#### 6.2.3 加入拼单组

**接口**: `POST /api/farmer/finance/joint-loan/{groupId}/join`

**请求参数**:
```typescript
{
  amount: number;      // 加入金额
  purpose: string;     // 资金用途
}
```

**响应**:
```json
{
  "code": 200,
  "message": "加入成功",
  "data": {
    "id": "member-uuid",
    "groupId": "group-uuid",
    "farmerId": "farmer-uuid",
    "amount": 50000.00,
    "purpose": "购买农资设备",
    "status": "PENDING",
    "createdAt": "2025-01-XX 10:05:00"
  }
}
```

#### 6.2.4 退出拼单组

**接口**: `POST /api/farmer/finance/joint-loan/{groupId}/quit`

**响应**:
```json
{
  "code": 200,
  "message": "退出成功",
  "data": null
}
```

#### 6.2.5 获取匹配结果

**接口**: `GET /api/farmer/finance/joint-loan/{groupId}/result`

**响应**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "matchId": "group-uuid",
    "status": "success",
    "mergedAmount": 200000.00,
    "totalMembers": 2,
    "applications": [
      {
        "id": "application-uuid-1",
        "farmerId": "farmer-uuid-1",
        "amount": 150000.00,
        "status": "APPLIED"
      },
      {
        "id": "application-uuid-2",
        "farmerId": "farmer-uuid-2",
        "amount": 50000.00,
        "status": "APPLIED"
      }
    ]
  }
}
```

---

## 7. DTO设计

### 7.1 前端DTO

#### 7.1.1 FinancingApplicationRequest
```typescript
export interface FinancingApplicationRequest {
  amount: number;              // 申请金额
  termMonths: number;          // 期限（月）
  purpose: string;              // 资金用途
  productId?: string;          // 产品ID（可选）
}
```

#### 7.1.2 FinancingApplicationResponse
```typescript
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
  timeline?: TimelineItem[];
  repaymentSchedules?: RepaymentSchedule[];
}
```

#### 7.1.3 MatchCandidateResponse
```typescript
export interface MatchCandidateResponse {
  groupId: string;
  groupName: string;
  currentAmount: number;
  targetAmount: number;
  matchedCount: number;
  matchScore: number;
  createdAt: string;
}
```

#### 7.1.4 MatchResultResponse
```typescript
export interface MatchResultResponse {
  matchId: string;
  status: 'success' | 'failed';
  mergedAmount: number;
  totalMembers: number;
  applications: FinancingApplicationResponse[];
}
```

### 7.2 后端DTO

#### 7.2.1 MatchCandidateResponse (后端)
**路径**: `com.agriverse.finance.dto.MatchCandidateResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchCandidateResponse {
    private String groupId;
    private String groupName;
    private BigDecimal currentAmount;
    private BigDecimal targetAmount;
    private Integer matchedCount;
    private Double matchScore;
    private LocalDateTime createdAt;
}
```

#### 7.2.2 MatchResultResponse (后端)
**路径**: `com.agriverse.finance.dto.MatchResultResponse`

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResultResponse {
    private String matchId;
    private String status;  // "success" or "failed"
    private BigDecimal mergedAmount;
    private Integer totalMembers;
    private List<FinancingApplicationResponse> applications;
}
```

---

## 8. 实现优先级

### 8.1 高优先级（P0）

1. **对接融资申请接口**
   - 影响范围：农户融资申请核心功能
   - 预计工作量：2小时
   - 依赖：无

2. **统一智能拼单接口路径**
   - 影响范围：智能拼单功能
   - 预计工作量：4小时
   - 依赖：融资申请接口对接完成

### 8.2 中优先级（P1）

3. **新增匹配候选查询接口**
   - 影响范围：拼单匹配功能
   - 预计工作量：4小时
   - 依赖：智能拼单接口统一

4. **新增退出拼单接口**
   - 影响范围：拼单管理功能
   - 预计工作量：2小时
   - 依赖：智能拼单接口统一

### 8.3 低优先级（P2）

5. **新增匹配结果查询接口**
   - 影响范围：拼单结果查看
   - 预计工作量：2小时
   - 依赖：智能拼单接口统一

---

## 9. 测试计划

### 9.1 单元测试

#### 9.1.1 前端API测试
- 测试融资申请接口调用
- 测试异常情况处理（金额低于最低额度）
- 测试智能拼单接口调用

#### 9.1.2 后端Service测试
- 测试匹配候选查询逻辑
- 测试退出拼单逻辑
- 测试匹配结果查询逻辑

### 9.2 集成测试

#### 9.2.1 端到端测试
1. **融资申请流程**
   - 正常申请流程
   - 金额低于最低额度，引导进入拼单
   - 申请失败处理

2. **智能拼单流程**
   - 创建拼单组
   - 查询匹配候选
   - 加入拼单组
   - 退出拼单组
   - 确认拼单并提交申请

### 9.3 性能测试

- 匹配候选查询性能（大量拼单组场景）
- 拼单组状态更新性能

---

## 10. 注意事项

### 10.1 数据一致性

- 拼单组状态更新需要保证原子性
- 退出拼单时需要更新拼单组总金额和成员数
- 确认拼单时需要为所有成员创建融资申请

### 10.2 异常处理

- 拼单组已满时，不允许加入
- 拼单组状态为MATCHED或APPLIED时，不允许加入或退出
- 农户只能退出自己加入的拼单组

### 10.3 权限控制

- 所有接口需要JWT认证
- 农户只能操作自己的融资申请和拼单组
- 加入拼单组时验证农户身份

### 10.4 业务规则

- 拼单组总金额需要达到最低拼单金额才能确认
- 匹配候选需要计算匹配度（基于金额、时间等）
- 退出拼单后，如果拼单组金额低于最低金额，需要更新状态

---

## 11. 路径修正说明

### 11.1 融资匹配接口路径修正

**问题**: 前端API文件 `api/farmerFinanceMatch.ts` 中定义的路径为 `/api/farmer/match/*`，但后端实际实现的路径为 `/api/farmer/finance/joint-loan/*`。

**解决方案**: 需要修改前端API文件中的路径，使其与后端保持一致。

**修正后的接口路径**:
```typescript
// 原路径: /api/farmer/match/start
// 修正后: /api/farmer/finance/joint-loan/create

// 原路径: /api/farmer/match/candidates
// 修正后: 使用后端现有的拼单组查询接口

// 原路径: /api/farmer/match/detail/{matchId}
// 修正后: /api/farmer/finance/joint-loan/{groupId}

// 原路径: /api/farmer/match/join
// 修正后: /api/farmer/finance/joint-loan/{groupId}/join

// 原路径: /api/farmer/match/quit
// 修正后: 后端未实现，需要新增或使用现有接口

// 原路径: /api/farmer/match/create
// 修正后: /api/farmer/finance/joint-loan/create

// 原路径: /api/farmer/match/result/{matchId}
// 修正后: /api/farmer/finance/joint-loan/{groupId}
```

**修正步骤**:
1. 修改 `api/farmerFinanceMatch.ts` 文件中的接口路径
2. 更新接口函数名称和参数，使其与后端DTO匹配
3. 测试接口调用，确保路径正确

---

## 12. 后续开发规划

### 12.1 短期计划（1-2周）

#### 12.1.1 核心接口对接（P0）
- [ ] **融资申请接口对接**
  - 实现 `submitFarmerFinanceApp()` 函数
  - 对接 `POST /api/farmer/finance/apply` 接口
  - 实现申请表单数据验证
  - 添加错误处理和用户提示

- [ ] **融资匹配路径修正**
  - 修正 `api/farmerFinanceMatch.ts` 中的接口路径
  - 统一使用后端 `/api/farmer/finance/joint-loan/*` 路径
  - 更新相关页面组件中的接口调用

- [ ] **商品管理接口完善**
  - 实现商品创建接口 `createFarmerProduct()`
  - 对接 `POST /api/farmer/products/create` 接口
  - 实现商品编辑功能（如需要）

#### 12.1.2 功能优化
- [ ] **融资申请流程优化**
  - 添加申请进度实时查询
  - 实现申请状态推送通知
  - 优化申请表单用户体验

- [ ] **拼单功能完善**
  - 实现拼单组实时状态更新
  - 添加拼单组成员列表展示
  - 实现拼单组超时提醒

### 12.2 中期计划（1个月）

#### 12.2.1 智能匹配功能增强
- [ ] **匹配算法优化**
  - 基于农户地理位置匹配
  - 基于作物类型匹配
  - 基于信用评分匹配
  - 实现匹配度评分系统

- [ ] **拼单组推荐系统**
  - 根据农户申请金额推荐合适的拼单组
  - 推荐相似农户的拼单组
  - 实现推荐理由展示

#### 12.2.2 数据可视化
- [ ] **融资数据看板增强**
  - 添加融资趋势图表
  - 实现还款计划可视化
  - 添加融资成本分析

- [ ] **商品数据看板优化**
  - 实现商品销售趋势分析
  - 添加商品热度排行
  - 实现商品收益分析

#### 12.2.3 移动端适配
- [ ] **响应式设计优化**
  - 优化移动端融资申请表单
  - 实现移动端拼单组列表
  - 添加移动端手势操作

### 12.3 长期计划（3个月）

#### 12.3.1 高级功能
- [ ] **拼单组自动匹配**
  - 系统自动匹配符合条件的农户
  - 自动创建拼单组
  - 实现智能推荐算法

- [ ] **融资风险评估**
  - 实现融资风险评估模型
  - 添加风险提示功能
  - 实现风险等级可视化

#### 12.3.2 集成功能
- [ ] **高德地图集成**
  - 集成高德地图SDK（地址选点）
  - 实现地理位置匹配
  - 添加地图可视化功能

- [ ] **WebSocket实时通信**
  - 实现融资状态实时推送
  - 实现拼单组状态实时更新
  - 添加实时消息通知

#### 12.3.3 性能优化
- [ ] **接口性能优化**
  - 实现接口缓存机制
  - 优化大数据量查询性能
  - 实现分页加载优化

- [ ] **前端性能优化**
  - 实现代码分割和懒加载
  - 优化首屏加载时间
  - 实现虚拟滚动（长列表）

---

## 13. 扩展功能（后续实现）

### 13.1 智能匹配算法优化
- 基于农户地理位置匹配
- 基于作物类型匹配
- 基于信用评分匹配
- 基于历史融资记录匹配

### 13.2 拼单组推荐
- 根据农户申请金额推荐合适的拼单组
- 推荐相似农户的拼单组
- 实现推荐理由展示

### 13.3 拼单组自动匹配
- 系统自动匹配符合条件的农户
- 自动创建拼单组
- 实现智能推荐算法

### 13.4 拼单组超时处理
- 设置拼单组超时时间
- 超时后自动取消或提醒
- 实现超时提醒推送

### 13.5 融资数据分析
- 融资趋势分析
- 还款能力评估
- 融资成本分析
- 风险预警系统

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。  
> 最后更新：2025-01-XX
