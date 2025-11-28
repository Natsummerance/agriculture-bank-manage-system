import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../components/ui/form";
import { useZodForm } from "../../../hooks/useZodForm";
import { z } from "zod";
import { toast } from "sonner";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";

const bankCardSchema = z.object({
  bankName: z.string().min(1, "请输入银行名称"),
  cardNumber: z.string().min(16, "请输入16位银行卡号").max(19, "银行卡号格式不正确"),
  cardholderName: z.string().min(1, "请输入持卡人姓名"),
  isDefault: z.boolean().optional(),
});

interface BankCard {
  id: string;
  bankName: string;
  cardNumber: string;
  cardholderName: string;
  isDefault: boolean;
}

const mockCards: BankCard[] = [];

export default function ExpertBankCardManage() {
  const [cards, setCards] = useState<BankCard[]>(mockCards);
  const form = useZodForm(bankCardSchema);

  const handleAddCard = form.handleSubmit((values) => {
    const newCard: BankCard = {
      id: Date.now().toString(),
      bankName: values.bankName,
      cardNumber: values.cardNumber.slice(-4),
      cardholderName: values.cardholderName,
      isDefault: values.isDefault || cards.length === 0,
    };
    if (newCard.isDefault) {
      setCards((prev) => prev.map((c) => ({ ...c, isDefault: false })));
    }
    setCards((prev) => [...prev, newCard]);
    toast.success("银行卡添加成功");
    form.reset();
  });

  const handleDelete = (id: string) => {
    if (window.confirm("确定要删除这张银行卡吗？")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
      toast.success("银行卡已删除");
    }
  };

  const handleSetDefault = (id: string) => {
    setCards((prev) =>
      prev.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }))
    );
    toast.success("已设置为默认银行卡");
  };

  return (
    <div className="min-h-screen bg-[#050816] pt-24 pb-12 px-6 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D]">
              银行卡管理
            </h2>
            <p className="text-sm text-white/60">管理你的银行卡信息，用于提现</p>
          </div>
          <Button variant="outline" onClick={() => navigateToSubRoute("profile", "overview")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg">我的银行卡</h3>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p>暂无银行卡</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-8 h-8 text-[#A78BFA]" />
                    <div>
                      <div className="font-semibold text-white">{card.bankName}</div>
                      <div className="text-sm text-white/60">
                        **** **** **** {card.cardNumber}
                      </div>
                      <div className="text-xs text-white/50">{card.cardholderName}</div>
                    </div>
                    {card.isDefault && (
                      <span className="px-2 py-1 rounded-full text-xs bg-[#A78BFA]/20 text-[#A78BFA]">
                        默认
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!card.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(card.id)}
                      >
                        设为默认
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(card.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 border-t border-white/10">
            <h3 className="text-lg mb-4">添加银行卡</h3>
            <Form {...form}>
              <form onSubmit={handleAddCard} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>银行名称</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入银行名称" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>银行卡号</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入16-19位银行卡号" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>持卡人姓名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入持卡人姓名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#A78BFA] to-[#FF6B9D] text-white hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加银行卡
                </Button>
              </form>
            </Form>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

