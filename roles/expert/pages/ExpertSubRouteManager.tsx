// src/roles/expert/components/ExpertSubRouteManager.tsx (新增文件)

import React, { useState, useEffect, useMemo } from 'react';
// 导入导航工具
import { onSubRouteChange, SubRoute } from '../../../utils/subRouteNavigation'; 

// 导入所有可能的子页面
import ExpertDashboardPage from '../pages/Dashboard';
import ExpertCalendarPage from '../pages/Calendar';
import ExpertLiveStreamPage from '../pages/ExpertLiveStreamPage'; // ⚡ 您的目标页面

// 定义专家角色的子路由映射
const ExpertSubRouteMap: Record<SubRoute, React.ReactNode> = {
    // 默认路由
    'dashboard': <ExpertDashboardPage />, 
    
    // 其他子页面
    'calendar': <ExpertCalendarPage />,
    
    // ⚡ 目标路由
    'live': <ExpertLiveStreamPage />, 
    
    // 如果需要其他路由，继续添加...
};

/**
 * 专家应用的子路由状态管理器
 * 监听 window 事件，切换子页面组件
 */
export default function ExpertSubRouteManager() {
    // 默认显示仪表盘
    const [currentSubRoute, setCurrentSubRoute] = useState<SubRoute>('dashboard');

    // 监听子路由切换事件
    useEffect(() => {
        // 在事件监听器中，我们只关心 'expert' tab 的事件
        const cleanup = onSubRouteChange((tab, subRoute, params) => {
            if (tab === 'expert') { // 确保只处理专家自己的路由事件
                console.log(`[SubRouteManager] Switching to route: ${subRoute}`);
                setCurrentSubRoute(subRoute);
                // ⚠️ 注意：如果需要处理 params，也在这里进行处理
            }
        });
        
        return cleanup; // 组件卸载时移除监听器
    }, []);

    // 渲染当前子路由对应的组件
    const CurrentComponent = useMemo(() => {
        return ExpertSubRouteMap[currentSubRoute] || ExpertSubRouteMap['dashboard'];
    }, [currentSubRoute]);

    return (
        <div className="expert-sub-route-container">
            {CurrentComponent}
        </div>
    );
}