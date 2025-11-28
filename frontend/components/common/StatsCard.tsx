import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
}

export function StatsCard({ title, value, subtitle, icon, color = "#18FF74" }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">{title}</span>
        {icon && <div className="text-lg" style={{ color }}>{icon}</div>}
      </div>
      <div className="text-2xl font-mono" style={{ color }}>
        {value}
      </div>
      {subtitle && <div className="text-xs text-white/50">{subtitle}</div>}
    </div>
  );
}


