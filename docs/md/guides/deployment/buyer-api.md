# 买家模块前端接口实现文档

> **版本**: 1.0  
> **创建日期**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **模块**: 买家模块前端接口对接

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

### 1.1 商品浏览
- 商品列表查询
- 商品详情查看
- 商品搜索和筛选

### 1.2 购物车管理
- 添加商品到购物车
- 购物车商品管理
- 购物车结算

### 1.3 订单管理
- 创建订单
- 订单列表查询
- 订单详情查看
- 订单状态更新
- 订单取消

### 1.4 其他功能
- 收货地址管理
- 优惠券使用
- 求购需求发布

---

## 2. 前端API需求

### 2.1 当前前端API (`api/buyer.ts`)

#### 2.1.1 已实现的接口
- ✅ `getBuyerProducts()` - 获取商品列表
- ✅ `getBuyerProductDetail()` - 获取商品详情
- ✅ `createBuyerOrder()` - 创建订单
- ✅ `getBuyerOrders()` - 获取订单列表
- ✅ `getBuyerOrderDetail()` - 获取订单详情
- ✅ `updateBuyerOrderStatus()` - 更新订单状态
- ✅ `cancelBuyerOrder()` - 取消订单

#### 2.1.2 接口实现状态
所有接口已在前端实现，但需要确认是否已正确对接后端。

---

## 3. 后端接口状态

### 3.1 已实现的后端接口

#### 3.1.1 商品管理接口
- ✅ `GET /api/buyer/products/list` - 获取商品列表
- ✅ `GET /api/buyer/products/{productId}` - 获取商品详情

#### 3.1.2 订单管理接口
- ✅ `POST /api/buyer/orders` - 创建订单
- ✅ `GET /api/buyer/orders` - 获取订单列表
- ✅ `GET /api/buyer/orders/{orderId}` - 获取订单详情
- ✅ `PUT /api/buyer/orders/{orderId}/status` - 更新订单状态
- ✅ `POST /api/buyer/orders/{orderId}/cancel` - 取消订单

---

## 4. 未实现接口列表

### 4.1 前端需要对接的接口

#### 4.1.1 购物车接口（后端未实现）

**说明**: 前端使用本地Store管理购物车，但后端可能需要购物车持久化功能。

**前端需求**:
- 购物车数据同步到后端
- 购物车数据从后端恢复

**建议后端接口**:
- `GET /api/buyer/cart` - 获取购物车
- `POST /api/buyer/cart/items` - 添加商品到购物车
- `PUT /api/buyer/cart/items/{itemId}` - 更新购物车商品数量
- `DELETE /api/buyer/cart/items/{itemId}` - 删除购物车商品
- `DELETE /api/buyer/cart` - 清空购物车

#### 4.1.2 收货地址接口（后端未实现）

**前端需求**:
- 收货地址列表查询
- 收货地址添加/编辑/删除
- 设置默认收货地址

**建议后端接口**:
- `GET /api/buyer/addresses` - 获取收货地址列表
- `POST /api/buyer/addresses` - 添加收货地址
- `PUT /api/buyer/addresses/{addressId}` - 更新收货地址
- `DELETE /api/buyer/addresses/{addressId}` - 删除收货地址
- `PUT /api/buyer/addresses/{addressId}/default` - 设置默认地址

#### 4.1.3 退款接口（后端未实现）

**前端需求**:
- 申请退款
- 查看退款进度
- 退款记录查询

**建议后端接口**:
- `POST /api/buyer/orders/{orderId}/refund` - 申请退款
- `GET /api/buyer/orders/{orderId}/refund` - 获取退款详情
- `GET /api/buyer/refunds` - 获取退款列表

---

## 5. 实现步骤

### 5.1 第一阶段：核心接口对接（P0）

#### 5.1.1 商品列表接口对接
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 确认前端 `getBuyerProducts()` 函数已正确调用后端接口
2. 验证请求参数格式
3. 验证响应数据格式
4. 处理分页逻辑

