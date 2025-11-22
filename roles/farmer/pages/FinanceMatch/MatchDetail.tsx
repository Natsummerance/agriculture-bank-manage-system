import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatchDetail, joinMatch, quitMatch, type MatchDetail as MatchDetailType } from "../../../../api/farmerFinanceMatch";
import { MatchProgress } from "../../../../components/farmer/MatchProgress";
import { MatchMemberList } from "../../../../components/farmer/MatchMemberList";
import { Button } from "../../../../components/ui/button";
import { toast } from "sonner";

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<MatchDetailType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getMatchDetail(id);
        setDetail(data);
      } catch {
        // Mock 示例
        setDetail({
          matchId: id,
          targetAmount: 200000,
          currentAmount: 120000,
          status: "matching",
          members: [
            { farmerId: "self", name: "我", amount: 50000 },
            { farmerId: "f1", name: "张三", amount: 70000 },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleJoin = async () => {
    if (!detail) return;
    try {
      await joinMatch(detail.matchId, 50000);
      toast.success("已加入拼单（本地模拟）");
    } catch {
      toast.error("加入拼单失败");
    }
  };

  const handleQuit = async () => {
    if (!detail) return;
    try {
      await quitMatch(detail.matchId);
      toast.success("已退出拼单（本地模拟）");
    } catch {
      toast.error("退出拼单失败");
    }
  };

  const handleGoResult = () => {
    if (!detail) return;
    navigate(`/farmer/finance/match/result?matchId=${detail.matchId}`);
  };

  if (loading || !detail) {
    return <div className="p-6 text-white/60 text-sm">正在加载拼单详情...</div>;
  }

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">拼单详情</h1>
      <MatchProgress targetAmount={detail.targetAmount} currentAmount={detail.currentAmount} />
      <MatchMemberList members={detail.members} />
      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={handleJoin}>
          加入拼单
        </Button>
        <Button size="sm" variant="outline" onClick={handleQuit}>
          退出拼单
        </Button>
        <Button size="sm" variant="outline" onClick={handleGoResult}>
          查看拼单结果
        </Button>
      </div>
    </div>
  );
}


