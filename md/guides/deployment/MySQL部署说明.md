# MySQL数据库本地部署说明

本文档说明如何将项目从H2数据库切换到MySQL数据库进行本地部署。

## 一、前置要求

1. **安装MySQL 8.0+**
   - 下载地址：https://dev.mysql.com/downloads/mysql/
   - 或使用Docker运行MySQL（推荐）

2. **创建数据库**
   ```sql
   CREATE DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## 二、使用Docker部署MySQL（推荐）

### 方式1：使用docker-compose

```bash
cd backend
docker-compose up -d mysql
```

这将启动MySQL容器，并自动执行`init.sql`初始化脚本。

### 方式2：手动运行MySQL容器

```bash
docker run -d \
  --name agriverse-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=agriverse \
  -e TZ=Asia/Shanghai \
  -p 3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

然后手动执行初始化脚本：
```bash
docker exec -i agriverse-mysql mysql -uroot -proot agriverse < init.sql
```

## 三、配置数据库连接

### 1. 修改application.yml

开发环境（dev profile）已配置为使用MySQL：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/agriverse?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: root
```

**根据实际情况修改：**
- `username`: MySQL用户名（默认root）
- `password`: MySQL密码（默认root）
- `url`: 如果MySQL不在localhost，修改主机地址

### 2. 启动应用

使用dev profile启动：

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

或者设置环境变量：

**Windows PowerShell:**
```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
mvn spring-boot:run
```

**Windows CMD:**
```cmd
set SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

**Linux/Mac:**
```bash
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

## 四、数据库初始化

### 自动初始化（推荐）

应用启动时，如果`ddl-auto: update`，Hibernate会自动创建/更新表结构。

### 手动初始化

如果需要手动执行SQL脚本：

```bash
# 使用MySQL客户端
mysql -uroot -proot agriverse < init.sql

# 或使用Docker
docker exec -i agriverse-mysql mysql -uroot -proot agriverse < init.sql
```

## 五、验证数据库连接

### 1. 检查应用日志

启动应用后，查看日志确认数据库连接成功：

```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

### 2. 检查数据库表

连接到MySQL数据库，检查表是否创建：

```sql
USE agriverse;
SHOW TABLES;

-- 应该看到以下表：
-- users
-- verification_codes
-- farmer_products
```

### 3. 测试API

访问健康检查接口：
```bash
curl http://localhost:8080/api/farmer/products/health
```

## 六、数据库表结构

### users（用户表）
- 存储用户基本信息
- 主键：id (VARCHAR(36))
- 唯一索引：phone, email

### verification_codes（验证码表）
- 存储验证码信息
- 主键：id (VARCHAR(36))
- 索引：phone+type, email+type

### farmer_products（农户商品表）
- 存储农户商品信息
- 主键：id (VARCHAR(36))
- 索引：farmer_id, status, name, category

## 七、常见问题

### 1. 连接失败：Communications link failure

**原因**：MySQL服务未启动或连接配置错误

**解决**：
- 检查MySQL服务是否运行：`docker ps` 或 `systemctl status mysql`
- 检查端口是否正确（默认3306）
- 检查防火墙设置

### 2. 认证失败：Access denied

**原因**：用户名或密码错误

**解决**：
- 检查`application.yml`中的用户名和密码
- 确认MySQL用户权限

### 3. 字符编码问题

**原因**：数据库字符集不是utf8mb4

**解决**：
```sql
ALTER DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 时区问题

**原因**：MySQL时区设置不正确

**解决**：
- 在连接URL中添加`serverTimezone=Asia/Shanghai`
- 或设置MySQL时区：`SET time_zone = '+08:00';`

## 八、生产环境配置

生产环境建议：

1. **修改密码**：使用强密码
2. **启用SSL**：在连接URL中设置`useSSL=true`
3. **使用连接池**：已配置HikariCP
4. **设置ddl-auto为validate**：防止意外修改表结构
5. **定期备份**：设置数据库备份策略

```yaml
spring:
  datasource:
    url: jdbc:mysql://your-mysql-host:3306/agriverse?useSSL=true&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_strong_password
  jpa:
    hibernate:
      ddl-auto: validate  # 生产环境使用validate
    show-sql: false        # 生产环境关闭SQL日志
```

## 九、数据迁移

如果从H2迁移到MySQL：

1. **导出H2数据**（如果有）
2. **创建MySQL数据库**
3. **执行init.sql创建表结构**
4. **导入数据**（如果有）
5. **启动应用验证**

## 十、测试环境

测试环境（test profile）仍使用H2内存数据库，这是合理的：
- 测试速度快
- 无需外部依赖
- 每次测试都是干净的环境

如需在测试中使用MySQL，修改`application-test.yml`即可。

---

**注意**：确保MySQL服务在应用启动前已运行，否则应用启动会失败。

