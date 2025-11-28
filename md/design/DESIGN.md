## AgriVerse 前端统一设计说明（StarGateApp + 多角色一体壳）

> 本文件是前端实现的唯一设计源文件。所有后续实现与重构必须以本文件为准，避免“写一点算一点”的发散式开发。

---

## 1. 顶层结构与入口流程

- **入口流程**
  - `/`：`Landing3DPage`（2D/3D 登录星球 + 角色选择）
  - 选择角色 → 跳转 `/select-role`，进入 `RoleStationRoute` → `RoleStation`
  - 登录成功（包括内部测试账号 `1 / 1`）：
    - `RoleContext` 注入：`role / userProfile / permissions / token / isMobile`
    - 跳转统一入口：**`/app`**

- **应用壳（壳层）**
  - `/app` 渲染 `StarGateApp`：
    - 顶部：统一的宇宙风 `Navigation`（星云之门）
    - 中部：根据 Tab + 当前角色，渲染不同角色模块的**首页/工作台**
  - 角色专属工作台等「深层业务」继续放在：
    - `roles/<role>/pages/...`
    - `/farmer/*` / `/buyer/*` 等路由体系中（深链接 / 独立页面）

---

## 2. StarGateApp 统一壳设计

文件：`pages/StarGateApp.tsx`

### 2.1 状态与依赖

- 状态：
  - `activeTab: "home" | "finance" | "expert" | "trade" | "profile" | "cart"`
- 依赖：
  - `useRole()`：读取 `role` 和 `userProfile`
  - UI：`Navigation` 顶部导航组件
  - 角色子系统入口页面：
    - 农户：`FarmerHome`, `FarmerProductList`, `FinanceList`, `FarmerOrders`
    - 买家：`BuyerHome`, `BuyerProductList`, `BuyerCart`, `BuyerOrders`
    - 银行：`BankDashboardPage`, `BankLoanProducts`, `BankAppApproval`
    - 专家：`ExpertDashboardPage`, `ExpertQAList`, `ExpertKnowledge`, `ExpertIncome`
    - 管理员：`AdminDashboardPage`, `AdminProductAudit`, `AdminOrderMonitor`
    - 旧通用页面兜底：`HomePage`, `TradePage`, `FinancePage`, `ExpertPage`

### 2.2 Tab → 角色 → 页面 映射（必须完全落地）

#### 2.2.1 首页 Tab（`activeTab === "home"`）

| 角色       | 页面                                     | 说明                     |
| ---------- | ---------------------------------------- | ------------------------ |
| 农户       | `FarmerHome`                             | 农户首页 / 种植驾驶舱    |
| 买家       | `BuyerHome`                              | 买家首页 / 采购驾驶舱    |
| 银行       | `BankDashboardPage`                      | 银行风控 & 业务 Dashboard |
| 专家       | `ExpertDashboardPage`                    | 专家数据总览             |
| 管理员     | `AdminDashboardPage`                     | 后台运营总览             |
| 未登录/其他 | `HomePage`                              | 旧版首页兜底             |

#### 2.2.2 交易 / 课程 Tab（`activeTab === "trade"`）

| 角色   | 页面                    | 语义                         |
| ------ | ----------------------- | ---------------------------- |
| 农户   | `FarmerProductList`     | 商品管理入口（上架/下架等） |
| 买家   | `BuyerProductList`      | 农商市场 · AgriMarket       |
| 专家   | `ExpertKnowledge`       | 课程 / 文章 / 知识中心       |
| 银行   | `BankLoanProducts`      | 贷款产品中心                 |
| 管理员 | `AdminProductAudit`     | 商品审核 / 内容合规入口      |
| 其他   | `TradePage`             | 旧通用交易页兜底             |

#### 2.2.3 金融 Tab（`activeTab === "finance"`）

