import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, User, Search, Shield, ShieldOff } from "lucide-react";
import { useAdminUserStore } from "../../../stores/adminUserStore";
import { SearchBar, FilterPanel } from "../../../components/common";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

const mockUsers = [
  { id: "u1", name: "张农户", role: "farmer", status: "active" as const },
  { id: "u2", name: "李买家", role: "buyer", status: "active" as const },
  { id: "u3", name: "王客户经理", role: "bank", status: "disabled" as const },
  { id: "u4", name: "赵专家", role: "expert", status: "active" as const },
];

const roleLabels: Record<string, string> = {
  farmer: "农户",
  buyer: "买家",
  bank: "银行",
  expert: "专家",
  admin: "管理员",
};

export default function AdminUserManage() {
  const { users, setUsers, toggleStatus } = useAdminUserStore();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    if (users.length === 0) {
      setUsers(mockUsers);
    }
  }, [users.length, setUsers]);

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.includes(search);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleToggleStatus = (id: string) => {
    toggleStatus(id);
    const user = users.find((u) => u.id === id);
    toast.success(`用户已${user?.status === "active" ? "禁用" : "启用"}`);
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#9D4EDD] to-[#FF6B9D]">
              用户管理
            </h2>
            <p className="text-sm text-white/60">
              管理系统用户，查看和修改用户状态
            </p>
          </div>
        </motion.div>

        {/* 搜索和筛选 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <SearchBar value={search} onChange={setSearch} placeholder="搜索用户名称..." />
          <FilterPanel
            title="角色"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { label: "全部", value: "all" },
              { label: "农户", value: "farmer" },
              { label: "买家", value: "buyer" },
              { label: "银行", value: "bank" },
              { label: "专家", value: "expert" },
              { label: "管理员", value: "admin" },
            ]}
          />
        </motion.section>

        {/* 用户列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#9D4EDD] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">用户列表</h3>
            <span className="text-sm text-white/60">共 {filtered.length} 个用户</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无用户</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9D4EDD] to-[#FF6B9D] flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg mb-1">{u.name}</div>
                      <div className="text-sm text-white/60">角色：{roleLabels[u.role] || u.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        u.status === "active"
                          ? "bg-emerald-400/20 text-emerald-400"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {u.status === "active" ? "已启用" : "已禁用"}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(u.id)}
                      className={u.status === "active" ? "border-red-500/30 text-red-400 hover:bg-red-500/10" : ""}
                    >
                      {u.status === "active" ? (
                        <>
                          <ShieldOff className="w-4 h-4 mr-2" />
                          禁用
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          启用
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
