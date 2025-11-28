# 管理员模块前端接口实现文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 管理员模块前端接口对接

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

### 1.1 用户管理
- 用户搜索和筛选
- 用户详情查看
- 用户状态管理（启用/禁用）
- 用户角色管理
- 用户统计数据

### 1.2 审核管理
- 商品审核
- 内容审核
- 专家审核
- 待审核列表查询

### 1.3 订单监控
- 订单统计
- 订单搜索
- 订单详情查看

### 1.4 融资监控
- 融资申请统计
- 融资申请列表

### 1.5 仪表盘
- 平台统计数据
- 业务指标监控

### 1.6 系统配置
- 系统参数配置
- 配置分类管理

### 1.7 其他功能
- 权限管理
- 退款管理
- 优惠券管理
- 灰度发布
- 横幅管理
- 操作日志

---

## 2. 前端API需求

### 2.1 当前前端API (`api/admin.ts`)

#### 2.1.1 已定义但未实现的接口
- ❌ `adminUserList()` - 获取用户列表（占位函数）
- ❌ `adminProductAuditList()` - 获取商品审核列表（占位函数）

#### 2.1.2 需要新增的接口
根据后端已实现的接口，前端需要实现以下功能模块的API：

1. **用户管理API**
2. **审核管理API**
3. **订单监控API**
4. **融资监控API**
5. **仪表盘API**
6. **系统配置API**

---

## 3. 后端接口状态

### 3.1 已实现的后端接口

#### 3.1.1 用户管理接口
- ✅ `POST /api/admin/users/search` - 搜索用户
- ✅ `GET /api/admin/users/{userId}` - 获取用户详情
- ✅ `PUT /api/admin/users/status` - 更新用户状态
- ✅ `PUT /api/admin/users/role` - 更新用户角色
- ✅ `GET /api/admin/users/statistics` - 获取用户统计

#### 3.1.2 审核管理接口
- ✅ `POST /api/admin/audit/product` - 审核商品
- ✅ `POST /api/admin/audit/content` - 审核内容
- ✅ `POST /api/admin/audit/expert` - 审核专家
- ✅ `GET /api/admin/audit/products/pending` - 获取待审核商品列表
- ✅ `GET /api/admin/audit/contents/pending` - 获取待审核内容列表
- ✅ `GET /api/admin/audit/experts/pending` - 获取待审核专家列表

#### 3.1.3 订单监控接口
- ✅ `GET /api/admin/orders/statistics` - 获取订单统计
- ✅ `POST /api/admin/orders/search` - 搜索订单
- ✅ `GET /api/admin/orders/{orderId}` - 获取订单详情

#### 3.1.4 融资监控接口
- ✅ `GET /api/admin/finance/monitor` - 获取融资监控数据

#### 3.1.5 仪表盘接口
- ✅ `GET /api/admin/dashboard/statistics` - 获取仪表盘统计

#### 3.1.6 系统配置接口
- ✅ `GET /api/admin/config` - 获取系统配置
- ✅ `POST /api/admin/config` - 设置系统配置

---

## 4. 未实现接口列表

### 4.1 前端需要实现的接口

#### 4.1.1 用户管理接口

**文件**: `api/admin.ts`

**需要实现的接口**:

1. **搜索用户**
```typescript
export interface UserSearchRequest {
  keyword?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}

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

export async function adminUserList(
  request: UserSearchRequest
): Promise<Page<AdminUser>> {
  return post<Page<AdminUser>>('/admin/users/search', request);
}
```

2. **获取用户详情**
```typescript
export async function getUserDetail(
  userId: string
): Promise<AdminUser> {
  return get<AdminUser>(`/admin/users/${userId}`);
}
```

3. **更新用户状态**
```typescript
export interface UserStatusUpdateRequest {
  userId: string;
  status: 'ACTIVE' | 'INACTIVE';
  reason?: string;
}

export async function updateUserStatus(
  request: UserStatusUpdateRequest
): Promise<AdminUser> {
  return put<AdminUser>('/admin/users/status', request);
}
```

4. **更新用户角色**
```typescript
export interface UserRoleUpdateRequest {
  userId: string;
  role: string;
}

export async function updateUserRole(
  request: UserRoleUpdateRequest
): Promise<AdminUser> {
  return put<AdminUser>('/admin/users/role', request);
}
```

5. **获取用户统计**
```typescript
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

export async function getUserStatistics(): Promise<UserStatisticsResponse> {
  return get<UserStatisticsResponse>('/admin/users/statistics');
}
```

