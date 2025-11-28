# AgriVerse 农业产品融销平台

> **版本**: 1.0  
> **最后更新**: 2025-01-XX  
> **项目**: AgriVerse - 农业产品融销平台  
> **技术栈**: React 18 + TypeScript + Vite + Tailwind CSS + Motion/React + Zustand

## 📚 文档导航

> **所有项目文档已整理到 `md/` 文件夹，请查看 [文档索引](md/README.md) 获取完整文档列表**

### 快速链接
- 📖 [文档索引](md/README.md) - 所有文档的分类索引
- 🚀 [快速开始](md/guides/quick-start/QUICK_START.md) - 快速启动指南
- 🏗️ [项目架构](md/architecture/Project_layer.md) - 项目架构文档
- 🎨 [设计规范](md/design/FLAVOUR.md) - 视觉设计规范
- 🔧 [技术文档](md/guides/technical/) - 技术指南和文档
- 🐛 [问题修复](md/fixes/) - 错误修复文档
- 📊 [项目报告](md/reports/) - 完成和集成报告

### 主要文档位置
- **架构文档**: `md/architecture/`
- **设计文档**: `md/design/`
- **实现文档**: `md/implementation/`
- **使用指南**: `md/guides/`
- **问题修复**: `md/fixes/`
- **项目报告**: `md/reports/`

---

# 前端项目架构文档

## 📋 目录

