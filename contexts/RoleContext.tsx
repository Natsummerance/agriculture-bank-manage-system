import { createContext, useContext, useState, ReactNode } from 'react';

export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

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

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const rolePermissions: Record<string, string[]> = {
  farmer: ['view-market', 'apply-loan', 'united-loan', 'consult-expert', 'publish-product'],
  buyer: ['view-market', 'purchase', 'checkout', 'publish-demand', 'consult-expert'],
  bank: ['approve-loan', 'view-applications', 'contract-sign', 'manage-repayment'],
  expert: ['manage-calendar', 'publish-knowledge', 'video-consult', 'receive-appointments'],
  admin: ['manage-users', 'view-all', 'approve-all', 'system-settings', 'data-analytics'],
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleType>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    if (role === 'admin') return true;
    return rolePermissions[role]?.includes(permission) || false;
  };

  return (
    <RoleContext.Provider value={{ role, userData, setRole, setUserData, hasPermission }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export function getRoleName(role: RoleType): string {
  const names: Record<string, string> = {
    farmer: '农户',
    buyer: '买家',
    bank: '银行',
    expert: '专家',
    admin: '管理员',
  };
  return role ? names[role] : '未登录';
}

export function getRoleColor(role: RoleType): string {
  const colors: Record<string, string> = {
    farmer: '#18FF74',
    buyer: '#00D6C2',
    bank: '#FFB800',
    expert: '#A78BFA',
    admin: '#FF6B9D',
  };
  return role ? colors[role] : '#FFFFFF';
}
