import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import FarmerNavBar from './navigation/FarmerNavBar';
import FarmerHomePage from './pages/FarmerHomePage';
import FarmerFinancePage from './pages/FarmerFinancePage';
import FarmerExpertPage from './pages/FarmerExpertPage';
import FarmerTradePage from './pages/FarmerTradePage';
import FarmerProfilePage from './pages/FarmerProfilePage';
import IMFloat from '../../components/common/IMFloat';
import { Toaster } from '../../components/ui/sonner';

export default function FarmerLayout() {
  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen pb-20"
        style={{
          background: 'linear-gradient(135deg, var(--bg-main), var(--bg-surface))'
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/farmer/home" replace />} />
          <Route path="/home" element={<FarmerHomePage />} />
          <Route path="/finance" element={<FarmerFinancePage />} />
          <Route path="/expert" element={<FarmerExpertPage />} />
          <Route path="/trade" element={<FarmerTradePage />} />
          <Route path="/profile" element={<FarmerProfilePage />} />
        </Routes>

        {/* 底部导航栏 */}
        <FarmerNavBar />

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