#### 4.1.2 审核管理接口

**需要实现的接口**:

1. **获取待审核商品列表**
```typescript
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

export async function adminProductAuditList(): Promise<AdminProductAudit[]> {
  return get<AdminProductAudit[]>('/admin/audit/products/pending');
}
```

2. **审核商品**
```typescript
export interface ProductAuditRequest {
  productId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

export async function auditProduct(
  request: ProductAuditRequest
): Promise<AdminProductAudit> {
  return post<AdminProductAudit>('/admin/audit/product', request);
}
```

3. **获取待审核内容列表**
```typescript
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

export async function getPendingContentAudits(): Promise<AdminContentAudit[]> {
  return get<AdminContentAudit[]>('/admin/audit/contents/pending');
}
```

4. **审核内容**
```typescript
export interface ContentAuditRequest {
  contentId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

export async function auditContent(
  request: ContentAuditRequest
): Promise<AdminContentAudit> {
  return post<AdminContentAudit>('/admin/audit/content', request);
}
```

5. **获取待审核专家列表**
```typescript
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

export async function getPendingExpertAudits(): Promise<AdminExpertAudit[]> {
  return get<AdminExpertAudit[]>('/admin/audit/experts/pending');
}
```

6. **审核专家**
```typescript
export interface ExpertAuditRequest {
  expertId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

export async function auditExpert(
  request: ExpertAuditRequest
): Promise<AdminExpertAudit> {
  return post<AdminExpertAudit>('/admin/audit/expert', request);
}
```

#### 4.1.3 订单监控接口

**需要实现的接口**:

1. **获取订单统计**
```typescript
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

export async function getOrderStatistics(): Promise<OrderStatisticsResponse> {
  return get<OrderStatisticsResponse>('/admin/orders/statistics');
}
```

2. **搜索订单**
```typescript
export interface OrderSearchRequest {
  keyword?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

export async function searchOrders(
  request: OrderSearchRequest
): Promise<Page<Order>> {
  return post<Page<Order>>('/admin/orders/search', request);
}
```

3. **获取订单详情**
```typescript
export async function getOrderDetail(
  orderId: string
): Promise<Order> {
  return get<Order>(`/admin/orders/${orderId}`);
}
```

#### 4.1.4 融资监控接口

**需要实现的接口**:

1. **获取融资监控数据**
```typescript
export interface FinanceMonitorResponse {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalAmount: number;
  approvedAmount: number;
  applications: any[];
}

export async function getFinanceMonitor(): Promise<FinanceMonitorResponse> {
  return get<FinanceMonitorResponse>('/admin/finance/monitor');
}
```

#### 4.1.5 仪表盘接口

**需要实现的接口**:

1. **获取仪表盘统计**
```typescript
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

export async function getDashboardStatistics(): Promise<AdminDashboardStatisticsResponse> {
  return get<AdminDashboardStatisticsResponse>('/admin/dashboard/statistics');
}
```

#### 4.1.6 系统配置接口

**需要实现的接口**:

1. **获取系统配置**
```typescript
export interface AdminSystemConfig {
  id: string;
  key: string;
  value: string;
  category: string;
  description?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export async function getSystemConfigs(
  category?: string
): Promise<AdminSystemConfig[]> {
  const params = category ? `?category=${category}` : '';
  return get<AdminSystemConfig[]>(`/admin/config${params}`);
}
```

2. **设置系统配置**
```typescript
export interface SystemConfigRequest {
  key: string;
  value: string;
  category?: string;
  description?: string;
}

export async function setSystemConfig(
  request: SystemConfigRequest
): Promise<AdminSystemConfig> {
  return post<AdminSystemConfig>('/admin/config', request);
}
```

---

## 5. 实现步骤

### 5.1 第一阶段：核心功能接口对接（P0）

#### 5.1.1 用户管理接口
**优先级**: P0  
**预计工作量**: 6小时

**步骤**:
1. 在 `api/admin.ts` 中实现用户管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 实现用户搜索和筛选功能
5. 实现用户状态和角色管理功能

#### 5.1.2 审核管理接口
**优先级**: P0  
**预计工作量**: 6小时

**步骤**:
1. 在 `api/admin.ts` 中实现审核管理相关接口
2. 定义请求和响应类型
3. 对接后端接口
4. 实现待审核列表查询功能
5. 实现审核操作功能

