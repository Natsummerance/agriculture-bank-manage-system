# AgriVerse - 农业产品融销平台完整项目文档（含完整文件架构和引用关系）

## 项目概述
AgriVerse（农业产品融销平台）是一个基于宇宙主题的农业产品融销一体化平台，支持多角色（农户、买家、银行、专家、管理员）使用，提供商品交易、金融服务、专家咨询、需求发布等功能。项目采用创新的3D WebGL登录界面和角色空间站概念。

## 完整项目结构

```
agriculture-bank-manage-system-main/
├── .cursorindexingignore
├── .gitignore
├── App.tsx                           # 应用入口组件
├── FILES_TO_COPY.txt
├── FRONTEND_TASKS.md
├── IFLOW.md
├── index.css                         # 全局样式
├── index.html                        # HTML 入口
├── INTEGRATION_GUIDE.md
├── main.tsx                          # React 应用启动文件
├── package-lock.json
├── package.json                      # 前端依赖配置
├── postcss.config.js
├── README.md
├── tailwind.config.js                # Tailwind CSS 配置
├── tsconfig.json                     # TypeScript 配置
├── tsconfig.node.json
├── vite.config.ts                    # Vite 构建配置
├── temp_delete_script.bat            # 临时删除脚本
├── .github/
│   └── copilot-instructions.md
├── .specstory/
│   ├── .gitignore
│   ├── .project.json
│   ├── .what-is-this.md
│   └── history/
├── .vscode/
│   └── settings.json
├── .VSCodeCounter/
│   └── 2025-11-20_23-37-22/
├── api/                              # 前端 API 客户端
│   ├── auth.ts                       # 认证 API 接口
│   ├── client.ts                     # HTTP 客户端
│   └── README.md
├── backend/                          # Java 后端服务
│   ├── .gitignore
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── generate-test-report.bat
│   ├── init-trade.sql
│   ├── init.sql                      # 数据库初始化脚本
│   ├── pom-report.xml
│   ├── pom.xml                       # Maven 配置文件
│   ├── QQ邮箱配置说明.md
│   ├── README.md
│   ├── .iflow/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/agriverse/
│   │       │   ├── AgriverseAuthApplication.java  # Spring Boot 启动类
│   │       │   ├── config/         # 配置类
│   │       │   │   ├── SecurityConfig.java        # 安全配置
│   │       │   │   ├── JwtConfig.java            # JWT 配置
│   │       │   │   └── CorsConfig.java           # CORS 配置
│   │       │   ├── controller/     # 控制器层
│   │       │   │   ├── AuthController.java       # 认证控制器
│   │       │   │   ├── ProductController.java    # 商品控制器
│   │       │   │   ├── CartController.java       # 购物车控制器
│   │       │   │   ├── OrderController.java      # 订单控制器
│   │       │   │   ├── CouponController.java     # 优惠券控制器
│   │       │   │   ├── LoanController.java       # 贷款控制器
│   │       │   │   └── AdminController.java      # 管理员控制器
│   │       │   ├── service/        # 服务层
│   │       │   │   ├── AuthService.java          # 认证服务
│   │       │   │   ├── ProductService.java       # 商品服务
│   │       │   │   ├── CartService.java          # 购物车服务
│   │       │   │   ├── OrderService.java         # 订单服务
│   │       │   │   ├── CouponService.java        # 优惠券服务
│   │       │   │   ├── LoanService.java          # 贷款服务
│   │       │   │   └── AdminService.java         # 管理员服务
│   │       │   ├── repository/     # 数据访问层
│   │       │   │   ├── UserRepository.java       # 用户仓库
│   │       │   │   ├── ProductRepository.java    # 商品仓库
│   │       │   │   ├── CartItemRepository.java   # 购物车仓库
│   │       │   │   ├── OrderRepository.java      # 订单仓库
│   │       │   │   ├── OrderItemRepository.java  # 订单项仓库
│   │       │   │   ├── CouponRepository.java     # 优惠券仓库
│   │       │   │   ├── UserCouponRepository.java # 用户优惠券仓库
│   │       │   │   └── LoanRepository.java       # 贷款仓库
│   │       │   ├── entity/         # 实体类
│   │       │   │   ├── User.java                 # 用户实体
│   │       │   │   ├── Product.java              # 商品实体
│   │       │   │   ├── CartItem.java             # 购物车项实体
│   │       │   │   ├── Order.java                # 订单实体
│   │       │   │   ├── OrderItem.java            # 订单项实体
│   │       │   │   ├── Coupon.java               # 优惠券实体
│   │       │   │   ├── UserCoupon.java           # 用户优惠券实体
│   │       │   │   └── Loan.java                 # 贷款实体
│   │       │   ├── dto/            # 数据传输对象
│   │       │   │   ├── auth/       # 认证相关DTO
│   │       │   │   ├── product/    # 商品相关DTO
│   │       │   │   ├── cart/       # 购物车相关DTO
│   │       │   │   ├── order/      # 订单相关DTO
│   │       │   │   ├── coupon/     # 优惠券相关DTO
│   │       │   │   └── loan/       # 贷款相关DTO
│   │       │   ├── security/       # 安全相关
│   │       │   │   ├── JwtTokenProvider.java     # JWT令牌提供者
│   │       │   │   ├── JwtAuthenticationFilter.java # JWT认证过滤器
│   │       │   │   └── CustomUserDetailsService.java # 用户详情服务
│   │       │   └── exception/      # 异常处理
│   │       │       ├── GlobalExceptionHandler.java # 全局异常处理器
│   │       │       └── CustomException.java      # 自定义异常
│   │       └── resources/
│   │           ├── application.yml               # 应用配置
│   │           ├── application-dev.yml           # 开发环境配置
│   │           ├── application-prod.yml          # 生产环境配置
│   │           └── static/                       # 静态资源
│   └── target/                       # Maven 构建输出目录
├── components/                       # React 组件库
│   ├── ErrorBoundary.tsx             # 错误边界组件
│   ├── ExpertPage.tsx                # 专家页面
│   ├── FinancePage.tsx               # 金融页面
│   ├── HeatmapSphere.tsx             # 热力图球体组件
│   ├── HomePage.tsx                  # 首页
│   ├── LoanSuccessModal.tsx          # 贷款成功模态框
│   ├── LoginPlanet.tsx               # 登录星球组件 (2D)
│   ├── LoginPlanet4.tsx              # 登录星球组件 (3D)
│   ├── MessageCenter.tsx             # 消息中心
│   ├── Navigation.tsx                # 导航栏组件
│   ├── ProfilePage.tsx               # 个人中心页面
│   ├── QuickNav.tsx                  # 快捷导航 (已移除)
│   ├── RoleNavigation.tsx            # 角色导航
│   ├── StarLoader.tsx                # 星球加载器
│   ├── TradePage.tsx                 # 交易页面
│   ├── WebGLSphere.tsx               # WebGL 球体
│   ├── admin/                        # 管理员相关组件
│   ├── auth/                         # 认证相关组件
│   │   └── RoleStations.tsx          # 角色空间站组件
│   ├── bank/                         # 银行相关组件
│   │   ├── BankFinancePage.tsx       # 银行金融页面
│   │   ├── BankRadar.tsx             # 银行雷达组件
│   │   └── JointLoanHub.tsx          # 联合贷款中心
│   ├── blockchain/                   # 区块链相关组件
│   ├── cart/                         # 购物车相关组件
│   │   └── CartPage.tsx              # 购物车页面
│   ├── common/                       # 通用组件
│   │   ├── DemandFab.tsx             # 需求发布浮动按钮
│   │   ├── IMFloat.tsx               # 悬浮聊天 (已移除)
│   │   ├── RoleQuickNav.tsx          # 角色快捷导航
│   │   └── SharePopover.tsx          # 分享弹窗
│   ├── consult/                      # 咨询相关组件
│   │   └── ConsultDialog.tsx         # 咨询对话框
│   ├── dashboards/                   # 仪表盘相关组件
│   │   └── RoleDashboards.tsx        # 角色仪表盘
│   ├── demand/                       # 需求发布相关组件
│   │   └── BuyerDemandPage.tsx       # 买家需求页面
│   ├── expert/                       # 专家相关组件
│   ├── figma/                        # Figma相关组件
│   ├── finance/                      # 金融相关组件
│   ├── home/                         # 首页相关组件
│   │   └── RoleBasedHomePage.tsx     # 角色基础首页
│   ├── notification/                 # 通知相关组件
│   ├── pages/                        # 页面组件
│   │   └── RoleFinancePage.tsx       # 角色金融页面
│   ├── product/                      # 产品相关组件
│   │   └── ProductDetailPage.tsx     # 产品详情页面
│   ├── profile/                      # 个人中心相关组件
│   ├── shaders/                      # WebGL 着色器
│   ├── trade/                        # 交易相关组件
│   └── ui/                           # UI 基础组件
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── async-button.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.ts
│       └── utils.ts
├── config/                           # 配置文件
│   └── roleNavigation.ts             # 角色导航配置
├── contexts/                         # React Context
│   └── RoleContext.tsx               # 角色上下文
├── guidelines/                       # 开发指南
│   └── Guidelines.md                 # 开发规范文档
├── hooks/                            # 自定义 Hook
│   ├── useFarmerFinance.ts           # 农户金融 Hook
│   ├── useFarmerPublish.ts           # 农户发布 Hook
│   └── useRoleNav.ts                 # 角色导航 Hook
├── docs/md/                               # 项目文档
│   └── (多个文档文件)
├── pages/                            # 页面组件
│   ├── AdminPanel.tsx                # 管理员面板
│   ├── Checkout.tsx                  # 结算页面
│   ├── ExpertCalendar.tsx            # 专家日历
│   ├── LoanApplication.tsx           # 贷款申请
│   ├── LoanApproval.tsx              # 贷款审批
│   ├── LoanMatching.tsx              # 贷款匹配
│   ├── MeetingRoomBooking.tsx        # 会议室预约
│   ├── PlanetPage.tsx                # 行星页面
│   └── StationPage.tsx               # 空间站页面
├── roles/                            # 角色专属布局
│   ├── admin/                        # 管理员角色
│   │   └── (角色相关文件)
│   ├── bank/                         # 银行角色
│   │   ├── BankLayout.tsx
│   │   └── navigation/
│   │       └── BankNavBar.tsx
│   ├── buyer/                        # 买家角色
│   │   └── (角色相关文件)
│   ├── expert/                       # 专家角色
│   │   └── (角色相关文件)
│   └── farmer/                       # 农户角色
│       └── (角色相关文件)
├── router/                           # 路由配置
│   └── index.tsx                     # 路由配置文件
├── stores/                           # Zustand 状态管理
│   ├── calendarStore.ts              # 日历状态
│   ├── cartStore.ts                  # 购物车状态
│   └── checkoutStore.ts              # 结算状态
├── styles/                           # 样式文件
├── utils/                            # 工具函数
│   └── useTheme.ts                   # 主题工具
└── node_modules/                     # Node.js 依赖模块
```

