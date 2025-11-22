import { useNavigate } from "react-router-dom";

export default function MatchIntro() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">智能拼单式融资匹配</h1>
      <p className="text-sm text-white/70">
        当单个农户融资金额不足以达到银行的最低审批额度时，系统会通过智能算法，帮你和周边信用良好、作物相似的农户一起“组团拼单”，统一向银行发起联合融资申请。
      </p>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-white/80">
        <div className="font-semibold mb-1">匹配逻辑简介</div>
        <ul className="list-disc list-inside space-y-1 text-white/70">
          <li>地理位置相近的农户，方便银行统一尽调与贷后管理</li>
          <li>作物品类相似，风险画像更清晰，可享受专项利率</li>
          <li>基于历史行为的信用等级，优先与高信用农户拼单</li>
          <li>自动凑整到银行最低审批额度（例如 20 万），提高成功率</li>
        </ul>
      </div>
      <button
        onClick={() => navigate("/farmer/finance/match/candidates")}
        className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 transition"
      >
        开始智能匹配
      </button>
    </div>
  );
}