#### 5.1.3 仪表盘接口
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 实现仪表盘统计接口
2. 对接后端接口
3. 实现统计数据展示

### 5.2 第二阶段：订单和融资监控接口对接（P1）

#### 5.2.1 订单监控接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现订单统计接口
2. 实现订单搜索接口
3. 实现订单详情查询接口
4. 实现订单列表和详情页面

#### 5.2.2 融资监控接口
**优先级**: P1  
**预计工作量**: 2小时

**步骤**:
1. 实现融资监控数据查询接口
2. 实现融资监控页面

### 5.3 第三阶段：系统配置接口对接（P1）

#### 5.3.1 系统配置接口
**优先级**: P1  
**预计工作量**: 4小时

**步骤**:
1. 实现系统配置查询接口
2. 实现系统配置设置接口
3. 实现系统配置管理页面

---

## 6. 接口对接说明

### 6.1 用户管理接口对接

#### 6.1.1 搜索用户

**前端实现**:
```typescript
// api/admin.ts

export interface UserSearchRequest {
  keyword?: string;
  role?: string;
  status?: string;
  page?: number;
  size?: number;
}

export async function adminUserList(
  request: UserSearchRequest
): Promise<Page<AdminUser>> {
  return post<Page<AdminUser>>('/admin/users/search', request);
}
```

**后端接口**: `POST /api/admin/users/search`

**响应示例**:
```json
{
  "code": 200,
  "message": "搜索成功",
  "data": {
    "content": [
      {
        "id": "user-uuid",
        "username": "testuser",
        "email": "test@example.com",
        "phone": "13800138000",
        "role": "FARMER",
        "status": "ACTIVE",
        "createdAt": "2025-01-XX 10:00:00",
        "updatedAt": "2025-01-XX 10:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "page": 0,
    "size": 20
  }
}
```

#### 6.1.2 更新用户状态

**前端实现**:
```typescript
export interface UserStatusUpdateRequest {
  userId: string;
  status: 'ACTIVE' | 'INACTIVE';
  reason?: string;
}

export async function updateUserStatus(
  request: UserStatusUpdateRequest
): Promise<AdminUser> {
  return put<AdminUser>('/admin/users/status', request);
}
```

**后端接口**: `PUT /api/admin/users/status`

### 6.2 审核管理接口对接

#### 6.2.1 获取待审核商品列表

**前端实现**:
```typescript
export async function adminProductAuditList(): Promise<AdminProductAudit[]> {
  return get<AdminProductAudit[]>('/admin/audit/products/pending');
}
```

**后端接口**: `GET /api/admin/audit/products/pending`

#### 6.2.2 审核商品

**前端实现**:
```typescript
export interface ProductAuditRequest {
  productId: string;
  action: 'APPROVE' | 'REJECT';
  auditComment?: string;
}

export async function auditProduct(
  request: ProductAuditRequest
): Promise<AdminProductAudit> {
  return post<AdminProductAudit>('/admin/audit/product', request);
}
```

**后端接口**: `POST /api/admin/audit/product`

### 6.3 订单监控接口对接

#### 6.3.1 获取订单统计

**前端实现**:
```typescript
export async function getOrderStatistics(): Promise<OrderStatisticsResponse> {
  return get<OrderStatisticsResponse>('/admin/orders/statistics');
}
```