## 文件详细内容和引用关系

### 1. App.tsx (应用主入口)
```typescript
// 引用文件：
import { useState, lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navigation } from "./components/Navigation";
import { QuickNav } from "./components/QuickNav";
import { StarLoader } from "./components/StarLoader";
import { HomePage } from "./components/HomePage";
import { TradePage } from "./components/TradePage";
import { FinancePage } from "./components/FinancePage";
import { ExpertPage } from "./components/ExpertPage";
import { ProfilePage } from "./components/ProfilePage";
import { LoginPlanet } from "./components/LoginPlanet";
import { LoginPlanet4 } from "./components/LoginPlanet4";
import { RoleStation } from "./components/auth/RoleStations";
import { RoleDashboard } from "./components/dashboards/RoleDashboards";
import CartPage from "./components/cart/CartPage";
import ProductDetailPage from "./components/product/ProductDetailPage";
import BuyerDemandPage from "./components/demand/BuyerDemandPage";
import IMFloat from "./components/common/IMFloat";
import DemandFab from "./components/common/DemandFab";
import MeetingRoomBooking from "./pages/MeetingRoomBooking";
import ExpertCalendar from "./pages/ExpertCalendar";
import Checkout from "./pages/Checkout";
import LoanApplication from "./pages/LoanApplication";
import LoanMatching from "./pages/LoanMatching";
import LoanApproval from "./pages/LoanApproval";
import AdminPanel from "./pages/AdminPanel";
import { RoleBasedHomePage } from "./components/home/RoleBasedHomePage";
import { useTheme } from "./utils/useTheme";
import { Toaster } from "./components/ui/sonner";
import { RoleProvider, useRole } from "./contexts/RoleContext";

// 被引用文件：
// - main.tsx (作为应用主组件被导入和渲染)
// - components/Navigation.tsx (用于页面导航)
// - components/ErrorBoundary.tsx (用于错误边界)
// - components/StarLoader.tsx (用于加载动画)
// - components/HomePage.tsx (首页组件)
// - components/TradePage.tsx (交易页面)
// - components/FinancePage.tsx (金融页面)
// - components/ExpertPage.tsx (专家页面)
// - components/ProfilePage.tsx (个人中心)
// - components/LoginPlanet.tsx (登录星球)
// - components/LoginPlanet4.tsx (3D登录星球)
// - components/auth/RoleStations.tsx (角色空间站)
// - components/dashboards/RoleDashboards.tsx (角色仪表盘)
// - components/cart/CartPage.tsx (购物车页面)
// - components/product/ProductDetailPage.tsx (产品详情)
// - components/demand/BuyerDemandPage.tsx (买家需求)
// - components/common/IMFloat.tsx (悬浮聊天)
// - components/common/DemandFab.tsx (需求发布按钮)
// - pages/MeetingRoomBooking.tsx (会议室预约)
// - pages/ExpertCalendar.tsx (专家日历)
// - pages/Checkout.tsx (结账页面)
// - pages/LoanApplication.tsx (贷款申请)
// - pages/LoanMatching.tsx (贷款匹配)
// - pages/LoanApproval.tsx (贷款审批)
// - pages/AdminPanel.tsx (管理员面板)
// - components/home/RoleBasedHomePage.tsx (角色基础首页)
// - utils/useTheme.ts (主题工具)
// - components/ui/sonner.tsx (通知组件)
// - contexts/RoleContext.tsx (角色上下文)

// 定义类型：
type PageType = "home" | "trade" | "finance" | "expert" | "profile" | "cart" | "product" | "demand" | "meeting" | "calendar" | "checkout" | "loan-apply" | "loan-match" | "loan-approve" | "admin";
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;
type AuthState = 'planet' | 'station' | 'dashboard' | 'app';
type PlanetVersion = '3.0' | '4.0';

// 状态变量：
const [authState, setAuthState] = useState<AuthState>('planet');         // 认证状态
const [selectedRole, setSelectedRole] = useState<RoleType>(null);         // 选择角色
const [userData, setUserData] = useState<any>(null);                      // 用户数据
const [currentPage, setCurrentPage] = useState<PageType>("home");         // 当前页面
const [planetVersion, setPlanetVersion] = useState<PlanetVersion>('4.0'); // 星球版本

// 主要函数：
// handleRoleSelect() - 处理角色选择
// handleLogin() - 处理登录成功
// handleBackToPlanet() - 返回星球选择
// renderPage() - 渲染当前页面
// handleDirectJump() - 直接跳转到角色页面
```

