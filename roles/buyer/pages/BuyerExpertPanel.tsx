import { useState } from "react";
import { motion } from "motion/react";
import { 
  Search,
  Star,
  Video,
  MessageCircle,
  Calendar,
  BookOpen,
  Plus
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const mockExperts = [
  { 
    id: 1, 
    name: "张教授", 
    field: "农产品质量检测", 
    avatar: "🔬", 
    rating: 4.9, 
    consultations: 1230, 
    online: true,
    price: 200,
    description: "专注农产品质量检测与认证，提供专业检测指导"
  },
  { 
    id: 2, 
    name: "李专家", 
    field: "采购策略", 
    avatar: "📊", 
    rating: 4.8, 
    consultations: 980, 
    online: true,
    price: 180,
    description: "帮助制定采购计划，优化供应链管理"
  },
];

export default function BuyerExpertPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookAppointment = (expertId: number) => {
    toast.success(`预约专家 #${expertId}`);
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
              购市学堂·选专家
            </h2>
            <p className="text-sm text-white/60">
              寻找采购专家，获取专业建议，优化采购决策。
            </p>
          </div>
        </motion.div>

        {/* 搜索栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索专家..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
        </motion.div>

        {/* 专家列表 */}
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
          <div className="grid gap-4 md:grid-cols-2">
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
                    预约咨询
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigateToSubRoute("expert", `appointment/book?expertId=${expert.id}`);
                    }}
                  >
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

