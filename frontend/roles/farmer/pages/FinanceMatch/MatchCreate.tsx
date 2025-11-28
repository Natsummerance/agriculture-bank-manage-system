import { z } from "zod";
import { useZodForm } from "../../../../hooks/useZodForm";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Button } from "../../../../components/ui/button";
import { createMatch } from "../../../../api/farmerFinanceMatch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = z.object({
  targetAmount: z.coerce.number().positive("目标额度必须大于0"),
  note: z.string().optional(),
  waitHours: z.coerce.number().positive("等待时间必须大于0"),
});

export default function MatchCreate() {
  const form = useZodForm(schema);
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">发起融资拼单</h1>
      <p className="text-sm text-white/60">
        当系统没有合适的拼单对象时，你可以主动发起一个拼单，由其他农户自愿加入，统一向银行提交联合融资。
      </p>
      <Form {...form}>
        <form
          className="space-y-4 max-w-xl"
          onSubmit={form.handleSubmit(async (values) => {
            try {
              const res = await createMatch(values);
              toast.success("拼单已创建（本地模拟）");
              const matchId = (res as any)?.matchId ?? "mock_match";
              navigate(`/farmer/finance/match/detail/${matchId}`);
            } catch {
              toast.error("创建拼单失败");
            }
          })}
        >
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>目标联合融资额度（元）</FormLabel>
                <FormControl>
                  <Input type="number" step="10000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>说明（可选）</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="例如：联合购买农机设备，扩大水稻种植面积..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waitHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>最长等待时间（小时）</FormLabel>
                <FormControl>
                  <Input type="number" step="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">创建拼单</Button>
        </form>
      </Form>
    </div>
  );
}


