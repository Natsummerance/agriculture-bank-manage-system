import { useState, useEffect } from "react";
import { LoginPlanet } from "./LoginPlanet";
import { LoginPlanet4 } from "./LoginPlanet4";
import { useNavigate } from "react-router-dom";
import { useRole } from "../contexts/RoleContext";

type Mode = "2d" | "3d";
const STORAGE_KEY = "agriverse_planet_version";

export default function Landing3DPage() {
  const navigate = useNavigate();
  const { setRole } = useRole();
  const [mode, setMode] = useState<Mode>("3d");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (stored === "2d" || stored === "3d") {
      setMode(stored);
    }
  }, []);

  const handleRoleSelect = (role: any) => {
    if (!role) return;
    setRole(role);
    navigate("/select-role");
  };

  const switchMode = () => {
    setMode((prev) => {
      const next = prev === "3d" ? "2d" : "3d";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  };

  return (
    <>
      {mode === "3d" ? (
        <LoginPlanet4 onRoleSelect={handleRoleSelect} />
      ) : (
        <LoginPlanet onRoleSelect={handleRoleSelect} />
      )}
      <div className="fixed top-4 left-4 z-50 flex items-center gap-2 text-xs">
        <button
          onClick={switchMode}
          className="px-3 py-1.5 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition"
        >
          {mode === "3d" ? "切换到 2D 星球 3.0" : "切换到 3D 宇宙 4.0"}
        </button>
      </div>
    </>
  );
}

