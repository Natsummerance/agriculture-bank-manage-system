# AgriVerse 后端服务 - 认证模块

## 项目概述

这是 AgriVerse 农业产品融销平台的后端认证服务，基于 Spring Boot 3.2.0 和 Java 17 构建。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **安全**: Spring Security 6.x + JWT
- **数据库**: MySQL 8.0 (开发测试使用 H2)
- **ORM**: Spring Data JPA + Hibernate
- **JWT库**: io.jsonwebtoken 0.12.3
- **构建工具**: Maven 3.8+
- **Java版本**: JDK 17+

## 项目结构

```
backend/
├── src/main/java/com/agriverse/
│   ├── auth/
│   │   ├── controller/       # 认证控制器
│   │   ├── service/          # 业务逻辑层
│   │   └── repository/       # 数据访问层
│   ├── entity/               # JPA 实体类
│   ├── dto/                  # 数据传输对象
│   ├── config/               # 配置类（安全、JWT等）
│   ├── util/                 # 工具类
│   └── AgriverseAuthApplication.java  # 主启动类
├── src/main/resources/
│   └── application.yml       # 应用配置文件
├── pom.xml                   # Maven 依赖配置
└── README.md                 # 项目说明文档
```

## 快速开始

### 前置条件

- JDK 17 或更高版本
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

## 错误响应

### 常见错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权/认证失败 |
| 403 | 禁止访问 |
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
  secret: your-secret-key  # JWT 签名密钥（生产环境应使用强密钥）
  expiration: 86400000     # 访问令牌过期时间（毫秒）
  refresh-expiration: 604800000  # 刷新令牌过期时间（毫秒）

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
```

## 生产部署

### 1. 修改 JWT 密钥

在生产环境中，**必须**修改 JWT 密钥为强密钥：

```yaml
jwt:
  secret: your-very-secure-secret-key-with-at-least-32-characters
```

### 2. 使用真实数据库

配置 MySQL 数据库连接，并设置 `ddl-auto` 为 `validate`：

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
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
```

### Q: 如何使用开发环境的 H2 数据库？
A: 运行时指定 profile：
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

## 许可证

MIT License

## 支持

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件至 support@agriverse.com
