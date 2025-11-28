import { useRole } from '../../contexts/RoleContext';
import { FinancePage } from '../FinancePage';
import LoanApproval from '../../pages/LoanApproval';

// 农户金融页面 - 贷款申请
function FarmerFinancePage() {
  return <FinancePage />;
}

// 买家金融页面 - 分期购物
function BuyerFinancePage() {
  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#00D6C2]">
          购市分期·智能金融
        </h2>
        <FinancePage />
      </div>
    </div>
  );
}

// 银行金融页面 - 审批管理
function BankFinancePage() {
  return <LoanApproval />;
}

// 专家金融页面 - 收益统计
function ExpertFinancePage() {
  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#18FF74]">
          知识收益·智慧价值
        </h2>
        <FinancePage />
      </div>
    </div>
  );
}

// 管理员金融页面 - 资本监控
function AdminFinancePage() {
  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#A5ACBA] to-[#00D6C2]">
          控制资本·金融监控
        </h2>
        <FinancePage />
      </div>
    </div>
  );
}

export function RoleFinancePage() {
  const { role } = useRole();

  switch (role) {
    case 'farmer':
      return <FarmerFinancePage />;
    case 'buyer':
      return <BuyerFinancePage />;
    case 'bank':
      return <BankFinancePage />;
    case 'expert':
      return <ExpertFinancePage />;
    case 'admin':
      return <AdminFinancePage />;
    default:
      return <FarmerFinancePage />;
  }
}
