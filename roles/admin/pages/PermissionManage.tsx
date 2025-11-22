import { rolePermissions } from "../../../config/permissions";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

export default function AdminPermissionManage() {
  const [permissions, setPermissions] = useState(rolePermissions);

  const togglePermission = (role: keyof typeof rolePermissions, perm: string) => {
    setPermissions((prev) => {
      const current = prev[role];
      const exists = current.includes(perm as any);
      return {
        ...prev,
        [role]: exists
          ? (current.filter((p) => p !== perm) as any)
          : ([...current, perm] as any),
      };
    });
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">角色权限管理（前端 Mock）</h1>
      <p className="text-sm text-white/60">
        该页面用于可视化查看和勾选当前角色的权限码（仅前端展示，实际持久化仍依赖后端或配置文件）。
      </p>
      <div className="space-y-4 text-sm">
        {Object.entries(permissions).map(([role, perms]) => (
          <div key={role} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            <div className="font-semibold mb-1">{role}</div>
            <div className="flex flex-wrap gap-2">
              {Object.values(rolePermissions)
                .flat()
                .filter((p, index, arr) => arr.indexOf(p) === index)
                .map((perm) => {
                  const checked = (perms as string[]).includes(perm);
                  return (
                    <Button
                      key={perm}
                      size="sm"
                      variant={checked ? "default" : "outline"}
                      className={checked ? "bg-emerald-500/80 text-black" : "border-white/30 text-white/70"}
                      onClick={() => togglePermission(role as keyof typeof rolePermissions, perm)}
                    >
                      {perm}
                    </Button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

