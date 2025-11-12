import { useState, lazy, Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Navigation } from "./components/Navigation";
import { StarLoader } from "./components/StarLoader";
import { HomePage } from "./components/HomePage";
import { TradePage } from "./components/TradePage";
import { FinancePage } from "./components/FinancePage";
import { ExpertPage } from "./components/ExpertPage";
import { ProfilePage } from "./components/ProfilePage";
import { LoginPlanet } from "./components/LoginPlanet";
import { LoginPlanet4 } from "./components/LoginPlanet4";
import { RoleStation } from "./components/auth/RoleStations";
import { RoleDashboard } from "./components/dashboards/RoleDashboards";
import CartPage from "./components/cart/CartPage";
import ProductDetailPage from "./components/product/ProductDetailPage";
import BuyerDemandPage from "./components/demand/BuyerDemandPage";
import IMFloat from "./components/common/IMFloat";
import DemandFab from "./components/common/DemandFab";
import { useTheme } from "./utils/useTheme";
import { Toaster } from "./components/ui/sonner";

type PageType = "home" | "trade" | "finance" | "expert" | "profile" | "cart" | "product" | "demand";
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin' | null;
type AuthState = 'planet' | 'station' | 'dashboard' | 'app';
type PlanetVersion = '3.0' | '4.0';

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('planet');
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  const [userData, setUserData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [planetVersion, setPlanetVersion] = useState<PlanetVersion>('4.0');
  
  // 初始化深空夜间主题
  useTheme();

  // 处理角色选择（星球点击）
  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    setAuthState('station');
  };

  // 处理登录成功
  const handleLogin = (data: any) => {
    setUserData(data.user);
    setAuthState('dashboard');
    // 3秒后进入应用主界面
    setTimeout(() => {
      setAuthState('app');
    }, 3000);
  };

  // 返回星球选择
  const handleBackToPlanet = () => {
    setSelectedRole(null);
    setAuthState('planet');
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "trade":
        return <TradePage />;
      case "finance":
        return <FinancePage />;
      case "expert":
        return <ExpertPage />;
      case "profile":
        return <ProfilePage />;
      case "cart":
        return <CartPage />;
      case "product":
        return <ProductDetailPage />;
      case "demand":
        return <BuyerDemandPage />;
      default:
        return <HomePage />;
    }
  };

  // 根据认证状态渲染不同界面
  if (authState === 'planet') {
    return (
      <ErrorBoundary>
        {/* 版本切换按钮 - 左上角 */}
        <div className="fixed top-4 left-4 z-[100] flex gap-3">
          <button
            onClick={() => setPlanetVersion('3.0')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              planetVersion === '3.0'
                ? 'bg-[#00D6C2] text-white shadow-lg'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
            style={{
              boxShadow: planetVersion === '3.0' ? '0 0 12px rgba(0, 214, 194, 0.5)' : 'none'
            }}
          >
            2D Canvas
          </button>
          <button
            onClick={() => setPlanetVersion('4.0')}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              planetVersion === '4.0'
                ? 'bg-[#18FF74] text-black shadow-lg'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
            style={{
              boxShadow: planetVersion === '4.0' ? '0 0 12px rgba(24, 255, 116, 0.5)' : 'none'
            }}
          >
            3D WebGL 🚀
          </button>
        </div>
        
        {planetVersion === '3.0' ? (
          <LoginPlanet onRoleSelect={handleRoleSelect} />
        ) : (
          <LoginPlanet4 onRoleSelect={handleRoleSelect} />
        )}
      </ErrorBoundary>
    );
  }

  if (authState === 'station' && selectedRole) {
    return (
      <ErrorBoundary>
        <RoleStation
          role={selectedRole}
          onLogin={handleLogin}
          onBack={handleBackToPlanet}
        />
      </ErrorBoundary>
    );
  }

  if (authState === 'dashboard' && selectedRole && userData) {
    return (
      <ErrorBoundary>
        <RoleDashboard role={selectedRole} userData={userData} />
      </ErrorBoundary>
    );
  }

  // 应用主界面
  return (
    <ErrorBoundary>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, var(--bg-main), var(--bg-surface))'
      }}>
        <Navigation 
          activeTab={currentPage}
          onTabChange={(tab) => setCurrentPage(tab as PageType)}
        />
        
        <Suspense fallback={<StarLoader onComplete={() => {}} />}>
          <main className="relative">
            {renderPage()}
          </main>
        </Suspense>

        {/* 全局浮动组件 */}
        <IMFloat />
        {currentPage === 'trade' && <DemandFab />}

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
