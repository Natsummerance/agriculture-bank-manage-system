# 本地MySQL数据库配置指南

本文档说明如何在本地配置MySQL数据库（不使用Docker）。

## 一、安装MySQL

### Windows

1. **下载MySQL安装包**
   - 访问：https://dev.mysql.com/downloads/mysql/
   - 选择 Windows (x86, 64-bit), ZIP Archive 或 MySQL Installer

2. **安装MySQL**
   - 运行安装程序
   - 选择"Developer Default"或"Server only"
   - 设置root密码（记住这个密码，后续配置需要用到）
   - 完成安装

3. **验证安装**
   ```cmd
   mysql --version
   ```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### Mac

```bash
# 使用Homebrew
brew install mysql
brew services start mysql
```

## 二、创建数据库

### 1. 登录MySQL

**Windows:**
```cmd
mysql -u root -p
```

**Linux/Mac:**
```bash
sudo mysql -u root -p
# 或
mysql -u root -p
```

### 2. 创建数据库

```sql
CREATE DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 验证数据库创建

```sql
SHOW DATABASES;
USE agriverse;
```

## 三、配置应用连接

### 1. 修改application.yml

当前配置（默认和dev profile）：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/agriverse?useUnicode=true&characterEncoding=utf8mb4&serverTimezone=Asia/Shanghai&allowPublicKeyRetrieval=true&useSSL=false
    username: root
    password: Tdl@3731  # 修改为你的MySQL root密码
```

**根据你的实际情况修改：**
- `username`: 你的MySQL用户名（默认root）
- `password`: 你的MySQL密码
- `url`: 如果MySQL不在localhost或端口不是3306，修改相应部分

### 2. 配置文件位置

- 默认配置：`backend/src/main/resources/application.yml`（第6-10行）
- 开发环境配置：`backend/src/main/resources/application.yml`（第112-116行，dev profile）

## 四、初始化数据库表

### 方式1：自动初始化（推荐）

应用启动时，如果`ddl-auto: update`，Hibernate会自动创建表结构。

**启动应用：**
```bash
cd backend
mvn spring-boot:run
```

或使用dev profile：
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

### 方式2：手动执行SQL脚本

如果需要手动初始化：

```bash
# Windows
mysql -uroot -p agriverse < backend\init.sql

# Linux/Mac
mysql -uroot -p agriverse < backend/init.sql
```

## 五、验证连接

### 1. 启动应用

```bash
cd backend
mvn spring-boot:run
```

### 2. 查看日志

启动成功后，应该看到：
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

如果连接失败，会看到错误信息。

### 3. 检查数据库表

登录MySQL查看表是否创建：

```sql
USE agriverse;
SHOW TABLES;

-- 应该看到：
-- users
-- verification_codes
-- farmer_products
```

### 4. 测试API

```bash
curl http://localhost:8080/api/farmer/products/health
```

## 六、常见问题

### 1. 连接失败：Communications link failure

**原因**：MySQL服务未启动

**解决**：
- **Windows**: 打开"服务"，找到MySQL服务，右键"启动"
- **Linux**: `sudo systemctl start mysql`
- **Mac**: `brew services start mysql`

### 2. 认证失败：Access denied for user 'root'@'localhost'

**原因**：用户名或密码错误

**解决**：
1. 检查`application.yml`中的用户名和密码
2. 确认MySQL root密码：
   ```sql
   -- 如果忘记了root密码，可以重置
   ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
   FLUSH PRIVILEGES;
   ```

### 3. 数据库不存在：Unknown database 'agriverse'

**原因**：数据库未创建

**解决**：
```sql
CREATE DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. 字符编码问题

**原因**：数据库字符集不是utf8mb4

**解决**：
```sql
ALTER DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 时区问题

**原因**：MySQL时区设置不正确

**解决**：
- 连接URL中已包含`serverTimezone=Asia/Shanghai`
- 或设置MySQL时区：
  ```sql
  SET GLOBAL time_zone = '+08:00';
  ```

## 七、当前配置信息

根据`application.yml`，当前配置为：

- **主机**: localhost
- **端口**: 3306
- **数据库名**: agriverse
- **用户名**: root
- **密码**: Tdl@3731（请根据实际情况修改）

## 八、快速启动步骤

1. **确保MySQL服务运行**
   ```bash
   # Windows: 检查服务
   # Linux: sudo systemctl status mysql
   # Mac: brew services list
   ```

2. **创建数据库**（如果不存在）
   ```sql
   CREATE DATABASE agriverse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **修改密码**（如果需要）
   编辑 `backend/src/main/resources/application.yml`，修改第10行和第116行的密码

4. **启动应用**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

5. **验证连接**
   - 查看启动日志，确认连接成功
   - 访问健康检查接口

---

**提示**：如果遇到问题，检查MySQL服务状态和日志文件。

