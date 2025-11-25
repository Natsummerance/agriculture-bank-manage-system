# AgriVerse 后端服务

## 项目概述

这是 AgriVerse 农业产品融销平台的后端服务，基于 Spring Boot 3.2.0 和 Java 21 构建。包含认证模块和农户商品管理模块。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **安全**: Spring Security 6.x + JWT (JSON Web Token)
- **数据库**: MySQL 8.0 (开发测试使用 H2)
- **ORM**: Spring Data JPA + Hibernate
- **JWT库**: io.jsonwebtoken 0.12.5
- **构建工具**: Maven 3.8+
- **Java版本**: JDK 21+

## 项目结构

```
backend/
├── src/main/java/com/agriverse/
│   ├── auth/                 # 认证模块
│   │   ├── controller/       # 认证控制器
│   │   ├── service/          # 业务逻辑层
│   │   └── repository/       # 数据访问层
│   ├── farmer/               # 农户模块
│   │   ├── controller/       # 农户商品控制器
│   │   ├── service/          # 农户商品服务
│   │   └── repository/       # 农户商品数据访问层
│   ├── buyer/                # 买家模块
│   │   ├── controller/       # 买家商品和订单控制器
│   │   ├── service/          # 买家商品和订单服务
│   │   └── repository/       # 买家订单数据访问层
│   ├── entity/               # JPA 实体类
│   │   ├── User.java         # 用户实体
│   │   ├── VerificationCode.java  # 验证码实体
│   │   ├── FarmerProduct.java      # 农户商品实体
│   │   ├── BuyerOrder.java         # 买家订单实体
│   │   └── BuyerOrderItem.java     # 买家订单项实体
│   ├── dto/                  # 数据传输对象
│   ├── config/               # 配置类（安全、JWT等）
│   ├── util/                 # 工具类（JWT提供者等）
│   └── AgriverseAuthApplication.java  # 主启动类
├── src/main/resources/
│   └── application.yml       # 应用配置文件
├── pom.xml                   # Maven 依赖配置
└── README.md                 # 项目说明文档
```

## 快速开始

### 前置条件

- JDK 21 或更高版本
- Maven 3.8 或更高版本
- MySQL 8.0 (可选，开发时可使用 H2 内存数据库)

### 安装步骤

1. **克隆或下载项目**

```bash
cd backend
```

2. **使用 Maven 构建**

```bash
mvn clean install
```

3. **配置数据库** (可选)

编辑 `src/main/resources/application.yml`，配置 MySQL 连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/agriverse
    username: root
    password: your_password
```

4. **运行应用**

```bash
mvn spring-boot:run
```

或者使用开发环境配置（使用 H2 内存数据库）：

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

应用将在 `http://localhost:8080` 上运行，API 前缀为 `/api`。

## API 接口文档

### 1. 用户登录

**请求**
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "password123",
  "role": "farmer"
}
```

**响应**
```json
{
  "code": 0,
  "message": "登录成功",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "expiresIn": 86400000,
    "user": {
      "id": "uuid",
      "phone": "13800138000",
      "name": "张三",
      "role": "FARMER",
      "email": "user@example.com",
      "createdAt": "2025-01-01 10:00:00",
      "updatedAt": "2025-01-01 10:00:00"
    }
  }
}
```

### 2. 用户注册

**请求**
```
POST /api/auth/register
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456",
  "password": "password123",
  "role": "farmer",
  "name": "张三",
  "email": "user@example.com",
  "company": "某农业有限公司",
  "location": "河北省石家庄市"
}
```

**响应**
```json
{
  "code": 0,
  "message": "注册成功",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "expiresIn": 86400000,
    "user": { ... }
  }
}
```

### 3. 发送验证码

**请求**
```
POST /api/auth/send-code
Content-Type: application/json

