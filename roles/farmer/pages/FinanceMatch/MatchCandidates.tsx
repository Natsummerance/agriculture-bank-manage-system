import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MatchCard } from "../../../../components/farmer/MatchCard";
import { getMatchCandidates, type MatchCandidate } from "../../../../api/farmerFinanceMatch";
import { toast } from "sonner";

export default function MatchCandidates() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);

  const amount = Number(params.get("amount") || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getMatchCandidates(amount || 0);
        setCandidates(data);
      } catch {
        toast.error("获取匹配候选列表失败（使用本地示例数据）");
        setCandidates([
          {
            farmerId: "f1",
            name: "张三",
            cropType: "水稻",
            matchScore: 88,
            amountNeeded: 30000,
            location: "XX省XX县",
          },
          {
            farmerId: "f2",
            name: "李四",
            cropType: "水稻",
            matchScore: 81,
            amountNeeded: 25000,
            location: "XX省XX县",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [amount]);

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">智能匹配候选农户</h1>
      <p className="text-sm text-white/60">
        系统根据你的融资需求，从附近区域、相似作物与信用等级中为你筛选出可拼单的农户。
      </p>
      {loading ? (
        <div className="text-white/60 text-sm">正在获取匹配结果...</div>
      ) : candidates.length === 0 ? (
        <div className="text-white/60 text-sm">当前暂无合适的拼单对象，可以尝试稍后再试或直接发起拼单。</div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <MatchCard
              key={c.farmerId}
              name={c.name}
              cropType={c.cropType}
              location={c.location}
              amountNeeded={c.amountNeeded}
              matchScore={c.matchScore}
              onJoin={() =>
                navigate(`/farmer/finance/match/detail/${c.farmerId}`, {
                  state: { fromCandidates: true },
                })
              }
              onDetail={() =>
                navigate(`/farmer/finance/match/detail/${c.farmerId}`, {
                  state: { fromCandidates: true },
                })
              }
            />
          ))}
        </div>
      )}
      <div className="pt-2 text-sm text-white/60">
        或者，你也可以
        <button
          onClick={() => navigate("/farmer/finance/match/create")}
          className="ml-1 underline text-emerald-400"
        >
          自己发起一个新的拼单
        </button>
        。
      </div>
    </div>
  );
}


