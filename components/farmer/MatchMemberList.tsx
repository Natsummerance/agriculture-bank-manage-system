interface MatchMember {
  farmerId: string;
  name: string;
  amount: number;
}

interface MatchMemberListProps {
  members: MatchMember[];
}

export function MatchMemberList({ members }: MatchMemberListProps) {
  if (!members.length) {
    return <div className="text-xs text-white/60">暂时还没有其他成员加入。</div>;
  }

  return (
    <div className="space-y-2 text-sm text-white">
      {members.map((m) => (
        <div
          key={m.farmerId}
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
        >
          <div>
            <div className="font-semibold">{m.name}</div>
            <div className="text-xs text-white/60">成员ID：{m.farmerId}</div>
          </div>
          <div className="text-emerald-400 font-mono">¥{m.amount.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}