{
  "phone": "13800138000",
  "type": "register",
  "role": "farmer"
}
```

**响应**
```json
{
  "code": 0,
  "message": "验证码已发送",
  "success": true,
  "data": {
    "success": true,
    "message": "验证码已发送",
    "expiresIn": 600
  }
}
```

### 4. 验证验证码

**请求**
```
POST /api/auth/verify-code
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456",
  "type": "register"
}
```

**响应**
```json
{
  "code": 0,
  "message": "验证成功",
  "success": true,
  "data": {
    "valid": true,
    "message": "验证码有效"
  }
}
```

### 5. 刷新令牌

**请求**
```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzUxMiJ9..."
}
```

**响应**
```json
{
  "code": 0,
  "message": "令牌刷新成功",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "refreshToken": "eyJhbGciOiJIUzUxMiJ9...",
    "expiresIn": 86400000
  }
}
```

### 6. 获取当前用户信息

**请求**
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": {
    "id": "uuid",
    "phone": "13800138000",
    "name": "张三",
    "role": "FARMER",
    "email": "user@example.com",
    "createdAt": "2025-01-01 10:00:00",
    "updatedAt": "2025-01-01 10:00:00"
  }
}
```

### 7. 重置密码

**请求**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "phone": "13800138000",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**响应**
```json
{
  "code": 0,
  "message": "密码重置成功",
  "success": true,
  "data": {
    "success": true,
    "message": "密码重置成功"
  }
}
```

### 8. 检查手机号是否存在

**请求**
```
GET /api/auth/check-phone?phone=13800138000&role=farmer
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": {
    "exists": true
  }
}
```

### 9. 登出

**请求**
```
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**响应**
```json
{
  "code": 0,
  "message": "登出成功",
  "success": true,
  "data": null
}
```

### 10. 健康检查

**请求**
```
GET /api/auth/health
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": "OK"
}
```

## 农户商品管理 API

### 1. 获取商品列表

**请求**
```
GET /api/farmer/products/list?search=大米&status=on&page=1&pageSize=20
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**查询参数**:
- `search` (可选): 搜索关键词（商品名称或产地）
- `status` (可选): 状态筛选，可选值：`all`（全部）、`on`（已上架）、`off`（已下架），默认 `all`
- `page` (可选): 页码，从1开始，默认 `1`
- `pageSize` (可选): 每页数量，默认 `20`

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "五常大米",
        "category": "粮食",
        "price": 58.00,
        "stock": 1000,
        "origin": "黑龙江五常",
        "description": "优质五常大米",
        "status": "on",
        "viewCount": 1250,
        "favoriteCount": 89,
        "shareCount": 23,
        "createdAt": "2025-01-01T10:00:00",
        "updatedAt": "2025-01-15T14:30:00"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 20
  }
}
```

### 2. 创建商品

**请求**
```
POST /api/farmer/products/create
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

{
  "name": "五常大米",
  "category": "粮食",
  "price": 58,
  "stock": 1000,
  "origin": "黑龙江五常",
  "description": "优质五常大米"
}
```

**请求体参数**:
- `name` (必需): 商品名称，最长200字符
- `category` (必需): 商品类别，最长100字符
- `price` (必需): 商品价格，必须大于0
- `stock` (必需): 库存数量，不能为负
- `origin` (必需): 产地信息，最长200字符
- `description` (可选): 图文详情，最长4000字符

**响应**
```json
{
  "code": 0,
  "message": "商品创建成功",
  "success": true,
  "data": {
    "id": "uuid",
    "name": "五常大米",
    "category": "粮食",
    "price": 58,
    "stock": 1000,
    "origin": "黑龙江五常",
    "description": "优质五常大米",
    "status": "off",
    "viewCount": 0,
    "favoriteCount": 0,
    "shareCount": 0,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-01T10:00:00"
  }
}
```

### 3. 商品上下架

**请求**
```
POST /api/farmer/products/toggle-status
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

