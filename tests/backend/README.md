# AgriVerse 测试文档

## 测试概述

本项目包含完整的测试套件，覆盖所有功能模块和业务流程。

## 测试结构

```
backend/tests/frontend/java/com/agriverse/
├── BaseTest.java                    # 基础测试类
├── TestRunner.java                  # 测试运行器
├── auth/
│   └── AuthControllerTest.java     # 认证模块测试
├── farmer/
│   └── FarmerProductControllerTest.java  # 农户模块测试
├── buyer/
│   ├── BuyerProductControllerTest.java    # 买家商品测试
│   ├── BuyerOrderControllerTest.java     # 买家订单测试
│   └── BuyerCartControllerTest.java      # 购物车测试
├── bank/
│   └── BankLoanControllerTest.java       # 银行模块测试
├── expert/
│   └── ExpertQAControllerTest.java       # 专家模块测试
├── admin/
│   └── AdminUserControllerTest.java      # 管理员模块测试
└── integration/
    └── IntegrationTest.java             # 集成测试
```

## 运行测试

### 运行所有测试

```bash
cd backend
mvn test
```

### 运行特定测试类

```bash
mvn test -Dtest=AuthControllerTest
```

### 运行特定测试方法

```bash
mvn test -Dtest=AuthControllerTest#testUserLoginSuccess
```

### 生成测试报告

```bash
mvn test surefire-report:report
```

报告位置：`backend/target/site/surefire-report.html`

## 测试覆盖范围

### 认证模块 (AuthControllerTest)
- ✅ 健康检查
- ✅ 发送验证码（注册/登录/重置密码）
- ✅ 验证验证码
- ✅ 用户注册（成功/失败场景）
- ✅ 用户登录（成功/失败场景）
- ✅ 获取用户信息
- ✅ 刷新Token
- ✅ 重置密码
- ✅ 检查手机号是否存在
- ✅ 登出
- ✅ 所有角色注册测试

### 农户模块 (FarmerProductControllerTest)
- ✅ 健康检查
- ✅ 获取商品列表（空列表/有数据/按状态筛选/搜索/分页）
- ✅ 创建商品（成功/验证失败）
- ✅ 商品上架/下架
- ✅ 获取商品数据看板
- ✅ 权限验证

### 买家商品模块 (BuyerProductControllerTest)
- ✅ 健康检查
- ✅ 获取商品列表（分类筛选/搜索/分页）
- ✅ 获取商品详情（成功/不存在/未上架）
- ✅ 只显示上架商品验证
- ✅ 权限验证

### 买家订单模块 (BuyerOrderControllerTest)
- ✅ 创建订单（成功/商品不存在/库存不足）
- ✅ 获取订单列表（按状态筛选/分页）
- ✅ 获取订单详情
- ✅ 取消订单
- ✅ 确认收货
- ✅ 权限验证

### 购物车模块 (BuyerCartControllerTest)
- ✅ 获取购物车（空/有商品）
- ✅ 添加商品到购物车（成功/商品不存在/数量验证/更新数量）
- ✅ 更新购物车商品
- ✅ 删除购物车商品
- ✅ 清空购物车
- ✅ 商品选中状态
- ✅ 权限验证

### 银行模块 (BankLoanControllerTest)
- ✅ 创建贷款产品
- ✅ 获取贷款产品列表
- ✅ 获取贷款申请列表
- ✅ 审批贷款申请
- ✅ 拒绝贷款申请
- ✅ 获取逾期贷款列表
- ✅ 获取统计数据
- ✅ 权限验证

### 专家模块 (ExpertQAControllerTest)
- ✅ 搜索问题
- ✅ 获取待回答问题列表
- ✅ 回答问题
- ✅ 获取我的回答列表
- ✅ 权限验证

### 管理员模块 (AdminUserControllerTest)
- ✅ 获取用户列表
- ✅ 搜索用户
- ✅ 获取用户详情
- ✅ 更新用户状态
- ✅ 更新用户角色
- ✅ 获取用户统计
- ✅ 权限验证（未认证/非管理员）

### 集成测试 (IntegrationTest)
- ✅ 完整业务流程：农户创建商品 -> 买家查看 -> 买家下单
- ✅ 跨角色权限控制

## 测试配置

测试使用 `application-test.yml` 配置文件，使用 H2 内存数据库进行测试。

## 注意事项

1. 所有测试都使用 `@Transactional` 注解，确保测试数据不会污染数据库
2. 每个测试类都继承 `BaseTest`，提供通用的测试工具方法
3. 测试使用随机端口，避免端口冲突
4. 测试数据使用时间戳生成唯一标识，避免数据冲突

## 持续集成

测试可以在 CI/CD 流程中自动运行：

```yaml
# .github/workflows/test.yml
- name: Run Tests
  run: |
    cd backend
    mvn test
```

## 测试覆盖率目标

- 单元测试覆盖率：> 80%
- 集成测试覆盖率：> 70%
- 关键业务逻辑覆盖率：100%