**后端接口**: `GET /api/admin/orders/statistics`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "totalOrders": 1000,
    "totalAmount": 500000.00,
    "todayOrders": 50,
    "todayAmount": 25000.00,
    "ordersByStatus": [
      {
        "status": "pending",
        "count": 100,
        "amount": 50000.00
      }
    ],
    "trendData": [
      {
        "date": "2025-01-01",
        "count": 50,
        "amount": 25000.00
      }
    ]
  }
}
```

### 6.4 仪表盘接口对接

#### 6.4.1 获取仪表盘统计

**前端实现**:
```typescript
export async function getDashboardStatistics(): Promise<AdminDashboardStatisticsResponse> {
  return get<AdminDashboardStatisticsResponse>('/admin/dashboard/statistics');
}
```

**后端接口**: `GET /api/admin/dashboard/statistics`

---

## 7. DTO设计

### 7.1 前端DTO

#### 7.1.1 AdminUser
```typescript
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
```

#### 7.1.2 AdminProductAudit
```typescript
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
```

#### 7.1.3 OrderStatisticsResponse
```typescript
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
```

### 7.2 后端DTO

后端DTO已在 `com.agriverse.admin.dto` 包中定义，前端需要确保类型匹配。

---

## 8. 实现优先级

### 8.1 高优先级（P0）

1. **用户管理接口对接**
   - 影响范围：管理员核心功能
   - 预计工作量：6小时
   - 依赖：无

2. **审核管理接口对接**
   - 影响范围：审核流程核心功能
   - 预计工作量：6小时
   - 依赖：无

3. **仪表盘接口对接**
   - 影响范围：数据展示
   - 预计工作量：2小时
   - 依赖：无

### 8.2 中优先级（P1）

4. **订单监控接口对接**
   - 影响范围：订单管理
   - 预计工作量：4小时
   - 依赖：无

5. **融资监控接口对接**
   - 影响范围：融资管理
   - 预计工作量：2小时
   - 依赖：无

6. **系统配置接口对接**
   - 影响范围：系统配置
   - 预计工作量：4小时
   - 依赖：无

---

## 9. 测试计划

### 9.1 单元测试

#### 9.1.1 前端API测试
- 测试用户管理接口调用
- 测试审核管理接口调用
- 测试订单监控接口调用
- 测试异常情况处理

#### 9.1.2 接口响应测试
- 测试各种响应格式
- 测试错误处理
- 测试数据格式验证

### 9.2 集成测试

#### 9.2.1 端到端测试
1. **用户管理流程**
   - 搜索用户
   - 查看用户详情
   - 更新用户状态
   - 更新用户角色
   - 查看用户统计

2. **审核流程**
   - 查看待审核商品列表
   - 审核商品（批准/拒绝）
   - 查看待审核内容列表
   - 审核内容（批准/拒绝）
   - 查看待审核专家列表
   - 审核专家（批准/拒绝）

3. **订单监控流程**
   - 查看订单统计
   - 搜索订单
   - 查看订单详情

4. **融资监控流程**
   - 查看融资监控数据

### 9.3 性能测试

- 大量用户搜索性能
- 订单搜索性能
- 统计数据查询性能

---

## 10. 注意事项

### 10.1 数据一致性

- 用户状态更新需要验证业务规则
- 用户角色更新需要验证权限
- 审核操作需要记录操作日志
- 系统配置更新需要验证配置值

### 10.2 异常处理

- 用户不存在时，返回友好提示
- 审核对象不存在时，提示用户
- 订单不存在时，返回404错误
- 系统配置不存在时，创建新配置

### 10.3 权限控制

- 所有接口需要JWT认证
- 所有接口需要ADMIN角色权限
- 操作需要记录操作日志
- 敏感操作需要二次确认

### 10.4 业务规则

- 用户状态更新不能影响已登录用户
- 审核操作需要填写审核意见
- 系统配置更新需要验证配置值格式
- 订单状态不能随意修改

### 10.5 性能优化

- 用户列表查询使用分页
- 订单列表查询使用分页
- 统计数据考虑缓存
- 审核列表查询使用分页

### 10.6 安全考虑

- 敏感操作需要二次确认
- 操作日志完整记录
- 用户信息加密传输
- 审核操作需要权限验证

---

## 11. 扩展功能（后续实现）

### 11.1 权限管理

1. **角色权限管理**
   - 角色创建和编辑
   - 权限分配
   - 权限验证

2. **操作权限控制**
   - 细粒度权限控制
   - 权限继承

### 11.2 退款管理

1. **退款审核**
   - 退款申请审核
   - 退款进度跟踪

2. **退款统计**
   - 退款金额统计
   - 退款原因分析

### 11.3 优惠券管理

1. **优惠券创建**
   - 优惠券类型设置
   - 优惠券规则配置

2. **优惠券统计**
   - 优惠券使用统计
   - 优惠券效果分析

### 11.4 灰度发布

1. **功能开关**
   - 功能开关管理
   - 灰度比例设置

2. **灰度监控**
   - 灰度效果监控
   - 灰度数据分析

---

## 12. 接口汇总表

### 12.1 用户管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/admin/users/search` | 搜索用户 | ✅ 后端已实现 |
| GET | `/api/admin/users/{userId}` | 获取用户详情 | ✅ 后端已实现 |
| PUT | `/api/admin/users/status` | 更新用户状态 | ✅ 后端已实现 |
| PUT | `/api/admin/users/role` | 更新用户角色 | ✅ 后端已实现 |
| GET | `/api/admin/users/statistics` | 获取用户统计 | ✅ 后端已实现 |

