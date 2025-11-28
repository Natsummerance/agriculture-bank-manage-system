import { useState } from "react";
import { motion } from "motion/react";
import { 
  MessageCircle, 
  Calendar, 
  Video, 
  BookOpen,
  Star,
  Plus,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockExperts = [
  { 
    id: 1, 
    name: "张教授", 
    field: "水稻种植", 
    avatar: "🌾", 
    rating: 4.9, 
    consultations: 1230, 
    online: true,
    price: 200,
    description: "专注水稻种植技术30年，擅长病虫害防治与高产栽培"
  },
  { 
    id: 2, 
    name: "李专家", 
    field: "果树管理", 
    avatar: "🍎", 
    rating: 4.8, 
    consultations: 980, 
    online: true,
    price: 180,
    description: "果树修剪、施肥、病虫害防治一站式指导"
  },
  { 
    id: 3, 
    name: "王顾问", 
    field: "畜牧养殖", 
    avatar: "🐄", 
    rating: 5.0, 
    consultations: 1560, 
    online: false,
    price: 250,
    description: "规模化养殖场管理专家，提供全程技术指导"
  },
];

const mockQuestions = [
  {
    id: 1,
    question: "水稻叶片发黄怎么办？",
    expert: "张教授",
    answer: "可能是缺氮或病害，建议先检查土壤养分，然后观察叶片是否有病斑...",
    likes: 128,
    time: "2小时前",
    status: "answered"
  },
  {
    id: 2,
    question: "苹果树修剪的最佳时期？",
    expert: "李专家",
    answer: "冬季休眠期（12月-次年2月）是最佳修剪期，此时树液流动缓慢...",
    likes: 95,
    time: "5小时前",
    status: "answered"
  },
];

const mockAppointments = [
  { id: 1, date: "11月1日", expert: "张教授", time: "09:00-10:00", status: "confirmed" },
  { id: 2, date: "11月3日", expert: "李专家", time: "14:00-15:00", status: "pending" },
];

export default function FarmerExpertPanel() {
  const [activeTab, setActiveTab] = useState<"experts" | "qa" | "appointments">("experts");

  const handleAskQuestion = () => {
    navigateToSubRoute("expert", "question/ask");
  };

  const handleBookAppointment = (expertId: number) => {
    navigateToSubRoute("expert", `appointment/book?expertId=${expertId}`);
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
              田心学堂·问专家
            </h2>
            <p className="text-sm text-white/60">
              连接农业专家，获取专业指导，解决种植难题。
            </p>
          </div>
          <Button
            onClick={handleAskQuestion}
            className="bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            提问
          </Button>
        </motion.div>

        {/* Tab 切换 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 border-b border-white/10"
        >
          {[
            { id: "experts", label: "专家列表", icon: Star },
            { id: "qa", label: "问答中心", icon: MessageCircle },
            { id: "appointments", label: "我的预约", icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2 ${
                  isActive ? "text-[#00D6C2]" : "text-white/60 hover:text-white/80"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="expertTabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D6C2] to-[#18FF74]"
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* 专家列表 */}
        {activeTab === "experts" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">推荐专家</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {mockExperts.map((expert, index) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{expert.avatar}</div>
                      <div>
                        <div className="font-semibold text-white">{expert.name}</div>
                        <div className="text-sm text-white/60">{expert.field}</div>
                      </div>
                    </div>
                    {expert.online && (
                      <div className="w-2 h-2 rounded-full bg-[#18FF74] animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-white/70">{expert.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white">{expert.rating}</span>
                      <span className="text-white/60">({expert.consultations}次咨询)</span>
                    </div>
                    <div className="text-[#00D6C2] font-semibold">¥{expert.price}/次</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBookAppointment(expert.id)}
                      className="flex-1 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      预约
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // 农户在这里也可以快速进入专家直播间（如果专家在直播）
                        navigateToSubRoute("expert", `live/join?expertId=${expert.id}`);
                      }}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 问答中心 */}
        {activeTab === "qa" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
                <h3 className="text-lg">热门问答</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToSubRoute("expert", "knowledge/favorite")}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                我的收藏
              </Button>
            </div>
            <div className="space-y-3">
              {mockQuestions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-5 h-5 text-[#00D6C2]" />
                        <div className="font-semibold text-white">{q.question}</div>
                      </div>
                      <div className="text-sm text-white/70 pl-7">{q.answer}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60 pl-7">
                    <div className="flex items-center gap-4">
                      <span>专家：{q.expert}</span>
                      <span>{q.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>{q.likes}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* 我的预约 */}
        {activeTab === "appointments" && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">预约记录</h3>
            </div>
            {mockAppointments.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">暂无预约记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mockAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{apt.expert}</div>
                        <div className="text-sm text-white/60">
                          {apt.date} {apt.time}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        apt.status === "confirmed" ? "text-emerald-400 bg-emerald-400/20" : "text-amber-400 bg-amber-400/20"
                      }`}>
                        {apt.status === "confirmed" ? "已确认" : "待确认"}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        // ⚡ 请添加 console.log
                        onClick={() => {
                            console.log(`[DEBUG] 尝试导航到会议室: live/join?appointmentId=${apt.id}`);
                            navigateToSubRoute("expert", `live/join?appointmentId=${apt.id}`);
                        }}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        进入会议室
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </div>
    </div>
  );
}