{
  "productId": "uuid",
  "status": "on"
}
```

**请求体参数**:
- `productId` (必需): 商品ID
- `status` (必需): 目标状态，`on`（上架）或 `off`（下架）

**响应**
```json
{
  "code": 0,
  "message": "商品已上架",
  "success": true,
  "data": null
}
```

### 4. 获取商品数据看板

**请求**
```
GET /api/farmer/products/dashboard
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "totalView": 12500,
    "totalFavorite": 890,
    "totalShare": 230,
    "avgView": 1250,
    "topProducts": [
      {
        "id": "uuid",
        "name": "五常大米",
        "viewCount": 3500,
        "favoriteCount": 250,
        "shareCount": 80
      }
    ],
    "trendData": [
      {
        "name": "近6天前",
        "value": 20
      },
      {
        "name": "近5天前",
        "value": 35
      },
      {
        "name": "近4天前",
        "value": 42
      },
      {
        "name": "近3天前",
        "value": 38
      },
      {
        "name": "近2天前",
        "value": 50
      },
      {
        "name": "昨天",
        "value": 50
      },
      {
        "name": "今天",
        "value": 60
      }
    ]
  }
}
```

### 4. 农户商品健康检查

**请求**
```
GET /api/farmer/products/health
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": "OK"
}
```

## 买家商品市场 API

### 1. 获取商品列表（买家市场）

**请求**
```
GET /api/buyer/products/list?search=大米&category=粮食&page=1&pageSize=20
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**查询参数**:
- `search` (可选): 搜索关键词（商品名称或产地）
- `category` (可选): 类别筛选
- `page` (可选): 页码，从1开始，默认 `1`
- `pageSize` (可选): 每页数量，默认 `20`

**说明**: 此接口仅返回状态为"已上架"的商品，供买家浏览和购买。

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "五常大米",
        "category": "粮食",
        "price": 58.00,
        "stock": 1000,
        "origin": "黑龙江五常",
        "description": "优质五常大米",
        "farmerId": "farmer-uuid",
        "farmerName": "张三",
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

### 2. 获取商品详情

**请求**
```
GET /api/buyer/products/{productId}
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**路径参数**:
- `productId` (必需): 商品ID

**说明**: 访问商品详情时会自动增加浏览量。

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "id": "uuid",
    "name": "五常大米",
    "category": "粮食",
    "price": 58.00,
    "stock": 1000,
    "origin": "黑龙江五常",
    "description": "优质五常大米，颗粒饱满，口感香甜",
    "farmerId": "farmer-uuid",
    "farmerName": "张三",
    "farmerPhone": "13800138000",
    "viewCount": 1251,
    "favoriteCount": 89,
    "shareCount": 23,
    "createdAt": "2025-01-01T10:00:00",
    "updatedAt": "2025-01-15T14:30:00"
  }
}
```

### 3. 买家商品健康检查

**请求**
```
GET /api/buyer/products/health
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": "OK"
}
```

## 买家订单管理 API

### 1. 创建订单

**请求**
```
POST /api/buyer/orders
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

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
  "shippingName": "李四",
  "shippingPhone": "13900139000",
  "shippingAddress": "四川省成都市武侯区天府大道中段1号",
  "paymentMethod": "alipay"
}
```

**请求体参数**:
- `items` (必需): 订单项数组
  - `productId` (必需): 商品ID
  - `quantity` (必需): 购买数量，必须大于0
- `shippingName` (必需): 收货人姓名
- `shippingPhone` (必需): 收货人手机号
- `shippingAddress` (必需): 收货地址
- `paymentMethod` (必需): 支付方式（如：alipay, wechat, bank等）

**说明**: 
- 创建订单时会自动检查商品是否已上架
- 自动检查库存是否充足
- 订单创建成功后会自动扣减商品库存
- 订单初始状态为 `pending`（待支付）

**响应**
```json
{
  "code": 0,
  "message": "订单创建成功",
  "success": true,
  "data": {
    "id": "order-uuid",
    "buyerId": "buyer-uuid",
    "status": "pending",
    "totalAmount": 176.00,
    "shippingName": "李四",
    "shippingPhone": "13900139000",
    "shippingAddress": "四川省成都市武侯区天府大道中段1号",
    "paymentMethod": "alipay",
    "items": [
      {
        "id": "item-uuid-1",
        "productId": "product-uuid-1",
        "productName": "五常大米",
        "price": 58.00,
        "quantity": 2,
        "productImage": null
      },
      {
        "id": "item-uuid-2",
        "productId": "product-uuid-2",
        "productName": "生态鸡蛋",
        "price": 60.00,
        "quantity": 1,
        "productImage": null
      }
    ],
    "createdAt": "2025-01-20T10:00:00",
    "updatedAt": "2025-01-20T10:00:00"
  }
}
```

### 2. 获取订单列表

