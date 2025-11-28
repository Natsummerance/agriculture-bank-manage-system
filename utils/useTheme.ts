/**
 * 深空夜间主题 Hook（简化版）
 * 固定为夜间模式，无切换功能
 */

import { useEffect } from 'react';

// 固定为夜间主题
export type Theme = 'night';

interface UseThemeReturn {
  theme: Theme;
  isNight: boolean; // 始终为 true
}

// 应用深空主题到DOM
function applyNightTheme() {
  if (typeof document === 'undefined') return;
  
  // 设置深色方案
  document.documentElement.style.colorScheme = 'dark';
  
  // 更新meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', '#0A0A0D');
  }
  
  // 设置背景色
  document.body.style.backgroundColor = '#0A0A0D';
}

export function useTheme(): UseThemeReturn {
  // 初始化应用夜间主题
  useEffect(() => {
    applyNightTheme();
  }, []);

  return {
    theme: 'night',
    isNight: true,
  };
}

// 白标租户主题覆盖
export function applyTenantTheme(tenantConfig: Record<string, string>) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.setAttribute('data-tenant', 'true');
  
  // 动态注入CSS变量
  Object.entries(tenantConfig).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
}

// 移除租户主题
export function removeTenantTheme() {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  root.removeAttribute('data-tenant');
}
