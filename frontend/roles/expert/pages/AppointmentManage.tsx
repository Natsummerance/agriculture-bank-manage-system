import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { useExpertCalendarStore } from "../../../stores/expertCalendarStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

interface Appointment {
  id: string;
  farmerName: string;
  farmerPhone: string;
  date: string;
  timeRange: string;
  topic: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    farmerName: "张农户",
    farmerPhone: "138****1234",
    date: "2025-03-05",
    timeRange: "14:00-15:00",
    topic: "水稻病虫害防治咨询",
    status: "pending",
    createdAt: "2小时前",
  },
  {
    id: "2",
    farmerName: "李果农",
    farmerPhone: "139****5678",
    date: "2025-03-06",
    timeRange: "10:00-11:00",
    topic: "柑橘种植技术指导",
    status: "confirmed",
    createdAt: "1天前",
  },
];

export default function ExpertAppointmentManage() {
  const { slots, addSlot } = useExpertCalendarStore();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [timeRange, setTimeRange] = useState("");

  const handleAddSlot = () => {
    if (!dateRange?.from || !timeRange) {
      toast.error("请选择日期和时间段");
      return;
    }
    const dateStr = dateRange.from.toISOString().slice(0, 10);
    addSlot(dateStr, timeRange);
    setTimeRange("");
    toast.success("已添加可预约时段");
  };

  const handleConfirmAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmed" as const } : a))
    );
    toast.success("已确认预约");
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a))
    );
    toast.success("已取消预约");
  };

  const statusConfig = {
    pending: { label: "待确认", color: "text-amber-400", bg: "bg-amber-400/20", icon: Clock },
    confirmed: { label: "已确认", color: "text-blue-400", bg: "bg-blue-400/20", icon: CheckCircle2 },
    completed: { label: "已完成", color: "text-emerald-400", bg: "bg-emerald-400/20", icon: CheckCircle2 },
    cancelled: { label: "已取消", color: "text-white/40", bg: "bg-white/5", icon: XCircle },
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
              预约管理
            </h2>
            <p className="text-sm text-white/60">
              管理可预约时段和农户预约请求
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("expert", "calendar")}
          >
            返回日历
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 添加可预约时段 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-[#00D6C2]" />
              <h3 className="text-lg">添加可预约时段</h3>
            </div>
            <div className="space-y-4">
              <DateRangePicker value={dateRange} onChange={setDateRange} />
              <Input
                placeholder="时间段，如 14:00-15:00"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/5 border-white/10"
              />
              <Button
                onClick={handleAddSlot}
                className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                添加时段
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-sm text-white/60 mb-2">已设置时段</div>
              <div className="space-y-2">
                {slots.length === 0 ? (
                  <div className="text-sm text-white/40">暂无时段</div>
                ) : (
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between text-sm p-2 rounded-lg bg-white/5"
                    >
                      <span className="text-white/80">
                        {slot.date} · {slot.timeRange}
                      </span>
                      <span className={`text-xs ${slot.isBooked ? "text-amber-400" : "text-emerald-400"}`}>
                        {slot.isBooked ? "已预约" : "可预约"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.section>

          {/* 预约请求列表 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">预约请求</h3>
            </div>
            {appointments.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">暂无预约请求</p>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment, index) => {
                  const status = statusConfig[appointment.status];
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-white/60" />
                            <span className="font-semibold text-white">{appointment.farmerName}</span>
                            <span className="text-xs text-white/60">{appointment.farmerPhone}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${status.color} ${status.bg}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="text-sm text-white/70 mb-1">{appointment.topic}</div>
                          <div className="text-xs text-white/50 space-y-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {appointment.date} {appointment.timeRange}
                            </div>
                            <div>预约时间：{appointment.createdAt}</div>
                          </div>
                        </div>
                      </div>
                      {appointment.status === "pending" && (
                        <div className="flex gap-2 pt-3 border-t border-white/10">
                          <Button
                            size="sm"
                            onClick={() => handleConfirmAppointment(appointment.id)}
                            className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                          >
                            确认预约
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            拒绝
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </div>
  );
}