### 2. components/auth/RoleStations.tsx (角色空间站)
```typescript
// 引用文件：
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Lock,
  Mail,
  Phone,
  Key,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { login, register, sendVerificationCode, type LoginRequest, type RegisterRequest } from "../../api/auth";

// 被引用文件：
// - App.tsx (通过RoleStation组件被导入)
// - components/LoginPlanet.tsx (角色选择后跳转)
// - components/LoginPlanet4.tsx (角色选择后跳转)

// 类型定义：
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

// 接口定义：
interface RoleStationProps {
  role: RoleType;      // 角色类型
  onLogin: (data: any) => void;  // 登录回调
  onBack: () => void;  // 返回回调
}

// 配置对象：
const stationConfig = {
  farmer: { title: '晨露·生态舱', subtitle: 'Farmer Eco Station', theme: 'from-[#18FF74]/20 to-[#00D6C2]/10', primaryColor: '#18FF74', icon: '🌾', background: 'linear-gradient(135deg, rgba(24, 255, 116, 0.05), rgba(0, 214, 194, 0.02))', feature: '数字稻田生长动画' },
  buyer: { title: '都市·购汇舱', subtitle: 'Buyer Commerce Station', theme: 'from-[#00D6C2]/20 to-[#18FF74]/10', primaryColor: '#00D6C2', icon: '🛒', background: 'linear-gradient(135deg, rgba(0, 214, 194, 0.05), rgba(24, 255, 116, 0.02))', feature: '城市霓虹扫描线' },
  bank: { title: '量子·金库舱', subtitle: 'Bank Quantum Vault', theme: 'from-[#FFD700]/20 to-[#FF8C00]/10', primaryColor: '#FFD700', icon: '🏦', background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 140, 0, 0.02))', feature: '金库门旋转开启' },
  expert: { title: '知识·轨道舱', subtitle: 'Expert Knowledge Orbit', theme: 'from-[#FF2566]/20 to-[#FF6B9D]/10', primaryColor: '#FF2566', icon: '👨‍🔬', background: 'linear-gradient(135deg, rgba(255, 37, 102, 0.05), rgba(255, 107, 157, 0.02))', feature: '环形书架旋转' },
  admin: { title: '核心·控制舱', subtitle: 'Admin Control Core', theme: 'from-[#9D4EDD]/20 to-[#C77DFF]/10', primaryColor: '#9D4EDD', icon: '⚙️', background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.05), rgba(199, 125, 255, 0.02))', feature: '3D拓扑实时旋转' }
};

// 状态变量：
const [mode, setMode] = useState<'login' | 'register'>('login');         // 登录/注册模式
const [loading, setLoading] = useState(false);                           // 加载状态
const [sendingCode, setSendingCode] = useState(false);                   // 发送验证码状态
const [codeCountdown, setCodeCountdown] = useState(0);                   // 验证码倒计时
const [formData, setFormData] = useState({                               // 表单数据
  phone: '',
  email: '',
  code: '',
  password: '',
  inviteCode: ''
});

// 主要函数：
// handleSendCode() - 发送验证码
// handleSubmit() - 提交表单
// handleQuickLogin() - 快速登录
// handleMockLogin() - 模拟登录
```