**请求**
```
GET /api/buyer/orders?status=pending&page=1&pageSize=20
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**查询参数**:
- `status` (可选): 订单状态筛选，可选值：`all`（全部）、`pending`（待支付）、`paid`（已支付）、`to-ship`（待发货）、`shipped`（已发货）、`completed`（已完成）、`refunding`（退款中）、`refunded`（已退款）、`cancelled`（已取消），默认 `all`
- `page` (可选): 页码，从1开始，默认 `1`
- `pageSize` (可选): 每页数量，默认 `20`

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order-uuid",
        "buyerId": "buyer-uuid",
        "status": "pending",
        "totalAmount": 176.00,
        "shippingName": "李四",
        "shippingPhone": "13900139000",
        "shippingAddress": "四川省成都市武侯区天府大道中段1号",
        "paymentMethod": "alipay",
        "items": [...],
        "createdAt": "2025-01-20T10:00:00",
        "updatedAt": "2025-01-20T10:00:00"
      }
    ],
    "total": 10,
    "page": 1,
    "pageSize": 20
  }
}
```

### 3. 获取订单详情

**请求**
```
GET /api/buyer/orders/{orderId}
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**路径参数**:
- `orderId` (必需): 订单ID

**说明**: 只能查询当前登录买家的订单。

**响应**
```json
{
  "code": 0,
  "message": "获取成功",
  "success": true,
  "data": {
    "id": "order-uuid",
    "buyerId": "buyer-uuid",
    "status": "pending",
    "totalAmount": 176.00,
    "shippingName": "李四",
    "shippingPhone": "13900139000",
    "shippingAddress": "四川省成都市武侯区天府大道中段1号",
    "paymentMethod": "alipay",
    "items": [...],
    "createdAt": "2025-01-20T10:00:00",
    "updatedAt": "2025-01-20T10:00:00"
  }
}
```

### 4. 更新订单状态

**请求**
```
PUT /api/buyer/orders/{orderId}/status
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
Content-Type: application/json

{
  "status": "paid"
}
```

**路径参数**:
- `orderId` (必需): 订单ID

**请求体参数**:
- `status` (必需): 目标订单状态

**说明**: 用于更新订单状态，如将订单从 `pending` 更新为 `paid`。

**响应**
```json
{
  "code": 0,
  "message": "订单状态已更新",
  "success": true,
  "data": null
}
```

### 5. 取消订单

**请求**
```
POST /api/buyer/orders/{orderId}/cancel
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**路径参数**:
- `orderId` (必需): 订单ID

**说明**: 
- 只能取消状态为 `pending`（待支付）或 `paid`（已支付）的订单
- 取消订单时会自动恢复商品库存

**响应**
```json
{
  "code": 0,
  "message": "订单已取消",
  "success": true,
  "data": null
}
```

### 6. 买家订单健康检查

**请求**
```
GET /api/buyer/orders/health
```

**响应**
```json
{
  "code": 0,
  "message": "操作成功",
  "success": true,
  "data": "OK"
}
```

## JWT 认证机制

### 认证流程

1. **用户登录/注册**：前端调用 `/api/auth/login` 或 `/api/auth/register`，后端返回 JWT Token
2. **前端存储Token**：前端将 Token 存储在 `localStorage` 中（key: `auth_token`）
3. **请求携带Token**：前端在每次API请求的 `Authorization` header 中携带 Token：
   ```
   Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
   ```
4. **后端验证Token**：`JwtAuthenticationFilter` 拦截请求，验证 Token 有效性
5. **设置认证上下文**：验证通过后，将用户ID设置到 Spring Security 上下文

### JWT Token 结构

JWT Token 包含以下信息：
- **Subject (sub)**: 用户ID
- **Claims**:
  - `phone`: 用户手机号
  - `role`: 用户角色（FARMER, BUYER, BANK, EXPERT, ADMIN）
  - `type`: 令牌类型（access/refresh）

### Token 配置

在 `application.yml` 中配置：
```yaml
jwt:
  secret: your-secret-key  # JWT签名密钥（生产环境必须使用强密钥，至少32字符）
  expiration: 86400000     # 访问令牌过期时间（毫秒，默认24小时）
  refresh-expiration: 604800000  # 刷新令牌过期时间（毫秒，默认7天）
```

