export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050816] via-[#0b1120] to-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-emerald-400 rounded-full animate-spin" />
        <p className="text-sm text-white/70">正在点亮星云，请稍候...</p>
      </div>
    </div>
  );
}