### 3. components/home/RoleBasedHomePage.tsx (角色基础首页)
```typescript
// 引用文件：
import { useRole } from '@/contexts/RoleContext';
import { HomePage } from '@/components/HomePage';
import { TradePage } from '@/components/TradePage';
import { ExpertPage } from '@/components/ExpertPage';
import { AdminPanel } from '@/pages/AdminPanel';
import { RoleFinancePage } from '@/components/pages/RoleFinancePage';
import { StarLoader } from '@/components/StarLoader';
import { RoleQuickNav } from '@/components/common/RoleQuickNav';
import { useState } from 'react';

// 被引用文件：
// - App.tsx (通过renderPage函数被导入显示)

// 状态变量：
const [showQuickNav, setShowQuickNav] = useState(false);

// 主要函数：
// renderPageWithQuickNav() - 渲染页面带快捷导航
// RoleBasedHomePage() - 根据角色返回对应页面
```

### 4. api/auth.ts (认证API)
```typescript
// 引用文件：
import { post, get, ApiError } from './client';

// 被引用文件：
// - components/auth/RoleStations.tsx (用于登录注册)
// - App.tsx (用于快速登录)
// - 其他需要认证的组件

// 类型定义：
export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

// 接口定义：
export interface LoginRequest {
  phone: string;
  password: string;
  role?: RoleType;
}

export interface RegisterRequest {
  phone: string;
  email: string;
  code: string;
  password: string;
  role: RoleType;
  inviteCode?: string;
  name?: string;
  company?: string;
  location?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: RoleType;
  avatar?: string;
  company?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: UserInfo;
  expiresIn?: number;
}

// API函数：
export async function login(data: LoginRequest): Promise<LoginResponse>
export async function register(data: RegisterRequest): Promise<RegisterResponse>
export async function sendVerificationCode(data: SendCodeRequest): Promise<SendCodeResponse>
export async function getCurrentUser(): Promise<UserInfo>
export async function logout(): Promise<void>
export async function refreshAuthToken(): Promise<{ token: string; refreshToken?: string }>
export async function checkPhoneExists(phone: string, role?: RoleType): Promise<boolean>
export async function resetPassword(phone: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }>
```