### 安全特性

- ✅ **Token签名验证**：使用 HMAC-SHA512 算法签名，防止Token被篡改
- ✅ **Token过期机制**：访问令牌24小时过期，刷新令牌7天过期
- ✅ **无状态认证**：使用JWT实现无状态认证，无需服务器端Session存储
- ✅ **权限控制**：使用 `@PreAuthorize("isAuthenticated()")` 注解保护需要认证的接口
- ✅ **CORS支持**：已配置跨域资源共享，支持前端跨域请求

### 前端集成示例

前端API客户端（`api/client.ts`）自动处理Token：

```typescript
// 自动从localStorage获取token并添加到请求头
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return {};
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
}
```

## 错误响应

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权/认证失败（Token无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 409 | 资源冲突（如手机号已被注册） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 错误响应示例

```json
{
  "code": 409,
  "message": "该手机号已被注册",
  "success": false
}
```

## 环境变量配置

在 `application.yml` 中可配置以下内容：

```yaml
# JWT 配置
jwt:
  secret: your-secret-key  # JWT 签名密钥（生产环境应使用强密钥，至少32字符）
  expiration: 86400000     # 访问令牌过期时间（毫秒，24小时）
  refresh-expiration: 604800000  # 刷新令牌过期时间（毫秒，7天）

# 验证码配置
verification-code:
  expiration: 600  # 验证码过期时间（秒）
  max-attempts: 5  # 最大验证尝试次数
  cooldown-period: 60  # 验证码冷却期（秒）

# 数据库配置
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/agriverse
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update  # 开发环境使用update，生产环境使用validate
    show-sql: true      # 开发环境显示SQL，生产环境设为false

# 服务器配置
server:
  port: 8080
  servlet:
    context-path: /api
```

## 数据库表结构

### 用户表 (users)
- `id`: UUID主键
- `phone`: 手机号（唯一索引）
- `password`: 加密密码
- `name`: 姓名
- `email`: 邮箱（唯一索引）
- `role`: 用户角色（FARMER, BUYER, BANK, EXPERT, ADMIN）
- `enabled`: 是否启用
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 验证码表 (verification_codes)
- `id`: UUID主键
- `phone`: 手机号
- `code`: 验证码
- `type`: 类型（register, login, reset）
- `expiredAt`: 过期时间
- `createdAt`: 创建时间

### 农户商品表 (farmer_products)
- `id`: UUID主键
- `farmerId`: 农户ID（索引）
- `name`: 商品名称（索引）
- `category`: 类别（索引）
- `price`: 价格
- `stock`: 库存
- `origin`: 产地
- `description`: 商品描述
- `status`: 状态（ON-已上架, OFF-已下架，索引）
- `viewCount`: 浏览量
- `favoriteCount`: 收藏数
- `shareCount`: 分享数
- `createdAt`: 创建时间
- `updatedAt`: 更新时间

### 买家订单表 (buyer_orders)
- `id`: UUID主键
- `buyerId`: 买家ID（索引）
- `status`: 订单状态（PENDING-待支付, PAID-已支付, TO_SHIP-待发货, SHIPPED-已发货, COMPLETED-已完成, REFUNDING-退款中, REFUNDED-已退款, CANCELLED-已取消，索引）
- `totalAmount`: 订单总金额
- `shippingName`: 收货人姓名
- `shippingPhone`: 收货人手机号
- `shippingAddress`: 收货地址
- `paymentMethod`: 支付方式
- `refundStatus`: 退款状态（PENDING-待卖家处理, APPROVED-卖家已同意, REJECTED-卖家已拒绝, ESCALATED-已申请平台仲裁, SUCCESS-平台已判定退款成功, FAILED-平台已判定退款失败）
- `refundReason`: 退款原因
- `createdAt`: 创建时间（索引）
- `updatedAt`: 更新时间

### 买家订单项表 (buyer_order_items)
- `id`: UUID主键
- `orderId`: 订单ID（外键，索引）
- `productId`: 商品ID（索引）
- `productName`: 商品名称（冗余字段，便于查询）
- `price`: 商品单价（下单时的价格，防止商品价格变动影响历史订单）
- `quantity`: 购买数量
- `productImage`: 商品图片URL（可选）

