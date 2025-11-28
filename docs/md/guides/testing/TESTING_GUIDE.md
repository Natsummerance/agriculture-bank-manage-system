# AgriVerse 完整测试指南

## 📋 概述

本文档提供了 AgriVerse 农业产品融销平台的完整测试指南。测试套件覆盖了所有功能模块，包括认证、农户、买家、银行、专家和管理员等各个角色的功能。

## 🎯 测试目标

- **功能完整性**：确保所有功能模块都得到测试
- **边界条件**：测试各种边界情况和异常场景
- **权限控制**：验证角色权限和访问控制
- **集成测试**：测试跨模块的业务流程
- **代码覆盖率**：目标覆盖率 > 80%

## 📁 测试结构

### 后端测试

```
backend/tests/frontend/java/com/agriverse/
├── BaseTest.java                    # 基础测试类，提供通用工具方法
├── TestRunner.java                  # 测试套件运行器
├── auth/
│   └── AuthControllerTest.java     # 认证模块测试（18个测试用例）
├── farmer/
│   └── FarmerProductControllerTest.java  # 农户模块测试（13个测试用例）
├── buyer/
│   ├── BuyerProductControllerTest.java    # 买家商品测试（10个测试用例）
│   ├── BuyerOrderControllerTest.java     # 买家订单测试（11个测试用例）
│   └── BuyerCartControllerTest.java      # 购物车测试（11个测试用例）
├── bank/
│   └── BankLoanControllerTest.java       # 银行模块测试（8个测试用例）
├── expert/
│   └── ExpertQAControllerTest.java       # 专家模块测试（5个测试用例）
├── admin/
│   └── AdminUserControllerTest.java      # 管理员模块测试（8个测试用例）
└── integration/
    └── IntegrationTest.java              # 集成测试（2个测试用例）
```

### 前端测试

```
tests/frontend/
├── setup.ts                    # 测试环境设置
├── utils/
│   └── testUtils.tsx          # 测试工具函数
├── components/
│   └── Button.test.tsx        # UI组件测试示例
├── pages/
│   └── FarmerApp.test.tsx     # 页面组件测试示例
└── api/
    └── api.test.ts            # API工具测试
```

## 🚀 运行测试

### 后端测试

#### 运行所有测试

```bash
cd backend
mvn test
```

#### 运行特定测试类

```bash
mvn test -Dtest=AuthControllerTest
```

#### 运行特定测试方法

```bash
mvn test -Dtest=AuthControllerTest#testUserLoginSuccess
```

#### 生成测试报告

```bash
mvn test surefire-report:report
```

报告位置：`backend/target/site/surefire-report.html`

### 前端测试

#### 运行所有测试

```bash
npm run test
```

#### 运行测试并查看UI

```bash
npm run test:ui
```

#### 生成覆盖率报告

```bash
npm run test:coverage
```

报告位置：`coverage/index.html`

### 一键运行所有测试

```powershell
.\scripts\run-tests.ps1
```

## 📊 测试覆盖范围

### 认证模块 (AuthControllerTest)

✅ **18个测试用例**，覆盖：
- 健康检查
- 发送验证码（注册/登录/重置密码）
- 验证验证码
- 用户注册（成功/失败场景）
- 用户登录（成功/失败场景）
- 获取用户信息
- 刷新Token
- 重置密码
- 检查手机号是否存在
- 登出
- 所有角色注册测试

### 农户模块 (FarmerProductControllerTest)

✅ **13个测试用例**，覆盖：
- 健康检查
- 获取商品列表（空列表/有数据/按状态筛选/搜索/分页）
- 创建商品（成功/验证失败）
- 商品上架/下架
- 获取商品数据看板
- 权限验证

### 买家商品模块 (BuyerProductControllerTest)

✅ **10个测试用例**，覆盖：
- 健康检查
- 获取商品列表（分类筛选/搜索/分页）
- 获取商品详情（成功/不存在/未上架）
- 只显示上架商品验证
- 权限验证

