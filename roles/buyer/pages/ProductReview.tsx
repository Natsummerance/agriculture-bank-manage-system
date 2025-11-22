import { useState } from "react";
import { motion } from "motion/react";
import { Star, Image as ImageIcon, Send } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const reviewSchema = z.object({
  rating: z.number().min(1, "请选择评分").max(5),
  content: z.string().min(5, "请至少填写5个字的评价"),
  images: z.array(z.string()).optional(),
});

const mockReviews = [
  {
    id: "1",
    userName: "买家***1",
    rating: 5,
    content: "大米质量很好，口感香甜，包装也很精美，会回购！",
    images: [],
    createdAt: "2025-03-01",
    helpful: 12,
  },
  {
    id: "2",
    userName: "买家***2",
    rating: 4,
    content: "整体不错，就是价格稍微贵了一点，但质量确实好。",
    images: [],
    createdAt: "2025-02-28",
    helpful: 8,
  },
];

export default function ProductReview() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id") || "p1";
  const [reviews, setReviews] = useState(mockReviews);
  const [rating, setRating] = useState(0);
  const form = useZodForm(reviewSchema, {
    defaultValues: {
      rating: 0,
      content: "",
      images: [],
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    const newReview = {
      id: Date.now().toString(),
      userName: "我",
      rating: values.rating,
      content: values.content,
      images: values.images || [],
      createdAt: new Date().toLocaleDateString(),
      helpful: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    toast.success("评价已提交");
    form.reset();
    setRating(0);
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
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#00D6C2] to-[#18FF74]">
              商品评价
            </h2>
            <p className="text-sm text-white/60">
              分享你的购物体验，帮助其他买家做出选择
            </p>
          </div>
        </motion.div>

        {/* 评价表单 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-[#00D6C2]" />
            <h3 className="text-lg">发表评价</h3>
          </div>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评分</FormLabel>
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
                        placeholder="请详细描述你的购物体验..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
              >
                <Send className="w-4 h-4 mr-2" />
                提交评价
              </Button>
            </form>
          </Form>
        </motion.section>

        {/* 评价列表 */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
            <h3 className="text-lg">全部评价 ({reviews.length})</h3>
          </div>
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D6C2] to-[#18FF74] flex items-center justify-center">
                      {review.userName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{review.userName}</div>
                      <div className="flex items-center gap-1 text-sm">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-white/60">{review.createdAt}</div>
                </div>
                <p className="text-white/80 mb-3">{review.content}</p>
                <div className="flex items-center gap-4 text-xs text-white/60">
                  <button className="hover:text-[#00D6C2]">有用 ({review.helpful})</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}

