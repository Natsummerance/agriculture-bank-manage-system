# 测试脚本说明

本目录包含 AgriVerse 项目的各种测试脚本。

## 📁 脚本列表

### 1. test-connectivity.ps1
**PowerShell版本的连通性测试脚本**

测试前后端连通性和所有API端点，使用虚拟测试数据。

**使用方法:**
```powershell
.\tests\scripts\test-connectivity.ps1
.\tests\scripts\test-connectivity.ps1 -Verbose
.\tests\scripts\test-connectivity.ps1 -BackendUrl "http://localhost:8080"
```

### 2. test-connectivity.js
**Node.js版本的连通性测试脚本**

跨平台的前后端连通性测试脚本。

**使用方法:**
```bash
node tests/scripts/test-connectivity.js
node tests/scripts/test-connectivity.js --verbose
BACKEND_URL=http://localhost:8080 node tests/scripts/test-connectivity.js
```

### 3. test-connectivity.py
**Python版本的连通性测试脚本**

跨平台的前后端连通性测试脚本。

**使用方法:**
```bash
python tests/scripts/test-connectivity.py
python tests/scripts/test-connectivity.py --verbose
BACKEND_URL=http://localhost:8080 python tests/scripts/test-connectivity.py
```

### 4. run-tests.ps1
**运行所有测试脚本**

运行后端和前端的所有测试。

**使用方法:**
```powershell
.\tests\scripts\run-tests.ps1
```

### 5. run-e2e-tests.ps1
**运行E2E集成测试**

运行完整的端到端测试。

**使用方法:**
```powershell
.\tests\scripts\run-e2e-tests.ps1
```

## 🎯 选择哪个脚本？

- **Windows用户**: 推荐使用 `test-connectivity.ps1`
- **跨平台/Node.js项目**: 使用 `test-connectivity.js`
- **Python环境**: 使用 `test-connectivity.py`

所有脚本功能相同，只是实现语言不同。

## 📊 测试报告

所有脚本都会在 `test-results/` 目录下生成JSON格式的测试报告。

## 🔗 相关文档

- [连通性测试指南](../docs/md/guides/testing/CONNECTIVITY_TEST_GUIDE.md)
- [完整测试计划](../docs/md/guides/testing/TEST_PLAN.md)
- [测试指南](../docs/md/guides/testing/TESTING_GUIDE.md)
