# 🌌 AgriVerse 项目结构文档

**版本**: v1.0  
**最后更新**: 2025-11-02  
**项目名称**: 农业产品融销平台 (AgriVerse)

---

## 📋 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构树](#项目结构树)
4. [核心文件说明](#核心文件说明)
5. [页面跳转逻辑](#页面跳转逻辑)
6. [页面功能说明](#页面功能说明)
7. [状态管理](#状态管理)
8. [工具函数](#工具函数)

---

## 项目概述

AgriVerse 是一个基于 React + TypeScript + Vite 构建的农业产品融销一体化平台，支持多角色（农户、买家、银行、专家、管理员）使用，提供商品交易、金融服务、专家咨询、需求发布等功能。

---

## 技术栈

- **框架**: React 18.3.1 + TypeScript
- **构建工具**: Vite 6.0.3
- **UI库**: Radix UI + Tailwind CSS 4.0
- **动画**: Motion (Framer Motion)
- **3D渲染**: Three.js 0.170.0
- **状态管理**: Zustand (stores目录)
- **表单**: React Hook Form + Zod
- **图表**: Recharts
- **通知**: Sonner

---

## 项目结构树

```
src/
├── components/              # 组件目录
│   ├── admin/              # 管理员组件
│   │   ├── FeatureFlagControl.tsx    # 功能开关控制
│   │   └── PushNotification.tsx       # 推送通知管理
│   ├── auth/               # 认证相关
│   │   └── RoleStations.tsx           # 角色空间站登录界面
│   ├── bank/               # 银行相关
│   │   ├── BankRadar.tsx              # 银行雷达图
│   │   └── JointLoanHub.tsx           # 联合贷款中心
│   ├── blockchain/         # 区块链相关
│   │   └── BlockchainExplorer.tsx    # 区块链浏览器
│   ├── cart/               # 购物车
│   │   └── CartPage.tsx               # 购物车页面
│   ├── common/             # 通用组件
│   │   ├── CartIcon.tsx               # 购物车图标
│   │   ├── DemandFab.tsx              # 需求发布悬浮按钮
│   │   ├── IMFloat.tsx                # 即时通讯浮动窗口
│   │   ├── Model360.tsx               # 360度产品展示
│   │   ├── QtyStepper.tsx            # 数量步进器
│   │   ├── SharePopover.tsx           # 分享弹窗
│   │   ├── SwipeDelete.tsx           # 滑动删除
│   │   └── index.ts                   # 导出索引
│   ├── consult/             # 咨询相关
│   │   └── ConsultDialog.tsx          # 专家咨询对话框
│   ├── dashboards/         # 仪表盘
│   │   └── RoleDashboards.tsx         # 角色专属仪表盘
│   ├── demand/             # 需求发布
│   │   ├── BuyerDemandPage.tsx        # 买家需求页面
│   │   ├── PublishDemandPage.tsx      # 发布需求页面
│   │   ├── MapPickerDialog.tsx        # 地图选择对话框
│   │   ├── PreviewDrawer.tsx          # 预览抽屉
│   │   ├── SuccessDialog.tsx          # 成功对话框
│   │   └── cards/                     # 需求卡片组件
│   │       ├── AIPreFillCard.tsx      # AI预填充卡片
│   │       ├── AttachmentsCard.tsx    # 附件卡片
│   │       ├── BasicInfoCard.tsx      # 基础信息卡片
│   │       └── SettingsCard.tsx       # 设置卡片
│   ├── expert/             # 专家相关
│   │   ├── ExpertDetailPage.tsx       # 专家详情页
│   │   └── ExpertRating.tsx          # 专家评分组件
│   ├── finance/            # 金融相关
│   │   ├── CompareSlider.tsx          # 对比滑块
│   │   ├── ContractSigning.tsx        # 合同签署
│   │   ├── DemandDetail.tsx           # 需求详情
│   │   ├── DemandManagement.tsx       # 需求管理
│   │   ├── DemandPublisher.tsx        # 需求发布器
│   │   ├── FinanceGateway.tsx         # 金融网关
│   │   ├── InvoiceDownload.tsx        # 发票下载
│   │   ├── QuantumMatch.tsx           # 量子匹配
│   │   └── RepaymentGame.tsx          # 还款游戏化
│   ├── home/               # 首页相关
│   │   ├── BankHome.tsx               # 银行首页
│   │   ├── BuyerHome.tsx              # 买家首页
│   │   ├── FarmerHome.tsx             # 农户首页
│   │   └── RoleHomePage.tsx           # 角色首页容器
│   ├── notification/       # 通知相关
│   │   └── NotificationDrawer.tsx    # 通知抽屉
│   ├── product/            # 产品相关
│   │   └── ProductDetailPage.tsx      # 产品详情页
│   ├── profile/            # 个人中心
│   │   ├── AddressDialog.tsx           # 地址管理对话框
│   │   ├── ProfileSettingsDialogs.tsx  # 设置对话框集合
│   │   └── RoleSpecificProfile.tsx    # 角色专属个人中心
│   ├── shaders/            # WebGL着色器
│   │   ├── atmosphereShader.ts        # 大气着色器
│   │   ├── meteorShader.ts            # 流星着色器
│   │   └── sunShader.ts               # 太阳着色器
│   ├── trade/              # 交易相关
│   │   └── FilterDrawer.tsx           # 筛选抽屉
│   ├── ui/                 # UI基础组件库 (shadcn/ui)
│   │   ├── accordion.tsx              # 手风琴
│   │   ├── alert-dialog.tsx           # 警告对话框
│   │   ├── alert.tsx                  # 警告提示
│   │   ├── aspect-ratio.tsx           # 宽高比
│   │   ├── async-button.tsx           # 异步按钮
│   │   ├── avatar.tsx                 # 头像
│   │   ├── badge.tsx                  # 徽章
│   │   ├── breadcrumb.tsx             # 面包屑
│   │   ├── button.tsx                 # 按钮
│   │   ├── calendar.tsx               # 日历
│   │   ├── card.tsx                   # 卡片
│   │   ├── carousel.tsx               # 轮播
│   │   ├── chart.tsx                  # 图表
│   │   ├── checkbox.tsx               # 复选框
│   │   ├── collapsible.tsx            # 折叠面板
│   │   ├── command.tsx                # 命令面板
│   │   ├── context-menu.tsx           # 上下文菜单
│   │   ├── dialog.tsx                 # 对话框
│   │   ├── drawer.tsx                 # 抽屉
│   │   ├── dropdown-menu.tsx         # 下拉菜单
│   │   ├── form.tsx                   # 表单
│   │   ├── hover-card.tsx             # 悬停卡片
│   │   ├── input-otp.tsx             # OTP输入
│   │   ├── input.tsx                  # 输入框
│   │   ├── label.tsx                  # 标签
│   │   ├── menubar.tsx                # 菜单栏
│   │   ├── navigation-menu.tsx        # 导航菜单
│   │   ├── pagination.tsx             # 分页
│   │   ├── popover.tsx                # 弹出框
│   │   ├── progress.tsx               # 进度条
│   │   ├── radio-group.tsx            # 单选组
│   │   ├── resizable.tsx              # 可调整大小
│   │   ├── scroll-area.tsx            # 滚动区域
│   │   ├── select.tsx                 # 选择器
│   │   ├── separator.tsx              # 分隔符
│   │   ├── sheet.tsx                  # 侧边栏
│   │   ├── sidebar.tsx                # 侧边栏
│   │   ├── skeleton.tsx               # 骨架屏
│   │   ├── slider.tsx                 # 滑块
│   │   ├── sonner.tsx                 # Toast通知
│   │   ├── switch.tsx                 # 开关
│   │   ├── table.tsx                  # 表格
│   │   ├── tabs.tsx                   # 标签页
│   │   ├── textarea.tsx               # 文本域
│   │   ├── toggle-group.tsx           # 切换组
│   │   ├── toggle.tsx                 # 切换按钮
│   │   ├── tooltip.tsx                # 工具提示
│   │   ├── use-mobile.ts              # 移动端检测Hook
│   │   └── utils.ts                   # UI工具函数
│   ├── figma/              # Figma相关
│   │   └── ImageWithFallback.tsx      # 图片降级组件
│   ├── ErrorBoundary.tsx              # 错误边界
│   ├── ExpertPage.tsx                 # 专家页面
│   ├── FinancePage.tsx                # 金融页面
│   ├── HeatmapSphere.tsx              # 热力图球体
│   ├── HomePage.tsx                   # 首页
│   ├── LoanSuccessModal.tsx           # 贷款成功模态框
│   ├── LoginPlanet.tsx                # 登录星球(2D Canvas版本)
│   ├── LoginPlanet4.tsx               # 登录星球(3D WebGL版本)
│   ├── MessageCenter.tsx              # 消息中心
│   ├── Navigation.tsx                 # 主导航栏
│   ├── ProfilePage.tsx                # 个人中心页面
│   ├── QuickNav.tsx                   # 快速导航
│   ├── RoleNavigation.tsx              # 角色导航
│   ├── StarLoader.tsx                 # 星星加载器
│   ├── TradePage.tsx                  # 交易页面
│   └── WebGLSphere.tsx                # WebGL球体组件
│
├── config/                 # 配置文件
│   └── roleNavigation.ts              # 角色导航配置
│
├── contexts/               # React Context
│   └── RoleContext.tsx                # 角色上下文
│
├── hooks/                  # 自定义Hooks
│   └── useRoleNav.ts                  # 角色导航Hook
│
├── pages/                  # 页面组件
│   ├── AdminPanel.tsx                 # 管理员面板
│   ├── Checkout.tsx                   # 结算页面
│   ├── ExpertCalendar.tsx             # 专家日历
│   ├── LoanApplication.tsx            # 贷款申请
│   ├── LoanApproval.tsx               # 贷款审批
│   ├── LoanMatching.tsx               # 贷款匹配
│   └── MeetingRoomBooking.tsx         # 会议室预订
│
├── stores/                 # Zustand状态管理
│   ├── calendarStore.ts               # 日历状态
│   ├── cartStore.ts                   # 购物车状态
│   ├── checkoutStore.ts               # 结算状态
│   ├── demandStore.ts                 # 需求状态
│   ├── loanStore.ts                   # 贷款状态
│   ├── meetStore.ts                   # 会议状态
│   └── msgStore.ts                    # 消息状态
│
├── styles/                 # 样式文件
│   ├── globals.css                    # 全局样式
│   └── theme.css                     # 主题样式
│
├── utils/                  # 工具函数
│   ├── useAIPreFill.ts               # AI预填充Hook
│   ├── useAsyncButton.ts             # 异步按钮Hook
│   ├── useCosmicPerformance.ts      # 性能监控Hook
│   ├── useDraftSave.ts               # 草稿保存Hook
│   ├── useImDialog.ts                # IM对话框Hook
│   ├── useMapPicker.ts               # 地图选择Hook
│   ├── useRepayModal.ts              # 还款模态框Hook
│   ├── useSignCanvas.ts              # 签名画布Hook
│   ├── useTheme.ts                   # 主题Hook
│   ├── suppress-three-warning.ts     # Three.js警告抑制
│   ├── startup.ts                    # 启动脚本
│   └── three-singleton.ts            # Three.js单例
│
├── guidelines/             # 开发指南
│   └── Guidelines.md                 # 开发规范
│
├── .specstory/             # SpecStory配置(忽略索引)
│   ├── .gitignore
│   ├── .project.json
│   ├── .what-is-this.md
│   └── history/
│
├── App.tsx                 # 应用主入口
├── main.tsx                # React入口文件
├── index.html              # HTML模板
├── index.css               # 全局CSS(包含Tailwind)
├── vite.config.ts          # Vite配置
├── tailwind.config.js      # Tailwind配置
├── postcss.config.js       # PostCSS配置
├── tsconfig.json           # TypeScript配置
├── tsconfig.node.json      # Node TypeScript配置
├── package.json            # 项目依赖
└── [大量文档文件].md      # 项目文档

```

---

## 核心文件说明

### 入口文件

#### `main.tsx`
- **作用**: React应用入口，渲染根组件
- **功能**: 初始化React应用，挂载到DOM

#### `App.tsx`
- **作用**: 应用主组件，管理全局状态和路由
- **核心功能**:
  - 管理认证状态 (`authState`: planet → station → dashboard → app)
  - 管理当前页面 (`currentPage`)
  - 管理角色选择 (`selectedRole`)
  - 处理页面渲染逻辑
  - 监听自定义导航事件
- **状态流转**:
  ```
  planet (星球选择) 
    → station (角色空间站登录) 
    → dashboard (角色仪表盘) 
    → app (应用主界面)
  ```

#### `index.html`
- **作用**: HTML模板文件
- **功能**: 定义页面基础结构，引入React根节点

### 配置文件

#### `vite.config.ts`
- **作用**: Vite构建工具配置
- **功能**: 配置开发服务器、构建选项、插件等

#### `tailwind.config.js`
- **作用**: Tailwind CSS配置
- **功能**: 定义主题颜色、自定义样式、响应式断点等

#### `tsconfig.json`
- **作用**: TypeScript编译配置
- **功能**: 定义编译选项、路径别名、类型检查规则等

---

## 页面跳转逻辑

### 认证流程

```
1. 启动应用
   ↓
2. 显示登录星球 (LoginPlanet/LoginPlanet4)
   - 用户点击角色卫星选择角色
   ↓
3. 进入角色空间站 (RoleStation)
   - 用户输入账号密码登录
   ↓
4. 显示角色仪表盘 (RoleDashboard)
   - 3秒后自动跳转
   ↓
5. 进入应用主界面 (App主界面)
   - 显示Navigation导航栏
   - 显示当前页面内容
```

### 主界面导航

应用主界面通过 `Navigation` 组件提供5个主要导航入口：

1. **星云之门** (`home`) → `HomePage`
2. **智融资本** (`finance`) → `FinancePage`
3. **知识星系** (`expert`) → `ExpertPage`
4. **农商市场** (`trade`) → `TradePage`
5. **我的宇宙** (`profile`) → `ProfilePage`

### 页面跳转方式

#### 1. 导航栏跳转
- **组件**: `Navigation.tsx`
- **方式**: 点击导航项，调用 `onTabChange(pageId)`
- **目标页面**: 主要5个页面

#### 2. 快速导航跳转
- **组件**: `QuickNav.tsx`
- **方式**: 悬浮快速导航按钮
- **目标页面**: 所有可用页面

#### 3. 购物车跳转
- **组件**: `Navigation.tsx` 购物车图标
- **方式**: 点击购物车图标
- **目标页面**: `CartPage` → `Checkout` (结算)

#### 4. 自定义事件跳转
- **方式**: 通过 `window.dispatchEvent` 触发自定义事件
- **事件列表**:
  - `navigate-to-meeting` → `MeetingRoomBooking`
  - `navigate-to-calendar` → `ExpertCalendar`
  - `navigate-to-loan-apply` → `LoanApplication`
  - `navigate-to-loan-match` → `LoanMatching`
  - `navigate-to-loan-approve` → `LoanApproval`
  - `navigate-to-admin-users` → `AdminPanel`

#### 5. Props回调跳转
- **方式**: 通过组件Props传递 `onNavigate` 回调
- **示例**: `CartPage` → `Checkout` 通过 `onNavigate('/order/confirm')`

### 页面路由映射表

| PageType | 组件 | 说明 |
|----------|------|------|
| `home` | `HomePage` | 首页 |
| `trade` | `TradePage` | 交易市场 |
| `finance` | `FinancePage` | 金融服务 |
| `expert` | `ExpertPage` | 专家咨询 |
| `profile` | `ProfilePage` | 个人中心 |
| `cart` | `CartPage` | 购物车 |
| `product` | `ProductDetailPage` | 产品详情 |
| `demand` | `BuyerDemandPage` | 需求发布 |
| `meeting` | `MeetingRoomBooking` | 会议室预订 |
| `calendar` | `ExpertCalendar` | 专家日历 |
| `checkout` | `Checkout` | 结算页面 |
| `loan-apply` | `LoanApplication` | 贷款申请 |
| `loan-match` | `LoanMatching` | 贷款匹配 |
| `loan-approve` | `LoanApproval` | 贷款审批 |
| `admin` | `AdminPanel` | 管理员面板 |

---

## 页面功能说明

### 1. 登录星球 (`LoginPlanet` / `LoginPlanet4`)

**文件**: `components/LoginPlanet.tsx` / `components/LoginPlanet4.tsx`

**功能**:
- 2D Canvas版本 (`LoginPlanet`) 和 3D WebGL版本 (`LoginPlanet4`)
- 显示5个角色卫星围绕中心星球旋转
- 点击卫星选择角色
- 拖拽卫星到中心触发登录
- 悬停显示角色信息卡片

**交互**:
- 鼠标悬停卫星 → 显示信息卡片
- 点击卫星 → 选择角色 → 进入空间站
- 拖拽卫星到中心 → 触发登录

---

### 2. 角色空间站 (`RoleStation`)

**文件**: `components/auth/RoleStations.tsx`

**功能**:
- 根据选择的角色显示对应的登录界面
- 账号密码登录
- 角色专属UI设计

**跳转**:
- 登录成功 → `RoleDashboard` → `App主界面`

---

### 3. 角色仪表盘 (`RoleDashboard`)

**文件**: `components/dashboards/RoleDashboards.tsx`

**功能**:
- 显示角色专属欢迎界面
- 展示角色相关信息
- 3秒后自动进入主界面

---

### 4. 首页 (`HomePage`)

**文件**: `components/HomePage.tsx`

**功能**:
- 根据角色显示不同的首页内容
- 集成 `RoleHomePage` 容器
- 显示角色专属首页组件:
  - `FarmerHome` - 农户首页
  - `BuyerHome` - 买家首页
  - `BankHome` - 银行首页

**子组件**:
- `components/home/RoleHomePage.tsx` - 角色首页容器
- `components/home/FarmerHome.tsx` - 农户首页
- `components/home/BuyerHome.tsx` - 买家首页
- `components/home/BankHome.tsx` - 银行首页

---

### 5. 交易市场 (`TradePage`)

**文件**: `components/TradePage.tsx`

**功能**:
- 商品列表展示
- 商品搜索
- 筛选功能 (价格、分类、产地、认证等)
- 商品卡片展示
- 发布求购需求入口

**子组件**:
- `components/trade/FilterDrawer.tsx` - 筛选抽屉
- `components/common/DemandFab.tsx` - 需求发布悬浮按钮

**跳转**:
- 点击商品 → `ProductDetailPage`
- 点击"发布求购需求" → `BuyerDemandPage`

---