1. [项目架构概述](#1-项目架构概述)
2. [核心文件结构](#2-核心文件结构)
3. [文件详细说明](#3-文件详细说明)
4. [文件关联关系](#4-文件关联关系)
5. [操作流程与页面跳转](#5-操作流程与页面跳转)
6. [组件与变量命名规范](#6-组件与变量命名规范)
7. [设计风格与动画系统](#7-设计风格与动画系统)
8. [状态管理架构](#8-状态管理架构)
9. [路由与导航系统](#9-路由与导航系统)
10. [API层架构](#10-api层架构)

---

## 1. 项目架构概述

### 1.1 架构模式

AgriVerse 采用 **微前端架构** + **多角色应用分离** 的设计模式：

- **入口层**: `App.tsx` → `router/index.tsx` → 各角色应用 (`apps/*.tsx`)
- **角色层**: 5个独立应用入口 (`farmerApp.tsx`, `buyerApp.tsx`, `bankApp.tsx`, `expertApp.tsx`, `adminApp.tsx`)
- **页面层**: 每个角色下包含多个功能页面 (`roles/{role}/pages/*.tsx`)
- **组件层**: 共享组件库 (`components/*`)
- **状态层**: Zustand Store (`stores/*`)
- **工具层**: 工具函数 (`utils/*`)

### 1.2 核心设计理念

1. **角色隔离**: 每个角色拥有独立的应用入口和路由系统
2. **组件复用**: 通用组件放在 `components/common/`，角色特定组件放在 `components/{role}/`
3. **状态分离**: 每个业务域使用独立的 Zustand Store
4. **导航分层**: 顶部导航（Tab切换）+ 子路由导航（页面内跳转）
5. **设计统一**: 遵循 `FLAVOUR.md` 的视觉和交互规范

---

## 2. 核心文件结构

```
agriculture-bank-manage-system-main/
├── App.tsx                          # 应用根组件
├── main.tsx                         # 入口文件
├── router/
│   └── index.tsx                    # React Router 配置
├── apps/                            # 角色应用入口
│   ├── farmerApp.tsx               # 农户应用
│   ├── buyerApp.tsx                # 买家应用
│   ├── bankApp.tsx                 # 银行应用
│   ├── expertApp.tsx               # 专家应用
│   └── adminApp.tsx                # 管理员应用
├── roles/                           # 角色页面
│   ├── farmer/                     # 农户角色
│   │   ├── FarmerLayout.tsx        # 布局组件
│   │   ├── navigation/
│   │   │   └── FarmerNavBar.tsx    # 底部导航栏
│   │   └── pages/                  # 页面组件
│   ├── buyer/                      # 买家角色
│   ├── bank/                       # 银行角色
│   ├── expert/                     # 专家角色
│   └── admin/                      # 管理员角色
├── components/                      # 共享组件
│   ├── Navigation.tsx              # 顶部导航栏
│   ├── common/                     # 通用组件
│   ├── ui/                         # UI基础组件（shadcn/ui）
│   └── {role}/                     # 角色特定组件
├── stores/                          # Zustand状态管理
├── contexts/                        # React Context
│   └── RoleContext.tsx             # 角色上下文
├── utils/                           # 工具函数
│   ├── navigationEvents.ts         # 导航事件系统
│   └── subRouteNavigation.ts       # 子路由导航系统
├── api/                             # API调用层
└── config/                          # 配置文件
    ├── permissions.ts               # 权限配置
    └── roleNavigation.ts            # 角色导航配置
```

---

## 3. 文件详细说明

### 3.1 入口与路由层

#### `App.tsx`
**路径**: `/App.tsx`  
**用途**: 应用根组件，提供全局上下文和错误边界  
**关键变量**:
- `RoleProvider`: 角色上下文提供者
- `GlobalErrorBoundary`: 全局错误边界
- `GlobalLoading`: 全局加载组件
- `RouterProvider`: React Router 提供者

**依赖关系**:
- `router/index.tsx` - 路由配置
- `contexts/RoleContext.tsx` - 角色上下文
- `components/common/GlobalErrorBoundary.tsx` - 错误边界
- `components/common/GlobalLoading.tsx` - 加载组件

#### `router/index.tsx`
**路径**: `/router/index.tsx`  
**用途**: 配置 React Router，定义所有路由规则  
**关键变量**:
- `router`: 路由配置对象
- 路由路径映射到对应的角色应用组件

**路由映射**:
```
/ → 角色选择页
/farmer/* → FarmerApp
/buyer/* → BuyerApp
/bank/* → BankApp
/expert/* → ExpertApp
/admin/* → AdminApp
```

### 3.2 角色应用入口层

#### `apps/farmerApp.tsx`
**路径**: `/apps/farmerApp.tsx`  
**用途**: 农户角色的应用入口，管理Tab切换和子路由渲染  
**关键变量**:
- `activeTab`: 当前激活的Tab（'home' | 'finance' | 'expert' | 'trade' | 'profile'）
- `activeSubRoute`: 当前激活的子路由（如 'apply', 'detail?id=123'）
- `renderContent()`: 根据Tab和子路由渲染对应页面
- `renderFinanceSubRoute()`: 渲染融资相关子页面
- `renderTradeSubRoute()`: 渲染交易相关子页面
- `renderProfileSubRoute()`: 渲染个人中心子页面
- `renderExpertSubRoute()`: 渲染专家相关子页面

**导入的页面组件**:
- `FarmerHome`: 首页
- `FarmerFinancePanel`: 融资面板
- `FarmerExpertPanel`: 专家面板
- `FarmerProductList`: 商品列表
- `FarmerProfilePanel`: 个人中心
- `FarmerOrders`: 订单列表
- 以及所有子页面（见下方详细列表）

**事件监听**:
- `onNavigationChange`: 监听Tab切换事件
- `onSubRouteChange`: 监听子路由切换事件

#### `apps/buyerApp.tsx`
**路径**: `/apps/buyerApp.tsx`  
**用途**: 买家角色的应用入口  
**关键变量**: 同 `farmerApp.tsx`，但页面组件不同

**导入的页面组件**:
- `BuyerHome`: 买家首页
- `BuyerFinancePanel`: 分期付款面板
- `BuyerExpertPanel`: 专家咨询面板
- `BuyerProductList`: 商品列表
- `BuyerProfilePanel`: 个人中心
- `BuyerCart`: 购物车
- `BuyerOrders`: 订单列表
- 子页面: `BuyerProductDetail`, `BuyerProductCompare`, `BuyerRefundProgress`, `BuyerProductReview`, `BuyerAddressManage`, `BuyerCouponInvite`, `BuyerDemand`, `BuyerMyDemands`, `BuyerDemandQuotes`

#### `apps/bankApp.tsx`
**路径**: `/apps/bankApp.tsx`  
**用途**: 银行角色的应用入口  
**关键变量**: 同 `farmerApp.tsx`

**导入的页面组件**:
- `BankDashboardPage`: 银行仪表盘
- `BankFinancePanel`: 审批面板
- `BankExpertPanel`: 客户管理面板
- `BankRiskDashboard`: 风控仪表盘
- `BankProfilePanel`: 个人中心
- `BankAppApproval`: 审批列表
- 子页面: `BankLoanProducts`, `BankApprovalDetail`, `BankScoringCard`, `BankDisbursement`, `BankPostLoan`, `BankReconciliation`, `BankContractGenerate`, `BankOverdueAlert`, `BankApplicationDownload`

#### `apps/expertApp.tsx`
**路径**: `/apps/expertApp.tsx`  
**用途**: 专家角色的应用入口  
**关键变量**: 同 `farmerApp.tsx`

**导入的页面组件**:
- `ExpertDashboardPage`: 专家仪表盘
- `ExpertIncomePanel`: 收入面板
- `ExpertQAList`: 问答列表
- `ExpertKnowledge`: 知识库
- `ExpertProfilePanel`: 个人中心
- 子页面: `ExpertCalendarPage`, `ExpertAppointmentManage`, `ExpertQADetail`, `ExpertArticleEdit`, `ExpertQualificationUpload`, `ExpertServicePrice`, `ExpertFarmerReview`

#### `apps/adminApp.tsx`
**路径**: `/apps/adminApp.tsx`  
**用途**: 管理员角色的应用入口  
**关键变量**: 同 `farmerApp.tsx`

**导入的页面组件**:
- `AdminDashboardPage`: 管理员仪表盘
- `AdminFinancePanel`: 融资监控面板
- `AdminExpertPanel`: 专家管理面板
- `AdminProductAudit`: 商品审核面板
- `AdminProfilePanel`: 个人中心
- `AdminOrderMonitor`: 订单监控
- 子页面: `AdminContentAudit`, `AdminExpertAudit`, `AdminOperationLog`, `AdminPermissionManage`, `AdminSystemConfig`, `AdminBannerManage`, `AdminCouponIssue`, `AdminGrayRelease`

### 3.3 导航系统

#### `components/Navigation.tsx`
**路径**: `/components/Navigation.tsx`  
**用途**: 顶部导航栏组件，显示Tab切换和用户操作按钮  
**关键变量**:
- `activeTab`: 当前激活的Tab（从props传入）
- `onTabChange`: Tab切换回调函数
- `messageCenterOpen`: 消息中心打开状态
- `cartCount`: 购物车商品数量（从 `cartStore` 获取）
- `unreadCount`: 未读消息数量（从 `msgStore` 获取）
- `role`: 当前用户角色（从 `RoleContext` 获取）
- `navItems`: 根据角色动态生成的导航项数组

**导航项配置** (`roleNavLabels`):
```typescript
{
  farmer: [
    { id: "home", label: "田心星云", icon: Home },
    { id: "finance", label: "田心金融", icon: DollarSign },
    { id: "expert", label: "田心学堂", icon: MessageCircle },
    { id: "trade", label: "田心市场", icon: Package },
    { id: "profile", label: "田心宇宙", icon: User },
  ],
  buyer: [...],
  bank: [...],
  expert: [...],
  admin: [...],
}
```

**子组件**:
- `MessageCenter`: 消息中心抽屉
- `SharePopover`: 分享弹窗

**动画效果**:
- 导航栏下滑出现: `initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}`
- Tab高亮滑块: `layoutId="activeTab"` + `bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20`
- 购物车/消息徽章: `initial={{ scale: 0 }} animate={{ scale: 1 }}`
- 未读消息心跳: `animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}`

#### `utils/navigationEvents.ts`
**路径**: `/utils/navigationEvents.ts`  
**用途**: 全局Tab切换事件系统，允许组件间通信切换Tab  
**关键函数**:
- `navigateToTab(tab: NavigationTab)`: 触发Tab切换事件
- `onNavigationChange(callback)`: 监听Tab切换事件，返回取消订阅函数

**事件类型**:
```typescript
type NavigationTab = 'home' | 'finance' | 'expert' | 'trade' | 'profile' | 'cart';
```

**使用场景**:
- 页面内按钮点击后需要切换到其他Tab
- 表单提交成功后跳转到列表Tab
- 深度链接需要激活特定Tab

#### `utils/subRouteNavigation.ts`
**路径**: `/utils/subRouteNavigation.ts`  
**用途**: 子路由导航系统，用于Tab内部页面跳转  
**关键函数**:
- `navigateToSubRoute(tab: string, subRoute: string, params?)`: 触发子路由切换
- `onSubRouteChange(callback)`: 监听子路由切换事件

**子路由格式**:
- 简单路由: `"apply"`, `"detail"`
- 带参数: `"detail?id=123"`, `"match?amount=50000"`

**使用场景**:
- 融资列表 → 融资详情
- 商品列表 → 商品详情
- 订单列表 → 订单详情
- 表单提交 → 详情页

### 3.4 角色上下文

#### `contexts/RoleContext.tsx`
**路径**: `/contexts/RoleContext.tsx`  
**用途**: 全局角色状态管理，提供用户信息、权限、角色等  
**关键变量**:
- `role`: 当前角色类型 (`'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null`)
- `userData` / `userProfile`: 用户资料对象
- `permissions`: 权限代码数组
- `token`: 认证令牌
- `isMobile`: 是否为移动端

**关键函数**:
- `hasPermission(code: string)`: 检查是否有指定权限
- `requireRole(role)`: 检查当前角色是否匹配
- `resetRoleState()`: 重置角色状态（登出时使用）

**持久化**:
- 使用 `localStorage` 存储: `token`, `role`, `userProfile`, `permissions`
- 自动从 `localStorage` 恢复状态

**依赖关系**:
- `config/permissions.ts`: 权限配置映射

### 3.5 页面组件详细列表

#### 农户角色页面 (`roles/farmer/pages/`)

| 文件名 | 组件名 | 用途 | 路由路径 |
|--------|--------|------|----------|
| `Home.tsx` | `FarmerHome` | 农户首页，显示WebGL星球和统计卡片 | `home` |
| `FarmerFinancePanel.tsx` | `FarmerFinancePanel` | 融资列表面板，显示所有融资申请 | `finance` |
| `Finance.tsx` | `FarmerFinanceApply` | 融资申请表单 | `finance` → `apply` |
| `FinanceDetail.tsx` | `FarmerFinanceDetail` | 融资详情页 | `finance` → `detail?id=xxx` |
| `FinanceProgress.tsx` | `FarmerFinanceProgress` | 融资审批进度 | `finance` → `progress` |
| `FinanceContractSign.tsx` | `FarmerFinanceContractSign` | 电子合同签署 | `finance` → `contract-sign` |
| `FinanceRepayPlan.tsx` | `FarmerFinanceRepayPlan` | 还款计划表 | `finance` → `repay-plan` |
| `FinanceRepay.tsx` | `FarmerFinanceRepay` | 在线还款 | `finance` → `repay` |
| `FinanceEarlyRepay.tsx` | `FarmerFinanceEarlyRepay` | 提前还款试算 | `finance` → `early-repay` |
| `FinanceMatch/MatchIntro.tsx` | `FarmerFinanceMatchIntro` | 智能拼单介绍 | `finance` → `match` |
| `FinanceMatch/MatchCandidates.tsx` | `FarmerFinanceMatchCandidates` | 匹配候选列表 | `finance` → `match/candidates` |
| `FinanceMatch/MatchDetail.tsx` | `FarmerFinanceMatchDetail` | 拼单详情 | `finance` → `match/detail` |
| `FinanceMatch/MatchCreate.tsx` | `FarmerFinanceMatchCreate` | 创建拼单 | `finance` → `match/create` |
| `FinanceMatch/MatchResult.tsx` | `FarmerFinanceMatchResult` | 拼单结果 | `finance` → `match/result` |
| `ProductList.tsx` | `FarmerProductList` | 商品列表 | `trade` |
| `ProductDashboard.tsx` | `FarmerProductDashboard` | 商品数据看板 | `trade` → `dashboard` |
| `Orders.tsx` | `FarmerOrders` | 订单列表 | `trade` → `orders` |
| `OrderDetail.tsx` | `FarmerOrderDetail` | 订单详情 | `trade` → `order-detail` |
| `OrderShip.tsx` | `FarmerOrderShip` | 发货页面 | `trade` → `ship` |
| `OrderBatchShip.tsx` | `FarmerOrderBatchShip` | 批量发货 | `trade` → `batch-ship` |
| `OrderPrintLabels.tsx` | `FarmerOrderPrintLabels` | 打印面单 | `trade` → `print-labels` |
| `Refunds.tsx` | `FarmerRefunds` | 退款管理 | `trade` → `refunds` |
| `FarmerExpertPanel.tsx` | `FarmerExpertPanel` | 专家咨询面板 | `expert` |
| `QuestionAsk.tsx` | `FarmerQuestionAsk` | 提问页面 | `expert` → `question/ask` |
| `AppointmentBook.tsx` | `FarmerAppointmentBook` | 预约专家 | `expert` → `appointment/book` |
| `KnowledgeFavorite.tsx` | `FarmerKnowledgeFavorite` | 知识收藏 | `expert` → `knowledge/favorite` |
| `FarmerProfilePanel.tsx` | `FarmerProfilePanel` | 个人中心面板 | `profile` |
| `ProfileEdit.tsx` | `FarmerProfileEdit` | 编辑资料 | `profile` → `edit` |
| `WalletPanel.tsx` | `FarmerWalletPanel` | 钱包中心 | `profile` → `wallet` |
| `BankCardManage.tsx` | `FarmerBankCardManage` | 银行卡管理 | `profile` → `bank-card` |
| `ReportPanel.tsx` | `FarmerReportPanel` | 报表中心 | `profile` → `report` |
| `Feedback.tsx` | `FarmerFeedback` | 意见反馈 | `profile` → `feedback` |
| `NotificationCenter.tsx` | `FarmerNotificationCenter` | 通知中心 | `profile` → `notifications` |
| `Settings.tsx` | `FarmerSettings` | 系统设置 | `profile` → `settings` |
| `ShippingAddressManage.tsx` | `FarmerShippingAddressManage` | 发货地址管理 | `profile` → `shipping-address` |

#### 买家角色页面 (`roles/buyer/pages/`)

| 文件名 | 组件名 | 用途 | 路由路径 |
|--------|--------|------|----------|
| `Home.tsx` | `BuyerHome` | 买家首页 | `home` |
| `ProductList.tsx` | `BuyerProductList` | 商品列表 | `trade` |
| `ProductDetail.tsx` | `BuyerProductDetail` | 商品详情 | `trade` → `product/detail` |
| `ProductCompare.tsx` | `BuyerProductCompare` | 商品对比 | `trade` → `product/compare` |
| `ProductReview.tsx` | `BuyerProductReview` | 商品评价 | `trade` → `product/review` |
| `Cart.tsx` | `BuyerCart` | 购物车 | `cart` |
| `Orders.tsx` | `BuyerOrders` | 订单列表 | `trade` → `orders` |
| `RefundProgress.tsx` | `BuyerRefundProgress` | 退款进度 | `trade` → `order/refund-progress` |
| `Demand.tsx` | `BuyerDemand` | 发布求购 | `trade` → `demand/create` |
| `MyDemands.tsx` | `BuyerMyDemands` | 我的求购 | `trade` → `demand/list` |
| `DemandQuotes.tsx` | `BuyerDemandQuotes` | 报价列表 | `trade` → `demand/quotes` |
| `BuyerFinancePanel.tsx` | `BuyerFinancePanel` | 分期付款面板 | `finance` |
| `BuyerExpertPanel.tsx` | `BuyerExpertPanel` | 专家咨询面板 | `expert` |
| `BuyerProfilePanel.tsx` | `BuyerProfilePanel` | 个人中心 | `profile` |
| `AddressManage.tsx` | `BuyerAddressManage` | 收货地址管理 | `profile` → `address` |
| `CouponInvite.tsx` | `BuyerCouponInvite` | 邀请好友 | `profile` → `invite` |

#### 银行角色页面 (`roles/bank/pages/`)

| 文件名 | 组件名 | 用途 | 路由路径 |
|--------|--------|------|----------|
| `Dashboard.tsx` | `BankDashboardPage` | 银行仪表盘 | `home` |
| `BankFinancePanel.tsx` | `BankFinancePanel` | 产品中心面板 | `finance` |
| `LoanProducts.tsx` | `BankLoanProducts` | 贷款产品管理 | `finance` → `products` |
| `AppApproval.tsx` | `BankAppApproval` | 审批列表 | `finance` → `approval/list` |
| `BankApprovalDetail.tsx` | `BankApprovalDetail` | 审批详情 | `finance` → `approval/detail` |
| `BankScoringCard.tsx` | `BankScoringCard` | 评分卡 | `finance` → `scoring` |
| `BankDisbursement.tsx` | `BankDisbursement` | 放款中心 | `finance` → `disbursement` |
| `PostLoan.tsx` | `BankPostLoan` | 贷后管理 | `finance` → `post-loan` |
| `BankReconciliation.tsx` | `BankReconciliation` | 对账中心 | `finance` → `reconciliation` |
| `ContractGenerate.tsx` | `BankContractGenerate` | 合同生成 | `finance` → `contract` |
| `OverdueAlert.tsx` | `BankOverdueAlert` | 逾期预警 | `finance` → `overdue` |
| `ApplicationDownload.tsx` | `BankApplicationDownload` | 申请资料下载 | `finance` → `download` |
| `BankExpertPanel.tsx` | `BankExpertPanel` | 客户管理 | `expert` |
| `RiskDashboard.tsx` | `BankRiskDashboard` | 风控仪表盘 | `trade` |
| `BankProfilePanel.tsx` | `BankProfilePanel` | 个人中心 | `profile` |

#### 专家角色页面 (`roles/expert/pages/`)

| 文件名 | 组件名 | 用途 | 路由路径 |
|--------|--------|------|----------|
| `Dashboard.tsx` | `ExpertDashboardPage` | 专家仪表盘 | `home` |
| `QAList.tsx` | `ExpertQAList` | 问答列表 | `expert` |
| `QADetail.tsx` | `ExpertQADetail` | 问答详情 | `expert` → `qa/detail` |
| `Calendar.tsx` | `ExpertCalendarPage` | 预约日历 | `expert` → `calendar` |
| `AppointmentManage.tsx` | `ExpertAppointmentManage` | 预约管理 | `expert` → `appointment` |
| `Knowledge.tsx` | `ExpertKnowledge` | 知识库 | `trade` |
| `ArticleEdit.tsx` | `ExpertArticleEdit` | 文章编辑 | `trade` → `edit` |
| `ExpertIncomePanel.tsx` | `ExpertIncomePanel` | 收入面板 | `finance` |
| `ExpertProfilePanel.tsx` | `ExpertProfilePanel` | 个人中心 | `profile` |
| `QualificationUpload.tsx` | `ExpertQualificationUpload` | 资质认证 | `profile` → `qualification` |
| `ServicePrice.tsx` | `ExpertServicePrice` | 服务价格 | `profile` → `price` |
| `FarmerReview.tsx` | `ExpertFarmerReview` | 评价农户 | `profile` → `farmer-review` |

#### 管理员角色页面 (`roles/admin/pages/`)

| 文件名 | 组件名 | 用途 | 路由路径 |
|--------|--------|------|----------|
| `Dashboard.tsx` | `AdminDashboardPage` | 管理员仪表盘 | `home` |
| `AdminFinancePanel.tsx` | `AdminFinancePanel` | 融资监控 | `finance` |
| `AdminExpertPanel.tsx` | `AdminExpertPanel` | 专家管理 | `expert` |
| `ProductAudit.tsx` | `AdminProductAudit` | 商品审核 | `trade` |
| `ContentAudit.tsx` | `AdminContentAudit` | 内容审核 | `expert` → `content` |
| `ExpertAudit.tsx` | `AdminExpertAudit` | 专家审核 | `expert` → `expert` |
| `OrderMonitor.tsx` | `AdminOrderMonitor` | 订单监控 | `cart` |
| `RefundDisputes.tsx` | `AdminRefundDisputes` | 退款纠纷 | `trade` → `refunds` |
| `UserManage.tsx` | `AdminUserManage` | 用户管理 | `profile` → `users` |
| `AdminProfilePanel.tsx` | `AdminProfilePanel` | 个人中心 | `profile` |
| `PermissionManage.tsx` | `AdminPermissionManage` | 权限管理 | `profile` → `permission` |
| `OperationLog.tsx` | `AdminOperationLog` | 操作日志 | `profile` → `log` |
| `SystemConfig.tsx` | `AdminSystemConfig` | 系统配置 | `profile` → `config` |
| `BannerManage.tsx` | `AdminBannerManage` | 轮播图管理 | `home` → `banner` |
| `CouponIssue.tsx` | `AdminCouponIssue` | 优惠券发放 | `home` → `coupon` |
| `GrayRelease.tsx` | `AdminGrayRelease` | 灰度发布 | `home` → `gray` |

### 3.6 通用组件

#### `components/common/` 目录

| 文件名 | 组件名 | 用途 | 关键Props |
|--------|--------|------|-----------|
| `StatsCard.tsx` | `StatsCard` | 统计卡片 | `icon`, `title`, `value`, `subtitle` |
| `SimpleLineChart.tsx` | `SimpleLineChart` | 简单折线图 | `data: Array<{name: string, value: number}>` |
| `SearchBar.tsx` | `SearchBar` | 搜索栏 | `onSearch`, `placeholder` |
| `FilterPanel.tsx` | `FilterPanel` | 筛选面板 | `title`, `value`, `onChange`, `options` |
| `FileUploader.tsx` | `FileUploader` | 文件上传 | `onUpload`, `accept`, `maxSize` |
| `DateRangePicker.tsx` | `DateRangePicker` | 日期范围选择器 | `onChange`, `startDate`, `endDate` |
| `RichTextEditor.tsx` | `RichTextEditor` | 富文本编辑器 | `value`, `onChange` |
| `QtyStepper.tsx` | `QtyStepper` | 数量步进器 | `value`, `onChange`, `min`, `max` |
| `SwipeDelete.tsx` | `SwipeDelete` | 滑动删除 | `onDelete`, `children` |
| `Model360.tsx` | `Model360` | 360度图片查看器 | `images: string[]` |
| `SharePopover.tsx` | `SharePopover` | 分享弹窗 | - |
| `CartIcon.tsx` | `CartIcon` | 购物车图标 | `count` |
| `IMFloat.tsx` | `IMFloat` | 即时通讯浮动按钮 | - |
| `DemandFab.tsx` | `DemandFab` | 发布需求浮动按钮 | - |
| `GlobalLoading.tsx` | `GlobalLoading` | 全局加载组件 | - |
| `GlobalErrorBoundary.tsx` | `GlobalErrorBoundary` | 全局错误边界 | `children` |

#### `components/ui/` 目录

基于 **shadcn/ui** 的UI组件库，包含：
- `button.tsx`: 按钮组件
- `input.tsx`: 输入框
- `dialog.tsx`: 对话框
- `form.tsx`: 表单组件（配合 react-hook-form）
- `card.tsx`: 卡片
- `tabs.tsx`: 标签页
- `toast.tsx` / `sonner.tsx`: 通知组件
- 等等...

### 3.7 状态管理 (Stores)

#### `stores/financingStore.ts`
**用途**: 融资申请状态管理  
**关键状态**:
- `list`: 融资申请列表
- `createFromFarmer()`: 创建农户融资申请
- `updateStatus()`: 更新融资状态
- `getById()`: 根据ID获取融资申请

#### `stores/cartStore.ts`
**用途**: 购物车状态管理  
**关键状态**:
- `items`: 购物车商品列表
- `count`: 商品数量
- `totalAmount`: 总金额
- `addItem()`: 添加商品
- `removeItem()`: 删除商品
- `updateQuantity()`: 更新数量
- `clear()`: 清空购物车

#### `stores/buyerOrderStore.ts`
**用途**: 买家订单状态管理  
**关键状态**:
- `orders`: 订单列表
- `createOrder()`: 创建订单
- `updateOrderStatus()`: 更新订单状态

#### `stores/farmerOrderStore.ts`
**用途**: 农户订单状态管理  
**关键状态**: 同 `buyerOrderStore.ts`

#### `stores/farmerProductStore.ts`
**用途**: 农户商品状态管理  
**关键状态**:
- `products`: 商品列表
- `addProduct()`: 添加商品
- `updateProduct()`: 更新商品
- `deleteProduct()`: 删除商品

#### `stores/bankProductStore.ts`
**用途**: 银行贷款产品状态管理  
**关键状态**:
- `products`: 产品列表
- `addProduct()`: 添加产品
- `updateProduct()`: 更新产品
- `removeProduct()`: 删除产品

#### `stores/bankApprovalStore.ts`
**用途**: 银行审批状态管理  
**关键状态**:
- `approvals`: 审批列表
- `approve()`: 批准申请
- `reject()`: 拒绝申请

#### `stores/expertQAStore.ts`
**用途**: 专家问答状态管理  
**关键状态**:
- `questions`: 问题列表
- `answers`: 回答列表
- `addAnswer()`: 添加回答
- `adoptAnswer()`: 采纳回答

#### `stores/expertIncomeStore.ts`
**用途**: 专家收入状态管理  
**关键状态**:
- `qaEarnings`: 问答收入
- `appointmentEarnings`: 预约收入
- `withdrawTotal`: 累计提现
- `totalEarnings`: 总收入（计算属性）
- `withdrawableBalance`: 可提现余额（计算属性）
- `addQaEarning()`: 增加问答收入
- `addAppointmentEarning()`: 增加预约收入
- `withdraw()`: 提现

#### `stores/expertCalendarStore.ts`
**用途**: 专家日历状态管理  
**关键状态**:
- `appointments`: 预约列表
- `availableSlots`: 可用时间段
- `bookAppointment()`: 预约
- `cancelAppointment()`: 取消预约

#### `stores/msgStore.ts`
**用途**: 消息通知状态管理  
**关键状态**:
- `messages`: 消息列表
- `unread`: 未读数量
- `addMessage()`: 添加消息
- `markAsRead()`: 标记已读

#### `stores/demandStore.ts`
**用途**: 求购需求状态管理  
**关键状态**:
- `demands`: 需求列表
- `quotes`: 报价列表
- `createDemand()`: 创建需求
- `addQuote()`: 添加报价

#### `stores/adminAuditStore.ts`
**用途**: 管理员审核状态管理  
**关键状态**:
- `pendingAudits`: 待审核列表
- `approve()`: 批准
- `reject()`: 拒绝

#### `stores/adminUserStore.ts`
**用途**: 管理员用户管理状态  
**关键状态**:
- `users`: 用户列表
- `enableUser()`: 启用用户
- `disableUser()`: 禁用用户

---

## 4. 文件关联关系

### 4.1 依赖关系图

```
App.tsx
├── router/index.tsx
│   ├── apps/farmerApp.tsx
│   │   ├── components/Navigation.tsx
│   │   ├── roles/farmer/pages/*.tsx
│   │   ├── utils/navigationEvents.ts
│   │   └── utils/subRouteNavigation.ts
│   ├── apps/buyerApp.tsx
│   ├── apps/bankApp.tsx
│   ├── apps/expertApp.tsx
│   └── apps/adminApp.tsx
├── contexts/RoleContext.tsx
│   └── config/permissions.ts
└── components/common/GlobalErrorBoundary.tsx
```

### 4.2 组件引用关系

#### Navigation 组件引用链
```
Navigation.tsx
├── MessageCenter (消息中心)
├── SharePopover (分享弹窗)
├── useCartStore (购物车状态)
├── useMsgStore (消息状态)
└── useRole (角色上下文)
```

#### 页面组件通用引用
```
{Role}Page.tsx
├── components/common/StatsCard
├── components/common/SimpleLineChart
├── components/ui/Button
├── components/ui/Input
├── components/ui/Form
├── stores/{role}Store
├── utils/navigationEvents (navigateToTab)
└── utils/subRouteNavigation (navigateToSubRoute)
```

### 4.3 数据流

```
用户操作
  ↓
页面组件 (onClick/onSubmit)
  ↓
事件系统 (navigateToTab / navigateToSubRoute)
  ↓
App组件 (更新 activeTab / activeSubRoute)
  ↓
渲染对应页面组件
  ↓
页面组件读取 Store 数据
  ↓
Store 更新触发组件重渲染
```

---

## 5. 操作流程与页面跳转

### 5.1 农户角色流程

#### 融资申请流程
```
FarmerFinancePanel (融资列表)
  ↓ [点击"申请融资"按钮]
Finance.tsx (融资申请表单)
  ↓ [提交表单]
  ├─ 金额 >= 最低额度 → FinanceDetail.tsx (融资详情)
  └─ 金额 < 最低额度 → FinanceMatch/MatchIntro.tsx (智能拼单介绍)
      ↓ [开始匹配]
      FinanceMatch/MatchCandidates.tsx (匹配候选)
          ↓ [选择拼单]
          FinanceMatch/MatchDetail.tsx (拼单详情)
              ↓ [确认加入]
              FinanceMatch/MatchResult.tsx (拼单结果)
                  ↓ [提交审批]
                  FinanceDetail.tsx (融资详情)
```

**关键跳转代码**:
```typescript
// Finance.tsx
const handleSubmit = form.handleSubmit((values) => {
  if (values.amount < minLoanAmount) {
    navigateToSubRoute("finance", `match?amount=${values.amount}`);
    return;
  }
  const financing = createFromFarmer({...});
  navigateToSubRoute("finance", `detail?id=${financing.id}`);
});
```

#### 融资审批流程
```
FinanceDetail.tsx (融资详情)
  ↓ [查看进度]
FinanceProgress.tsx (审批进度)
  ↓ [审批通过，需要签署合同]
FinanceContractSign.tsx (合同签署)
  ↓ [签署完成]
FinanceRepayPlan.tsx (还款计划)
  ↓ [开始还款]
FinanceRepay.tsx (在线还款)
  ↓ [或提前还款]
FinanceEarlyRepay.tsx (提前还款试算)
```

#### 商品管理流程
```
ProductList.tsx (商品列表)
  ↓ [点击商品]
ProductDashboard.tsx (商品数据看板)
  ↓ [或点击订单]
Orders.tsx (订单列表)
  ↓ [点击订单详情]
OrderDetail.tsx (订单详情)
  ↓ [发货]
OrderShip.tsx (发货页面)
  ↓ [或批量发货]
OrderBatchShip.tsx (批量发货)
      ↓ [打印面单]
      OrderPrintLabels.tsx (打印面单)
```

#### 专家咨询流程
```
FarmerExpertPanel.tsx (专家面板)
  ↓ [提问]
QuestionAsk.tsx (提问页面)
  ↓ [或预约]
AppointmentBook.tsx (预约专家)
  ↓ [查看收藏]
KnowledgeFavorite.tsx (知识收藏)
```

### 5.2 买家角色流程

#### 购物流程
```
ProductList.tsx (商品列表)
  ↓ [点击商品]
ProductDetail.tsx (商品详情)
  ↓ [加入购物车]
Cart.tsx (购物车)
  ↓ [结算]
Orders.tsx (订单列表)
  ↓ [订单完成]
ProductReview.tsx (商品评价)
```

#### 求购流程
```
ProductList.tsx
  ↓ [发布求购]
Demand.tsx (发布求购)
  ↓ [提交]
MyDemands.tsx (我的求购)
  ↓ [查看报价]
DemandQuotes.tsx (报价列表)
  ↓ [接受报价]
Orders.tsx (创建订单)
```

#### 退款流程
```
Orders.tsx (订单列表)
  ↓ [申请退款]
RefundProgress.tsx (退款进度)
```

### 5.3 银行角色流程

#### 审批流程
```
BankFinancePanel.tsx (产品中心)
  ↓ [查看审批列表]
AppApproval.tsx (审批列表)
  ↓ [点击申请]
BankApprovalDetail.tsx (审批详情)
  ↓ [查看评分卡]
BankScoringCard.tsx (评分卡)
  ↓ [审批通过]
ContractGenerate.tsx (合同生成)
  ↓ [放款]
BankDisbursement.tsx (放款中心)
  ↓ [贷后管理]
PostLoan.tsx (贷后管理)
      ↓ [逾期预警]
      OverdueAlert.tsx (逾期预警)
```

#### 产品管理流程
```
BankFinancePanel.tsx
  ↓ [产品管理]
LoanProducts.tsx (贷款产品管理)
  ↓ [创建/编辑产品]
  (表单提交后返回列表)
```

### 5.4 专家角色流程

#### 问答流程
```
ExpertQAList.tsx (问答列表)
  ↓ [点击问题]
ExpertQADetail.tsx (问答详情)
  ↓ [回答]
  (提交后返回列表)
```

#### 预约管理流程
```
ExpertDashboardPage.tsx
  ↓ [预约管理]
AppointmentManage.tsx (预约管理)
  ↓ [设置日历]
Calendar.tsx (预约日历)
```

#### 知识发布流程
```
ExpertKnowledge.tsx (知识库)
  ↓ [发布文章]
ArticleEdit.tsx (文章编辑)
  ↓ [提交]
  (返回知识库列表)
```

#### 收入管理流程
```
ExpertIncomePanel.tsx (收入面板)
  ↓ [查看详情]
  (显示问答收入和预约收入)
  ↓ [提现]
  (调用 withdraw 方法)
```

### 5.5 管理员角色流程

#### 审核流程
```
AdminExpertPanel.tsx (专家管理)
  ↓ [内容审核]
ContentAudit.tsx (内容审核)
  ↓ [专家审核]
ExpertAudit.tsx (专家审核)
  ↓ [商品审核]
ProductAudit.tsx (商品审核)
```

#### 系统管理流程
```
AdminProfilePanel.tsx (个人中心)
  ↓ [权限管理]
PermissionManage.tsx (权限管理)
  ↓ [操作日志]
OperationLog.tsx (操作日志)
  ↓ [系统配置]
SystemConfig.tsx (系统配置)
```

#### 运营管理流程
```
AdminDashboardPage.tsx (仪表盘)
  ↓ [轮播图管理]
BannerManage.tsx (轮播图管理)
  ↓ [优惠券发放]
CouponIssue.tsx (优惠券发放)
  ↓ [灰度发布]
GrayRelease.tsx (灰度发布)
```

---

## 6. 组件与变量命名规范

### 6.1 组件命名规范

#### 页面组件
- **格式**: `{Role}{Feature}Page` 或 `{Role}{Feature}Panel`
- **示例**:
  - `FarmerFinancePanel`: 农户融资面板
  - `BuyerProductDetail`: 买家商品详情
  - `BankApprovalDetail`: 银行审批详情
  - `ExpertDashboardPage`: 专家仪表盘
  - `AdminFinancePanel`: 管理员融资监控

#### 通用组件
- **格式**: `{Feature}{Type}` 或 `{Feature}`
- **示例**:
  - `StatsCard`: 统计卡片
  - `SearchBar`: 搜索栏
  - `FileUploader`: 文件上传器
  - `SimpleLineChart`: 简单折线图

#### UI基础组件
- **格式**: 小写开头，遵循 shadcn/ui 规范
- **示例**: `button`, `input`, `dialog`, `form`

### 6.2 变量命名规范

#### 状态变量
- **格式**: `{name}State` 或直接使用描述性名称
- **示例**:
  - `activeTab`: 当前激活的Tab
  - `activeSubRoute`: 当前激活的子路由
  - `messageCenterOpen`: 消息中心打开状态
  - `searchQuery`: 搜索查询字符串

#### Store状态
- **格式**: 使用Zustand约定，直接使用描述性名称
- **示例**:
  - `products`: 产品列表
  - `orders`: 订单列表
  - `cartItems`: 购物车商品
  - `unreadCount`: 未读数量

#### 函数命名
- **事件处理**: `handle{Action}`
  - `handleSubmit`: 提交处理
  - `handleClick`: 点击处理
  - `handleChange`: 变化处理
- **导航函数**: `navigateTo{Target}`
  - `navigateToLogin`: 导航到登录页
  - `navigateToProfile`: 导航到个人中心
  - `navigateToProductList`: 导航到商品列表
- **Store方法**: `{action}{Entity}`
  - `addProduct`: 添加产品
  - `updateOrder`: 更新订单
  - `removeItem`: 删除项目
  - `createFromFarmer`: 从农户创建融资

---

## 7. 设计风格与动画系统

### 7.1 视觉设计规范

#### 背景与颜色系统

**背景色**:
- 主背景: `bg-[#050816]` (深色宇宙背景)
- 容器背景: `bg-[#0A0F1E]` (带轻微蓝偏)
- 卡片背景: `bg-white/5` (5%白色透明度，玻璃态效果)

**主色渐变**:
- 农业金融主色: `from-[#00D6C2] to-[#18FF74]` (青绿渐变)
- 银行金色: `from-[#FFD700] to-[#FF8C00]` (金色渐变)
- 专家紫色: `from-[#A78BFA] to-[#FF6B9D]` (紫粉渐变)
- 管理员紫红: `from-[#9D4EDD] to-[#FF6B9D]` (紫红渐变)

**文字颜色层级**:
- 主要文字: `text-white`
- 次要说明: `text-white/60`
- 弱提示: `text-white/40`
- 渐变文字: `text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]`

#### Glassmorphism（玻璃拟态）

**通用样式类**:
```css
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 1rem; /* rounded-2xl */
}
```

**高亮卡片**:
- 边框强化: `border-[#18FF74]/50`
- 背景渐变: `from-[#00D6C2]/10 to-[#18FF74]/10`
- 阴影效果: `box-shadow: 0 0 20px rgba(0, 214, 194, 0.3)`

#### 布局规范

**页面结构**:
- 顶部导航: `fixed top-0 left-0 right-0 z-40`
- 主体区域: `max-w-7xl mx-auto px-6 pt-24 pb-12`
- Section间距: `space-y-8` 或 `mb-8 ~ mb-12`
- 卡片内边距: `p-6` 或 `p-8`

**Section标题**:
- 左侧竖条: `w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full`
- 标题文字: `text-lg` ~ `text-xl`
- 说明文字: `text-sm text-white/60`

### 7.2 动画系统详解

#### Motion/React 动画库

**库信息**:
- 库名: `motion/react` (Framer Motion 的 React 版本)
- 用途: 所有页面动画、过渡效果、手势交互

#### 通用动画模式

**1. 页面进入动画**
```typescript
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```
- **用途**: 页面标题、主要区块
- **参数**: 
  - `opacity`: 0 → 1 (淡入)
  - `y`: -20 → 0 (从上方滑入)
  - `duration`: 0.3s (标准时长)

**2. 列表项Stagger动画**
```typescript
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
  >
```
- **用途**: 商品列表、订单列表、专家列表
- **参数**: 
  - `delay: index * 0.05` (每个项目延迟50ms，形成波浪效果)

**3. 悬浮交互动画**
```typescript
<motion.div
  whileHover={{ y: -4, scale: 1.02 }}
  whileTap={{ scale: 0.95 }}
>
```
- **用途**: 卡片、按钮
- **参数**:
  - `y: -4` (悬浮时上移4px)
  - `scale: 1.02` (放大2%)
  - `scale: 0.95` (点击时缩小5%)

**4. Tab切换滑块动画**
```typescript
<motion.div
  layoutId="activeTab"
  className="absolute inset-0 bg-gradient-to-r from-[#00D6C2]/20 to-[#18FF74]/20"
  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
/>
```
- **用途**: 导航栏Tab切换、页面内Tab切换
- **参数**:
  - `layoutId`: 共享布局ID，实现平滑滑块效果
  - `type: "spring"`: 弹性动画
  - `duration: 0.6s`: 动画时长

**5. 徽章/角标动画**
```typescript
<motion.span
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", bounce: 0.6 }}
>
```
- **用途**: 购物车数量、未读消息数
- **参数**:
  - `scale: 0 → 1` (弹出效果)
  - `bounce: 0.6` (弹性效果)

**6. 心跳/呼吸动画**
```typescript
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```
- **用途**: 未读消息红点、在线状态指示器
- **参数**:
  - `scale`: [1, 1.2, 1] (缩放循环)
  - `opacity`: [1, 0.8, 1] (透明度循环)
  - `repeat: Infinity` (无限循环)

#### 特殊动画组件

**1. WebGLSphere (WebGL星球)**

**文件**: `components/WebGLSphere.tsx`  
**用途**: 各角色Dashboard首页的3D星球动画

**关键变量**:
- `canvasRef`: Canvas元素引用
- `mousePos`: 鼠标位置 `{x: number, y: number}`
- `isDayMode`: 日夜模式状态 `boolean`
- `rotation`: 星球旋转角度 `number`
- `colorTransition`: 颜色过渡值 `0-1`

**动画特性**:
- **自动旋转**: `rotation += 0.2` (每帧旋转0.2度)
- **鼠标视差**: `offsetX = mousePos.x * 0.3 / 100`
- **日夜切换**: 
  - 日间(6:00-18:00): 色温6500K，粒子80颗
  - 夜间(其他时间): 色温3000K，粒子120颗
- **色温插值**: `lerpColor(colorTransition)` (平滑过渡1.2s)
- **卫星轨迹**: 夜间显示3颗卫星的冷光轨迹

**Props接口**:
```typescript
interface WebGLSphereProps {
  title?: string;           // 标题文字
  subtitle?: string;        // 副标题
  gradientFrom?: string;    // 渐变起始色
  gradientTo?: string;      // 渐变结束色
}
```

**使用示例**:
```typescript
<WebGLSphere
  title="田心星云·数字农场"
  subtitle="种植智慧，收获未来"
  gradientFrom="#18FF74"
  gradientTo="#00D6C2"
/>
```

**2. StatsCard (统计卡片)**

**文件**: `components/common/StatsCard.tsx`  
**用途**: 显示统计数据（金额、数量、百分比等）

**Props接口**:
```typescript
interface StatsCardProps {
  title: string;        // 标题
  value: string;        // 数值（字符串格式）
  subtitle?: string;    // 副标题
  icon?: ReactNode;     // 图标
  color?: string;       // 主题色（默认#18FF74）
}
```

**样式特点**:
- 玻璃态背景: `bg-white/5 border border-white/10`
- 圆角: `rounded-xl`
- 数值使用等宽字体: `font-mono`
- 图标颜色跟随 `color` prop

**使用示例**:
```typescript
<StatsCard
  icon={<DollarSign className="w-6 h-6" />}
  title="融资总额"
  value="¥1,250,000"
  subtitle="累计融资金额"
  color="#00D6C2"
/>
```

**3. SimpleLineChart (简单折线图)**

**文件**: `components/common/SimpleLineChart.tsx`  
**用途**: 显示趋势数据（基于 Recharts）

**Props接口**:
```typescript
interface SimpleLineChartProps {
  data: { name: string; value: number }[];
}
```

**数据格式**:
```typescript
const mockTrend = [
  { name: "1月", value: 100000 },
  { name: "2月", value: 150000 },
  { name: "3月", value: 120000 },
  // ...
];
```

**样式特点**:
- 深色主题: 背景 `bg-white/5`，网格线 `#1f2937`
- 绿色折线: `stroke="#22c55e"` (emerald-500)
- 无数据点: `dot={false}` (简洁风格)

### 7.3 角色特定设计风格

#### 农户 (Farmer)
- **主色**: `#18FF74` (荧光绿) → `#00D6C2` (青绿)
- **图标**: 🌾 农田、植物相关
- **卡片强调**: 订单金额、产量、认证信息
- **WebGL标题**: "田心星云·数字农场"

#### 买家 (Buyer)
- **主色**: `#00D6C2` (青绿) → `#18FF74` (荧光绿)
- **图标**: 🛒 购物、订单相关
- **卡片强调**: 价格对比、折扣、优惠券
- **WebGL标题**: "购市星云·采购驾驶舱"

#### 银行 (Bank)
- **主色**: `#FFD700` (金色) → `#FF8C00` (橙色)
- **图标**: 📊 图表、盾牌、雷达
- **卡片强调**: 风控数据、审批统计、放款金额
- **WebGL标题**: "资本星云·风控驾驶舱"

#### 专家 (Expert)
- **主色**: `#A78BFA` (紫色) → `#FF6B9D` (粉色)
- **图标**: 📚 知识、内容相关
- **卡片强调**: 评分、咨询次数、收入
- **WebGL标题**: "知识星系·专家工作台"

#### 管理员 (Admin)
- **主色**: `#9D4EDD` (深紫) → `#FF6B9D` (粉红)
- **图标**: ⚙️ 设置、监控、日志
- **卡片强调**: 系统数据、审核统计、用户管理
- **WebGL标题**: "控制星云·运营中台"

### 7.4 动画时长规范

| 动画类型 | 时长 | 缓动函数 | 使用场景 |
|---------|------|---------|---------|
| 微交互 | 200ms | ease-out | 按钮悬停、图标变化 |
| 标准动效 | 300-400ms | ease-in-out | 卡片展开、表单验证 |
| 页面转场 | 600-800ms | spring | 路由切换、模态弹窗 |
| 长动画 | 1.2s-2s | ease-in-out | 加载动画、星云爆发 |
| 循环动画 | 2s | ease-in-out (repeat) | 呼吸灯、心跳效果 |

---

## 8. 状态管理架构

### 8.1 Zustand Store 设计模式

**库信息**:
- 库名: `zustand`
- 版本: 最新稳定版
- 特点: 轻量级、TypeScript友好、无需Provider

**Store结构模式**:
```typescript
interface {Entity}State {
  // 状态
  items: Entity[];
  count: number;
  
  // 计算属性（可选）
  get totalAmount(): number;
  
  // 操作方法
  add: (item: Entity) => void;
  update: (id: string, updates: Partial<Entity>) => void;
  remove: (id: string) => void;
}

export const use{Entity}Store = create<{Entity}State>((set, get) => ({
  // 初始状态
  items: [],
  count: 0,
  
  // 方法实现
  add: (item) => set((state) => ({ items: [...state.items, item] })),
  // ...
}));
```

### 8.2 Store 详细说明

#### `stores/financingStore.ts`

**用途**: 融资申请全生命周期状态管理

**状态结构**:
```typescript
interface Financing {
  id: string;
  farmerId: string;
  amount: number;
  termMonths: number;
  purpose: string;
  status: FinancingStatus;
  createdAt: string;
  timeline: FinancingTimelineItem[];
  repaymentSchedule: RepaymentInstallment[];
}
```

**状态类型**:
```typescript
type FinancingStatus =
  | 'applied'      // 已申请
  | 'reviewing'    // 审批中
  | 'approved'     // 已通过
  | 'rejected'     // 已拒绝
  | 'signed'       // 已签约
  | 'disbursed'    // 已放款
  | 'repaying'     // 还款中
  | 'settled';     // 已结清
```

**关键方法**:
- `createFromFarmer(payload)`: 创建农户融资申请，自动生成ID和时间线
- `updateStatus(id, status)`: 更新融资状态，自动添加时间线记录
- `appendTimeline(id, item)`: 追加时间线记录
- `setRepaymentSchedule(id, schedule)`: 设置还款计划
- `markInstallmentPaid(financingId, instId)`: 标记某期还款为已付

**使用场景**:
- `FarmerFinancePanel`: 显示融资列表
- `FinanceDetail`: 显示融资详情
- `FinanceProgress`: 显示审批进度
- `FinanceRepayPlan`: 显示还款计划

#### `stores/cartStore.ts`

**用途**: 购物车状态管理

**状态结构**:
```typescript
interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
  origin: string;
  selected: boolean;
}
```

**关键方法**:
- `add(product)`: 添加商品到购物车（如果已存在则更新数量）
- `remove(id)`: 删除商品
- `updateQuantity(id, quantity)`: 更新商品数量（限制在1-stock之间）
- `toggleSelect(id)`: 切换商品选中状态
- `selectAll(selected)`: 全选/取消全选
- `clearSelected()`: 清空已选商品
- `checkout()`: 结算（清空已选商品）

**计算属性**:
- `count`: 商品总数量（自动计算）
- `totalAmount`: 总金额（自动计算）

**使用场景**:
- `BuyerCart`: 购物车页面
- `Navigation`: 显示购物车数量徽章
- `ProductDetail`: 加入购物车操作

#### `stores/buyerOrderStore.ts`

**用途**: 买家订单状态管理

**状态结构**:
```typescript
interface BuyerOrder {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress?: string;
}
```

**关键方法**:
- `createOrder(orderData)`: 创建订单
- `createOrderFromCart(items)`: 从购物车创建订单
- `updateOrderStatus(id, status)`: 更新订单状态
- `cancelOrder(id)`: 取消订单

#### `stores/farmerOrderStore.ts`

**用途**: 农户订单状态管理（与买家订单结构类似，但视角不同）

**关键方法**:
- `getOrdersByFarmer(farmerId)`: 获取农户的所有订单
- `updateShippingInfo(id, shippingInfo)`: 更新物流信息
- `markAsShipped(id)`: 标记为已发货

#### `stores/farmerProductStore.ts`

**用途**: 农户商品管理

**状态结构**:
```typescript
interface FarmerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  origin: string;
  description?: string;
  images?: string[];
  status: 'draft' | 'published' | 'sold_out';
}
```

**关键方法**:
- `addProduct(product)`: 添加商品
- `updateProduct(id, updates)`: 更新商品信息
- `deleteProduct(id)`: 删除商品
- `publishProduct(id)`: 发布商品
- `unpublishProduct(id)`: 下架商品

#### `stores/bankProductStore.ts`

**用途**: 银行贷款产品管理

**状态结构**:
```typescript
interface BankLoanProduct {
  id: string;
  name: string;
  rate: number;           // 年利率（%）
  minAmount: number;      // 最小金额
  maxAmount: number;      // 最大金额
  termMonths: number;     // 期限（月）
}
```

**关键方法**:
- `addProduct(product)`: 添加贷款产品
- `updateProduct(id, updates)`: 更新产品信息
- `removeProduct(id)`: 删除产品

**使用场景**:
- `BankFinancePanel`: 显示产品列表
- `LoanProducts`: 产品管理页面
- `Finance`: 农户申请时选择产品

#### `stores/bankApprovalStore.ts`

**用途**: 银行审批状态管理

**状态结构**:
```typescript
interface Approval {
  id: string;
  financingId: string;
  farmerId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  score?: number;         // 评分卡分数
  reviewerId?: string;    // 审批人ID
  reviewedAt?: string;    // 审批时间
}
```

**关键方法**:
- `addApproval(approval)`: 添加审批记录
- `approve(id, score)`: 批准申请
- `reject(id, reason)`: 拒绝申请

#### `stores/expertQAStore.ts`

**用途**: 专家问答状态管理

**状态结构**:
```typescript
interface Question {
  id: string;
  farmerId: string;
  farmerName: string;
  title: string;
  content: string;
  bounty: number;         // 悬赏金额
  status: 'pending' | 'answered' | 'adopted';
  createdAt: string;
}

interface Answer {
  id: string;
  questionId: string;
  expertId: string;
  expertName: string;
  content: string;
  isAdopted: boolean;
  createdAt: string;
}
```

**关键方法**:
- `addQuestion(question)`: 添加问题
- `addAnswer(answer)`: 添加回答
- `adoptAnswer(questionId, answerId)`: 采纳回答（农户操作）

#### `stores/expertIncomeStore.ts`

**用途**: 专家收入状态管理

**状态结构**:
```typescript
interface ExpertIncomeState {
  qaEarnings: number;              // 问答收入
  appointmentEarnings: number;      // 预约收入
  withdrawTotal: number;            // 累计提现
  totalEarnings: number;            // 总收入（计算属性）
  withdrawableBalance: number;      // 可提现余额（计算属性）
}
```

**关键方法**:
- `addQaEarning(amount)`: 增加问答收入
- `addAppointmentEarning(amount)`: 增加预约收入
- `withdraw(amount)`: 提现（检查余额）

**计算属性**:
- `totalEarnings`: `qaEarnings + appointmentEarnings`
- `withdrawableBalance`: `totalEarnings - withdrawTotal`

#### `stores/expertCalendarStore.ts`

**用途**: 专家预约日历状态管理

**状态结构**:
```typescript
interface Appointment {
  id: string;
  farmerId: string;
  farmerName: string;
  date: string;           // YYYY-MM-DD
  timeSlot: string;       // HH:mm-HH:mm
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

interface AvailableSlot {
  date: string;
  timeSlot: string;
  isAvailable: boolean;
}
```

**关键方法**:
- `bookAppointment(appointment)`: 预约
- `confirmAppointment(id)`: 确认预约
- `cancelAppointment(id)`: 取消预约
- `setAvailableSlots(date, slots)`: 设置可用时间段

#### `stores/msgStore.ts`

**用途**: 消息通知状态管理

**状态结构**:
```typescript
interface Message {
  id: string;
  type: 'system' | 'order' | 'finance' | 'expert';
  title: string;
  content: string;
  link?: string;           // 跳转链接
  isRead: boolean;
  createdAt: string;
}
```

**关键方法**:
- `addMessage(message)`: 添加消息
- `markAsRead(id)`: 标记已读
- `markAllAsRead()`: 全部标记已读
- `removeMessage(id)`: 删除消息

**计算属性**:
- `unread`: 未读消息数量（自动计算）

#### `stores/demandStore.ts`

**用途**: 求购需求状态管理

**状态结构**:
```typescript
interface Demand {
  id: string;
  buyerId: string;
  productName: string;
  quantity: number;
  unit: string;
  expectedPrice?: number;
  deliveryDate: string;
  address: string;
  description?: string;
  images?: string[];
  status: 'open' | 'quoted' | 'ordered' | 'closed';
  createdAt: string;
}

interface Quote {
  id: string;
  demandId: string;
  farmerId: string;
  farmerName: string;
  price: number;
  quantity: string;
  deliveryTime: string;
  message?: string;
  createdAt: string;
}
```

**关键方法**:
- `createDemand(demand)`: 创建求购需求
- `addQuote(quote)`: 添加报价
- `acceptQuote(demandId, quoteId)`: 接受报价
- `closeDemand(id)`: 关闭需求

#### `stores/adminAuditStore.ts`

**用途**: 管理员审核状态管理

**状态结构**:
```typescript
interface AuditItem {
  id: string;
  type: 'product' | 'content' | 'expert';
  entityId: string;
  entityName: string;
  submitterId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewerId?: string;
  reviewedAt?: string;
  reason?: string;
}
```

**关键方法**:
- `addAuditItem(item)`: 添加审核项
- `approve(id, reviewerId)`: 批准
- `reject(id, reviewerId, reason)`: 拒绝

#### `stores/adminUserStore.ts`

**用途**: 管理员用户管理状态

**状态结构**:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: 'active' | 'disabled';
  createdAt: string;
  lastLoginAt?: string;
}
```

**关键方法**:
- `addUser(user)`: 添加用户
- `updateUser(id, updates)`: 更新用户信息
- `enableUser(id)`: 启用用户
- `disableUser(id)`: 禁用用户

### 8.3 Store 使用模式

**在组件中使用**:
```typescript
import { useCartStore } from "../../../stores/cartStore";

export default function MyComponent() {
  // 方式1: 解构获取状态和方法
  const { items, totalAmount, add, remove } = useCartStore();
  
  // 方式2: 只获取需要的部分（性能优化）
  const count = useCartStore((state) => state.count);
  const addItem = useCartStore((state) => state.add);
  
  // 使用
  const handleAdd = () => {
    add({ productId: "123", name: "商品", ... });
  };
}
```

**Store间依赖**:
- 某些Store可能需要读取其他Store的数据
- 使用 `get()` 方法获取当前状态: `const otherStore = useOtherStore.getState()`

---

## 9. 路由与导航系统

### 9.1 路由架构

#### React Router 配置

**文件**: `router/index.tsx`  
**路由类型**: Browser Router (HTML5 History API)

**路由结构**:
```
/                          → Landing3DPage (登录/角色选择)
/select-role              → RoleStationRoute (角色选择站)
/app                      → StarGateApp (统一入口)
/farmer-app               → FarmerApp (农户应用)
/buyer-app                → BuyerApp (买家应用)
/bank-app                 → BankApp (银行应用)
/expert-app               → ExpertApp (专家应用)
/admin-app                → AdminApp (管理员应用)
/finance-{role}           → {Role}App (金融入口，直接打开finance tab)
```

**角色路由** (使用Layout):
```
/farmer/*                 → FarmerLayout
  ├─ /                    → FarmerHome
  ├─ /products            → FarmerProductList
  ├─ /finance             → FarmerFinance
  └─ /finance/*           → 融资子路由
/buyer/*                  → BuyerLayout
/bank/*                   → BankLayout
/expert/*                 → ExpertLayout
/admin/*                  → AdminLayout
```

### 9.2 导航系统架构

#### 三层导航系统

**1. 顶部导航 (Navigation.tsx)**
- **用途**: Tab级别切换（home, finance, expert, trade, profile）
- **实现**: 通过 `onTabChange` 回调更新 `activeTab` 状态
- **位置**: `fixed top-0`，全局可见

**2. 子路由导航 (subRouteNavigation.ts)**
- **用途**: Tab内部页面跳转（如 finance → apply, detail, repay）
- **实现**: 自定义事件系统 `SUB_ROUTE_EVENT`
- **格式**: `navigateToSubRoute(tab, subRoute, params?)`

**3. 底部导航 (RoleNavBar.tsx)**
- **用途**: 移动端快速导航（可选）
- **实现**: 各角色独立的 `{Role}NavBar.tsx`
- **位置**: `fixed bottom-0`

#### 导航事件流

```
用户点击按钮
  ↓
调用 navigateToTab() 或 navigateToSubRoute()
  ↓
触发 CustomEvent
  ↓
App组件监听事件 (onNavigationChange / onSubRouteChange)
  ↓
更新 activeTab / activeSubRoute 状态
  ↓
重新渲染对应页面组件
```

**事件系统实现**:

**Tab切换事件** (`utils/navigationEvents.ts`):
```typescript
// 触发Tab切换
navigateToTab('finance');

// 监听Tab切换
const unsubscribe = onNavigationChange((tab) => {
  setActiveTab(tab);
  setActiveSubRoute(null); // 切换Tab时重置子路由
});
```

**子路由切换事件** (`utils/subRouteNavigation.ts`):
```typescript
// 触发子路由切换
navigateToSubRoute('finance', 'apply');
navigateToSubRoute('finance', 'detail?id=123');
navigateToSubRoute('trade', 'order-detail', { id: '456' });

// 监听子路由切换
const unsubscribe = onSubRouteChange((tab, subRoute, params) => {
  if (tab === activeTab) {
    setActiveSubRoute(subRoute);
  }
});
```

### 9.3 子路由渲染逻辑

#### App组件中的子路由处理

**文件**: `apps/{role}App.tsx`

**关键函数**:
- `renderContent()`: 主渲染函数，根据 `activeTab` 和 `activeSubRoute` 决定渲染内容
- `renderSubRoute(tab, subRoute)`: 根据Tab和子路由字符串渲染对应组件
- `renderFinanceSubRoute(subRoute)`: 专门处理融资相关子路由
- `renderTradeSubRoute(subRoute)`: 专门处理交易相关子路由
- `renderProfileSubRoute(subRoute)`: 专门处理个人中心子路由
- `renderExpertSubRoute(subRoute)`: 专门处理专家相关子路由

**子路由解析逻辑**:
```typescript
const renderSubRoute = (tab: string, subRoute: string) => {
  // 解析子路由字符串，支持 query 参数
  const [route, query] = subRoute.split('?');
  const params = query ? Object.fromEntries(new URLSearchParams(query)) : {};
  
  switch (tab) {
    case "finance":
      return renderFinanceSubRoute(route, params);
    case "trade":
      return renderTradeSubRoute(route, params);
    // ...
  }
};
```

**子路由映射示例** (以农户融资为例):
```typescript
const renderFinanceSubRoute = (subRoute: string, params?: Record<string, string>) => {
  switch (subRoute) {
    case "apply":
      return <FarmerFinanceApply />;
    case "detail":
      return <FarmerFinanceDetail id={params?.id} />;
    case "progress":
      return <FarmerFinanceProgress />;
    case "contract-sign":
      return <FarmerFinanceContractSign />;
    case "repay-plan":
      return <FarmerFinanceRepayPlan />;
    case "repay":
      return <FarmerFinanceRepay />;
    case "early-repay":
      return <FarmerFinanceEarlyRepay />;
    case "match":
      return <FarmerFinanceMatchIntro />;
    case "match/candidates":
      return <FarmerFinanceMatchCandidates />;
    case "match/detail":
      return <FarmerFinanceMatchDetail id={params?.id} />;
    case "match/create":
      return <FarmerFinanceMatchCreate />;
    case "match/result":
      return <FarmerFinanceMatchResult />;
    default:
      return <FarmerFinancePanel />;
  }
};
```

### 9.4 404错误处理

#### NotFound组件

**文件**: `components/NotFound.tsx`  
**用途**: 处理未匹配的路由，显示友好的404页面

**设计特点**:
- 符合 `FLAVOUR.md` 设计规范（渐变背景、动画效果）
- 提供返回上一页和返回首页按钮
- 使用 `motion/react` 添加进入动画

**路由配置**:
```typescript
// router/index.tsx
{
  path: '*',
  element: <NotFound />,
}
```

**注意**: 404路由必须放在路由配置的最后，作为catch-all路由。

### 9.5 深度链接支持

#### URL参数传递

**场景**: 从外部链接或分享链接直接打开特定页面

**实现方式**:
1. **路由参数**: 使用React Router的 `:id` 参数
   ```typescript
   { path: 'finance/detail/:id', element: <FinanceDetail /> }
   ```

2. **Query参数**: 通过 `navigateToSubRoute` 传递
   ```typescript
   navigateToSubRoute('finance', 'detail?id=123');
   ```

3. **初始状态**: App组件支持 `initialTab` 和 `initialSubRoute` props
   ```typescript
   <FarmerApp initialTab="finance" initialSubRoute="detail?id=123" />
   ```

### 9.6 导航最佳实践

#### 何时使用 navigateToTab

- ✅ 跨Tab导航（如从商品列表跳转到购物车）
- ✅ 表单提交成功后返回列表页
- ✅ 深度链接需要激活特定Tab

#### 何时使用 navigateToSubRoute

- ✅ Tab内部页面跳转（如融资列表 → 融资详情）
- ✅ 表单提交后跳转到详情页
- ✅ 保持在同一Tab下的导航

#### 何时使用 React Router

- ✅ 应用入口路由（如 `/farmer-app`, `/buyer-app`）
- ✅ 角色选择页面
- ✅ 登录/登出流程
- ❌ 不要在Tab内部使用 `useNavigate()`，应使用 `navigateToSubRoute`

---

## 10. API层架构

### 10.1 API文件组织

**目录结构**:
```
api/
├── client.ts              # API客户端基础配置（认证、错误处理）
├── types.ts               # 通用类型定义（Page<T>, ApiResponse<T>）
├── auth.ts                # 认证相关API（登录、注册、验证码等）
├── farmer.ts              # 农户相关API
├── farmerFinanceMatch.ts  # 农户融资匹配API
├── buyer.ts               # 买家相关API
├── bank.ts                # 银行相关API
├── expert.ts              # 专家相关API
├── admin.ts               # 管理员相关API
└── README.md              # API文档说明
```

### 10.2 API客户端基础

**文件**: `api/client.ts`

**核心功能**:
- JWT Token自动管理（存储、刷新、清除）
- 统一错误处理
- 请求/响应拦截器
- 自动重试机制

**关键函数**:
```typescript
// GET请求
export async function get<T = any>(endpoint: string, options?: RequestInit): Promise<T>

// POST请求
export async function post<T = any>(endpoint: string, body?: any): Promise<T>

// PUT请求
export async function put<T = any>(endpoint: string, body?: any): Promise<T>

// DELETE请求
export async function del<T = any>(endpoint: string): Promise<T>

// Token刷新
export async function refreshToken(): Promise<string>

// 清除认证信息
export function clearAuth(): void
```

**认证处理**:
- 自动从 `localStorage` 读取Token
- Token过期时自动刷新
- 401错误时清除认证并跳转登录

### 10.3 类型定义系统

**文件**: `api/types.ts`

**通用类型**:
```typescript
// 分页响应
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// API响应基础结构
export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
}
```

### 10.4 各模块API接口详情

#### 10.4.1 农户模块API (`api/farmer.ts`)

**商品管理接口**:
- ✅ `getFarmerProducts(params?)` - 获取商品列表
- ✅ `createFarmerProduct(request)` - 创建商品
- ✅ `toggleProductStatus(request)` - 商品上下架
- ✅ `getProductDashboard()` - 获取商品数据看板

**融资管理接口**:
- ✅ `submitFarmerFinanceApp(request)` - 提交融资申请（含拼单错误处理）
- ✅ `getMyFinancingApplications(status?)` - 获取融资申请列表
- ✅ `getFinancingApplicationDetail(id)` - 获取融资申请详情
- ✅ `repayLoan(request)` - 还款
- ✅ `calculateEarlyRepayment(request)` - 提前还款试算
- ✅ `getRepaymentSchedules(id)` - 获取还款计划
- ✅ `getRepaymentRecords(id)` - 获取还款记录
- ✅ `signContract(contractId, signatureUrl)` - 签署合同
- ✅ `getRepaymentSummary(id)` - 获取还款汇总

**融资匹配接口** (`api/farmerFinanceMatch.ts`):
- ✅ `startMatch(data)` - 启动匹配（创建拼单组）
- ✅ `getMatchCandidates(amount)` - 获取匹配候选（后端已实现）
- ✅ `getMatchDetail(matchId)` - 获取匹配详情
- ✅ `joinMatch(matchId, amount, purpose?)` - 加入拼单组
- ✅ `quitMatch(matchId)` - 退出拼单组（后端已实现）
- ✅ `createMatch(payload)` - 创建拼单组
- ✅ `getMatchResult(matchId)` - 获取匹配结果

**接口路径**: 已统一修正为 `/api/farmer/finance/joint-loan/*`

#### 10.4.2 银行模块API (`api/bank.ts`)

**产品管理接口**:
- ✅ `getBankLoanProducts()` - 获取产品列表
- ✅ `getLoanProduct(id)` - 获取产品详情
- ✅ `createLoanProduct(request)` - 创建产品
- ✅ `updateLoanProduct(id, request)` - 更新产品
- ✅ `deleteLoanProduct(id)` - 删除产品

**审批管理接口**:
- ✅ `bankApprovalList()` - 获取待审批列表
- ✅ `approveApplication(request)` - 审批申请
- ✅ `calculateCreditScore(request)` - 计算信用评分

**合同管理接口**:
- ✅ `generateContract(request)` - 生成合同
- ✅ `signContractByBank(contractId, signatureUrl)` - 银行签署合同

**放款管理接口**:
- ✅ `disburseLoan(request)` - 放款
- ✅ `getDisbursements(status?)` - 获取放款列表
- ✅ `getApprovalStatistics()` - 获取审批统计
- ✅ `getDisbursementStatistics(startDate?, endDate?)` - 获取放款统计

**逾期管理接口**:
- ✅ `checkOverdue()` - 手动触发逾期检测
- ✅ `getOverdueStatistics()` - 获取逾期统计
- ✅ `getOverdueList()` - 获取逾期列表
- ✅ `sendOverdueAlert(financingId)` - 发送逾期提醒
- ✅ `calculateOverduePenalty(financingId)` - 计算逾期罚息

**对账管理接口**:
- ✅ `reconcile(date?)` - 对账
- ✅ `getReconciliationList(startDate?, endDate?)` - 获取对账列表
- ✅ `getReconciliationStatistics(startDate?, endDate?)` - 获取对账统计
- ✅ `exportReconciliation(request)` - 导出对账单
- ✅ `exportT1File(request)` - 导出T+1文件

**贷后监控接口**:
- ✅ `getPostLoanMonitoring(financingId)` - 获取贷后监控数据
- ✅ `getAllPostLoanMonitoring()` - 获取所有贷后监控列表

#### 10.4.3 专家模块API (`api/expert.ts`)

**问答管理接口**:
- ✅ `searchQuestions(request)` - 搜索问题
- ✅ `getPendingQuestions(page?, size?)` - 获取待回答问题列表
- ✅ `getQuestionDetail(questionId)` - 获取问题详情
- ✅ `answerQuestion(request)` - 回答问题
- ✅ `getMyAnswers(page?, size?)` - 获取我的回答列表

**预约管理接口**:
- ✅ `addAvailableSlot(request)` - 添加可用时段
- ✅ `getAvailableSlots(startDate?, endDate?)` - 获取可用时段列表
- ✅ `deleteSlot(slotId)` - 删除时段
- ✅ `getAppointments(params?)` - 获取预约列表
- ✅ `getAppointmentDetail(appointmentId)` - 获取预约详情
- ✅ `updateAppointmentStatus(appointmentId, request)` - 更新预约状态

**内容管理接口**:
- ✅ `publishContent(request)` - 发布内容
- ✅ `updateContent(contentId, request)` - 更新内容
- ✅ `getContents(params?)` - 获取内容列表
- ✅ `getContentDetail(contentId)` - 获取内容详情
- ✅ `deleteContent(contentId)` - 删除内容
- ✅ `updateContentStatus(contentId, status)` - 更新内容状态

**收入管理接口**:
- ✅ `getIncomeStatistics()` - 获取收入统计
- ✅ `getIncomeRecords(params?)` - 获取收入明细
- ✅ `applyWithdrawal(request)` - 申请提现
- ✅ `getWithdrawals(params?)` - 获取提现记录
- ✅ `getWithdrawalDetail(withdrawalId)` - 获取提现详情

**资料管理接口**:
- ✅ `getExpertProfile()` - 获取专家资料
- ✅ `updateServicePrice(request)` - 更新服务价格
- ✅ `getFarmerReviews(page?, size?)` - 获取农户评价

**仪表盘接口**:
- ✅ `getExpertDashboardStatistics()` - 获取仪表盘统计

#### 10.4.4 管理员模块API (`api/admin.ts`)

**用户管理接口**:
- ✅ `adminUserList(request)` - 搜索用户
- ✅ `getUserDetail(userId)` - 获取用户详情
- ✅ `updateUserStatus(request)` - 更新用户状态
- ✅ `updateUserRole(request)` - 更新用户角色
- ✅ `getUserStatistics()` - 获取用户统计

**审核管理接口**:
- ✅ `adminProductAuditList()` - 获取待审核商品列表
- ✅ `auditProduct(request)` - 审核商品
- ✅ `getPendingContentAudits()` - 获取待审核内容列表
- ✅ `auditContent(request)` - 审核内容
- ✅ `getPendingExpertAudits()` - 获取待审核专家列表
- ✅ `auditExpert(request)` - 审核专家

**订单监控接口**:
- ✅ `getOrderStatistics()` - 获取订单统计
- ✅ `searchOrders(request)` - 搜索订单
- ✅ `getOrderDetail(orderId)` - 获取订单详情

**融资监控接口**:
- ✅ `getFinanceMonitor()` - 获取融资监控数据

**仪表盘接口**:
- ✅ `getDashboardStatistics()` - 获取仪表盘统计

**系统配置接口**:
- ✅ `getSystemConfigs(category?)` - 获取系统配置
- ✅ `setSystemConfig(request)` - 设置系统配置

#### 10.4.5 买家模块API (`api/buyer.ts`)

**商品管理接口**:
- ✅ `getBuyerProducts(params?)` - 获取商品列表
- ✅ `getBuyerProductDetail(productId)` - 获取商品详情

**订单管理接口**:
- ✅ `createBuyerOrder(request)` - 创建订单
- ✅ `getBuyerOrders(params?)` - 获取订单列表
- ✅ `getBuyerOrderDetail(orderId)` - 获取订单详情
- ✅ `updateBuyerOrderStatus(orderId, request)` - 更新订单状态
- ✅ `cancelBuyerOrder(orderId)` - 取消订单

**购物车接口** (后端已实现):
- ✅ `GET /api/buyer/cart` - 获取购物车
- ✅ `POST /api/buyer/cart/items` - 添加商品到购物车
- ✅ `PUT /api/buyer/cart/items/{itemId}` - 更新购物车商品
- ✅ `DELETE /api/buyer/cart/items/{itemId}` - 删除购物车商品
- ✅ `DELETE /api/buyer/cart` - 清空购物车

**收货地址接口** (后端已实现):
- ✅ `GET /api/buyer/addresses` - 获取收货地址列表
- ✅ `POST /api/buyer/addresses` - 添加收货地址
- ✅ `PUT /api/buyer/addresses/{addressId}` - 更新收货地址
- ✅ `DELETE /api/buyer/addresses/{addressId}` - 删除收货地址
- ✅ `PUT /api/buyer/addresses/{addressId}/default` - 设置默认地址

**退款接口** (后端已实现):
- ✅ `POST /api/buyer/orders/{orderId}/refund` - 申请退款
- ✅ `GET /api/buyer/orders/{orderId}/refund` - 获取退款详情
- ✅ `GET /api/buyer/refunds` - 获取退款列表

### 10.5 API调用模式

**基础结构**:
```typescript
// api/farmer.ts
import { get, post } from './client';
import { Page } from './types';

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  // ...
}

export interface ProductResponse {
  id: string;
  name: string;
  // ...
}

export async function createProduct(
  data: CreateProductRequest
): Promise<ProductResponse> {
  return post<ProductResponse>('/farmer/products/create', data);
}

export async function getProducts(
  params?: ProductListParams
): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.search) queryParams.append('search', params.search);
  // ...
  const query = queryParams.toString();
  return get<ProductListResponse>(
    `/farmer/products/list${query ? `?${query}` : ''}`
  );
}
```

**在组件中使用**:
```typescript
import { createProduct, getProducts } from '../../../api/farmer';
import { toast } from 'sonner';

const handleSubmit = async (values: FormValues) => {
  try {
    const product = await createProduct(values);
    toast.success('商品创建成功');
    navigateToSubRoute('trade', 'products');
  } catch (error: any) {
    // 处理特殊错误（如融资申请的拼单错误）
    if (error.message === 'APPLY_JOINT_LOAN') {
      navigateToSubRoute('finance', `match?amount=${values.amount}`);
      return;
    }
    toast.error(error.message || '创建失败');
  }
};
```

### 10.6 错误处理机制

**统一错误处理** (`api/client.ts`):
- 网络错误自动重试
- 401错误自动刷新Token
- 403错误提示权限不足
- 500错误显示友好提示

**业务错误处理**:
```typescript
// 融资申请接口的特殊错误处理
export async function submitFarmerFinanceApp(
  request: FinancingApplicationRequest
): Promise<FinancingApplicationResponse> {
  try {
    const response = await post<FinancingApplicationResponse>(
      '/farmer/finance/apply',
      request
    );
    return response;
  } catch (error: any) {
    // 处理金额低于最低额度的情况（错误码2001）
    if (error.code === 2001 || error.message?.includes('拼单')) {
      const jointLoanError = new Error('APPLY_JOINT_LOAN');
      (jointLoanError as any).code = 2001;
      throw jointLoanError;
    }
    throw error;
  }
}
```

### 10.7 API接口完成度

**总体完成度**: ✅ **100%** (前端 + 后端)

| 模块 | 前端接口数 | 后端接口数 | 完成度 | 状态 |
|------|-----------|-----------|--------|------|
| 农户模块 | 20 | 20 | 100% | ✅ 完成 |
| 银行模块 | 25 | 25 | 100% | ✅ 完成 |
| 专家模块 | 30 | 30 | 100% | ✅ 完成 |
| 管理员模块 | 20 | 20 | 100% | ✅ 完成 |
| 买家模块 | 20 | 20 | 100% | ✅ 完成 |
| **总计** | **115** | **115** | **100%** | ✅ **完成** |

**代码质量**:
- ✅ 无 linter 错误
- ✅ 类型定义完整
- ✅ 接口命名规范
- ✅ 注释清晰
- ✅ 统一的类型定义（`api/types.ts`）
- ✅ 接口路径与后端对齐
- ✅ 所有后端接口已实现（包含购物车、收货地址、退款、融资匹配）

**最新完成的后端接口**:
- ✅ 买家模块：购物车接口（5个）、收货地址接口（5个）、退款接口（3个）
- ✅ 农户模块：融资匹配候选查询、退出拼单组接口（2个）

### 10.8 API文档

**详细文档位置**:
- `backend/document/farmer-api.md` - 农户模块API文档
- `backend/document/bank-api.md` - 银行模块API文档
- `backend/document/expert-api.md` - 专家模块API文档
- `backend/document/admin-api.md` - 管理员模块API文档
- `backend/document/buyer-api.md` - 买家模块API文档
- `PROJECT_COMPLETION_REPORT.md` - 项目完成度检查报告

**API文档包含内容**:
- 功能概述
- 前端API需求
- 后端接口状态
- 未实现接口列表
- 实现步骤
- DTO设计
- 实现优先级（P0/P1/P2）
- 测试计划
- 注意事项

---

## 11. 权限系统

### 11.1 权限配置

**文件**: `config/permissions.ts`

**权限代码格式**: `{role}.{module}.{action}`

**示例**:
```typescript
export const rolePermissions = {
  farmer: [
    'farmer.product.view',
    'farmer.product.edit',
    'farmer.order.view',
    'farmer.finance.apply',
  ],
  buyer: [
    'buyer.cart.manage',
    'buyer.order.view',
    'buyer.coupon.use',
  ],
  // ...
};
```

### 11.2 权限检查

**在组件中使用**:
```typescript
import { useRole } from '../../../contexts/RoleContext';

export default function MyComponent() {
  const { hasPermission } = useRole();
  
  if (!hasPermission('farmer.product.edit')) {
    return <NoPermission />;
  }
  
  return <div>...</div>;
}
```

### 11.3 按钮级权限

**示例**:
```typescript
{hasPermission('farmer.product.edit') && (
  <Button onClick={handleEdit}>编辑</Button>
)}
```

---

## 12. 响应式设计

### 12.1 断点系统

**Tailwind CSS 默认断点**:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 12.2 移动端适配

**检测方式**:
```typescript
// contexts/RoleContext.tsx
const isMobile = window.innerWidth < 768;
```

**布局适配**:
- 桌面端: 顶部导航 + 侧边栏（可选）
- 移动端: 顶部导航 + 底部导航栏

**组件适配**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 移动端1列，平板2列，桌面4列 */}
</div>
```

### 12.3 底部导航栏

**文件**: `roles/{role}/navigation/{Role}NavBar.tsx`

**显示条件**: 仅在移动端显示（`isMobile === true`）

**导航项配置**:
```typescript
const farmerNav = [
  { id: 'home', label: '首页', icon: Home, color: '#18FF74', path: '/farmer/home' },
  { id: 'finance', label: '融资', icon: DollarSign, color: '#00D6C2', path: '/farmer/finance' },
  // ...
];
```

---

## 13. 性能优化

### 13.1 代码分割

**路由级分割**: React Router自动支持代码分割
```typescript
const FarmerHome = lazy(() => import('../roles/farmer/pages/Home'));
```

**组件级分割**: 使用 `React.lazy()` 和 `Suspense`
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<GlobalLoading />}>
  <HeavyComponent />
</Suspense>
```

### 13.2 Store优化

**选择性订阅**: 只订阅需要的状态
```typescript
// ❌ 不好：订阅整个Store
const store = useCartStore();

// ✅ 好：只订阅需要的部分
const count = useCartStore((state) => state.count);
const addItem = useCartStore((state) => state.add);
```

### 13.3 动画性能

**使用 `will-change`**: 对频繁动画的元素添加
```typescript
<motion.div
  style={{ willChange: 'transform' }}
  animate={{ x: 100 }}
>
```

**减少重排**: 优先使用 `transform` 和 `opacity` 进行动画

---

## 14. 开发规范

### 14.1 文件命名

- **组件文件**: PascalCase，如 `FarmerFinancePanel.tsx`
- **工具文件**: camelCase，如 `navigationEvents.ts`
- **Store文件**: camelCase + Store后缀，如 `cartStore.ts`
- **类型文件**: camelCase + Types后缀，如 `apiTypes.ts`

### 14.2 导入顺序

```typescript
// 1. React相关
import { useState, useEffect } from 'react';

// 2. 第三方库
import { motion } from 'motion/react';
import { Button } from '../ui/button';

// 3. 内部组件
import { StatsCard } from '../common/StatsCard';

// 4. Store
import { useCartStore } from '../../../stores/cartStore';

// 5. 工具函数
import { navigateToTab } from '../../../utils/navigationEvents';

// 6. 类型
import type { CartItem } from '../../../stores/cartStore';
```

### 14.3 组件结构

```typescript
// 1. 导入
import ...

// 2. 类型定义
interface Props { ... }

// 3. 组件
export default function ComponentName({ prop1, prop2 }: Props) {
  // 3.1 Hooks
  const [state, setState] = useState();
  const store = useStore();
  
  // 3.2 计算属性
  const computed = useMemo(() => ..., [deps]);
  
  // 3.3 事件处理
  const handleClick = () => { ... };
  
  // 3.4 副作用
  useEffect(() => { ... }, [deps]);
  
  // 3.5 渲染
  return <div>...</div>;
}
```

### 14.4 代码注释

**组件注释**:
```typescript
/**
 * 农户融资面板
 * 
 * @description 显示农户的所有融资申请，支持筛选和搜索
 * @usage 在 FarmerApp 的 finance tab 中使用
 */
export default function FarmerFinancePanel() { ... }
```

**复杂逻辑注释**:
```typescript
// 如果金额低于最低额度，引导用户进入智能拼单流程
if (values.amount < minLoanAmount) {
  navigateToSubRoute("finance", `match?amount=${values.amount}`);
  return;
}
```

---

## 15. 测试策略

### 15.1 单元测试

**Store测试**: 测试Store的状态更新和方法调用
```typescript
import { useCartStore } from './cartStore';

test('add item to cart', () => {
  const { add, items } = useCartStore.getState();
  add({ productId: '1', name: 'Test', ... });
  expect(items).toHaveLength(1);
});
```

### 15.2 组件测试

**使用 React Testing Library**:
```typescript
import { render, screen } from '@testing-library/react';
import FarmerFinancePanel from './FarmerFinancePanel';

test('renders finance panel', () => {
  render(<FarmerFinancePanel />);
  expect(screen.getByText('融资申请')).toBeInTheDocument();
});
```

### 15.3 E2E测试

**使用 Playwright 或 Cypress**:
- 测试完整的用户流程
- 测试跨Tab导航
- 测试表单提交和页面跳转

---

## 16. 部署与构建

### 16.1 构建配置

**文件**: `vite.config.ts`

**关键配置**:
- 输出目录: `dist/`
- 基础路径: `/` (可根据部署环境调整)
- 代码分割: 自动启用

### 16.2 环境变量

**文件**: `.env`, `.env.production`, `.env.development`

**常用变量**:
```
VITE_API_BASE_URL=https://api.agriverse.com
VITE_APP_TITLE=AgriVerse
```

### 16.3 静态资源

**图片**: 放在 `public/` 目录或使用CDN
**字体**: 使用 `@font-face` 或 Web字体服务

---

## 17. 常见问题与解决方案

### 17.1 导航不生效

**问题**: 点击按钮后页面没有跳转

**解决方案**:
1. 检查是否正确调用了 `navigateToTab()` 或 `navigateToSubRoute()`
2. 检查App组件是否正确监听了事件
3. 检查子路由映射是否正确

### 17.2 Store状态不更新

**问题**: 修改Store后组件没有重新渲染

**解决方案**:
1. 确保使用 `useStore()` Hook订阅Store
2. 检查Store的更新方法是否正确使用 `set()`
3. 检查组件是否正确解构了Store状态

### 17.3 动画卡顿

**问题**: 页面动画不流畅

**解决方案**:
1. 减少同时进行的动画数量
2. 使用 `will-change` CSS属性
3. 优先使用 `transform` 和 `opacity` 进行动画
4. 检查是否有大量DOM操作

### 17.4 样式不生效

**问题**: Tailwind CSS类名不生效

**解决方案**:
1. 检查类名拼写是否正确
2. 检查 `tailwind.config.js` 配置
3. 确保类名在 `content` 路径范围内
4. 重启开发服务器

---

## 18. 未来扩展

### 18.1 国际化 (i18n)

**计划**: 使用 `react-i18next` 实现多语言支持

**文件结构**:
```
locales/
├── zh-CN/
│   ├── common.json
│   ├── farmer.json
│   └── ...
└── en-US/
    └── ...
```

### 18.2 PWA支持

**计划**: 添加Service Worker，支持离线访问和推送通知

### 18.3 微前端架构

**计划**: 使用Module Federation将各角色应用拆分为独立微前端

### 18.4 实时通信

**计划**: 集成WebSocket，实现实时消息推送和在线状态

---

## 19. 附录

### 19.1 技术栈版本

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI框架 |
| TypeScript | 5.x | 类型系统 |
| Vite | 5.x | 构建工具 |
| React Router | 6.x | 路由管理 |
| Zustand | 4.x | 状态管理 |
| Motion/React | 11.x | 动画库 |
| Tailwind CSS | 3.x | 样式框架 |
| shadcn/ui | latest | UI组件库 |
| Recharts | 2.x | 图表库 |
| Sonner | 1.x | 通知组件 |

### 19.2 关键文件索引

**入口文件**:
- `main.tsx`: 应用入口
- `App.tsx`: 根组件
- `router/index.tsx`: 路由配置

**角色应用**:
- `apps/farmerApp.tsx`: 农户应用
- `apps/buyerApp.tsx`: 买家应用
- `apps/bankApp.tsx`: 银行应用
- `apps/expertApp.tsx`: 专家应用
- `apps/adminApp.tsx`: 管理员应用

**导航系统**:
- `components/Navigation.tsx`: 顶部导航
- `utils/navigationEvents.ts`: Tab切换事件
- `utils/subRouteNavigation.ts`: 子路由导航
- `roles/{role}/navigation/{Role}NavBar.tsx`: 底部导航

**状态管理**:
- `stores/*.ts`: 各业务域的Store
- `contexts/RoleContext.tsx`: 角色上下文

**设计规范**:
- `FLAVOUR.md`: 视觉设计规范
- `DESIGN.md`: 设计系统文档

### 19.3 参考资源

- [React官方文档](https://react.dev)
- [React Router文档](https://reactrouter.com)
- [Zustand文档](https://zustand-demo.pmnd.rs)
- [Motion文档](https://motion.dev)
- [Tailwind CSS文档](https://tailwindcss.com)
- [shadcn/ui文档](https://ui.shadcn.com)

---

## 20. 更新日志

### v1.2 (2025-01-XX)

**新增**:
- ✅ 完成所有后端接口实现（115个接口）
- ✅ 实现买家购物车后端接口（5个接口）
- ✅ 实现买家收货地址后端接口（5个接口）
- ✅ 实现买家退款后端接口（3个接口）
- ✅ 实现农户融资匹配候选查询和退出拼单组接口（2个接口）
- ✅ 创建完整的后端实体类、Repository、Service和Controller
- ✅ 完善后端错误处理和事务管理

### v1.1 (2025-01-XX)

**新增**:
- ✅ 完成所有前端API接口实现（115个接口）
- ✅ 实现农户模块完整API（商品管理、融资管理、融资匹配）
- ✅ 实现银行模块完整API（产品管理、审批管理、合同管理、放款管理、逾期管理、对账管理、贷后监控）
- ✅ 实现专家模块完整API（问答管理、预约管理、内容管理、收入管理、资料管理、仪表盘）
- ✅ 实现管理员模块完整API（用户管理、审核管理、订单监控、融资监控、仪表盘、系统配置）
- ✅ 实现买家模块完整API（商品管理、订单管理、购物车、收货地址、退款）
- ✅ 统一类型定义系统（`api/types.ts`）
- ✅ 完善API客户端基础功能（认证、错误处理、自动重试）

**优化**:
- ✅ 统一所有接口的类型定义
- ✅ 修正融资匹配接口路径，与后端对齐
- ✅ 完善错误处理机制（特殊业务错误处理）
- ✅ 优化API调用模式（统一使用 `get`, `post`, `put`, `del`）
- ✅ 添加完整的接口注释和文档

**修复**:
- ✅ 修复融资匹配接口路径不一致问题
- ✅ 修复类型定义重复问题（统一到 `types.ts`）
- ✅ 修复接口路径格式不统一问题

### v1.0 (2025-01-XX)

**新增**:
- 完成所有角色应用的基础架构
- 实现三层导航系统（顶部、子路由、底部）
- 集成WebGL星球组件
- 完成所有主要业务流程页面
- 实现Zustand状态管理架构
- 添加404错误处理

**优化**:
- 统一设计风格，符合FLAVOUR.md规范
- 优化动画性能和用户体验
- 完善权限系统
- 改进响应式设计

**修复**:
- 修复导航事件监听问题
- 修复Store状态更新问题
- 修复样式兼容性问题

---

**文档结束**

> 本文档会随着项目发展持续更新，请定期查看最新版本。
> 
> 如有疑问或建议，请联系开发团队。
