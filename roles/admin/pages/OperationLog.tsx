import { useState } from "react";
import { motion } from "motion/react";
import { FileText, User, Calendar, Filter, Download } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { FilterPanel } from "../../../components/common/FilterPanel";

interface LogEntry {
  id: string;
  operator: string;
  role: string;
  action: string;
  target: string;
  result: "success" | "failed";
  ip: string;
  timestamp: string;
}

const mockLogs: LogEntry[] = [
  {
    id: "1",
    operator: "管理员A",
    role: "admin",
    action: "审核商品",
    target: "商品 #PROD001",
    result: "success",
    ip: "192.168.1.100",
    timestamp: "2025-03-01 10:30:25",
  },
  {
    id: "2",
    operator: "管理员B",
    role: "admin",
    action: "拒绝专家申请",
    target: "专家 #EXP002",
    result: "success",
    ip: "192.168.1.101",
    timestamp: "2025-03-01 11:15:42",
  },
];

const actionOptions = [
  { label: "全部", value: "all" },
  { label: "商品审核", value: "product" },
  { label: "内容审核", value: "content" },
  { label: "专家审核", value: "expert" },
  { label: "权限管理", value: "permission" },
];

export default function AdminOperationLog() {
  const [logs] = useState<LogEntry[]>(mockLogs);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterAction, setFilterAction] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== "all" && !log.action.includes(filterAction)) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    toast.success("正在导出操作日志...");
    // TODO: 调用Excel导出服务
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              操作日志
            </h2>
            <p className="text-sm text-white/60">
              查看所有管理员的操作记录
            </p>
          </div>
          <div className="flex gap-2">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              导出日志
            </Button>
          </div>
        </motion.div>

        {/* 筛选器 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <FilterPanel
            title="操作类型"
            value={filterAction}
            onChange={setFilterAction}
            options={actionOptions}
          />
        </motion.section>

        {/* 日志列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">操作记录</h3>
            <span className="text-sm text-white/60">共 {filteredLogs.length} 条</span>
          </div>
          {filteredLogs.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">暂无操作日志</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <User className="w-4 h-4 text-white/60" />
                        <span className="font-semibold text-white">{log.operator}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                          {log.role}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.result === "success" ? "bg-emerald-400/20 text-emerald-400" : "bg-red-400/20 text-red-400"
                        }`}>
                          {log.result === "success" ? "成功" : "失败"}
                        </span>
                      </div>
                      <div className="text-sm text-white/70 mb-1">
                        {log.action}：{log.target}
                      </div>
                      <div className="text-xs text-white/50 space-y-1">
                        <div>IP地址：{log.ip}</div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {log.timestamp}
                        </div>
                      </div>
                    </div>
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

