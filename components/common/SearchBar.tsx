import { Input } from "../ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "搜索商品、订单、农户..."}
        className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
        onKeyDown={(e) => {
          if (e.key === "Enter" && onSearch) {
            onSearch(value);
          }
        }}
      />
    </div>
  );
}


