import { Button } from "../ui/button";

interface MatchCardProps {
  name: string;
  cropType: string;
  location: string;
  amountNeeded: number;
  matchScore: number;
  onJoin?: () => void;
  onDetail?: () => void;
}

export function MatchCard({
  name,
  cropType,
  location,
  amountNeeded,
  matchScore,
  onJoin,
  onDetail,
}: MatchCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2 text-sm text-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{name}</div>
        <div className="text-xs text-emerald-400">匹配度 {matchScore}%</div>
      </div>
      <div className="text-white/70">
        作物：{cropType} · 区域：{location}
      </div>
      <div className="text-xs text-white/60">拟融资额度：¥{amountNeeded.toLocaleString()}</div>
      <div className="flex gap-2 pt-1">
        {onJoin && (
          <Button size="sm" onClick={onJoin}>
            加入该拼单
          </Button>
        )}
        {onDetail && (
          <Button size="sm" variant="outline" onClick={onDetail}>
            查看拼单详情
          </Button>
        )}
      </div>
    </div>
  );
}


