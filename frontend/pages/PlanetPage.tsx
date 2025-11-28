import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPlanet } from '../components/LoginPlanet';
import { LoginPlanet4 } from '../components/LoginPlanet4';
import { ErrorBoundary } from '../components/ErrorBoundary';

type PlanetVersion = '3.0' | '4.0';
type RoleType = 'farmer' | 'buyer' | 'bank' | 'expert' | 'admin';

export default function PlanetPage() {
  const [planetVersion, setPlanetVersion] = useState<PlanetVersion>('4.0');
  const navigate = useNavigate();

  const handleRoleSelect = (role: RoleType | null) => {
    if (role) {
      navigate(`/station/${role}`);
    }
  };

  return (
    <ErrorBoundary>
      {/* 版本切换按钮 */}
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