### 12.2 审核管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/admin/audit/product` | 审核商品 | ✅ 后端已实现 |
| POST | `/api/admin/audit/content` | 审核内容 | ✅ 后端已实现 |
| POST | `/api/admin/audit/expert` | 审核专家 | ✅ 后端已实现 |
| GET | `/api/admin/audit/products/pending` | 获取待审核商品列表 | ✅ 后端已实现 |
| GET | `/api/admin/audit/contents/pending` | 获取待审核内容列表 | ✅ 后端已实现 |
| GET | `/api/admin/audit/experts/pending` | 获取待审核专家列表 | ✅ 后端已实现 |

### 12.3 订单监控接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/admin/orders/statistics` | 获取订单统计 | ✅ 后端已实现 |
| POST | `/api/admin/orders/search` | 搜索订单 | ✅ 后端已实现 |
| GET | `/api/admin/orders/{orderId}` | 获取订单详情 | ✅ 后端已实现 |

### 12.4 融资监控接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/admin/finance/monitor` | 获取融资监控数据 | ✅ 后端已实现 |

### 12.5 仪表盘接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/admin/dashboard/statistics` | 获取仪表盘统计 | ✅ 后端已实现 |

### 12.6 系统配置接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/admin/config` | 获取系统配置 | ✅ 后端已实现 |
| POST | `/api/admin/config` | 设置系统配置 | ✅ 后端已实现 |

---

## 13. 前端实现检查清单

### 13.1 用户管理模块

- [ ] 实现搜索用户接口
- [ ] 实现获取用户详情接口
- [ ] 实现更新用户状态接口
- [ ] 实现更新用户角色接口
- [ ] 实现获取用户统计接口
- [ ] 实现用户列表页面
- [ ] 实现用户详情页面
- [ ] 实现用户状态管理页面

### 13.2 审核管理模块

- [ ] 实现获取待审核商品列表接口
- [ ] 实现审核商品接口
- [ ] 实现获取待审核内容列表接口
- [ ] 实现审核内容接口
- [ ] 实现获取待审核专家列表接口
- [ ] 实现审核专家接口
- [ ] 实现审核列表页面
- [ ] 实现审核操作页面

### 13.3 订单监控模块

- [ ] 实现获取订单统计接口
- [ ] 实现搜索订单接口
- [ ] 实现获取订单详情接口
- [ ] 实现订单统计页面
- [ ] 实现订单列表页面
- [ ] 实现订单详情页面

### 13.4 融资监控模块

- [ ] 实现获取融资监控数据接口
- [ ] 实现融资监控页面

### 13.5 仪表盘模块

- [ ] 实现获取仪表盘统计接口
- [ ] 实现仪表盘页面
- [ ] 实现统计数据可视化

### 13.6 系统配置模块

- [ ] 实现获取系统配置接口
- [ ] 实现设置系统配置接口
- [ ] 实现系统配置管理页面

---

## 14. 常见问题

### 14.1 接口调用问题

**Q: 如何获取当前登录管理员的ID？**  
A: 从JWT token中解析用户信息，后端会自动获取当前用户信息。

**Q: 审核操作需要填写审核意见吗？**  
A: 建议填写，特别是拒绝时，审核意见是必填的。

**Q: 用户状态更新会影响已登录用户吗？**  
A: 不会立即影响，但下次登录时会验证状态。

### 14.2 数据格式问题

**Q: 日期时间字段使用什么格式？**  
A: 使用 ISO 8601 格式：`YYYY-MM-DDTHH:mm:ss` 或 `YYYY-MM-DD`。

**Q: 金额字段使用什么类型？**  
A: 前端使用 `number` 类型，后端使用 `BigDecimal`，注意精度处理。

### 14.3 业务逻辑问题

**Q: 已审核的商品可以重新审核吗？**  
A: 不可以，已审核的商品不能重新审核。

**Q: 用户角色可以随意修改吗？**  
A: 可以，但需要注意权限影响，建议谨慎操作。

**Q: 系统配置更新后立即生效吗？**  
A: 根据配置类型，有些配置需要重启服务才能生效。

---

## 15. 代码示例

### 15.1 用户管理使用示例

