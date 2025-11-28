# AgriVerse 前后端集成指南

这个文档说明了如何将前端和后端进行集成。

## 目录结构

```
agriculture-bank-manage-system-main/
├── api/                      # 前端 API 客户端
│   ├── client.ts             # HTTP 客户端（已完成）
│   └── auth.ts               # 认证 API 接口（已完成）
├── backend/                  # Java 后端服务（新增）
│   ├── src/main/java/...     # Java 源代码
│   ├── src/main/resources/   # 配置文件
│   ├── pom.xml               # Maven 依赖
│   └── README.md             # 后端文档
└── ...其他前端文件
```

## 快速开始

### 前端配置

在前端项目中配置 API 基础 URL。编辑 `api/client.ts` 中的配置：

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

在 `.env` 文件中设置：

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 后端配置

1. **进入后端目录**
```bash
cd backend
```

2. **安装依赖**
```bash
mvn clean install
```

3. **配置数据库** (可选)

编辑 `src/main/resources/application.yml`

4. **运行应用**

开发环境（使用 H2 内存数据库）：
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

生产环境（使用 MySQL）：
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

### 前端启动

```bash
npm run dev
```

访问 `http://localhost:5173`

## 前端 API 使用示例

### 1. 用户登录

```typescript
import { login } from '@/api/auth';

const handleLogin = async () => {
  try {
    const response = await login({
      phone: '13800138000',
      password: 'password123',
      role: 'farmer'
    });
    console.log('登录成功:', response);
    // 保存用户信息到全局状态或本地存储
  } catch (error) {
    console.error('登录失败:', error);
  }
};
```

### 2. 用户注册

```typescript
import { sendVerificationCode, register } from '@/api/auth';

// 第一步：发送验证码
const handleSendCode = async (phone: string) => {
  try {
    await sendVerificationCode({
      phone,
      type: 'register',
      role: 'farmer'
    });
    console.log('验证码已发送');
  } catch (error) {
    console.error('发送失败:', error);
  }
};

// 第二步：注册
const handleRegister = async () => {
  try {
    const response = await register({
      phone: '13800138000',
      code: '123456',
      password: 'password123',
      role: 'farmer',
      name: '张三',
      email: 'user@example.com',
      company: '某农业有限公司',
      location: '河北省石家庄市'
    });
    console.log('注册成功:', response);
  } catch (error) {
    console.error('注册失败:', error);
  }
};
```

### 3. 获取当前用户信息

```typescript
import { getCurrentUser } from '@/api/auth';

const handleGetUserInfo = async () => {
  try {
    const userInfo = await getCurrentUser();
    console.log('用户信息:', userInfo);
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};
```

### 4. 刷新令牌

```typescript
import { refreshAuthToken } from '@/api/auth';

const handleRefreshToken = async () => {
  try {
    const response = await refreshAuthToken();
    console.log('令牌已刷新:', response);
  } catch (error) {
    console.error('刷新失败:', error);
  }
};
```

### 5. 登出

```typescript
import { logout } from '@/api/auth';

const handleLogout = async () => {
  try {
    await logout();
    console.log('已登出');
    // 清除用户信息
  } catch (error) {
    console.error('登出失败:', error);
  }
};
```

## 数据库初始化

### MySQL 初始化脚本

```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS agriverse;
USE agriverse;

-- 用户表
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  role ENUM('FARMER', 'BUYER', 'BANK', 'EXPERT', 'ADMIN') NOT NULL,
  avatar VARCHAR(255),
  company VARCHAR(100),
  location VARCHAR(200),
  enabled BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  login_attempts INT DEFAULT 0,
  last_login_time DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_phone (phone),
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- 验证码表
CREATE TABLE verification_codes (
  id VARCHAR(36) PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type ENUM('REGISTER', 'LOGIN', 'RESET') NOT NULL,
  expired_at DATETIME NOT NULL,
  attempts INT DEFAULT 0,
  used BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  INDEX idx_phone_type (phone, type),
  INDEX idx_expired_at (expired_at)
);
```

## 跨域配置

前端默认运行在 `localhost:5173`，后端在 `localhost:8080`。已在后端 `SecurityConfig` 中配置了 CORS。

## JWT Token 工作流

1. **登录/注册时获取 Token**
   ```
   POST /api/auth/login
   Response: { token, refreshToken, user, expiresIn }
   ```

2. **Token 自动保存在 LocalStorage**
   ```typescript
   localStorage.setItem('auth_token', response.token);
   localStorage.setItem('refresh_token', response.refreshToken);
   ```

3. **每个请求自动添加 Authorization 头**
   ```
   Authorization: Bearer {token}
   ```

4. **Token 过期时自动刷新**
   ```typescript
   POST /api/auth/refresh
   Request: { refreshToken }
   Response: { token, refreshToken, expiresIn }
   ```

## 错误处理

前端已在 `api/client.ts` 中实现了统一的错误处理：

```typescript
// 自动捕获 API 错误
if (!data.success && data.code !== 0) {
  throw new ApiError(data.code, data.message, data.data);
}
```

后端返回错误格式：

```json
{
  "code": 400,
  "message": "错误描述",
  "success": false
}
```

## 性能优化建议

1. **Token 缓存**: 使用 localStorage 保存 token，避免频繁重新登录
2. **请求拦截**: 实现请求拦截器，自动附加 Authorization 头
3. **错误重试**: 在 token 过期时自动刷新并重试请求
4. **数据库索引**: 已为常查询字段建立索引

## 安全建议

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **密钥管理**: JWT 密钥应存放在环境变量中，不要硬编码
3. **验证码有效期**: 建议设置为 10 分钟
4. **登录失败限制**: 实现登录失败次数限制和账户锁定
5. **密码加密**: 使用 bcrypt 对密码进行加密
6. **CORS**: 生产环境应限制允许的源

## 故障排除

### 问题1: CORS 错误

**症状**: 浏览器控制台显示 CORS 错误

**解决方案**:
1. 检查后端 CORS 配置
2. 确保 API 地址正确
3. 检查请求头是否正确

### 问题2: Token 过期

**症状**: 请求返回 401 Unauthorized

**解决方案**:
1. 自动刷新 token 的逻辑已在 `client.ts` 中实现
2. 如果还是失败，重新登录获取新 token

### 问题3: 验证码发送失败

**症状**: 发送验证码返回错误

**解决方案**:
1. 检查后端 `SmsService` 是否正确配置
2. 短信服务商 API 是否可用
3. 手机号格式是否正确

## 下一步

1. **集成支付服务** - 添加支付模块
2. **集成文件上传** - 添加文件上传功能
3. **集成消息队列** - 异步处理业务逻辑
4. **添加更多业务模块** - 交易、融资、专家等模块
5. **部署上线** - Docker 容器化、云平台部署

## 相关文档

- [前端项目结构](../README.md)
- [后端项目文档](./backend/README.md)
- [API 文档](./backend/README.md#api-接口文档)
- [copilot-instructions.md](./.github/copilot-instructions.md)

## 支持

如有问题，请通过以下方式联系：
- GitHub Issues
- 邮件: support@agriverse.com
