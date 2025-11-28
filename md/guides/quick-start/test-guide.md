# 功能性测试指南

## 服务启动状态检查

### 1. 数据库检查
- **MySQL配置**: localhost:3306/agriverse
- **用户名**: root
- **密码**: Tdl@3731
- **检查方法**: 
  ```powershell
  # 检查MySQL服务是否运行
  Get-Service -Name "*mysql*" | Select-Object Name, Status
  ```

### 2. 后端服务检查
- **端口**: 8080
- **API基础路径**: http://localhost:8080/api
- **健康检查**: http://localhost:8080/api/auth/health
- **检查方法**:
  ```powershell
  # 检查端口是否被占用
  netstat -ano | findstr ":8080"
  
  # 测试健康检查接口
  Invoke-WebRequest -Uri "http://localhost:8080/api/auth/health" -Method GET
  ```

### 3. 前端服务检查
- **端口**: 5173
- **访问地址**: http://localhost:5173
- **检查方法**:
  ```powershell
  # 检查端口是否被占用
  netstat -ano | findstr ":5173"
  
  # 测试前端页面
  Invoke-WebRequest -Uri "http://localhost:5173" -Method GET
  ```

## 启动服务步骤

### 步骤1: 启动数据库
如果MySQL未运行,请启动MySQL服务:
```powershell
# Windows服务方式
Start-Service -Name "MySQL80"  # 根据实际服务名调整

# 或使用MySQL Workbench启动
```

### 步骤2: 启动后端服务
在 `backend` 目录下执行:
```powershell
cd backend
mvn spring-boot:run
# 或使用IDE运行 AgriverseAuthApplication.java
```

等待看到以下日志表示启动成功:
```
Started AgriverseAuthApplication in X.XXX seconds
```

### 步骤3: 启动前端服务
在项目根目录执行:
```powershell
npm run dev
```

等待看到以下输出:
```
  VITE v6.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 功能性测试清单

### 1. 认证功能测试

#### 1.1 健康检查
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/health" -Method GET
```
**预期结果**: 返回 `{"code":0,"message":"操作成功","success":true,"data":"OK"}`

#### 1.2 发送验证码
```powershell
$body = @{
    phone = "13800138000"
    type = "register"
    role = "farmer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/send-code" -Method POST -Body $body -ContentType "application/json"
```
**预期结果**: 返回成功消息

#### 1.3 用户注册
```powershell
$body = @{
    phone = "13800138000"
    code = "123456"
    password = "password123"
    role = "farmer"
    name = "测试农户"
    email = "test@example.com"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $body -ContentType "application/json"
$response.Content
```
**预期结果**: 返回token和用户信息

#### 1.4 用户登录
```powershell
$body = @{
    phone = "13800138000"
    password = "password123"
    role = "farmer"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = ($response.Content | ConvertFrom-Json).data.token
Write-Host "Token: $token"
```
**预期结果**: 返回token和用户信息