### 5. contexts/RoleContext.tsx (角色上下文)
```typescript
// 引用文件：
import { createContext, useContext, useState, ReactNode } from 'react';

// 被引用文件：
// - App.tsx (通过RoleProvider包裹应用)
// - components/home/RoleBasedHomePage.tsx (通过useRole获取角色)
// - components/common/RoleQuickNav.tsx (通过useRole获取权限)
// - 所有需要角色信息的组件

// 类型定义：
export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

// 接口定义：
interface UserData {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  phone?: string;
  company?: string;
  location?: string;
}

interface RoleContextType {
  role: RoleType;
  userData: UserData | null;
  setRole: (role: RoleType) => void;
  setUserData: (data: UserData | null) => void;
  hasPermission: (permission: string) => boolean;
}

// 权限配置：
const rolePermissions: Record<string, string[]> = {
  farmer: ['view-market', 'apply-loan', 'united-loan', 'consult-expert', 'publish-product'],
  buyer: ['view-market', 'purchase', 'checkout', 'publish-demand', 'consult-expert'],
  bank: ['approve-loan', 'view-applications', 'contract-sign', 'manage-repayment'],
  expert: ['manage-calendar', 'publish-knowledge', 'video-consult', 'receive-appointments'],
  admin: ['manage-users', 'view-all', 'approve-all', 'system-settings', 'data-analytics'],
};

// Context对象：
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// 主要函数：
// useRole() - 自定义Hook获取角色信息
// getRoleName() - 获取角色名称
// getRoleColor() - 获取角色颜色
```

### 6. components/common/RoleQuickNav.tsx (角色快捷导航)
```typescript
// 引用文件：
import { motion } from 'motion/react';
import { Calendar, CreditCard, FileText, Users, Briefcase, Building2, X } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';

// 被引用文件：
// - components/home/RoleBasedHomePage.tsx (集成到各角色页面)

// 接口定义：
interface RoleQuickNavProps {
  onNavigate: (page: string) => void;  // 导航回调
  onClose: () => void;                 // 关闭回调
}

// 主要函数：
// RoleQuickNav() - 根据角色显示相应快捷入口
// getQuickLinks() - 获取角色特定快捷链接
```

### 7. stores/cartStore.ts (购物车状态管理)
```typescript
// 引用文件：
import { create } from 'zustand';

// 被引用文件：
// - components/cart/CartPage.tsx
// - components/product/ProductDetailPage.tsx
// - pages/Checkout.tsx
// - 任何需要购物车状态的组件

// 接口定义：
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Store定义：
const useCartStore = create<CartState>((set, get) => ({
  items: [],
  count: 0,
  total: 0,
  addToCart: (item) => { /* ... */ },
  updateQuantity: (id, quantity) => { /* ... */ },
  removeFromCart: (id) => { /* ... */ },
  clearCart: () => { /* ... */ }
}));
```

### 8. components/Navigation.tsx (导航栏)
```typescript
// 引用文件：
import { motion } from "motion/react";
import { Home, DollarSign, Users, ShoppingCart, User, Bell, Share2 } from "lucide-react";
import { useState } from "react";
import { MessageCenter } from "./MessageCenter";
import SharePopover from "./common/SharePopover";
import { useCartStore } from "../stores/cartStore";
import { useMsgStore } from "../stores/msgStore";
import { useRole } from "../contexts/RoleContext";

// 被引用文件：
// - App.tsx (应用主界面中显示)

// 导航项配置：
const navItems = [
  { id: 'home', label: '星云之门', icon: Home },
  { id: 'finance', label: '智融资本', icon: DollarSign },
  { id: 'expert', label: '知识星系', icon: Users },
  { id: 'trade', label: '农商市场', icon: ShoppingCart },
  { id: 'profile', label: '我的宇宙', icon: User },
];

// 主要函数：
// Navigation() - 显示导航栏，根据角色显示不同标签
```

### 9. pages/LoanApproval.tsx (贷款审批页面)
```typescript
// 引用文件：
import { useState } from 'react';
import { motion } from 'motion/react';
import { Download, Video, CheckCircle, XCircle, FileText, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

// 被引用文件：
// - App.tsx (通过renderPage函数)
// - components/pages/RoleFinancePage.tsx (银行角色专用)
// - components/home/RoleBasedHomePage.tsx (银行角色显示)

// 接口定义：
interface LoanApplicationData {
  id: string;
  applicant: string;
  avatar: string;
  amount: number;
  purpose: string;
  duration: number;
  creditScore: number;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  location: string;
  farmSize: string;
  isUnited: boolean;
  unitedMembers?: number;
}

// 状态变量：
const [applications, setApplications] = useState<LoanApplicationData[]>(mockApplications);
const [selectedApp, setSelectedApp] = useState<LoanApplicationData | null>(null);
const [isDownloading, setIsDownloading] = useState(false);
const [showVideoModal, setShowVideoModal] = useState(false);
const [isApproving, setIsApproving] = useState(false);

// 主要函数：
// handleDownloadDocs() - 下载文档
// handleApprove() - 批准申请
// handleReject() - 拒绝申请
// calculateRiskScore() - 计算风险评分
```

