# 脚本目录

本目录包含项目相关的脚本文件。

## 📁 目录结构

```
scripts/
├── README.md                    # 本文件
├── start-all-services.ps1      # 启动所有服务脚本
└── test/
    └── test-system.ps1         # 自动化测试脚本
```

## 🚀 脚本说明

### start-all-services.ps1
启动所有服务（数据库、后端、前端）的自动化脚本。

**使用方法:**
```powershell
.\scripts\start-all-services.ps1
```

**功能:**
- 检查MySQL服务状态
- 在新窗口中启动后端服务（Spring Boot）
- 在新窗口中启动前端服务（Vite）

### test/test-system.ps1
自动化功能测试脚本，用于测试API和前端功能。

**使用方法:**
```powershell
.\scripts\test\test-system.ps1
```

**功能:**
- 检查服务状态
- 测试认证功能
- 测试商品管理功能
- 测试订单功能
- 输出测试结果汇总

## 📝 注意事项

- 所有脚本需要在项目根目录执行
- 确保已安装必要的依赖（Node.js, Maven等）
- PowerShell执行策略可能需要设置为 `RemoteSigned`

## 🔗 相关文档

- [快速开始指南](../md/guides/quick-start/QUICK_START.md)
- [测试指南](../md/guides/quick-start/test-guide.md)

