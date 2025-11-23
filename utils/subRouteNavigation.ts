/**
 * 子路由导航系统
 * 用于在Tab内部进行子页面导航，而不是跳转到外部路由
 */

export type SubRoute = string;

const SUB_ROUTE_EVENT = 'app-sub-route-change';

export interface SubRouteChangeEvent extends CustomEvent {
  detail: {
    tab: string;
    subRoute: SubRoute;
    params?: Record<string, string>;
  };
}

/**
 * 触发子路由切换事件
 */
export function navigateToSubRoute(tab: string, subRoute: SubRoute, params?: Record<string, string>) {
  const event = new CustomEvent(SUB_ROUTE_EVENT, {
    detail: { tab, subRoute, params },
  });
  window.dispatchEvent(event);
}

/**
 * 监听子路由切换事件
 */
export function onSubRouteChange(callback: (tab: string, subRoute: SubRoute, params?: Record<string, string>) => void) {
  const handler = (e: Event) => {
    const customEvent = e as SubRouteChangeEvent;
    callback(customEvent.detail.tab, customEvent.detail.subRoute, customEvent.detail.params);
  };
  window.addEventListener(SUB_ROUTE_EVENT, handler);
  return () => {
    window.removeEventListener(SUB_ROUTE_EVENT, handler);
  };
}

