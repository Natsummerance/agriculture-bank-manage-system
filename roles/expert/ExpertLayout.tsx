import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import ExpertNavBar from './navigation/ExpertNavBar';
import { RoleFinancePage } from '../../components/pages/RoleFinancePage';
import { RoleExpertPage } from '../../components/pages/RoleExpertPage';
import { RoleTradePage } from '../../components/pages/RoleTradePage';
import { RoleProfilePage } from '../../components/pages/RoleProfilePage';
import { RoleHomePage } from '../../components/home/RoleHomePage';
import IMFloat from '../../components/common/IMFloat';
import { Toaster } from '../../components/ui/sonner';

export default function ExpertLayout() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(135deg, var(--bg-main), var(--bg-surface))' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/expert/home" replace />} />
          <Route path="/home" element={<RoleHomePage />} />
          <Route path="/finance" element={<RoleFinancePage />} />
          <Route path="/expert" element={<RoleExpertPage />} />
          <Route path="/trade" element={<RoleTradePage />} />
          <Route path="/profile" element={<RoleProfilePage />} />
        </Routes>
        <ExpertNavBar />
        <IMFloat />
        <Toaster position="top-center" toastOptions={{ style: { background: 'rgba(10, 10, 13, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}} />
      </div>
    </ErrorBoundary>
  );
}
