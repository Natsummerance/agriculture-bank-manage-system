import { useState, useEffect } from 'react';
import { roleNavigations, type RoleType, type NavItem } from '../config/roleNavigation';
import { useRole } from '../contexts/RoleContext';

export const useRoleNav = () => {
  const { role } = useRole();
  const [activeNav, setActiveNav] = useState('home');

  // 获取当前角色的导航配置
  const nav: NavItem[] = role ? roleNavigations[role] : roleNavigations.farmer;

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