#### 1.5 获取当前用户信息 (需要token)
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-WebRequest -Uri "http://localhost:8080/api/auth/me" -Method GET -Headers $headers
```
**预期结果**: 返回当前登录用户信息

### 2. 农户商品管理测试

#### 2.1 创建商品 (需要登录)
```powershell
$body = @{
    name = "测试商品"
    category = "粮食"
    price = 58.00
    stock = 1000
    origin = "测试产地"
    description = "这是一个测试商品"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/farmer/products/create" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```
**预期结果**: 返回创建的商品信息

#### 2.2 获取商品列表
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/farmer/products/list" -Method GET -Headers $headers
```
**预期结果**: 返回商品列表

#### 2.3 商品上下架
```powershell
$body = @{
    productId = "商品ID"
    status = "on"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/farmer/products/toggle-status" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```
**预期结果**: 返回成功消息

### 3. 买家功能测试

#### 3.1 获取商品列表 (买家市场)
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/buyer/products/list" -Method GET -Headers $headers
```
**预期结果**: 返回已上架的商品列表

#### 3.2 获取商品详情
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/api/buyer/products/{productId}" -Method GET -Headers $headers
```
**预期结果**: 返回商品详细信息

#### 3.3 创建订单
```powershell
$body = @{
    items = @(
        @{
            productId = "商品ID"
            quantity = 2
        }
    )
    shippingName = "收货人"
    shippingPhone = "13900139000"
    shippingAddress = "收货地址"
    paymentMethod = "alipay"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/api/buyer/orders" -Method POST -Body $body -ContentType "application/json" -Headers $headers
```
**预期结果**: 返回创建的订单信息

### 4. 前端功能测试

#### 4.1 访问前端页面
打开浏览器访问: http://localhost:5173

#### 4.2 测试登录流程
1. 打开登录页面
2. 输入手机号和密码
3. 选择角色 (farmer/buyer/bank/expert/admin)
4. 点击登录
5. 检查是否成功跳转到对应角色的首页

#### 4.3 测试注册流程
1. 打开注册页面
2. 输入手机号
3. 获取验证码
4. 输入验证码和其他信息
5. 提交注册
6. 检查是否自动登录

#### 4.4 测试各角色功能
- **农户角色**: 商品管理、融资申请、订单管理
- **买家角色**: 商品浏览、购物车、订单管理
- **银行角色**: 审批管理、产品管理
- **专家角色**: 问答管理、预约管理
- **管理员角色**: 用户管理、审核管理

## 常见问题排查

### 问题1: 后端启动失败
**可能原因**:
- MySQL未启动
- 数据库连接配置错误
- 端口8080被占用

**解决方法**:
1. 检查MySQL服务状态
2. 检查 `application.yml` 中的数据库配置
3. 检查端口占用: `netstat -ano | findstr ":8080"`

### 问题2: 前端启动失败
**可能原因**:
- 依赖未安装
- 端口5173被占用
- Node.js版本不兼容

**解决方法**:
1. 运行 `npm install` 安装依赖
2. 检查端口占用: `netstat -ano | findstr ":5173"`
3. 检查Node.js版本: `node -v` (需要 >= 18)

### 问题3: API调用失败
**可能原因**:
- 后端服务未启动
- CORS配置问题
- Token过期或无效

**解决方法**:
1. 确认后端服务已启动
2. 检查浏览器控制台的错误信息
3. 重新登录获取新token

### 问题4: 数据库连接失败
**可能原因**:
- MySQL服务未启动
- 用户名密码错误
- 数据库不存在

**解决方法**:
1. 启动MySQL服务
2. 检查 `application.yml` 中的数据库配置
3. 创建数据库: `CREATE DATABASE agriverse;`
4. 运行初始化脚本: `backend/init.sql`

## 测试报告模板

### 测试环境
- **操作系统**: Windows 10/11
- **数据库**: MySQL 8.0
- **后端**: Spring Boot 3.2.0 (Java 21)
- **前端**: React 18 + Vite 6
- **测试时间**: [填写时间]

### 测试结果

| 功能模块 | 测试项 | 状态 | 备注 |
|---------|--------|------|------|
| 认证模块 | 健康检查 | ⬜ | |
| 认证模块 | 发送验证码 | ⬜ | |
| 认证模块 | 用户注册 | ⬜ | |
| 认证模块 | 用户登录 | ⬜ | |
| 认证模块 | 获取用户信息 | ⬜ | |
| 农户模块 | 创建商品 | ⬜ | |
| 农户模块 | 商品列表 | ⬜ | |
| 农户模块 | 商品上下架 | ⬜ | |
| 买家模块 | 商品列表 | ⬜ | |
| 买家模块 | 创建订单 | ⬜ | |
| 前端 | 页面加载 | ⬜ | |
| 前端 | 登录流程 | ⬜ | |
| 前端 | 注册流程 | ⬜ | |

### 发现的问题
1. [问题描述]
2. [问题描述]

### 建议
1. [改进建议]
2. [改进建议]