**前端代码检查**:
```typescript
// api/buyer.ts
export async function getBuyerProducts(
  params?: BuyerProductListParams
): Promise<BuyerProductListResponse> {
  // 确认路径是否正确: /buyer/products/list
  // 确认参数传递是否正确
  return get<BuyerProductListResponse>(endpoint);
}
```

#### 5.1.2 商品详情接口对接
**优先级**: P0  
**预计工作量**: 1小时

**步骤**:
1. 确认前端 `getBuyerProductDetail()` 函数已正确调用后端接口
2. 验证响应数据格式
3. 处理商品不存在的情况

#### 5.1.3 订单创建接口对接
**优先级**: P0  
**预计工作量**: 3小时

**步骤**:
1. 确认前端 `createBuyerOrder()` 函数已正确调用后端接口
2. 验证请求参数格式（订单项、收货地址等）
3. 处理库存不足、商品下架等异常情况
4. 订单创建成功后更新购物车

**前端代码检查**:
```typescript
// api/buyer.ts
export async function createBuyerOrder(
  request: CreateOrderRequest
): Promise<BuyerOrder> {
  // 确认路径: /buyer/orders
  // 确认请求体格式正确
  return post<BuyerOrder>('/buyer/orders', request);
}
```

#### 5.1.4 订单列表接口对接
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 确认前端 `getBuyerOrders()` 函数已正确调用后端接口
2. 验证状态筛选逻辑
3. 验证分页逻辑
4. 处理空列表情况

#### 5.1.5 订单详情接口对接
**优先级**: P0  
**预计工作量**: 1小时

**步骤**:
1. 确认前端 `getBuyerOrderDetail()` 函数已正确调用后端接口
2. 验证响应数据格式
3. 处理订单不存在的情况

#### 5.1.6 订单状态更新接口对接
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 确认前端 `updateBuyerOrderStatus()` 函数已正确调用后端接口
2. 验证状态流转规则
3. 处理状态更新失败的情况

#### 5.1.7 订单取消接口对接
**优先级**: P0  
**预计工作量**: 2小时

**步骤**:
1. 确认前端 `cancelBuyerOrder()` 函数已正确调用后端接口
2. 验证取消条件（如已发货的订单不能取消）
3. 处理取消失败的情况

### 5.2 第二阶段：购物车接口实现（P1）

#### 5.2.1 购物车后端接口实现
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 设计购物车数据库表
2. 创建购物车实体类
3. 实现购物车Repository
4. 实现购物车Service
5. 实现购物车Controller
6. 前端对接购物车接口

### 5.3 第三阶段：收货地址接口实现（P1）

#### 5.3.1 收货地址后端接口实现
**优先级**: P1  
**预计工作量**: 6小时

**步骤**:
1. 设计收货地址数据库表
2. 创建收货地址实体类
3. 实现收货地址Repository
4. 实现收货地址Service
5. 实现收货地址Controller
6. 前端对接收货地址接口

### 5.4 第四阶段：退款接口实现（P2）

#### 5.4.1 退款后端接口实现
**优先级**: P2  
**预计工作量**: 8小时

**步骤**:
1. 设计退款数据库表
2. 创建退款实体类
3. 实现退款Repository
4. 实现退款Service
5. 实现退款Controller
6. 前端对接退款接口

---

## 6. 接口对接说明

### 6.1 商品列表接口对接

#### 6.1.1 前端实现

**接口**: `GET /api/buyer/products/list`

