import { useState } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle2 } from "lucide-react";
import { useExpertCalendarStore } from "../../../stores/expertCalendarStore";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

export default function ExpertCalendarPage() {
  const { slots, addSlot } = useExpertCalendarStore();
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              可预约时间管理
            </h2>
            <p className="text-sm text-white/60">
              设置可预约时段，方便农户预约咨询
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("expert", "appointment")}
          >
            查看预约请求
          </Button>
        </motion.div>

        {/* 添加时段表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <CalendarIcon className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg">添加可预约时段</h3>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
            <div className="flex-1">
              <label className="text-sm text-white/60 mb-2 block">选择日期</label>
              <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>
            <div className="flex-1">
              <label className="text-sm text-white/60 mb-2 block">时间段</label>
              <Input
                placeholder="时间段，如 14:00-15:00"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>
            <Button
              onClick={handleAddSlot}
              className="bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加时段
            </Button>
          </div>
        </motion.section>

        {/* 时段列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#A78BFA] to-[#FF6B9D] rounded-full" />
            <h3 className="text-lg">已设置时段</h3>
            <span className="text-sm text-white/60">共 {slots.length} 个时段</span>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <Clock className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60">尚未设置可预约时间</p>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {slots.map((s, index) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`rounded-2xl glass-morphism border p-4 ${
                    s.isBooked
                      ? "border-[#FF6B9D]/30 bg-[#FF6B9D]/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className={`w-5 h-5 ${s.isBooked ? "text-[#FF6B9D]" : "text-[#A78BFA]"}`} />
                      <div>
                        <div className="font-semibold text-white">{s.date}</div>
                        <div className="text-sm text-white/60">{s.timeRange}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.isBooked ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#FF6B9D]" />
                          <span className="text-xs text-[#FF6B9D]">已被预约</span>
                        </>
                      ) : (
                        <span className="text-xs text-emerald-400">可预约</span>
                      )}
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
