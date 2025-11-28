import { useState } from "react";
import { motion } from "motion/react";
import { Star, User, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";

const reviewSchema = z.object({
  farmerId: z.string().min(1, "请选择农户"),
  rating: z.number().min(1, "请选择评分").max(5),
  content: z.string().min(5, "请至少填写5个字的评价"),
  tags: z.array(z.string()).optional(),
});

const mockFarmers = [
  { id: "1", name: "张农户", avatar: "🌾", recentService: "水稻种植咨询" },
  { id: "2", name: "李果农", avatar: "🍎", recentService: "果树管理咨询" },
];

const reviewTags = ["专业认真", "沟通顺畅", "问题清晰", "配合度高", "需要改进"];

export default function ExpertFarmerReview() {
  const [selectedFarmer, setSelectedFarmer] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const form = useZodForm(reviewSchema, {
    defaultValues: {
      farmerId: "",
      rating: 0,
      content: "",
      tags: [],
    },
  });

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = form.handleSubmit((values) => {
    toast.success("评价已提交");
    form.reset();
    setSelectedFarmer("");
    setRating(0);
    setSelectedTags([]);
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              评价农户
            </h2>
            <p className="text-sm text-white/60">
              对服务过的农户进行评价，帮助其他专家了解
            </p>
          </div>
        </motion.div>

        {/* 评价表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-[#A78BFA]" />
            <h3 className="text-lg">选择农户</h3>
          </div>

          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="farmerId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-3 md:grid-cols-2">
                        {mockFarmers.map((farmer) => (
                          <button
                            key={farmer.id}
                            type="button"
                            onClick={() => {
                              setSelectedFarmer(farmer.id);
                              field.onChange(farmer.id);
                            }}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              selectedFarmer === farmer.id
                                ? "border-[#A78BFA] bg-[#A78BFA]/10"
                                : "border-white/10 bg-white/5 hover:border-white/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{farmer.avatar}</div>
                              <div>
                                <div className="font-semibold text-white">{farmer.name}</div>
                                <div className="text-xs text-white/60">{farmer.recentService}</div>
                              </div>
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
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      评分
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              setRating(star);
                              field.onChange(star);
                            }}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-white/20"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <label className="text-sm text-white/80 mb-2 block">评价标签（可选）</label>
                <div className="flex flex-wrap gap-2">
                  {reviewTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-[#A78BFA]/20 text-[#A78BFA] border border-[#A78BFA]/50"
                          : "bg-white/5 text-white/60 border border-white/10 hover:border-white/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评价内容</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                        className="bg-white/5 border-white/10"
                        placeholder="详细描述你对这位农户的评价..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                提交评价
              </Button>
            </form>
          </Form>
        </motion.section>
      </div>
    </div>
  );
}

