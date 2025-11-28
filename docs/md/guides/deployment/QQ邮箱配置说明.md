# QQ邮箱配置说明

## 如何获取QQ邮箱授权码

### 步骤1：登录QQ邮箱
1. 访问 https://mail.qq.com
2. 使用你的QQ号和密码登录

### 步骤2：开启SMTP服务
1. 登录后，点击页面右上角的 **设置**
2. 选择 **账户** 选项卡
3. 向下滚动找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务**
4. 开启 **POP3/SMTP服务** 或 **IMAP/SMTP服务**（推荐开启IMAP/SMTP）
5. 按照提示完成手机验证

### 步骤3：获取授权码
1. 开启服务后，点击 **生成授权码** 按钮
2. 按照提示发送短信验证
3. 验证成功后，会显示一个16位的授权码（例如：`abcdefghijklmnop`）
4. **重要**：这个授权码只显示一次，请立即复制保存

## 配置 application.yml

在 `backend/src/main/resources/application.yml` 文件中，找到邮件配置部分，修改以下内容：

```yaml
spring:
  mail:
    host: smtp.qq.com
    port: 587
    username: 你的QQ邮箱@qq.com  # 例如：123456789@qq.com
    password: 你的授权码  # 刚才获取的16位授权码
    from: 你的QQ邮箱@qq.com  # 通常与username相同
```

### 配置示例

```yaml
spring:
  mail:
    host: smtp.qq.com
    port: 587
    username: 123456789@qq.com
    password: abcdefghijklmnop  # 替换为你的真实授权码
    from: 123456789@qq.com
```

## 注意事项

1. **授权码不是QQ密码**：授权码是专门用于第三方应用登录的密码
2. **授权码只显示一次**：如果忘记，需要重新生成
3. **安全性**：不要将授权码提交到Git仓库，建议使用环境变量或配置文件（不提交到版本控制）
4. **端口选择**：
   - 587端口：使用TLS加密（推荐）
   - 465端口：使用SSL加密（需要修改配置中的starttls为ssl）

## 测试邮件发送

配置完成后，重启后端服务，尝试注册新用户。如果配置正确，验证码会发送到用户填写的邮箱中。

## 常见问题

### 1. 邮件发送失败：535 Error
- 原因：授权码错误或未开启SMTP服务
- 解决：检查授权码是否正确，确认已开启SMTP服务

### 2. 连接超时
- 原因：网络问题或端口被防火墙阻止
- 解决：检查网络连接，尝试使用465端口（SSL）

### 3. 邮件进入垃圾箱
- 原因：邮件内容被识别为垃圾邮件
- 解决：这是正常现象，提醒用户检查垃圾邮件文件夹