## 生产部署

### 1. 修改 JWT 密钥

在生产环境中，**必须**修改 JWT 密钥为强密钥（至少32字符）：

```yaml
jwt:
  secret: your-very-secure-secret-key-with-at-least-32-characters-random-string
```

**⚠️ 警告**：不要使用默认密钥，必须生成随机强密钥！

### 2. 使用真实数据库

配置 MySQL 数据库连接，并设置 `ddl-auto` 为 `validate`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-mysql-host:3306/agriverse?useSSL=true&serverTimezone=Asia/Shanghai
    username: your-username
    password: your-password
  jpa:
    hibernate:
      ddl-auto: validate  # 生产环境使用validate，不自动创建表
    show-sql: false       # 生产环境关闭SQL日志
```

### 3. 启用 HTTPS

建议在生产环境中启用 HTTPS，修改 application.yml：

```yaml
server:
  ssl:
    key-store: /path/to/keystore.jks
    key-store-password: your-password
    key-store-type: JKS
```

### 4. 集成短信服务

在 `SmsService` 中集成真实的短信服务商 API，如阿里云、腾讯云等。

### 5. 构建 Docker 镜像

```bash
docker build -t agriverse-auth:latest .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod agriverse-auth:latest
```

## 测试

运行单元测试：

```bash
mvn test
```

## 模块说明

### 认证模块 (auth)
- 用户注册、登录、登出
- 验证码发送和验证
- 密码重置
- JWT Token 生成和刷新
- 用户信息查询

### 农户商品管理模块 (farmer)
- 商品列表查询（支持搜索和状态筛选）
- 商品上下架操作
- 商品数据看板统计

### 买家商品市场模块 (buyer)
- 商品列表查询（仅显示已上架商品，支持搜索和分类筛选）
- 商品详情查看（自动增加浏览量）
- 商品信息展示（包含农户信息）

### 买家订单管理模块 (buyer)
- 订单创建（自动检查商品状态和库存，自动扣减库存）
- 订单列表查询（支持状态筛选和分页）
- 订单详情查询
- 订单状态更新
- 订单取消（自动恢复库存）

## 常见问题

### Q: 如何修改端口？
A: 在 `application.yml` 中修改：
```yaml
server:
  port: 8081
```

### Q: 如何启用数据库日志？
A: 在 `application.yml` 中修改：
```yaml
logging:
  level:
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

### Q: 如何使用开发环境的 H2 数据库？
A: 运行时指定 profile：
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Q: Token 过期后如何处理？
A: 前端应捕获 401 错误，调用 `/api/auth/refresh` 接口刷新 Token，或引导用户重新登录。

### Q: 如何确保只能操作自己的商品？
A: 后端通过 `Principal` 获取当前登录用户ID，在 Service 层验证 `farmerId` 是否匹配，确保用户只能操作自己的商品。

### Q: 商品数据看板的趋势数据是真实的吗？
A: 当前版本的趋势数据是模拟生成的。实际项目中应建立统计数据表，记录每日的浏览量、收藏量等数据，从统计数据表查询真实趋势。

### Q: 买家如何查看所有农户发布的商品？
A: 买家通过 `/api/buyer/products/list` 接口可以查看所有状态为"已上架"的商品。此接口会自动过滤掉已下架的商品。

### Q: 创建订单时如何保证库存一致性？
A: 订单创建时会在事务中完成以下操作：
1. 检查商品是否已上架
2. 检查库存是否充足
3. 创建订单和订单项
4. 扣减商品库存
如果任何一步失败，整个事务会回滚，保证数据一致性。

### Q: 取消订单时库存如何恢复？
A: 取消订单时，系统会遍历订单中的所有商品，将购买数量加回到商品库存中。只有状态为 `pending` 或 `paid` 的订单可以取消。

### Q: 订单状态有哪些？
A: 订单状态包括：
- `pending`: 待支付
- `paid`: 已支付
- `to-ship`: 待发货
- `shipped`: 已发货
- `completed`: 已完成
- `refunding`: 退款中
- `refunded`: 已退款
- `cancelled`: 已取消

## 许可证

MIT License

## 支持

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至 support@agriverse.com
