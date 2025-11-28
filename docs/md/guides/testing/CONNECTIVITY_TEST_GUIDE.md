# AgriVerse 前后端连通性测试指南

## 📋 概述

本文档提供了 AgriVerse 农业产品融销平台的前后端连通性测试指南。使用虚拟测试方法，无需真实数据即可测试所有API端点和连通性。

## 🎯 测试特点

### 虚拟测试方法
- ✅ **无需真实数据**: 使用虚拟测试数据，不依赖数据库中的真实用户
- ✅ **自动生成数据**: 每次测试自动生成唯一的虚拟测试数据
- ✅ **全面覆盖**: 测试所有API端点和前后端连通性
- ✅ **快速执行**: 轻量级测试，执行速度快
- ✅ **详细报告**: 生成JSON格式的测试报告

### 测试覆盖范围
- ✅ 服务可用性测试
- ✅ 认证API测试（7个端点）
- ✅ 农户API测试（4个端点）
- ✅ 买家API测试（4个端点）
- ✅ 银行API测试（3个端点）
- ✅ 专家API测试（2个端点）
- ✅ 管理员API测试（2个端点）
- ✅ 文件上传API测试
- ✅ 前端页面连通性测试
- ✅ API响应时间测试

## 🚀 快速开始

### 方式1: PowerShell脚本（推荐，Windows）

```powershell
# 基本运行
.\scripts\test-connectivity.ps1

# 详细输出
.\scripts\test-connectivity.ps1 -Verbose

# 自定义后端地址
.\scripts\test-connectivity.ps1 -BackendUrl "http://localhost:8080"

# 自定义前端地址
.\scripts\test-connectivity.ps1 -FrontendUrl "http://localhost:5173"
```

### 方式2: Node.js脚本（跨平台）

```bash
# 安装依赖（如果需要）
npm install

# 运行测试
node scripts/test-connectivity.js

# 详细输出
node scripts/test-connectivity.js --verbose

# 自定义环境变量
BACKEND_URL=http://localhost:8080 FRONTEND_URL=http://localhost:5173 node scripts/test-connectivity.js
```

### 方式3: Python脚本（跨平台）

```bash
# 安装依赖
pip install requests

# 运行测试
python scripts/test-connectivity.py

# 详细输出
python scripts/test-connectivity.py --verbose

# 自定义环境变量
BACKEND_URL=http://localhost:8080 FRONTEND_URL=http://localhost:5173 python scripts/test-connectivity.py
```

## 📊 测试报告

测试完成后，会在 `test-results/` 目录下生成JSON格式的测试报告：

```json
{
  "timestamp": "2025-01-XX HH:mm:ss",
  "backendUrl": "http://localhost:8080",
  "frontendUrl": "http://localhost:5173",
  "summary": {
    "total": 50,
    "passed": 45,
    "failed": 5,
    "passRate": 90.0
  },
  "results": [
    {
      "name": "后端服务健康检查",
      "passed": true,
      "message": "Status: 200, Time: 45ms",
      "statusCode": 200,
      "responseTime": "45ms"
    }
  ]
}
```

## 🔧 测试配置

### 环境变量

- `BACKEND_URL`: 后端服务地址（默认: http://localhost:8080）
- `FRONTEND_URL`: 前端服务地址（默认: http://localhost:5173）

### 虚拟测试数据

脚本会自动生成以下虚拟测试数据：

- **虚拟用户**: 随机手机号、密码、邮箱等
- **虚拟商品**: 随机商品名称、价格、库存等
- **虚拟订单**: 虚拟订单项和地址
- **虚拟融资**: 虚拟融资申请数据

### 预期状态码

测试会根据API的特性接受以下状态码：

- **公开API**: 200（成功）
- **需要认证的API**: 200（成功）或 401（未认证）
- **需要特定角色的API**: 200（成功）、401（未认证）或 403（无权限）

## 📝 测试流程

### 1. 服务可用性测试
- 检查后端服务是否运行
- 检查前端服务是否运行

### 2. 认证API测试
- 健康检查
- 发送验证码
- 检查手机号
- 用户登录（获取Token）

### 3. 各模块API测试
- 使用获取的Token测试需要认证的API
- 测试所有主要功能端点

### 4. 前端页面连通性测试
- 测试所有主要前端页面是否可访问

### 5. API响应时间测试
- 测试关键API的响应时间
- 验证性能是否满足要求

## ⚠️ 注意事项

1. **服务运行**: 确保后端和前端服务都在运行
2. **端口占用**: 确保8080和5173端口未被占用
3. **网络连接**: 确保可以访问localhost
4. **测试数据**: 虚拟测试数据不会影响真实数据
5. **Token获取**: 如果登录失败，部分需要认证的API测试可能会失败（这是正常的）

## 🔍 故障排查

### 后端服务不可用
```
错误: 后端服务不可用
解决: 
1. 检查后端服务是否运行: cd backend && mvn spring-boot:run
2. 检查端口8080是否被占用
3. 检查防火墙设置
```

### 前端服务不可用
```
警告: 前端服务不可用
说明: 可以继续测试API，但前端页面测试会跳过
解决:
1. 启动前端服务: npm run dev
2. 检查端口5173是否被占用
```

### 认证失败
```
说明: 如果虚拟用户登录失败，部分需要认证的API会返回401
这是正常的，说明API的认证机制正常工作
```

## 📈 测试结果解读

### 通过率说明
- **≥ 80%**: 优秀，系统运行正常
- **60-80%**: 良好，部分功能可能有问题
- **< 60%**: 需要检查，可能有严重问题

### 状态码说明
- **200**: 请求成功
- **401**: 未认证（需要登录）
- **403**: 无权限（需要特定角色）
- **400**: 请求参数错误
- **404**: 端点不存在
- **500**: 服务器错误

## 🔗 相关文档

- [完整测试计划](TEST_PLAN.md)
- [测试指南](TESTING_GUIDE.md)
- [E2E测试指南](E2E_TEST_GUIDE.md)
- [测试覆盖率报告](TEST_COVERAGE_REPORT.md)
- [完整测试总结](COMPLETE_TEST_SUMMARY.md)

## 📞 支持

如有问题，请参考：
- 测试脚本代码
- 项目文档
- 开发团队

---

**最后更新**: 2025-01-XX  
**版本**: 1.0