### 买家订单模块 (BuyerOrderControllerTest)

✅ **11个测试用例**，覆盖：
- 创建订单（成功/商品不存在/库存不足）
- 获取订单列表（按状态筛选/分页）
- 获取订单详情
- 取消订单
- 确认收货
- 权限验证

### 购物车模块 (BuyerCartControllerTest)

✅ **11个测试用例**，覆盖：
- 获取购物车（空/有商品）
- 添加商品到购物车（成功/商品不存在/数量验证/更新数量）
- 更新购物车商品
- 删除购物车商品
- 清空购物车
- 商品选中状态
- 权限验证

### 银行模块 (BankLoanControllerTest)

✅ **8个测试用例**，覆盖：
- 创建贷款产品
- 获取贷款产品列表
- 获取贷款申请列表
- 审批贷款申请
- 拒绝贷款申请
- 获取逾期贷款列表
- 获取统计数据
- 权限验证

### 专家模块 (ExpertQAControllerTest)

✅ **5个测试用例**，覆盖：
- 搜索问题
- 获取待回答问题列表
- 回答问题
- 获取我的回答列表
- 权限验证

### 管理员模块 (AdminUserControllerTest)

✅ **8个测试用例**，覆盖：
- 获取用户列表
- 搜索用户
- 获取用户详情
- 更新用户状态
- 更新用户角色
- 获取用户统计
- 权限验证（未认证/非管理员）

### 集成测试 (IntegrationTest)

✅ **2个测试用例**，覆盖：
- 完整业务流程：农户创建商品 -> 买家查看 -> 买家下单
- 跨角色权限控制

## 🔧 测试配置

### 后端测试配置

测试使用 `application-test.yml` 配置文件，使用 H2 内存数据库进行测试，确保：
- 测试数据不会污染生产数据库
- 测试执行速度快
- 测试环境独立

### 前端测试配置

使用 Vitest 作为测试框架，配置在 `vitest.config.ts` 中：
- 使用 jsdom 模拟浏览器环境
- 支持 React Testing Library
- 集成代码覆盖率工具

## 📝 编写新测试

### 后端测试示例

```java
@Test
@DisplayName("测试功能描述")
public void testFunctionName() {
    // 1. 准备测试数据
    Map<String, Object> request = new HashMap<>();
    request.put("key", "value");
    
    // 2. 执行测试
    HttpHeaders headers = getAuthHeaders(token);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
    
    ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
        getBaseUrl() + "/api/endpoint",
        HttpMethod.POST,
        entity,
        typeRef
    );
    
    // 3. 验证结果
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertNotNull(response.getBody());
}
```

### 前端测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '../utils/testUtils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('应该正确渲染', () => {
    render(<MyComponent />)
    expect(screen.getByText('预期文本')).toBeInTheDocument()
  })
})
```

## ⚠️ 注意事项

1. **测试隔离**：每个测试应该独立运行，不依赖其他测试
2. **数据清理**：使用 `@Transactional` 确保测试数据自动回滚
3. **唯一标识**：使用时间戳生成唯一测试数据，避免冲突
4. **权限测试**：确保测试覆盖所有权限场景（认证/未认证/不同角色）
5. **边界条件**：测试空值、最大值、最小值等边界情况

## 📈 持续改进

1. **定期审查**：定期审查测试覆盖率，确保新功能都有测试
2. **优化性能**：优化测试执行时间，提高CI/CD效率
3. **提高稳定性**：减少测试的随机失败，提高测试稳定性
4. **文档更新**：及时更新测试文档，反映最新的测试结构

## 🔗 相关文档

- [后端测试详细文档](backend/tests/frontend/README.md)
- [完整测试计划](TEST_PLAN.md)
- [项目架构文档](Project_layer.md)

## 📞 支持

如有问题，请参考：
- 测试代码示例
- 项目文档
- 开发团队

---

**最后更新**：2025-01-XX  
**版本**：1.0