**前端代码**:
```typescript
// api/buyer.ts
export async function getBuyerProducts(
  params?: BuyerProductListParams
): Promise<BuyerProductListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  if (params?.category) {
    queryParams.append('category', params.category);
  }
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.pageSize) {
    queryParams.append('pageSize', params.pageSize.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/buyer/products/list${queryString ? `?${queryString}` : ''}`;
  
  return get<BuyerProductListResponse>(endpoint);
}
```

**后端接口**: `GET /api/buyer/products/list?search={search}&category={category}&page={page}&pageSize={pageSize}`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "products": [
      {
        "id": "product-uuid",
        "name": "五常大米",
        "category": "粮食",
        "price": 58.00,
        "stock": 1000,
        "origin": "黑龙江五常",
        "description": "优质五常大米",
        "farmerId": "farmer-uuid",
        "farmerName": "张农户",
        "viewCount": 1250,
        "favoriteCount": 89,
        "shareCount": 23,
        "createdAt": "2025-01-01T10:00:00"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 6.2 商品详情接口对接

#### 6.2.1 前端实现

**接口**: `GET /api/buyer/products/{productId}`

**前端代码**:
```typescript
export async function getBuyerProductDetail(
  productId: string
): Promise<BuyerProductDetail> {
  return get<BuyerProductDetail>(`/buyer/products/${productId}`);
}
```

**后端接口**: `GET /api/buyer/products/{productId}`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "id": "product-uuid",
    "name": "五常大米",
    "category": "粮食",
    "price": 58.00,
    "stock": 1000,
    "origin": "黑龙江五常",
    "description": "优质五常大米",
    "farmerId": "farmer-uuid",
    "farmerName": "张农户",
    "farmerPhone": "138****1234",
    "viewCount": 1250,
    "favoriteCount": 89,
    "shareCount": 23,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-15T14:30:00"
  }
}
```

### 6.3 订单创建接口对接

#### 6.3.1 前端实现

**接口**: `POST /api/buyer/orders`

**前端代码**:
```typescript
export interface CreateOrderRequest {
  items: OrderItem[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
}

export async function createBuyerOrder(
  request: CreateOrderRequest
): Promise<BuyerOrder> {
  return post<BuyerOrder>('/buyer/orders', request);
}
```

**后端接口**: `POST /api/buyer/orders`

**请求体示例**:
```json
{
  "items": [
    {
      "productId": "product-uuid-1",
      "quantity": 2
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1
    }
  ],
  "shippingName": "张三",
  "shippingPhone": "13800138000",
  "shippingAddress": "北京市朝阳区xxx街道xxx号",
  "paymentMethod": "ALIPAY"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "订单创建成功",
  "data": {
    "id": "order-uuid",
    "buyerId": "buyer-uuid",
    "status": "pending",
    "totalAmount": 174.00,
    "shippingName": "张三",
    "shippingPhone": "13800138000",
    "shippingAddress": "北京市朝阳区xxx街道xxx号",
    "paymentMethod": "ALIPAY",
    "items": [
      {
        "id": "item-uuid-1",
        "productId": "product-uuid-1",
        "productName": "五常大米",
        "price": 58.00,
        "quantity": 2,
        "productImage": "https://example.com/image.jpg"
      }
    ],
    "createdAt": "2025-01-XX 10:00:00",
    "updatedAt": "2025-01-XX 10:00:00"
  }
}
```

### 6.4 订单列表接口对接

#### 6.4.1 前端实现

**接口**: `GET /api/buyer/orders?status={status}&page={page}&pageSize={pageSize}`

**前端代码**:
```typescript
export async function getBuyerOrders(
  params?: {
    status?: string;
    page?: number;
    pageSize?: number;
  }
): Promise<BuyerOrderListResponse> {
  const queryParams = new URLSearchParams();
  
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
  const endpoint = `/buyer/orders${queryString ? `?${queryString}` : ''}`;
  
  return get<BuyerOrderListResponse>(endpoint);
}
```

**后端接口**: `GET /api/buyer/orders?status={status}&page={page}&pageSize={pageSize}`

**响应示例**:
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "buyerId": "buyer-uuid",
        "status": "pending",
        "totalAmount": 174.00,
        "items": [...],
        "createdAt": "2025-01-XX 10:00:00"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

### 6.5 订单详情接口对接

#### 6.5.1 前端实现

**接口**: `GET /api/buyer/orders/{orderId}`

**前端代码**:
```typescript
export async function getBuyerOrderDetail(
  orderId: string
): Promise<BuyerOrder> {
  return get<BuyerOrder>(`/buyer/orders/${orderId}`);
}
```