```typescript
// roles/admin/pages/UserManagement.tsx
import { adminUserList, updateUserStatus } from '../../../api/admin';
import { useState, useEffect } from 'react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminUserList({
        page: 0,
        size: 20
      });
      setUsers(response.content);
    } catch (error) {
      toast.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: string) => {
    try {
      await updateUserStatus({
        userId,
        status,
        reason: '管理员操作'
      });
      toast.success('用户状态更新成功');
      loadUsers();
    } catch (error) {
      toast.error('用户状态更新失败');
    }
  };

  return (
    <div>
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          onUpdateStatus={handleUpdateStatus}
        />
      ))}
    </div>
  );
}
```

### 15.2 审核管理使用示例

```typescript
// roles/admin/pages/AuditManagement.tsx
import { adminProductAuditList, auditProduct } from '../../../api/admin';
import { useState, useEffect } from 'react';

export default function AdminAuditManagement() {
  const [audits, setAudits] = useState([]);

  useEffect(() => {
    loadPendingAudits();
  }, []);

  const loadPendingAudits = async () => {
    try {
      const data = await adminProductAuditList();
      setAudits(data);
    } catch (error) {
      toast.error('获取待审核列表失败');
    }
  };

  const handleAudit = async (productId: string, action: string, comment?: string) => {
    try {
      await auditProduct({
        productId,
        action,
        auditComment: comment
      });
      toast.success('审核成功');
      loadPendingAudits();
    } catch (error) {
      toast.error('审核失败');
    }
  };

  return (
    <div>
      {audits.map(audit => (
        <AuditCard 
          key={audit.id} 
          audit={audit}
          onApprove={() => handleAudit(audit.productId, 'APPROVE')}
          onReject={(comment) => handleAudit(audit.productId, 'REJECT', comment)}
        />
      ))}
    </div>
  );
}
```

### 15.3 仪表盘使用示例

```typescript
// roles/admin/pages/Dashboard.tsx
import { getDashboardStatistics } from '../../../api/admin';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const data = await getDashboardStatistics();
      setStatistics(data);
    } catch (error) {
      toast.error('获取统计数据失败');
    }
  };

  return (
    <div>
      <StatisticsCards statistics={statistics} />
      <TrendChart data={statistics?.trendData} />
    </div>
  );
}
```

---

## 16. 后续开发规划

### 16.1 短期计划（1-2周）

#### 16.1.1 核心接口对接（P0）
- [ ] **用户管理接口对接**
  - 实现 `adminUserList()` 函数
  - 实现用户搜索、详情、状态管理接口
  - 实现用户角色管理接口
  - 实现用户统计接口
  - 实现用户管理页面

- [ ] **审核管理接口对接**
  - 实现 `adminProductAuditList()` 函数
  - 实现商品、内容、专家审核接口
  - 实现待审核列表查询接口
  - 实现审核操作页面

- [ ] **仪表盘接口对接**
  - 实现仪表盘统计接口
  - 实现统计数据展示
  - 实现仪表盘页面

#### 16.1.2 订单和融资监控（P1）
- [ ] **订单监控功能**
  - 实现订单统计接口
  - 实现订单搜索接口
  - 实现订单详情查询接口

- [ ] **融资监控功能**
  - 实现融资监控数据查询接口
  - 实现融资监控页面

### 16.2 中期计划（1个月）

#### 16.2.1 系统配置功能
- [ ] **系统配置管理**
  - 实现系统配置查询接口
  - 实现系统配置设置接口
  - 实现系统配置管理页面

#### 16.2.2 权限管理功能
- [ ] **权限系统**
  - 实现角色权限管理
  - 实现操作权限控制
  - 实现权限管理页面

#### 16.2.3 退款管理功能
- [ ] **退款审核**
  - 实现退款申请审核接口
  - 实现退款进度跟踪接口
  - 实现退款统计接口

### 16.3 长期计划（3个月）

#### 16.3.1 优惠券管理
- [ ] **优惠券系统**
  - 实现优惠券创建接口
  - 实现优惠券类型设置
  - 实现优惠券规则配置
  - 实现优惠券统计功能

#### 16.3.2 灰度发布
- [ ] **功能开关管理**
  - 实现功能开关管理接口
  - 实现灰度比例设置
  - 实现灰度效果监控

#### 16.3.3 运营管理
- [ ] **横幅管理**
  - 实现轮播图管理接口
  - 实现横幅配置功能

- [ ] **数据报表**
  - 实现业务数据报表
  - 实现数据导出功能
  - 实现数据可视化

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。  
> 最后更新：2025-01-XX

