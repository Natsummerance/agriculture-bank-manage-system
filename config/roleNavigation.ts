import {
  Home,
  DollarSign,
  Users,
  ShoppingCart,
  User,
  Grid,
  CreditCard,
  BookOpen,
  ShoppingBag,
  TrendingUp,
  Briefcase,
  BarChart2,
  Star,
  Edit3,
  Server,
  Package,
  ListChecks,
  Calendar,
  Settings,
} from "lucide-react";

export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  color: string;
  perm?: string;
}

export interface RoleMenuItem {
  path: string;
  label: string;
  icon: any;
}

export const roleNavigations: Record<RoleType, NavItem[]> = {
  farmer: [
    { id: 'home',    label: '田心星云',   icon: Home,         color: '#18FF74', perm: 'farmer.product.view' },
    { id: 'finance', label: '田心金融',   icon: DollarSign,   color: '#00D6C2', perm: 'farmer.finance.apply' },
    { id: 'expert',  label: '田心学堂',   icon: Users,        color: '#FF7A9C', perm: 'farmer.product.view' },
    { id: 'trade',   label: '田心市场',   icon: ShoppingCart, color: '#FFE600', perm: 'farmer.product.view' },
    { id: 'profile', label: '田心宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  buyer: [
    { id: 'home',    label: '购市星云',   icon: Grid,         color: '#FFE600', perm: 'buyer.order.view' },
    { id: 'finance', label: '购市分期',   icon: CreditCard,   color: '#00D6C2', perm: 'buyer.cart.manage' },
    { id: 'expert',  label: '购市学堂',   icon: BookOpen,     color: '#FF7A9C', perm: 'buyer.order.view' },
    { id: 'trade',   label: '购市市场',   icon: ShoppingBag,  color: '#18FF74', perm: 'buyer.cart.manage' },
    { id: 'profile', label: '购市宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  bank: [
    { id: 'home',    label: '资本星云',   icon: TrendingUp,   color: '#00D6C2', perm: 'bank.approval.view' },
    { id: 'finance', label: '资本审批',   icon: DollarSign,   color: '#18FF74', perm: 'bank.approval.handle' },
    { id: 'expert',  label: '资本智库',   icon: Briefcase,    color: '#FF7A9C', perm: 'bank.product.manage' },
    { id: 'trade',   label: '资本数据',   icon: BarChart2,    color: '#FFE600', perm: 'bank.approval.view' },
    { id: 'profile', label: '资本宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  expert: [
    { id: 'home',    label: '知识星系',   icon: Star,         color: '#FF7A9C', perm: 'expert.qa.answer' },
    { id: 'finance', label: '知识收益',   icon: DollarSign,   color: '#18FF74', perm: 'expert.calendar.manage' },
    { id: 'expert',  label: '知识管理',   icon: Edit3,        color: '#00D6C2', perm: 'expert.content.publish' },
    { id: 'trade',   label: '知识市场',   icon: ShoppingCart, color: '#FFE600', perm: 'expert.content.publish' },
    { id: 'profile', label: '知识宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  admin: [
    { id: 'home',    label: '控制星云',   icon: Server,       color: '#A5ACBA', perm: 'admin.user.manage' },
    { id: 'finance', label: '控制资本',   icon: DollarSign,   color: '#00D6C2', perm: 'admin.product.audit' },
    { id: 'expert',  label: '控制智库',   icon: Users,        color: '#FF7A9C', perm: 'admin.content.audit' },
    { id: 'trade',   label: '控制数据',   icon: BarChart2,    color: '#18FF74', perm: 'admin.order.monitor' },
    { id: 'profile', label: '控制宇宙',   icon: User,         color: '#FFE600', perm: 'admin.role.manage' },
  ],
};

// 角色配置
export const roleConfig: Record<RoleType, { 
  name: string; 
  color: string; 
  theme: string;
  description: string;
}> = {
  farmer: { 
    name: '农户', 
    color: '#18FF74', 
    theme: '田心',
    description: '种植智慧，收获未来'
  },
  buyer: { 
    name: '买家', 
    color: '#FFE600', 
    theme: '购市',
    description: '智能采购，品质保障'
  },
  bank: { 
    name: '银行', 
    color: '#00D6C2', 
    theme: '资本',
    description: '金融赋能，助农兴农'
  },
  expert: { 
    name: '专家', 
    color: '#FF7A9C', 
    theme: '知识',
    description: '传播智慧，共创价值'
  },
  admin: { 
    name: '管理员', 
    color: '#A5ACBA', 
    theme: '控制',
    description: '系统管理，数据监控'
  },
};

// 角色菜单（基于真实路由 path）
export const roleMenus: Record<RoleType, RoleMenuItem[]> = {
  farmer: [
    { path: '/farmer', label: '首页', icon: Home },
    { path: '/farmer/products', label: '商品', icon: Package },
    { path: '/farmer/orders', label: '订单', icon: ListChecks },
    { path: '/farmer/finance', label: '融资', icon: DollarSign },
    { path: '/farmer/wallet', label: '钱包', icon: CreditCard },
  ],
  buyer: [
    { path: '/buyer', label: '首页', icon: Grid },
    { path: '/buyer/products', label: '商品', icon: ShoppingBag },
    { path: '/buyer/cart', label: '购物车', icon: ShoppingCart },
    { path: '/buyer/orders', label: '订单', icon: ListChecks },
    { path: '/buyer/coupon', label: '优惠券', icon: CreditCard },
  ],
  bank: [
    { path: '/bank', label: 'Dashboard', icon: TrendingUp },
    { path: '/bank/approval', label: '审批', icon: DollarSign },
    { path: '/bank/products', label: '产品', icon: Package },
    { path: '/bank/post-loan', label: '贷后', icon: Briefcase },
    { path: '/bank/risk-dashboard', label: '风控', icon: BarChart2 },
  ],
  expert: [
    { path: '/expert', label: 'Dashboard', icon: Star },
    { path: '/expert/qa', label: '问答', icon: BookOpen },
    { path: '/expert/calendar', label: '日历', icon: Calendar },
    { path: '/expert/knowledge', label: '知识库', icon: Edit3 },
    { path: '/expert/income', label: '收入', icon: DollarSign },
  ],
  admin: [
    { path: '/admin', label: 'Dashboard', icon: Server },
    { path: '/admin/users', label: '用户', icon: Users },
    { path: '/admin/product-audit', label: '商品审核', icon: Package },
    { path: '/admin/order-monitor', label: '订单监控', icon: BarChart2 },
    { path: '/admin/permission', label: '权限', icon: Settings },
  ],
};
