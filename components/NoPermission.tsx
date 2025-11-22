import { AlertTriangle } from "lucide-react";

export default function NoPermission() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/40 mb-2">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-semibold text-white">无权限访问此页面</h1>
        <p className="text-sm text-white/60">
          请使用具备对应角色权限的账号登录，或返回角色选择页面。
        </p>
      </div>
    </div>
  );
}


