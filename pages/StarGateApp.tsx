import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { HomePage } from "../components/HomePage";
import { TradePage } from "../components/TradePage";
import { FinancePage } from "../components/FinancePage";
import { ExpertPage } from "../components/ExpertPage";
import { ProfilePage } from "../components/ProfilePage";
import { useRole } from "../contexts/RoleContext";

// 农户端
import FarmerHome from "../roles/farmer/pages/Home";
import FarmerProductList from "../roles/farmer/pages/ProductList";
import FinanceList from "../roles/farmer/pages/FinanceList";
import FarmerOrders from "../roles/farmer/pages/Orders";

// 买家端
import BuyerHome from "../roles/buyer/pages/Home";
import BuyerProductList from "../roles/buyer/pages/ProductList";
import BuyerCart from "../roles/buyer/pages/Cart";
import BuyerOrders from "../roles/buyer/pages/Orders";

// 银行端
import BankDashboardPage from "../roles/bank/pages/Dashboard";
import BankLoanProducts from "../roles/bank/pages/LoanProducts";
import BankAppApproval from "../roles/bank/pages/AppApproval";

// 专家端
import ExpertDashboardPage from "../roles/expert/pages/Dashboard";
import ExpertQAList from "../roles/expert/pages/QAList";
import ExpertKnowledge from "../roles/expert/pages/Knowledge";
import ExpertIncome from "../roles/expert/pages/Income";

// 管理端
import AdminDashboardPage from "../roles/admin/pages/Dashboard";
import AdminProductAudit from "../roles/admin/pages/ProductAudit";
import AdminOrderMonitor from "../roles/admin/pages/OrderMonitor";

export default function StarGateApp() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const { role } = useRole();

  const renderContent = () => {
    // 首页 Tab：按角色展示对应驾驶舱
    if (activeTab === "home") {
      switch (role) {
        case "farmer":
          return <FarmerHome />;
        case "buyer":
          return <BuyerHome />;
        case "bank":
          return <BankDashboardPage />;
        case "expert":
          return <ExpertDashboardPage />;
        case "admin":
          return <AdminDashboardPage />;
        default:
          return <HomePage />;
      }
    }

    // 交易 / 课程 Tab：不同角色含义不同
    if (activeTab === "trade") {
      switch (role) {
        case "farmer":
          // 农户：商品管理入口
          return <FarmerProductList />;
        case "buyer":
          // 买家：农商市场
          return <BuyerProductList />;
        case "expert":
          // 专家：课程 / 文章中心
          return <ExpertKnowledge />;
        case "bank":
          // 银行：贷款产品配置
          return <BankLoanProducts />;
        case "admin":
          // 管理员：商品审核 / 交易监控二选一
          return <AdminProductAudit />;
        default:
          return <TradePage />;
      }
    }

    // 金融 Tab：按角色映射到对应融资中心
    if (activeTab === "finance") {
      switch (role) {
        case "farmer":
          // 农户：我的融资列表 + 详情入口
          return <FinanceList />;
        case "buyer":
          // 买家：暂时使用通用金融页，后续可接「分期中心」
          return <FinancePage />;
        case "bank":
          // 银行：审批工作台
          return <BankAppApproval />;
        case "expert":
          // 专家：收入中心
          return <ExpertIncome />;
        case "admin":
          // 管理员：用仪表盘作为融资监控入口
          return <AdminDashboardPage />;
        default:
          return <FinancePage />;
      }
    }

    // 知识 / 专家 Tab
    if (activeTab === "expert") {
      switch (role) {
        case "expert":
          // 专家本人：问答列表
          return <ExpertQAList />;
        case "farmer":
        case "buyer":
        case "bank":
        case "admin":
          // 其他角色：统一进入知识星系总览
          return <ExpertPage />;
        default:
          return <ExpertPage />;
      }
    }

    // 个人中心 Tab
    if (activeTab === "profile") {
      return <ProfilePage />;
    }

    // 顶部购物车按钮
    if (activeTab === "cart") {
      if (role === "buyer") {
        return <BuyerCart />;
      }
      if (role === "farmer") {
        return <FarmerOrders />;
      }
      if (role === "admin") {
        return <AdminOrderMonitor />;
      }
      return <TradePage />;
    }

    // 兜底：回到首页
    return <HomePage />;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-20">{renderContent()}</main>
    </div>
  );
}