**后端接口**: `GET /api/buyer/orders/{orderId}`

### 6.6 订单状态更新接口对接

#### 6.6.1 前端实现

**接口**: `PUT /api/buyer/orders/{orderId}/status`

**前端代码**:
```typescript
export interface UpdateOrderStatusRequest {
  status: string;
}

export async function updateBuyerOrderStatus(
  orderId: string,
  request: UpdateOrderStatusRequest
): Promise<void> {
  return put<void>(`/buyer/orders/${orderId}/status`, request);
}
```

**后端接口**: `PUT /api/buyer/orders/{orderId}/status`

**请求体示例**:
```json
{
  "status": "paid"
}
```

### 6.7 订单取消接口对接

#### 6.7.1 前端实现

**接口**: `POST /api/buyer/orders/{orderId}/cancel`

**前端代码**:
```typescript
export async function cancelBuyerOrder(
  orderId: string
): Promise<void> {
  return post<void>(`/buyer/orders/${orderId}/cancel`);
}
```

**后端接口**: `POST /api/buyer/orders/{orderId}/cancel`

---

## 7. DTO设计

### 7.1 前端DTO

#### 7.1.1 BuyerProduct
```typescript
export interface BuyerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  farmerId: string;
  farmerName: string;
  viewCount?: number;
  favoriteCount?: number;
  shareCount?: number;
  createdAt?: string;
}
```

#### 7.1.2 BuyerOrder
```typescript
export interface BuyerOrder {
  id: string;
  buyerId: string;
  status: string;
  totalAmount: number;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  refundStatus?: string;
  refundReason?: string;
  items: BuyerOrderItem[];
  createdAt: string;
  updatedAt: string;
}
```

#### 7.1.3 CreateOrderRequest
```typescript
export interface CreateOrderRequest {
  items: OrderItem[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  paymentMethod: string;
}
```

### 7.2 后端DTO

后端DTO已在 `com.agriverse.dto` 包中定义，前端需要确保类型匹配。

---

## 8. 实现优先级

### 8.1 高优先级（P0）

1. **商品列表接口对接**
   - 影响范围：商品浏览核心功能
   - 预计工作量：2小时
   - 依赖：无

2. **商品详情接口对接**
   - 影响范围：商品详情查看
   - 预计工作量：1小时
   - 依赖：无

3. **订单创建接口对接**
   - 影响范围：订单创建核心功能
   - 预计工作量：3小时
   - 依赖：商品详情接口

4. **订单列表接口对接**
   - 影响范围：订单管理核心功能
   - 预计工作量：2小时
   - 依赖：无

5. **订单详情接口对接**
   - 影响范围：订单详情查看
   - 预计工作量：1小时
   - 依赖：无

6. **订单状态更新接口对接**
   - 影响范围：订单状态管理
   - 预计工作量：2小时
   - 依赖：订单详情接口

7. **订单取消接口对接**
   - 影响范围：订单取消功能
   - 预计工作量：2小时
   - 依赖：订单详情接口

### 8.2 中优先级（P1）

8. **购物车接口实现**
   - 影响范围：购物车持久化
   - 预计工作量：6小时（后端实现）+ 2小时（前端对接）
   - 依赖：商品详情接口

9. **收货地址接口实现**
   - 影响范围：收货地址管理
   - 预计工作量：6小时（后端实现）+ 2小时（前端对接）
   - 依赖：无

### 8.3 低优先级（P2）

10. **退款接口实现**
    - 影响范围：退款功能
    - 预计工作量：8小时（后端实现）+ 3小时（前端对接）
    - 依赖：订单管理接口

---

## 9. 测试计划

### 9.1 单元测试

#### 9.1.1 前端API测试
- 测试商品列表接口调用
- 测试订单创建接口调用
- 测试异常情况处理

#### 9.1.2 接口响应测试
- 测试各种响应格式
- 测试错误处理
- 测试数据格式验证

### 9.2 集成测试

#### 9.2.1 端到端测试
1. **商品浏览流程**
   - 查看商品列表
   - 搜索商品
   - 查看商品详情
   - 加入购物车

