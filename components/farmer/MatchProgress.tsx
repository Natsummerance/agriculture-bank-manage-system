interface MatchProgressProps {
  targetAmount: number;
  currentAmount: number;
}

export function MatchProgress({ targetAmount, currentAmount }: MatchProgressProps) {
  const percent = Math.min(100, Math.round((currentAmount / targetAmount) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-white/60">
        <span>
          已拼额度：¥{currentAmount.toLocaleString()} / ¥{targetAmount.toLocaleString()}
        </span>
        <span className="text-emerald-400">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}


