import { 
  Home, DollarSign, Users, ShoppingCart, User, Grid, CreditCard, BookOpen, 
  ShoppingBag, TrendingUp, Briefcase, BarChart2, Star, Edit3, Server 
} from "lucide-react";

export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  color: string;
}

export const roleNavigations: Record<RoleType, NavItem[]> = {
  farmer: [
    { id: 'home',    label: '田心星云',   icon: Home,         color: '#18FF74' },
    { id: 'finance', label: '田心金融',   icon: DollarSign,   color: '#00D6C2' },
    { id: 'expert',  label: '田心学堂',   icon: Users,        color: '#FF7A9C' },
    { id: 'trade',   label: '田心市场',   icon: ShoppingCart, color: '#FFE600' },
    { id: 'profile', label: '田心宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  buyer: [
    { id: 'home',    label: '购市星云',   icon: Grid,         color: '#FFE600' },
    { id: 'finance', label: '购市分期',   icon: CreditCard,   color: '#00D6C2' },
    { id: 'expert',  label: '购市学堂',   icon: BookOpen,     color: '#FF7A9C' },
    { id: 'trade',   label: '购市市场',   icon: ShoppingBag,  color: '#18FF74' },
    { id: 'profile', label: '购市宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  bank: [
    { id: 'home',    label: '资本星云',   icon: TrendingUp,   color: '#00D6C2' },
    { id: 'finance', label: '资本审批',   icon: DollarSign,   color: '#18FF74' },
    { id: 'expert',  label: '资本智库',   icon: Briefcase,    color: '#FF7A9C' },
    { id: 'trade',   label: '资本数据',   icon: BarChart2,    color: '#FFE600' },
    { id: 'profile', label: '资本宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  expert: [
    { id: 'home',    label: '知识星系',   icon: Star,         color: '#FF7A9C' },
    { id: 'finance', label: '知识收益',   icon: DollarSign,   color: '#18FF74' },
    { id: 'expert',  label: '知识管理',   icon: Edit3,        color: '#00D6C2' },
    { id: 'trade',   label: '知识市场',   icon: ShoppingCart, color: '#FFE600' },
    { id: 'profile', label: '知识宇宙',   icon: User,         color: '#A5ACBA' },
  ],
  admin: [
    { id: 'home',    label: '控制星云',   icon: Server,       color: '#A5ACBA' },
    { id: 'finance', label: '控制资本',   icon: DollarSign,   color: '#00D6C2' },
    { id: 'expert',  label: '控制智库',   icon: Users,        color: '#FF7A9C' },
    { id: 'trade',   label: '控制数据',   icon: BarChart2,    color: '#18FF74' },
    { id: 'profile', label: '控制宇宙',   icon: User,         color: '#FFE600' },
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