### 10. components/FinancePage.tsx (金融页面)
```typescript
// 被引用文件：
// - components/pages/RoleFinancePage.tsx (作为农户金融页面)
// - App.tsx (当currentPage为'finance'时显示)

// 产品配置：
const loanProducts = [
  { id: 1, name: "农业生产贷", rate: "3.85%", limit: "1-50万", period: "1-3年", features: ["快速审批", "利率优惠", "灵活还款"], color: "from-[#00D6C2] to-[#18FF74]", score: 95 },
  { id: 2, name: "种植专项贷", rate: "4.15%", limit: "5-100万", period: "1-5年", features: ["专项支持", "季节性还款", "免抵押"], color: "from-[#18FF74] to-[#00D6C2]", score: 92 },
  { id: 3, name: "供应链融资", rate: "4.50%", limit: "10-200万", period: "6个月-2年", features: ["订单融资", "应收账款", "库存质押"], color: "from-[#00D6C2] to-[#FF2566]", score: 88 },
  { id: 4, name: "设备租赁贷", rate: "5.00%", limit: "20-500万", period: "2-5年", features: ["设备抵押", "以租代购", "税收优惠"], color: "from-[#FF2566] to-[#00D6C2]", score: 85 }
];

// 匹配节点：
const matchNodes = [
  { id: 1, type: "farmer", name: "张农户", x: 20, y: 30, similarity: 0.85 },
  { id: 2, type: "farmer", name: "李农场", x: 30, y: 60, similarity: 0.78 },
  { id: 3, type: "buyer", name: "王商贸", x: 60, y: 25, similarity: 0.92 },
  { id: 4, type: "buyer", name: "赵超市", x: 70, y: 70, similarity: 0.88 },
  { id: 5, type: "bank", name: "农行", x: 45, y: 45, similarity: 1.0 },
  { id: 6, type: "farmer", name: "钱合作社", x: 25, y: 85, similarity: 0.75 },
];

// 步骤配置：
const steps = [
  { id: 1, title: "填写信息", desc: "基本资料与需求", status: "completed" },
  { id: 2, title: "智能匹配", desc: "AI分析推荐产品", status: "active" },
  { id: 3, title: "在线申请", desc: "提交贷款申请", status: "pending" },
  { id: 4, title: "审批放款", desc: "快速审批到账", status: "pending" }
];
```

## 文件间引用关系图

```
App.tsx
├── components/Navigation.tsx (导入)
├── components/home/RoleBasedHomePage.tsx (导入)
├── components/LoginPlanet.tsx (导入)
├── components/LoginPlanet4.tsx (导入)
├── components/auth/RoleStations.tsx (导入)
├── components/dashboards/RoleDashboards.tsx (导入)
├── contexts/RoleContext.tsx (导入RoleProvider)
├── utils/useTheme.ts (导入)
├── api/auth.ts (通过RoleStation导入)
└── components/common/RoleQuickNav.tsx (通过RoleBasedHomePage导入)

components/auth/RoleStations.tsx
├── api/auth.ts (导入login, register等函数)
└── contexts/RoleContext.tsx (通过App.tsx间接使用)

components/home/RoleBasedHomePage.tsx
├── contexts/RoleContext.tsx (导入useRole)
├── components/HomePage.tsx (导入)
├── components/TradePage.tsx (导入)
├── components/ExpertPage.tsx (导入)
├── pages/AdminPanel.tsx (导入)
├── components/pages/RoleFinancePage.tsx (导入)
├── components/StarLoader.tsx (导入)
└── components/common/RoleQuickNav.tsx (导入)

components/Navigation.tsx
├── contexts/RoleContext.tsx (导入useRole)
├── stores/cartStore.ts (导入)
└── stores/msgStore.ts (导入)

components/common/RoleQuickNav.tsx
├── contexts/RoleContext.tsx (导入useRole)
└── 通过RoleBasedHomePage.tsx被App.tsx使用

api/auth.ts
├── api/client.ts (导入post, get等函数)
└── 被多个组件导入使用

contexts/RoleContext.tsx
├── 被App.tsx用于提供上下文
├── 被RoleBasedHomePage.tsx用于获取角色
├── 被RoleQuickNav.tsx用于权限检查
└── 被Navigation.tsx用于显示角色特定内容

stores/cartStore.ts
├── 被Navigation.tsx用于显示购物车数量
├── 被CartPage.tsx用于管理购物车状态
└── 被ProductDetailPage.tsx用于添加商品到购物车

pages/LoanApproval.tsx
├── 通过RoleBasedHomePage.tsx (银行角色)被App.tsx使用
├── 通过RoleFinancePage.tsx (银行角色)被App.tsx使用
└── components/ui/button.tsx (导入)

components/FinancePage.tsx
├── 通过RoleBasedHomePage.tsx (农户角色)被App.tsx使用
├── 通过RoleFinancePage.tsx (其他角色)被App.tsx使用
└── components/pages/RoleFinancePage.tsx (根据角色显示)
```

## 详细的组件依赖关系

