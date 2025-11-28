import { motion } from "motion/react";
import { Plus, Video, BookOpen, MessageCircle, Calendar, DollarSign, Users, Star, Award } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const pendingConsults = [
  { id: 1, farmer: "张农户", topic: "有机蔬菜病虫害防治", time: "今天 14:00", status: "待接单", urgent: true, fee: "¥200" },
  { id: 2, farmer: "李农场", topic: "土壤改良方案咨询", time: "今天 16:00", status: "已预约", urgent: false, fee: "¥150" },
  { id: 3, farmer: "王合作社", topic: "智能灌溉系统规划", time: "明天 10:00", status: "待确认", urgent: false, fee: "¥300" },
];

const stats = [
  { label: "本月收益", value: "¥12,580", change: "+28%", color: "#FF7A9C", icon: DollarSign },
  { label: "咨询次数", value: "89", change: "+15", color: "#18FF74", icon: Users },
  { label: "知识发布", value: "234", change: "+23", color: "#00D6C2", icon: BookOpen },
  { label: "满意评分", value: "4.9", change: "+0.2", color: "#FFE600", icon: Star },
];

const recentArticles = [
  { id: 1, title: "春季农作物病虫害防治技术", views: 2345, likes: 189, time: "2天前" },
  { id: 2, title: "有机农业土壤改良实践指南", views: 1890, likes: 156, time: "5天前" },
  { id: 3, title: "智能温室大棚控制系统设计", views: 3456, likes: 267, time: "1周前" },
];

export function ExpertHome() {
  const handlePublishKnowledge = () => {
    toast.success("发布知识功能 - 打开编辑器");
  };

  const handleStartLive = () => {
    toast.success("开始直播功能 - 准备直播间");
  };

  const handleAcceptConsult = (consultId: number) => {
    toast.success(`已接单咨询 #${consultId}`);
  };

  const handleViewCalendar = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-calendar'));
  };

  const handleGoToIncome = () => {
    const event = new CustomEvent('navigate-tab', { detail: { tab: 'finance' } });
    window.dispatchEvent(event);
  };

  const handleViewArticle = (articleId: number) => {
    toast.success(`查看文章 #${articleId}`);
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#00D6C2]">
            知识星系·Expert Universe
          </h2>
          <p className="text-white/60">传播智慧，共创价值</p>
        </motion.div>

        {/* 顶部双FAB按钮 */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Button
              onClick={handlePublishKnowledge}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#FF7A9C] to-[#00D6C2] text-white hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(255, 122, 156, 0.4)" }}
            >
              <Plus className="w-6 h-6" />
              发布知识
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Button
              onClick={handleStartLive}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#00D6C2] to-[#FF7A9C] text-white hover:opacity-90 shadow-lg flex items-center gap-3"
              style={{ boxShadow: "0 8px 24px rgba(0, 214, 194, 0.4)" }}
            >
              <Video className="w-6 h-6" />
              开始直播
            </Button>
          </motion.div>
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-morphism rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}20`,
                      border: `1px solid ${stat.color}40`
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  <span 
                    className="text-sm px-2 py-1 rounded-full"
                    style={{
                      background: stat.change.startsWith('+') ? '#18FF7420' : '#FF256620',
                      color: stat.change.startsWith('+') ? '#18FF74' : '#FF2566'
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-mono mb-1 text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewCalendar}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#FF7A9C]/30 transition-all"
          >
            <Calendar className="w-10 h-10 mb-4 text-[#FF7A9C]" />
            <h3 className="text-white mb-2">我的日历</h3>
            <p className="text-white/60 text-sm">管理预约时段</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoToIncome}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#18FF74]/30 transition-all"
          >
            <DollarSign className="w-10 h-10 mb-4 text-[#18FF74]" />
            <h3 className="text-white mb-2">收益报告</h3>
            <p className="text-white/60 text-sm">查看收入详情</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-morphism rounded-2xl p-6 text-left border border-white/10 hover:border-[#00D6C2]/30 transition-all"
          >
            <Award className="w-10 h-10 mb-4 text-[#00D6C2]" />
            <h3 className="text-white mb-2">专家认证</h3>
            <p className="text-white/60 text-sm">提升专业等级</p>
          </motion.button>
        </div>

        {/* 待处理咨询 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">待处理咨询</h3>
            <span className="text-sm text-white/60">{pendingConsults.length} 个待接单</span>
          </div>
          
          <div className="space-y-4">
            {pendingConsults.map((consult, i) => (
              <motion.div
                key={consult.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#FF7A9C]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white">{consult.topic}</h4>
                      {consult.urgent && (
                        <span className="px-2 py-1 rounded-full text-xs bg-[#FF2566]/20 text-[#FF2566] border border-[#FF2566]/40">
                          紧急
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>{consult.farmer}</span>
                      <span>•</span>
                      <span>{consult.time}</span>
                      <span>•</span>
                      <span className="text-[#18FF74]">{consult.fee}</span>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      background: consult.status === '待接单' ? '#FFE60020' : '#00D6C220',
                      color: consult.status === '待接单' ? '#FFE600' : '#00D6C2',
                      border: `1px solid ${consult.status === '待接单' ? '#FFE60040' : '#00D6C240'}`
                    }}
                  >
                    {consult.status}
                  </span>
                </div>

                {consult.status === '待接单' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleAcceptConsult(consult.id)}
                      className="flex-1 bg-gradient-to-r from-[#FF7A9C] to-[#00D6C2] text-white hover:opacity-90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      接单
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white/80 hover:bg-white/10"
                    >
                      忽略
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 我的文章 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white">我的文章</h3>
            <Button
              variant="ghost"
              className="text-[#00D6C2] hover:text-[#00D6C2]/80"
              onClick={handlePublishKnowledge}
            >
              <Plus className="w-4 h-4 mr-2" />
              写文章
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentArticles.map((article, i) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleViewArticle(article.id)}
                className="w-full bg-white/5 rounded-xl p-5 border border-white/10 hover:border-[#00D6C2]/30 transition-all text-left"
              >
                <h4 className="text-white mb-3">{article.title}</h4>
                <div className="flex items-center gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {article.views} 阅读
                  </span>
                  <span className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#FFE600]" />
                    {article.likes} 点赞
                  </span>
                  <span>{article.time}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