| 角色   | 页面                | 语义 / 要求                                               |
| ------ | ------------------- | ---------------------------------------------------------- |
| 农户   | `FinanceList`       | **我的融资列表**，接入完整融资闭环（详情、进度、还款等） |
| 买家   | `FinancePage`       | 暂用旧金融页，后续升级为“分期中心”                       |
| 银行   | `BankAppApproval`   | 审批工作台（贷款申请队列 + 详情 + 审批操作）             |
| 专家   | `ExpertIncome`      | 专家收入中心（问答 + 预约 + 提现）                       |
| 管理员 | `AdminDashboardPage` | 作为融资监控总入口（后续可拆专门“融资监控”页）           |
| 其他   | `FinancePage`       | 旧通用金融兜底                                            |

#### 2.2.4 知识 / 专家 Tab（`activeTab === "expert"`）

| 角色           | 页面            | 说明                               |
| -------------- | --------------- | ---------------------------------- |
| 专家（expert） | `ExpertQAList`  | 专家问答工作台（待答/已答等）     |
| 其他所有角色   | `ExpertPage`    | 知识星系总览入口（咨询、预约等） |

#### 2.2.5 个人中心 Tab（`activeTab === "profile"`）

- 所有角色统一入口：`ProfilePage`
- 内部使用 `useRole().userProfile` + `role` 展示不同头像/昵称/角色信息
- 下层通过 `RoleSpecificProfile` 插入各角色特定配置模块（认证、钱包、银行卡等）

#### 2.2.6 购物车 / 订单 快捷按钮（`activeTab === "cart"`）

| 角色   | 页面              | 说明                                      |
| ------ | ----------------- | ----------------------------------------- |
| 买家   | `BuyerCart`       | 购物车 + 结算入口                         |
| 农户   | `FarmerOrders`    | 订单发货管理                              |
| 管理员 | `AdminOrderMonitor` | 全平台订单监控                          |
| 其他   | `TradePage`       | 兜底跳回市场页                            |

---

## 3. Navigation（顶部导航）角色化设计

文件：`components/Navigation.tsx`

### 3.1 行为

- 接口：`Navigation({ activeTab, onTabChange })`
- 读取 `useRole().role`，根据角色选择不同的 **导航文案**：
  - 图标固定：`Home, DollarSign, Users, ShoppingCart, User`
  - Tab id 固定：`home / finance / expert / trade / profile / cart`

### 3.2 文案映射

```ts
const baseNavItems = [
  { id: "home", label: "星云之门", icon: Home },
  { id: "finance", label: "智融资本", icon: DollarSign },
  { id: "expert", label: "知识星系", icon: Users },
  { id: "trade", label: "农商市场", icon: ShoppingCart },
  { id: "profile", label: "我的宇宙", icon: User },
];

const roleNavLabels = {
  farmer: [
    { id: "home", label: "种植驾驶舱", icon: Home },
    { id: "finance", label: "我的融资", icon: DollarSign },
    { id: "expert", label: "问专家", icon: Users },
    { id: "trade", label: "卖商品", icon: ShoppingCart },
    { id: "profile", label: "农场档案", icon: User },
  ],
  buyer: [
    { id: "home", label: "采购首页", icon: Home },
    { id: "finance", label: "分期中心", icon: DollarSign },
    { id: "expert", label: "选专家", icon: Users },
    { id: "trade", label: "买好货", icon: ShoppingCart },
    { id: "profile", label: "我的账户", icon: User },
  ],
  bank: [
    { id: "home", label: "风控驾驶舱", icon: Home },
    { id: "finance", label: "产品中心", icon: DollarSign },
    { id: "expert", label: "客户经理", icon: Users },
    { id: "trade", label: "授信监控", icon: ShoppingCart },
    { id: "profile", label: "机构资料", icon: User },
  ],
  expert: [
    { id: "home", label: "专家主页", icon: Home },
    { id: "finance", label: "收入中心", icon: DollarSign },
    { id: "expert", label: "我的问答", icon: Users },
    { id: "trade", label: "课程/文章", icon: ShoppingCart },
    { id: "profile", label: "个人资料", icon: User },
  ],
  admin: [
    { id: "home", label: "运营中台", icon: Home },
    { id: "finance", label: "融资监控", icon: DollarSign },
    { id: "expert", label: "专家管理", icon: Users },
    { id: "trade", label: "交易监控", icon: ShoppingCart },
    { id: "profile", label: "系统配置", icon: User },
  ],
};
```

