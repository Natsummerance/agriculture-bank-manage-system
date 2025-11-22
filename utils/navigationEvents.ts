/**
 * 全局导航事件系统
 * 用于在 Panel 页面中通知 App 切换 tab，而不是使用路由跳转
 */

export type NavigationTab = 'home' | 'finance' | 'expert' | 'trade' | 'profile' | 'cart';

const NAVIGATION_EVENT = 'app-navigation-change';

export interface NavigationChangeEvent extends CustomEvent {
  detail: {
    tab: NavigationTab;
  };
}

/**
 * 触发导航切换事件
 */
export function navigateToTab(tab: NavigationTab) {
  const event = new CustomEvent(NAVIGATION_EVENT, {
    detail: { tab },
  });
  window.dispatchEvent(event);
}

/**
 * 监听导航切换事件
 */
export function onNavigationChange(callback: (tab: NavigationTab) => void) {
  const handler = (e: Event) => {
    const customEvent = e as NavigationChangeEvent;
    callback(customEvent.detail.tab);
  };
  window.addEventListener(NAVIGATION_EVENT, handler);
  return () => {
    window.removeEventListener(NAVIGATION_EVENT, handler);
  };
}

