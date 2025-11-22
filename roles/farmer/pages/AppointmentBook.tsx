import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, Video, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { DateRangePicker } from "../../../components/common/DateRangePicker";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

const appointmentSchema = z.object({
  expertId: z.string().min(1, "请选择专家"),
  topic: z.string().min(5, "请至少输入5个字的咨询主题"),
  description: z.string().min(10, "请至少输入10个字的问题描述"),
  preferredDate: z.string().min(1, "请选择预约日期"),
  preferredTime: z.string().min(1, "请选择预约时间"),
});

const mockExperts = [
  { id: "1", name: "张教授", field: "水稻种植", available: true },
  { id: "2", name: "李专家", field: "果树管理", available: true },
];

const mockTimeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

export default function AppointmentBook() {
  const [selectedExpert, setSelectedExpert] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const form = useZodForm(appointmentSchema, {
    defaultValues: {
      expertId: "",
      topic: "",
      description: "",
      preferredDate: "",
      preferredTime: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    toast.success("预约申请已提交，等待专家确认");
    form.reset();
    setSelectedExpert("");
    setDateRange(undefined);
    setSelectedTime("");
  });

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              预约专家服务
            </h2>
            <p className="text-sm text-white/60">
              预约专家进行一对一咨询
            </p>
          </div>
        </motion.div>

        {/* 预约表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-[#18FF74]" />
            <h3 className="text-lg">预约信息</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="expertId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>选择专家</FormLabel>
                    <FormControl>
                      <div className="grid gap-3 md:grid-cols-2">
                        {mockExperts.map((expert) => (
                          <button
                            key={expert.id}
                            type="button"
                            onClick={() => {
                              setSelectedExpert(expert.id);
                              field.onChange(expert.id);
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedExpert === expert.id
                                ? "border-[#18FF74] bg-[#18FF74]/10"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <User className="w-5 h-5 text-[#00D6C2]" />
                              <div className="text-left">
                                <div className="font-semibold text-white">{expert.name}</div>
                                <div className="text-xs text-white/60">{expert.field}</div>
                              </div>
                              {selectedExpert === expert.id && (
                                <CheckCircle2 className="w-5 h-5 text-[#18FF74] ml-auto" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>咨询主题</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white/5 border-white/10" placeholder="如：水稻病虫害防治咨询" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>问题描述</FormLabel>
                    <FormControl>
                      <textarea
                        rows={4}
                        {...field}
                        className="w-full bg-white/5 border border-white/10 rounded-md p-3 text-white placeholder-white/40"
                        placeholder="详细描述你想要咨询的问题..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-white/80 mb-2 block">预约日期</label>
                  <DateRangePicker value={dateRange} onChange={setDateRange} />
                  {dateRange?.from && (
                    <input
                      type="hidden"
                      {...form.register("preferredDate")}
                      value={dateRange.from.toISOString().split("T")[0]}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm text-white/80 mb-2 block">预约时间</label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockTimeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setSelectedTime(slot);
                          form.setValue("preferredTime", slot);
                        }}
                        className={`p-2 rounded-lg border transition-all ${
                          selectedTime === slot
                            ? "border-[#18FF74] bg-[#18FF74]/10 text-[#18FF74]"
                            : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <div className="text-xs">{slot}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#18FF74] to-[#00D6C2] text-black hover:opacity-90"
              >
                <Video className="w-4 h-4 mr-2" />
                提交预约申请
              </Button>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

