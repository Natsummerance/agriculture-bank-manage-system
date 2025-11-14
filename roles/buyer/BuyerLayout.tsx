import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import BuyerNavBar from './navigation/BuyerNavBar';
import BuyerHomePage from './pages/BuyerHomePage';
import BuyerFinancePage from './pages/BuyerFinancePage';
import BuyerExpertPage from './pages/BuyerExpertPage';
import BuyerTradePage from './pages/BuyerTradePage';
import BuyerProfilePage from './pages/BuyerProfilePage';
import IMFloat from '../../components/common/IMFloat';
import DemandFab from '../../components/common/DemandFab';
import { Toaster } from '../../components/ui/sonner';

export default function BuyerLayout() {
  return (
    <ErrorBoundary>
      <div 
        className="min-h-screen pb-20"
        style={{
          background: 'linear-gradient(135deg, var(--bg-main), var(--bg-surface))'
        }}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/buyer/home" replace />} />
          <Route path="/home" element={<BuyerHomePage />} />
          <Route path="/finance" element={<BuyerFinancePage />} />
          <Route path="/expert" element={<BuyerExpertPage />} />
          <Route path="/trade" element={<BuyerTradePage />} />
          <Route path="/profile" element={<BuyerProfilePage />} />
        </Routes>

        <BuyerNavBar />
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