2. **订单创建流程**
   - 从购物车创建订单
   - 填写收货地址
   - 选择支付方式
   - 提交订单
   - 查看订单详情

3. **订单管理流程**
   - 查看订单列表
   - 筛选订单状态
   - 查看订单详情
   - 取消订单
   - 更新订单状态

### 9.3 性能测试

- 大量商品列表查询性能
- 订单创建并发性能
- 购物车操作性能

---

## 10. 注意事项

### 10.1 数据一致性

- 订单创建时需要验证商品库存
- 订单创建时需要验证商品状态（是否上架）
- 订单取消时需要恢复商品库存
- 订单状态更新需要验证状态流转规则

### 10.2 异常处理

- 商品不存在时，返回友好提示
- 商品库存不足时，提示用户
- 商品已下架时，提示用户
- 订单状态不允许取消时，提示用户

### 10.3 权限控制

- 所有接口需要JWT认证
- 买家只能查看和操作自己的订单
- 订单详情需要验证订单归属

### 10.4 业务规则

- 订单状态流转：pending → paid → shipped → completed
- 只有pending状态的订单可以取消
- 订单创建后自动扣除商品库存
- 订单取消后自动恢复商品库存

### 10.5 性能优化

- 商品列表查询使用分页
- 订单列表查询使用分页
- 商品详情考虑缓存

### 10.6 安全考虑

- 收货地址信息加密存储
- 订单金额验证
- 防止重复提交订单

---

## 11. 扩展功能（后续实现）

### 11.1 购物车持久化

1. **后端购物车服务**
   - 购物车数据存储在数据库
   - 支持多设备同步
   - 购物车过期清理

2. **购物车功能增强**
   - 购物车商品数量限制
   - 购物车商品过期提醒
   - 购物车商品价格变化提醒

### 11.2 收货地址管理

1. **地址管理功能**
   - 地址列表管理
   - 地址编辑和删除
   - 默认地址设置
   - 地址验证

2. **地址选择优化**
   - 地址快速选择
   - 地址搜索
   - 地址地图选择

### 11.3 退款功能

1. **退款申请**
   - 退款原因选择
   - 退款金额计算
   - 退款凭证上传

2. **退款流程**
   - 退款审核
   - 退款进度跟踪
   - 退款到账通知

### 11.4 订单功能增强

1. **订单评价**
   - 商品评价
   - 服务评价
   - 评价图片上传

2. **订单分享**
   - 订单分享链接
   - 订单二维码

3. **订单统计**
   - 订单金额统计
   - 订单趋势分析

---

## 12. 接口汇总表

### 12.1 商品管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/buyer/products/list` | 获取商品列表 | ✅ 后端已实现 |
| GET | `/api/buyer/products/{productId}` | 获取商品详情 | ✅ 后端已实现 |

### 12.2 订单管理接口

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/buyer/orders` | 创建订单 | ✅ 后端已实现 |
| GET | `/api/buyer/orders` | 获取订单列表 | ✅ 后端已实现 |
| GET | `/api/buyer/orders/{orderId}` | 获取订单详情 | ✅ 后端已实现 |
| PUT | `/api/buyer/orders/{orderId}/status` | 更新订单状态 | ✅ 后端已实现 |
| POST | `/api/buyer/orders/{orderId}/cancel` | 取消订单 | ✅ 后端已实现 |

### 12.3 购物车接口（建议实现）

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/buyer/cart` | 获取购物车 | ❌ 后端未实现 |
| POST | `/api/buyer/cart/items` | 添加商品到购物车 | ❌ 后端未实现 |
| PUT | `/api/buyer/cart/items/{itemId}` | 更新购物车商品 | ❌ 后端未实现 |
| DELETE | `/api/buyer/cart/items/{itemId}` | 删除购物车商品 | ❌ 后端未实现 |
| DELETE | `/api/buyer/cart` | 清空购物车 | ❌ 后端未实现 |

