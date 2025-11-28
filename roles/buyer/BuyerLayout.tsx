import { Navigate, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import IMFloat from '../../components/common/IMFloat';
import DemandFab from '../../components/common/DemandFab';
import { Toaster } from '../../components/ui/sonner';
import { useRole } from '../../contexts/RoleContext';
import NoPermission from '../../components/NoPermission';

export default function BuyerLayout() {
  const { role, token, requireRole, hasPermission } = useRole();

  if (!token || !role) {
    return <Navigate to="/select-role" replace />;
  }

  if (!requireRole('buyer')) {
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
        {!hasPermission('buyer.order.view') ? (
          <NoPermission />
        ) : (
          <Outlet />
        )}

        <IMFloat />
        <DemandFab />

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
