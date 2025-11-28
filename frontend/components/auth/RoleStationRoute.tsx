import { useNavigate } from "react-router-dom";
import { useRole } from "../../contexts/RoleContext";
import { RoleStation } from "./RoleStations";

// 简单封装：从 RoleContext 读取当前选择的角色，回退为农户
export default function RoleStationRoute() {
  const navigate = useNavigate();
  const { role } = useRole();

  const currentRole = (role ?? "farmer") as "farmer" | "buyer" | "bank" | "expert" | "admin";

  return (
    <RoleStation
      role={currentRole}
      onLogin={() => {
        // 登录成功后，RoleStations 内部会自己处理跳转/状态，
        // 这里不需要额外逻辑，保留占位以兼容原签名。
      }}
      onBack={() => navigate("/")}
    />
  );
}


