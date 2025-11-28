import { useState, useEffect } from 'react';
import { roleNavigations, type NavItem } from '../config/roleNavigation';
import { useRole } from '../contexts/RoleContext';

export const useRoleNav = () => {
  const { role, hasPermission } = useRole();
  const [activeNav, setActiveNav] = useState('home');

  // 获取当前角色的导航配置，并按权限过滤
  const allNav: NavItem[] = role ? roleNavigations[role] : roleNavigations.farmer;
  const nav: NavItem[] = allNav.filter((item) => !item.perm || hasPermission(item.perm));

  // 切换导航
  const navigateTo = (id: string) => {
    setActiveNav(id);
  };

  // 角色切换时重置导航
  useEffect(() => {
    setActiveNav('home');
  }, [role]);

  return {
    nav,
    activeNav,
    navigateTo,
    role,
  };
};