### 12.4 收货地址接口（建议实现）

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| GET | `/api/buyer/addresses` | 获取收货地址列表 | ❌ 后端未实现 |
| POST | `/api/buyer/addresses` | 添加收货地址 | ❌ 后端未实现 |
| PUT | `/api/buyer/addresses/{addressId}` | 更新收货地址 | ❌ 后端未实现 |
| DELETE | `/api/buyer/addresses/{addressId}` | 删除收货地址 | ❌ 后端未实现 |
| PUT | `/api/buyer/addresses/{addressId}/default` | 设置默认地址 | ❌ 后端未实现 |

### 12.5 退款接口（建议实现）

| 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|
| POST | `/api/buyer/orders/{orderId}/refund` | 申请退款 | ❌ 后端未实现 |
| GET | `/api/buyer/orders/{orderId}/refund` | 获取退款详情 | ❌ 后端未实现 |
| GET | `/api/buyer/refunds` | 获取退款列表 | ❌ 后端未实现 |

---

## 13. 前端实现检查清单

### 13.1 商品管理模块

- [x] 实现获取商品列表接口
- [x] 实现获取商品详情接口
- [ ] 验证接口调用是否正确
- [ ] 验证错误处理是否完善
- [ ] 验证分页逻辑是否正确

### 13.2 订单管理模块

- [x] 实现创建订单接口
- [x] 实现获取订单列表接口
- [x] 实现获取订单详情接口
- [x] 实现更新订单状态接口
- [x] 实现取消订单接口
- [ ] 验证接口调用是否正确
- [ ] 验证订单状态流转是否正确
- [ ] 验证异常情况处理

### 13.3 购物车模块

- [x] 实现本地购物车Store（Zustand）
- [ ] 对接后端购物车接口（待后端实现）
- [ ] 实现购物车数据同步
- [ ] 实现购物车数据恢复

### 13.4 收货地址模块

- [ ] 实现收货地址列表接口（待后端实现）
- [ ] 实现收货地址添加接口（待后端实现）
- [ ] 实现收货地址编辑接口（待后端实现）
- [ ] 实现收货地址删除接口（待后端实现）
- [ ] 实现默认地址设置接口（待后端实现）

### 13.5 退款模块

- [ ] 实现申请退款接口（待后端实现）
- [ ] 实现退款详情查询接口（待后端实现）
- [ ] 实现退款列表查询接口（待后端实现）

---

## 14. 常见问题

### 14.1 接口调用问题

**Q: 商品列表接口返回空数据？**  
A: 检查筛选条件是否正确，确认商品是否已上架。

**Q: 订单创建失败？**  
A: 检查商品库存是否充足，商品是否已下架，收货地址是否完整。

**Q: 订单状态更新失败？**  
A: 检查订单状态流转规则，确认当前状态是否允许更新到目标状态。

### 14.2 数据格式问题

**Q: 订单金额计算不正确？**  
A: 前端需要根据商品价格和数量计算，但最终金额以后端返回为准。

**Q: 订单状态枚举值不匹配？**  
A: 确认前后端状态枚举值一致，建议使用常量定义。

### 14.3 业务逻辑问题

**Q: 已发货的订单可以取消吗？**  
A: 不可以，只有pending状态的订单可以取消。

**Q: 订单取消后库存会恢复吗？**  
A: 会，后端会自动恢复商品库存。

**Q: 购物车数据会丢失吗？**  
A: 当前使用本地Store，刷新页面会丢失。建议实现后端购物车接口进行持久化。

---

## 15. 代码示例

### 15.1 商品列表页面使用示例

```typescript
// roles/buyer/pages/ProductList.tsx
import { getBuyerProducts } from '../../../api/buyer';
import { useState, useEffect } from 'react';

export default function BuyerProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getBuyerProducts({
        page: 1,
        pageSize: 20
      });
      setProducts(response.products);
    } catch (error) {
      toast.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### 15.2 订单创建使用示例

```typescript
// roles/buyer/pages/Cart.tsx
import { createBuyerOrder } from '../../../api/buyer';
import { useCartStore } from '../../../stores/cartStore';

