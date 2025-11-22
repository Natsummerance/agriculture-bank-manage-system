# API接口文档

## 概述

本项目提供了完整的认证API接口，包括注册、登录、验证码等功能。

## 目录结构

```
api/
├── client.ts      # API客户端工具，统一处理HTTP请求
├── auth.ts        # 认证相关API接口
└── README.md      # 本文档
```

## 环境配置

在项目根目录创建 `.env` 文件，配置API基础URL：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

如果不配置，默认使用 `http://localhost:3000/api`。

## API接口说明

### 1. 用户登录

**接口**: `POST /api/auth/login`

**请求参数**:
```typescript
{
  phone: string;      // 手机号
  password: string;   // 密码
  role?: RoleType;    // 角色类型（可选）
}
```

**响应**:
```typescript
{
  token: string;              // 访问令牌
  refreshToken?: string;      // 刷新令牌（可选）
  user: UserInfo;             // 用户信息
  expiresIn?: number;         // token过期时间（秒）
}
```

**使用示例**:
```typescript
import { login } from '@/api/auth';

const response = await login({
  phone: '13800138000',
  password: '123456',
  role: 'farmer'
});
```

### 2. 用户注册

**接口**: `POST /api/auth/register`

**请求参数**:
```typescript
{
  phone: string;          // 手机号
  code: string;           // 验证码
  password?: string;      // 密码（可选，某些角色可能不需要）
  role: RoleType;         // 角色类型
  inviteCode?: string;    // 邀请码（农户专属，可选）
  name?: string;          // 姓名（可选）
  email?: string;         // 邮箱（可选）
  company?: string;       // 公司名称（可选）
  location?: string;      // 地址（可选）
}
```

**响应**:
```typescript
{
  token: string;              // 访问令牌
  refreshToken?: string;      // 刷新令牌（可选）
  user: UserInfo;             // 用户信息
  expiresIn?: number;         // token过期时间（秒）
}
```

**使用示例**:
```typescript
import { register } from '@/api/auth';

const response = await register({
  phone: '13800138000',
  code: '123456',
  role: 'farmer',
  inviteCode: 'INVITE123'
});
```

### 3. 发送验证码

**接口**: `POST /api/auth/send-code`

**请求参数**:
```typescript
{
  phone: string;              // 手机号
  type: 'register' | 'login' | 'reset';  // 验证码类型
  role?: RoleType;            // 角色类型（可选）
}
```

**响应**:
```typescript
{
  success: boolean;           // 是否成功
  message: string;            // 提示信息
  expiresIn?: number;        // 验证码有效期（秒）
}
```

**使用示例**:
```typescript
import { sendVerificationCode } from '@/api/auth';

await sendVerificationCode({
  phone: '13800138000',
  type: 'register',
  role: 'farmer'
});
```

### 4. 验证验证码

**接口**: `POST /api/auth/verify-code`

**请求参数**:
```typescript
{
  phone: string;              // 手机号
  code: string;               // 验证码
  type: 'register' | 'login' | 'reset';  // 验证码类型
}
```

**响应**:
```typescript
{
  valid: boolean;             // 是否有效
  message?: string;           // 提示信息
}
```

### 5. 刷新Token

**接口**: `POST /api/auth/refresh`

**请求参数**:
```typescript
{
  refreshToken: string;       // 刷新令牌
}
```

**响应**:
```typescript
{
  token: string;              // 新的访问令牌
  refreshToken?: string;      // 新的刷新令牌（可选）
}
```

### 6. 退出登录

**接口**: `POST /api/auth/logout`

**请求**: 需要携带Authorization头

**响应**: 无

### 7. 获取当前用户信息

**接口**: `GET /api/auth/me`

**请求**: 需要携带Authorization头

**响应**:
```typescript
UserInfo  // 用户信息对象
```

### 8. 检查手机号是否已注册

**接口**: `GET /api/auth/check-phone`

**请求参数**:
- `phone`: 手机号
- `role`: 角色类型（可选）

**响应**:
```typescript
{
  exists: boolean;            // 是否已注册
}
```

## 数据类型

### RoleType
```typescript
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';
```

### UserInfo
```typescript
interface UserInfo {
  id: string;                 // 用户ID
  name: string;               // 姓名
  phone: string;              // 手机号
  email?: string;             // 邮箱
  role: RoleType;             // 角色
  avatar?: string;            // 头像URL
  company?: string;           // 公司名称
  location?: string;          // 地址
  createdAt?: string;         // 创建时间
  updatedAt?: string;         // 更新时间
}
```

## 错误处理

API客户端会自动处理常见的HTTP错误：

- **401**: 未授权，自动清除本地token
- **403**: 无权限访问
- **404**: 请求的资源不存在
- **429**: 请求过于频繁
- **500+**: 服务器错误

所有错误都会抛出 `ApiError` 异常，包含错误码和错误信息。

## Token管理

登录和注册成功后，token会自动保存到 `localStorage`：

- `auth_token`: 访问令牌
- `refresh_token`: 刷新令牌（如果提供）

后续的API请求会自动在请求头中添加 `Authorization: Bearer {token}`。

## 使用示例

### 在组件中使用

```typescript
import { useState } from 'react';
import { login, register, sendVerificationCode } from '@/api/auth';
import { toast } from 'sonner';

function LoginComponent() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login({
        phone,
        password,
        role: 'farmer'
      });
      
      // 登录成功，token已自动保存
      toast.success('登录成功');
      console.log('用户信息:', response.user);
    } catch (error: any) {
      toast.error(error.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... 表单UI
  );
}
```

## 后端接口要求

后端需要实现以下接口：

1. `POST /api/auth/login` - 用户登录
2. `POST /api/auth/register` - 用户注册
3. `POST /api/auth/send-code` - 发送验证码
4. `POST /api/auth/verify-code` - 验证验证码
5. `POST /api/auth/refresh` - 刷新token
6. `POST /api/auth/logout` - 退出登录
7. `GET /api/auth/me` - 获取当前用户信息
8. `GET /api/auth/check-phone` - 检查手机号是否已注册

### 响应格式

后端应该返回统一的响应格式：

```typescript
{
  code: number;        // 状态码，200或0表示成功
  message: string;     // 提示信息
  data: any;          // 数据
  success: boolean;    // 是否成功
}
```

或者直接返回数据（API客户端会尝试解析为标准格式）。

### 错误响应

错误时应该返回：

```typescript
{
  code: number;        // 错误码
  message: string;     // 错误信息
  data?: any;         // 可选的错误数据
}
```

## 注意事项

1. 所有API请求都会自动添加 `Content-Type: application/json` 头
2. 如果存在token，会自动添加 `Authorization: Bearer {token}` 头
3. 请求超时时间默认为10秒，可以在调用时通过 `timeout` 参数自定义
4. 401错误会自动清除本地token，需要重新登录
5. 验证码发送有60秒倒计时，防止频繁请求





