import { Navigate, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import IMFloat from '../../components/common/IMFloat';
import { Toaster } from '../../components/ui/sonner';
import { useRole } from '../../contexts/RoleContext';
import NoPermission from '../../components/NoPermission';

export default function FarmerLayout() {
  const { role, token, requireRole, hasPermission } = useRole();

  // 未登录：跳到角色选择
  if (!token || !role) {
    return <Navigate to="/select-role" replace />;
  }

  // 登录但角色不匹配：显示无权限页面
  if (!requireRole('farmer')) {
    return <NoPermission />;
  }

  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen"
        style={{
          background: 'linear-gradient(135deg, var(--bg-main), var(--bg-surface))'
        }}
      >
        {/* 页面级别基础权限控制：无查看权限则整体禁止访问 */}
        {!hasPermission('farmer.product.view') ? (
          <NoPermission />
        ) : (
          <Outlet />
        )}

        {/* 全局浮动组件 */}
        <IMFloat />

        {/* Toast通知 */}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(10, 10, 13, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
