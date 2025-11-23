import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getMatchResult } from "../../../../api/farmerFinanceMatch";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";

export default function MatchResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"success" | "failed" | "pending">("pending");
  const [mergedAmount, setMergedAmount] = useState<number | null>(null);

  const matchId = params.get("matchId") || "mock_match";

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await getMatchResult(matchId);
        setStatus(res.status);
        setMergedAmount(res.mergedAmount);
      } catch {
        // 本地 Mock：随机成功/失败
        const ok = Math.random() > 0.5;
        setStatus(ok ? "success" : "failed");
        setMergedAmount(ok ? 200000 : null);
      }
    };
    fetchResult();
  }, [matchId]);

  if (status === "pending") {
    return <div className="p-6 text-white/60 text-sm">正在计算拼单结果...</div>;
  }

  const handleRetry = () => {
    navigate("/farmer/finance/match");
  };

  const handleGoFinance = () => {
    toast.success("已将拼单额度带入融资申请表单（示意）");
    navigate("/farmer/finance");
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">拼单结果</h1>
      {status === "success" ? (
        <div className="rounded-xl border border-emerald-400/60 bg-emerald-500/10 p-4 space-y-2 text-sm">
          <div className="font-semibold text-emerald-300">拼单成功</div>
          <div className="text-white/80">
            已成功与其他农户组成联合融资单，合并额度约为{" "}
            <span className="font-mono text-emerald-300">
              ¥{(mergedAmount ?? 0).toLocaleString()}
            </span>
            ，可直接进入正式融资申请流程。
          </div>
          <Button size="sm" onClick={handleGoFinance}>
            去填写联合融资申请
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-red-400/60 bg-red-500/10 p-4 space-y-2 text-sm">
          <div className="font-semibold text-red-300">拼单失败</div>
          <div className="text-white/80">
            当前时间窗口内未能找到足够的拼单成员，你可以稍后重新尝试匹配，或直接提交单户融资申请。
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleRetry}>
              重新发起匹配
            </Button>
            <Button size="sm" variant="outline" onClick={() => navigate("/farmer/finance")}>
              回到融资申请
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


