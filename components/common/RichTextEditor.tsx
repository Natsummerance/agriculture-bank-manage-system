import { useState } from "react";
import { Textarea } from "../ui/textarea";

interface RichTextEditorProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function RichTextEditor({ label, value, onChange }: RichTextEditorProps) {
  const [inner, setInner] = useState(value ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInner(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="space-y-1">
      {label && <div className="text-sm text-white/70">{label}</div>}
      <Textarea
        rows={5}
        value={inner}
        onChange={handleChange}
        placeholder="在这里输入商品图文详情，可包含种植方式、品质描述、包装方式等信息（占位简易编辑器）。"
      />
      <div className="text-xs text-white/50">后续可替换为真正的富文本编辑器（如 TipTap / Slate）</div>
    </div>
  );
}


