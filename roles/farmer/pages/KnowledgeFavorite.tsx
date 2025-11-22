import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Heart, Share2, ThumbsUp, MessageCircle, Calendar } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";

interface KnowledgeItem {
  id: string;
  title: string;
  author: string;
  type: "article" | "video" | "qa";
  content: string;
  likes: number;
  views: number;
  isLiked: boolean;
  isFavorited: boolean;
  createdAt: string;
}

const mockKnowledge: KnowledgeItem[] = [
  {
    id: "1",
    title: "水稻病虫害防治指南",
    author: "张教授",
    type: "article",
    content: "详细介绍水稻常见病虫害的识别与防治方法...",
    likes: 128,
    views: 1230,
    isLiked: false,
    isFavorited: true,
    createdAt: "2025-03-01",
  },
  {
    id: "2",
    title: "果树修剪技术视频",
    author: "李专家",
    type: "video",
    content: "通过视频演示果树修剪的正确方法...",
    likes: 95,
    views: 890,
    isLiked: true,
    isFavorited: false,
    createdAt: "2025-02-28",
  },
];

export default function KnowledgeFavorite() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(mockKnowledge);

  const handleLike = (id: string) => {
    setKnowledge((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
    toast.success(knowledge.find((k) => k.id === id)?.isLiked ? "已取消点赞" : "已点赞");
  };

  const handleFavorite = (id: string) => {
    setKnowledge((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
    toast.success(knowledge.find((k) => k.id === id)?.isFavorited ? "已取消收藏" : "已收藏");
  };

  const handleShare = (id: string) => {
    toast.success("分享链接已复制到剪贴板");
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
              知识收藏
            </h2>
            <p className="text-sm text-white/60">
              收藏的专家文章、视频和问答
            </p>
          </div>
        </motion.div>

        {/* 知识列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#18FF74] to-[#00D6C2] rounded-full" />
            <h3 className="text-lg">我的收藏 ({knowledge.filter((k) => k.isFavorited).length})</h3>
          </div>

          {knowledge.filter((k) => k.isFavorited).length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-2">暂无收藏内容</p>
              <p className="text-sm text-white/40">去专家页面收藏感兴趣的内容</p>
            </div>
          ) : (
            <div className="space-y-3">
              {knowledge
                .filter((k) => k.isFavorited)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {item.type === "article" ? (
                            <BookOpen className="w-5 h-5 text-[#18FF74]" />
                          ) : item.type === "video" ? (
                            <MessageCircle className="w-5 h-5 text-[#00D6C2]" />
                          ) : (
                            <Calendar className="w-5 h-5 text-amber-400" />
                          )}
                          <span className="font-semibold text-white">{item.title}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60">
                            {item.type === "article" ? "文章" : item.type === "video" ? "视频" : "问答"}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{item.content}</p>
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <span>作者：{item.author}</span>
                          <span>浏览 {item.views}</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLike(item.id)}
                        className={item.isLiked ? "border-[#FF6B9D] text-[#FF6B9D]" : ""}
                      >
                        <ThumbsUp className={`w-4 h-4 mr-2 ${item.isLiked ? "fill-[#FF6B9D]" : ""}`} />
                        {item.likes}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleFavorite(item.id)}
                        className={item.isFavorited ? "border-[#18FF74] text-[#18FF74]" : ""}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${item.isFavorited ? "fill-[#18FF74]" : ""}`} />
                        收藏
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleShare(item.id)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        分享
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

