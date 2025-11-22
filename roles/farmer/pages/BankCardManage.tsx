import { useState } from "react";
import { motion } from "motion/react";
import { CreditCard, Plus, Trash2, CheckCircle2 } from "lucide-react";
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

const mockCards: BankCard[] = [
  {
    id: "1",
    bankName: "中国农业银行",
    cardNumber: "6234",
    cardholderName: "张三",
    isDefault: true,
  },
];

export default function FarmerBankCardManage() {
  const [cards, setCards] = useState<BankCard[]>(mockCards);
  const form = useZodForm(bankCardSchema);

  const handleAddCard = form.handleSubmit((values) => {
    const newCard: BankCard = {
      id: Date.now().toString(),
      bankName: values.bankName,
      cardNumber: values.cardNumber.slice(-4), // 只保存后4位
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

  const handleDeleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    toast.success("银行卡已删除");
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <h2 className="mb-3 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#00D6C2]">
              银行卡管理
            </h2>
            <p className="text-sm text-white/60">
              管理提现银行卡，设置默认收款账户
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigateToSubRoute("profile", "wallet")}
          >
            返回钱包
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 银行卡列表 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-[#00D6C2] to-[#18FF74] rounded-full" />
              <h3 className="text-lg">我的银行卡</h3>
            </div>
            {cards.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 text-center">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60">暂无银行卡</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl glass-morphism border p-6 ${
                      card.isDefault
                        ? "border-[#00D6C2] bg-[#00D6C2]/10"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-[#00D6C2]" />
                          <span className="font-semibold text-white">{card.bankName}</span>
                          {card.isDefault && (
                            <span className="text-xs px-2 py-1 rounded-full bg-emerald-400/20 text-emerald-400">
                              默认
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-white/60 mb-1">
                          尾号 {card.cardNumber} · {card.cardholderName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!card.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(card.id)}
                          >
                            设默认
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>

          {/* 添加银行卡表单 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass-morphism border border-white/10 bg-white/5 p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-[#18FF74]" />
              <h3 className="text-lg">添加银行卡</h3>
            </div>
            <Form {...form}>
              <form onSubmit={handleAddCard} className="space-y-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>银行名称</FormLabel>
                      <FormControl>
                        <Input placeholder="如：中国农业银行" {...field} />
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
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value || false}
                          onChange={field.onChange}
                          className="w-4 h-4 rounded border-white/30"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">设为默认银行卡</FormLabel>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#00D6C2] to-[#18FF74] text-black hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加银行卡
                </Button>
              </form>
            </Form>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
