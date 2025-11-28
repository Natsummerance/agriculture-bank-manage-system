import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { rolePermissions, type PermissionCode } from '../config/permissions';
import { useCartStore } from '../stores/cartStore';

export type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Exclude<RoleType, null>;
  avatar: string;
  phone?: string;
  company?: string;
  location?: string;
}

interface RoleContextType {
  role: RoleType;
  userData: UserProfile | null;
  /** 简化使用的别名 */
  userProfile: UserProfile | null;
  permissions: PermissionCode[];
  token: string | null;
  isMobile: boolean;

  setRole: (role: RoleType) => void;
  setUserData: (data: UserProfile | null) => void;
  setUserProfile: (data: UserProfile | null) => void;
  setPermissions: (perms: PermissionCode[]) => void;
  setToken: (token: string | null) => void;
  setIsMobile: (value: boolean) => void;

  hasPermission: (code: string) => boolean;
  requireRole: (role: Exclude<RoleType, null>) => boolean;
  resetRoleState: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  token: 'agriverse_token',
  userProfile: 'agriverse_user_profile',
  role: 'agriverse_role',
  permissions: 'agriverse_permissions',
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<RoleType>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<PermissionCode[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 初始化：从 localStorage 恢复
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedToken = window.localStorage.getItem(STORAGE_KEYS.token);
    const storedRole = window.localStorage.getItem(STORAGE_KEYS.role) as RoleType | null;
    const storedProfile = window.localStorage.getItem(STORAGE_KEYS.userProfile);
    const storedPerms = window.localStorage.getItem(STORAGE_KEYS.permissions);

    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile) as UserProfile;
        setUserData(parsed);
      } catch {
        // ignore
      }
    }
    if (storedPerms) {
      try {
        const parsed = JSON.parse(storedPerms) as PermissionCode[];
        setPermissions(parsed);
      } catch {
        // ignore
      }
    }

    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handleResize = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 当有 token + role 但权限为空时，自动注入默认权限
  useEffect(() => {
    if (token && role && permissions.length === 0) {
      const base = rolePermissions[role];
      if (base) {
        setPermissions(base as PermissionCode[]);
      }
    }
  }, [token, role, permissions.length]);

  // 同步到 localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (token) window.localStorage.setItem(STORAGE_KEYS.token, token);
    else window.localStorage.removeItem(STORAGE_KEYS.token);
  }, [token]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (role) window.localStorage.setItem(STORAGE_KEYS.role, role);
    else window.localStorage.removeItem(STORAGE_KEYS.role);
  }, [role]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (userData) window.localStorage.setItem(STORAGE_KEYS.userProfile, JSON.stringify(userData));
    else window.localStorage.removeItem(STORAGE_KEYS.userProfile);
  }, [userData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (permissions.length > 0) {
      window.localStorage.setItem(STORAGE_KEYS.permissions, JSON.stringify(permissions));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.permissions);
    }
  }, [permissions]);

  const hasPermission = (code: string): boolean => {
    if (!role) return false;
    if (role === 'admin') return true;
    return permissions.includes(code as PermissionCode);
  };

  const resetRoleState = () => {
    // 清空角色相关上下文
    setRole(null);
    setUserData(null);
    setPermissions([]);
    setToken(null);

    // 清空购物车等缓存
    useCartStore.setState({ items: [], count: 0, totalAmount: 0 });

    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        userData,
        userProfile: userData,
        permissions,
        token,
        isMobile,
        setRole,
        setUserData,
        setUserProfile: setUserData,
        setPermissions: (perms) => setPermissions(perms),
        setToken,
        setIsMobile,
        hasPermission,
        requireRole: (requiredRole) => role === requiredRole,
        resetRoleState,
      }}
    >
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
