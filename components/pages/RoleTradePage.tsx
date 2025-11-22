import { useRole } from '../../contexts/RoleContext';
import { TradePage } from '../TradePage';

// 农户交易页面 - 产品发布/订单管理
function FarmerTradePage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#18FF74]">
          田心市场·产品发布
        </h2>
        <TradePage />
      </div>
    </div>
  );
}

// 买家交易页面 - 购物商城
function BuyerTradePage() {
  return <TradePage />;
}

// 银行交易页面 - 数据看板
function BankTradePage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#00D6C2]">
          资本数据·交易看板
        </h2>
        <TradePage />
      </div>
    </div>
  );
}

// 专家交易页面 - 知识市场
function ExpertTradePage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#FF7A9C]">
          知识市场·付费咨询
        </h2>
        <TradePage />
      </div>
    </div>
  );
}

// 管理员交易页面 - 数据监控
function AdminTradePage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#18FF74] to-[#A5ACBA]">
          控制数据·实时监控
        </h2>
        <TradePage />
      </div>
    </div>
  );
}

export function RoleTradePage() {
  const { role } = useRole();

  switch (role) {
    case 'farmer':
      return <FarmerTradePage />;
    case 'buyer':
      return <BuyerTradePage />;
    case 'bank':
      return <BankTradePage />;
    case 'expert':
      return <ExpertTradePage />;
    case 'admin':
      return <AdminTradePage />;
    default:
      return <BuyerTradePage />;
  }
}
