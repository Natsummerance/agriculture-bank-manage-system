import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RoleStation } from '../components/auth/RoleStations';
import { RoleDashboard } from '../components/dashboards/RoleDashboards';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useRole } from '../contexts/RoleContext';

type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';
type AuthState = 'station' | 'dashboard';

export default function StationPage() {
  const { role: roleParam } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { setRole, setUserData } = useRole();
  const [authState, setAuthState] = useState<AuthState>('station');
  const [userData, setLocalUserData] = useState<any>(null);

  const role = roleParam as RoleType;

  useEffect(() => {
    if (!role || !['farmer', 'buyer', 'bank', 'expert', 'admin'].includes(role)) {
      navigate('/planet');
    }
  }, [role, navigate]);

  const handleLogin = (data: any) => {
    setLocalUserData(data.user);
    setAuthState('dashboard');
    
    // 3秒后进入应用主界面
    setTimeout(() => {
      // 设置全局角色上下文
      setRole(role);
      setUserData({
        id: data.user.id || '001',
        name: data.user.name || '用户',
        email: data.user.email || 'user@example.com',
        role: role,
        avatar: data.user.avatar || '👤',
        phone: data.user.phone,
        company: data.user.company,
        location: data.user.location,
      });
      
      // 导航到角色主页
      navigate(`/${role}/home`);
    }, 3000);
  };

  const handleBackToPlanet = () => {
    navigate('/planet');
  };

  if (!role) {
    return null;
  }

  return (
    <ErrorBoundary>
      {authState === 'station' && (
        <RoleStation
          role={role}
          onLogin={handleLogin}
          onBack={handleBackToPlanet}
        />
      )}
      
      {authState === 'dashboard' && userData && (
        <RoleDashboard role={role} userData={userData} />
      )}
    </ErrorBoundary>
  );
}