- 若 `roleNavLabels[role]` 不存在，则使用 `baseNavItems`。
- 购物车按钮点击固定调用：`onTabChange("cart")`。

---

## 4. ProfilePage 角色化与 userProfile 集成

文件：`components/ProfilePage.tsx`

### 4.1 数据来源

- 从 `useRole()` 读取：
  - `userProfile`：后端登录返回的真实用户信息（`RoleStation` 已注入）
  - `role`：当前角色
- 本地仅保留通用统计元数据（演示用）：

```ts
const defaultUserMeta = {
  level: "VIP会员",
  contribution: 8850,
  certifications: ["有机认证", "绿色食品", "地理标志"],
};
```

### 4.2 展示规则

- 显示名称：
  - `displayName = userProfile?.name || "未命名用户"`
- 头像：
  - 优先：`userProfile.avatar`
  - 否则按角色赋默认表情：
    - 农户：👨‍🌾
    - 买家：🛒
    - 银行：🏦
    - 专家：👨‍🔬
    - 管理员：⚙️
    - 其他：👤
- 标题区：
  - 姓名：`displayName`
  - 会员等级、贡献值、认证徽章：使用 `defaultUserMeta`（后续可对接真实统计）
- 其它区域（地址管理 / 最近活动 / 雷达图等）暂保持通用展示逻辑。
- 尾部：`<RoleSpecificProfile />` 根据 `role` 渲染各角色独有配置（例如：银行卡管理、认证状态、机构信息等）。

---

## 5. RoleContext 约束

文件：`contexts/RoleContext.tsx`

- **必须保证**：
  - `userProfile` 在登录后被正确注入，并持久化到 `localStorage`。
  - `role` 与 `userProfile.role` 保持一致。
  - 切换角色或登出时，`resetRoleState()` 清理：
    - `role / userProfile / permissions / token`
    - `localStorage` 中相关键
    - 购物车等全局缓存（`useCartStore` 等）

---

## 6. 实施步骤（后续编码按此顺序执行）

1. **完成 StarGateApp Tab 映射落地**
   - 确保 `StarGateApp.tsx` 中的 `renderContent` 逻辑与「2.2 映射表」保持 100% 一致。
   - 所有引用的 `roles/*/pages/*` 页面存在且无编译错误。

2. **完善各角色首页/工作台**
   - 在 `FarmerHome / BuyerHome / BankDashboardPage / ExpertDashboardPage / AdminDashboardPage` 中，将之前实现的：
     - 退款闭环、融资闭环、智能拼单、报表、钱包等入口模块，布局到合适的卡片/分区中。

3. **ProfilePage 与 userProfile 校验**
   - 确保登录（包括内部 `1 / 1`）后，`ProfilePage` 展示的头像与名称与选择的角色一致。
   - 后续可将 `defaultUserMeta` 替换为真实统计数据源。

4. **统一风格检查**
   - 所有新接入的角色页面在 `/app` 中显示时，需继承当前宇宙视觉风格（背景色、glass-morphism、渐变等）。

5. **持续更新本 DESIGN.md**
   - 若后续新增 Tab、角色或重构页面映射，必须先更新本文件，再改代码。

---

> 实现要求：之后的所有实现步骤，先“读取 DESIGN.md → 确认映射和约束 → 再编码”，禁止与本设计不一致的随意跳转或临时页面映射。


