import { ReactNode } from "react";
import { Button } from "../ui/button";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterPanelProps {
  title?: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  extra?: ReactNode;
}

export function FilterPanel({ title, options, value, onChange, extra }: FilterPanelProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {title && <span className="text-sm text-white/60">{title}</span>}
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? "default" : "outline"}
          size="sm"
          className={
            value === opt.value
              ? "bg-emerald-500/80 text-black border-emerald-400"
              : "border-white/20 text-white/70 hover:bg-white/10"
          }
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </Button>
      ))}
      {extra}
    </div>
  );
}


