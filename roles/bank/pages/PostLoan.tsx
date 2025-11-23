import { useBuyerOrderStore } from "../../../stores/buyerOrderStore";

export default function BankPostLoan() {
  // 这里简单使用买家订单作为“还款计划”Mock，占位展示
  const { orders } = useBuyerOrderStore();

  return (
    <div className="p-6 space-y-4 text-white">
      <h1 className="text-xl font-semibold">贷后管理（占位）</h1>
      <p className="text-sm text-white/60">
        此处将用于展示实际贷款还款计划、逾期列表等，目前使用订单数据做简单占位。
      </p>
      {orders.length === 0 ? (
        <div className="text-white/60">暂无数据。</div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between mb-1">
                <span>贷款编号：{o.id}</span>
                <span className="text-white/60">状态：模拟中</span>
              </div>
              <div>模拟还款总额：¥{o.totalAmount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