### 页面级别依赖关系
```
App.tsx (根组件)
├── 身份验证流程
│   ├── LoginPlanet.tsx / LoginPlanet4.tsx (星球选择)
│   └── RoleStation.tsx (角色空间站) → Auth API
│       └── RoleDashboard.tsx (角色仪表盘)
├── 主界面流程
│   ├── Navigation.tsx (导航栏)
│   └── 根据角色显示不同页面
│       ├── RoleBasedHomePage.tsx (角色基础首页)
│       │   ├── HomePage.tsx (农户)
│       │   ├── TradePage.tsx (买家)
│       │   ├── RoleFinancePage.tsx (其他角色)
│       │   │   └── LoanApproval.tsx (银行)
│       │   ├── ExpertPage.tsx (专家)
│       │   └── AdminPanel.tsx (管理员)
│       └── 其他特定页面
│           ├── CartPage.tsx
│           ├── ProductDetailPage.tsx
│           ├── Checkout.tsx
│           ├── LoanApplication.tsx
│           └── ...
└── 通用组件
    ├── StarLoader.tsx (加载动画)
    ├── QuickNav.tsx (快捷导航 - 已移除)
    ├── RoleQuickNav.tsx (角色快捷导航)
    └── Toaster (通知)
```

### 状态管理依赖关系
```
状态来源
├── Context (全局状态)
│   └── RoleContext.tsx
│       ├── App.tsx (提供者)
│       ├── components/home/RoleBasedHomePage.tsx (消费者)
│       ├── components/common/RoleQuickNav.tsx (消费者)
│       └── components/Navigation.tsx (消费者)
└── Zustand (局部状态)
    ├── stores/cartStore.ts
    │   ├── components/Navigation.tsx (购物车计数)
    │   ├── components/cart/CartPage.tsx (购物车主逻辑)
    │   ├── components/product/ProductDetailPage.tsx (加入购物车)
    │   └── pages/Checkout.tsx (结算)
    ├── stores/checkoutStore.ts
    │   └── pages/Checkout.tsx
    └── stores/*Store.ts
        └── 对应页面组件
```

### API 依赖关系
```
API 客户端
├── api/client.ts (基础HTTP客户端)
│   ├── api/auth.ts (认证相关)
│   ├── 各他API文件
│   └── 所有需要网络请求的组件
└── 具体API端点
    ├── auth.ts (认证)
    │   ├── components/auth/RoleStations.tsx
    │   ├── App.tsx (快速登录)
    │   └── 其他认证相关组件
    ├── 产品相关API
    │   ├── components/TradePage.tsx
    │   ├── components/product/ProductDetailPage.tsx
    │   └── pages/AdminPanel.tsx
    ├── 购物车相关API
    │   ├── stores/cartStore.ts
    │   └── components/cart/CartPage.tsx
    ├── 订单相关API
    │   ├── pages/Checkout.tsx
    │   └── pages/AdminPanel.tsx
    └── 贷款相关API
        ├── pages/LoanApplication.tsx
        ├── pages/LoanApproval.tsx
        └── components/FinancePage.tsx
```

## 完整的变量和函数清单

### App.tsx 完整定义
```typescript
// 类型定义
type PageType = "home" | "trade" | "finance" | "expert" | "profile" | "cart" | "product" | "demand" | "meeting" | "calendar" | "checkout" | "loan-apply" | "loan-match" | "loan-approve" | "admin";
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;
type AuthState = 'planet' | 'station' | 'dashboard' | 'app';
type PlanetVersion = '3.0' | '4.0';

// 状态变量
const [authState, setAuthState] = useState<AuthState>('planet');
const [selectedRole, setSelectedRole] = useState<RoleType>(null);
const [userData, setUserData] = useState<any>(null);
const [currentPage, setCurrentPage] = useState<PageType>("home");
const [planetVersion, setPlanetVersion] = useState<PlanetVersion>('4.0');

// 事件监听状态
const handleNavigateToMeeting = () => setCurrentPage('meeting');
const handleNavigateToCalendar = () => setCurrentPage('calendar');
const handleNavigateToLoanApply = () => setCurrentPage('loan-apply');
const handleNavigateToLoanMatch = () => setCurrentPage('loan-match');
const handleNavigateToLoanApprove = () => setCurrentPage('loan-approve');
const handleNavigateToAdmin = () => setCurrentPage('admin');

// 主要函数
const handleRoleSelect = (role: RoleType) => { ... };
const handleLogin = (data: any) => { ... };
const handleBackToPlanet = () => { ... };
const renderPage = () => { ... };
const handleDirectJump = (role: RoleType) => { ... };

// 渲染函数
const renderPage = () => {
  switch (currentPage) {
    case "home": return <RoleBasedHomePage />;
    case "trade": return <TradePage />;
    case "finance": return <FinancePage />;
    case "expert": return <ExpertPage />;
    case "profile": return <ProfilePage />;
    // ... 其他页面
  }
};
```

