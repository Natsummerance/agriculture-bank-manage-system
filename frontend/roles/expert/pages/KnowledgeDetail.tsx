import { motion } from "motion/react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Eye, Heart, Share2, BookOpen, User, Tag } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

export default function ExpertKnowledgeDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  // Mock数据 - 实际应从API获取
  const article = {
    id: id || "1",
    title: "现代农业种植技术指南：从选种到收获的完整流程",
    author: "张农业专家",
    authorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=expert",
    category: "种植技术",
    tags: ["种植", "技术", "农业"],
    content: `
# 现代农业种植技术指南

## 一、选种阶段

选择合适的种子是成功种植的第一步。在选择种子时，需要考虑以下因素：

1. **气候适应性**：选择适合当地气候条件的品种
2. **抗病性**：优先选择抗病性强的品种
3. **产量潜力**：根据市场需求选择高产或优质品种

## 二、土壤准备

良好的土壤是作物生长的基础：

- **土壤检测**：定期检测土壤pH值、有机质含量等指标
- **施肥方案**：根据检测结果制定科学的施肥计划
- **深耕整地**：确保土壤疏松，有利于根系生长

## 三、播种管理

播种时机的选择至关重要：

- **温度要求**：不同作物对温度有不同的要求
- **湿度控制**：保持适宜的土壤湿度
- **播种深度**：根据种子大小确定合适的播种深度

## 四、生长期管理

作物生长期需要持续关注：

1. **水肥管理**：根据作物生长阶段调整水肥比例
2. **病虫害防治**：定期检查，及时防治
3. **除草管理**：及时清除杂草，避免竞争养分

## 五、收获与储存

收获时机的把握直接影响作物品质：

- **成熟度判断**：根据作物特征判断最佳收获时机
- **收获方法**：采用合适的收获工具和方法
- **储存条件**：控制温度、湿度，延长储存期

## 总结

现代农业种植需要科学的管理方法和持续的学习。希望本指南能帮助农户朋友们提高种植水平，获得更好的收成。
    `,
    views: 1234,
    likes: 89,
    createdAt: "2025-01-15",
    readingTime: "8分钟",
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = () => {
    toast.success("已收藏");
  };

  const handleShare = () => {
    toast.success("链接已复制到剪贴板");
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white pb-24">
      {/* 顶部导航 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-[#0A0F1E]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Heart className="w-5 h-5 text-[#FF2566]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 文章头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-[#00D6C2]" />
            <span className="text-sm text-[#00D6C2]">{article.category}</span>
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#00D6C2] to-[#18FF74] bg-clip-text text-transparent">
            {article.title}
          </h1>
          <div className="flex items-center gap-6 text-sm text-white/60 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{article.createdAt}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.views}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{article.readingTime}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/80"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* 文章内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <div className="whitespace-pre-line text-white/90 leading-relaxed">
              {article.content}
            </div>
          </div>
        </motion.div>

        {/* 底部操作栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <Button
            onClick={handleLike}
            variant="outline"
            className="border-[#FF2566]/30 text-[#FF2566] hover:bg-[#FF2566]/10"
          >
            <Heart className="w-4 h-4 mr-2" />
            收藏 ({article.likes})
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-white/10 text-white/80 hover:bg-white/5"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