export default function BuyerCart() {
  const { items, totalAmount, checkout } = useCartStore();

  const handleCheckout = async () => {
    try {
      const order = await createBuyerOrder({
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingName: '张三',
        shippingPhone: '13800138000',
        shippingAddress: '北京市朝阳区xxx街道xxx号',
        paymentMethod: 'ALIPAY'
      });
      
      await checkout();
      toast.success('订单创建成功');
      navigateToSubRoute('trade', `order-detail?id=${order.id}`);
    } catch (error) {
      toast.error('订单创建失败');
    }
  };

  return (
    <Button onClick={handleCheckout}>
      结算 (¥{totalAmount})
    </Button>
  );
}
```

### 15.3 订单列表使用示例

```typescript
// roles/buyer/pages/Orders.tsx
import { getBuyerOrders } from '../../../api/buyer';
import { useState, useEffect } from 'react';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, [status]);

  const loadOrders = async () => {
    try {
      const response = await getBuyerOrders({
        status: status !== 'all' ? status : undefined,
        page: 1,
        pageSize: 20
      });
      setOrders(response.orders);
    } catch (error) {
      toast.error('获取订单列表失败');
    }
  };

  return (
    <div>
      <FilterPanel 
        value={status} 
        onChange={setStatus}
        options={[
          { value: 'all', label: '全部' },
          { value: 'pending', label: '待支付' },
          { value: 'paid', label: '已支付' },
          { value: 'shipped', label: '已发货' },
          { value: 'completed', label: '已完成' }
        ]}
      />
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

---

## 16. 后续开发规划

### 16.1 短期计划（1-2周）

#### 16.1.1 接口对接验证（P0）
- [ ] **商品接口对接验证**
  - 验证商品列表接口调用是否正确
  - 验证商品详情接口调用是否正确
  - 测试分页和筛选功能

- [ ] **订单接口对接验证**
  - 验证订单创建接口调用是否正确
  - 验证订单列表接口调用是否正确
  - 验证订单状态更新接口调用是否正确
  - 测试异常情况处理

#### 16.1.2 购物车功能（P1）
- [ ] **购物车后端接口实现**
  - 设计购物车数据库表
  - 实现购物车后端接口
  - 前端对接购物车接口
  - 实现购物车数据同步

#### 16.1.3 收货地址功能（P1）
- [ ] **收货地址后端接口实现**
  - 设计收货地址数据库表
  - 实现收货地址后端接口
  - 前端对接收货地址接口
  - 实现地址管理页面

### 16.2 中期计划（1个月）

#### 16.2.1 退款功能
- [ ] **退款后端接口实现**
  - 设计退款数据库表
  - 实现退款申请接口
  - 实现退款进度查询接口
  - 前端对接退款接口

#### 16.2.2 求购功能
- [ ] **求购需求管理**
  - 实现求购需求发布接口
  - 实现求购需求列表查询
  - 实现报价管理功能
  - 实现求购需求详情页面

#### 16.2.3 商品评价功能
- [ ] **评价系统**
  - 实现商品评价接口
  - 实现评价列表查询
  - 实现评价图片上传
  - 实现评价管理页面

### 16.3 长期计划（3个月）

#### 16.3.1 高级功能
- [ ] **商品对比功能**
  - 实现商品对比接口
  - 实现对比篮功能
  - 实现对比页面

- [ ] **智能推荐**
  - 基于购买历史的商品推荐
  - 基于浏览历史的商品推荐
  - 实现推荐算法

#### 16.3.2 移动端优化
- [ ] **移动端适配**
  - 优化移动端购物流程
  - 实现移动端手势操作
  - 优化移动端性能

#### 16.3.3 性能优化
- [ ] **接口性能优化**
  - 实现接口缓存机制
  - 优化大数据量查询性能
  - 实现虚拟滚动（长列表）

---

**文档结束**

> 本文档会随着开发进度持续更新，请定期查看最新版本。  
> 最后更新：2025-01-XX