### components/auth/RoleStations.tsx 完整定义
```typescript
// 类型定义
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

// 接口定义
interface RoleStationProps {
  role: RoleType;
  onLogin: (data: any) => void;
  onBack: () => void;
}

// 配置对象
const stationConfig = {
  farmer: { title: '晨露·生态舱', subtitle: 'Farmer Eco Station', ... },
  buyer: { title: '都市·购汇舱', subtitle: 'Buyer Commerce Station', ... },
  bank: { title: '量子·金库舱', subtitle: 'Bank Quantum Vault', ... },
  expert: { title: '知识·轨道舱', subtitle: 'Expert Knowledge Orbit', ... },
  admin: { title: '核心·控制舱', subtitle: 'Admin Control Core', ... }
};

// 状态变量
const [mode, setMode] = useState<'login' | 'register'>('login');
const [loading, setLoading] = useState(false);
const [sendingCode, setSendingCode] = useState(false);
const [codeCountdown, setCodeCountdown] = useState(0);
const [formData, setFormData] = useState({ phone: '', email: '', code: '', password: '', inviteCode: '' });

// 主要函数
const handleSendCode = async () => { ... };
const handleSubmit = async (e: React.FormEvent) => { ... };
const handleQuickLogin = async (role: RoleType) => { ... };
const handleMockLogin = (role: RoleType) => { ... };
const StationBackground = ({ role }: { role: RoleType }) => { ... };
```

### contexts/RoleContext.tsx 完整定义
```typescript
// 类型定义
export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

// 接口定义
interface UserData {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  avatar: string;
  phone?: string;
  company?: string;
  location?: string;
}

interface RoleContextType {
  role: RoleType;
  userData: UserData | null;
  setRole: (role: RoleType) => void;
  setUserData: (data: UserData | null) => void;
  hasPermission: (permission: string) => boolean;
}

// 权限配置
const rolePermissions: Record<string, string[]> = {
  farmer: ['view-market', 'apply-loan', 'united-loan', 'consult-expert', 'publish-product'],
  buyer: ['view-market', 'purchase', 'checkout', 'publish-demand', 'consult-expert'],
  bank: ['approve-loan', 'view-applications', 'contract-sign', 'manage-repayment'],
  expert: ['manage-calendar', 'publish-knowledge', 'video-consult', 'receive-appointments'],
  admin: ['manage-users', 'view-all', 'approve-all', 'system-settings', 'data-analytics'],
};

// Context对象
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider组件
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const hasPermission = (permission: string): boolean => { ... };
  
  return (
    <RoleContext.Provider value={{ role, userData, setRole, setUserData, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}

// 自定义Hook
export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

// 辅助函数
export function getRoleName(role: RoleType): string { ... }
export function getRoleColor(role: RoleType): string { ... }
```

## 完整的后端结构 (backend/src/main/java/com/agriverse/)

### 主启动类 (AgriverseAuthApplication.java)
```java
@SpringBootApplication
@EnableJpaRepositories
public class AgriverseAuthApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgriverseAuthApplication.class, args);
    }
}
```

### 配置类
- **SecurityConfig.java**: Spring Security配置
- **JwtConfig.java**: JWT配置
- **CorsConfig.java**: CORS配置

### 控制器层 (controller/)
- **AuthController.java**: 处证相关API
- **ProductController.java**: 产品相关API
- **CartController.java**: 购物车相关API
- **OrderController.java**: 订单相关API
- **CouponController.java**: 优惠券相关API
- **LoanController.java**: 贷款相关API
- **AdminController.java**: 管理员相关API

### 服务层 (service/)
- **AuthService.java**: 认证业务逻辑
- **ProductService.java**: 产品业务逻辑
- **CartService.java**: 购物车业务逻辑
- **OrderService.java**: 订单业务逻辑
- **CouponService.java**: 优惠券业务逻辑
- **LoanService.java**: 贷款业务逻辑
- **AdminService.java**: 管理员业务逻辑

### 数据访问层 (repository/)
- **UserRepository.java**: 用户数据访问
- **ProductRepository.java**: 产品数据访问
- **CartItemRepository.java**: 购物车数据访问
- **OrderRepository.java**: 订单数据访问
- **OrderItemRepository.java**: 订单项数据访问
- **CouponRepository.java**: 优惠券数据访问
- **UserCouponRepository.java**: 用户优惠券数据访问
- **LoanRepository.java**: 贷款数据访问

### 实体类 (entity/)
- **User.java**: 用户实体
- **Product.java**: 产品实体
- **CartItem.java**: 购物车实体
- **Order.java**: 订单实体
- **OrderItem.java**: 订单项实体
- **Coupon.java**: 优惠券实体
- **UserCoupon.java**: 用户优惠券实体
- **Loan.java**: 贷款实体

### DTO类 (dto/)
- **auth/**: 认证相关数据传输对象
- **product/**: 产品相关数据传输对象
- **cart/**: 购物车相关数据传输对象
- **order/**: 订单相关数据传输对象
- **coupon/**: 优惠券相关数据传输对象
- **loan/**: 贷款相关数据传输对象

### 安全组件 (security/)
- **JwtTokenProvider.java**: JWT令牌提供者
- **JwtAuthenticationFilter.java**: JWT认证过滤器
- **CustomUserDetailsService.java**: 自定义用户详情服务

### 异常处理 (exception/)
- **GlobalExceptionHandler.java**: 全局异常处理器
- **CustomException.java**: 自定义异常

这个完整的文档包含了项目的所有文件结构、组件关系、引用路径、变量函数定义以及前后端的完整架构信息，可以作为AI助手开发参考的全面资料。