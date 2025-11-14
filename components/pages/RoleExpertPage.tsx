import { useRole } from '../../contexts/RoleContext';
import { ExpertPage } from '../ExpertPage';

// 农户专家页面 - 咨询学习
function FarmerExpertPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#18FF74]">
          田心学堂·农业智库
        </h2>
        <ExpertPage />
      </div>
    </div>
  );
}

// 买家专家页面 - 商品问答
function BuyerExpertPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#FFE600]">
          购市学堂·品质问答
        </h2>
        <ExpertPage />
      </div>
    </div>
  );
}

// 银行专家页面 - 风控智库
function BankExpertPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#00D6C2]">
          资本智库·风控专家
        </h2>
        <ExpertPage />
      </div>
    </div>
  );
}

// 专家主页面 - 知识管理
function ExpertExpertPage() {
  return <ExpertPage />;
}

// 管理员专家页面 - 内容审核
function AdminExpertPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A9C] to-[#A5ACBA]">
          控制智库·内容审核
        </h2>
        <ExpertPage />
      </div>
    </div>
  );
}

export function RoleExpertPage() {
  const { role } = useRole();

  switch (role) {
    case 'farmer':
      return <FarmerExpertPage />;
    case 'buyer':
      return <BuyerExpertPage />;
    case 'bank':
      return <BankExpertPage />;
    case 'expert':
      return <ExpertExpertPage />;
    case 'admin':
      return <AdminExpertPage />;
    default:
      return <FarmerExpertPage />;
  }
}
