import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import { onNavigationChange } from "../utils/navigationEvents";
import { onSubRouteChange } from "../utils/subRouteNavigation";
import FarmerHome from "../roles/farmer/pages/Home";
import FarmerFinancePanel from "../roles/farmer/pages/FarmerFinancePanel";
import FarmerExpertPanel from "../roles/farmer/pages/FarmerExpertPanel";
import FarmerProductList from "../roles/farmer/pages/ProductList";
import FarmerProductDashboard from "../roles/farmer/pages/ProductDashboard";
import FarmerProfilePanel from "../roles/farmer/pages/FarmerProfilePanel";
import FarmerOrders from "../roles/farmer/pages/Orders";
// Finance 子页面
import FarmerFinanceApply from "../roles/farmer/pages/Finance";
import FarmerFinanceProgress from "../roles/farmer/pages/FinanceProgress";
import FarmerFinanceContractSign from "../roles/farmer/pages/FinanceContractSign";
import FarmerFinanceRepayPlan from "../roles/farmer/pages/FinanceRepayPlan";
import FarmerFinanceRepay from "../roles/farmer/pages/FinanceRepay";
import FarmerFinanceEarlyRepay from "../roles/farmer/pages/FinanceEarlyRepay";
import FarmerFinanceMatchIntro from "../roles/farmer/pages/FinanceMatch/MatchIntro";
import FarmerFinanceMatchCandidates from "../roles/farmer/pages/FinanceMatch/MatchCandidates";
import FarmerFinanceMatchDetail from "../roles/farmer/pages/FinanceMatch/MatchDetail";
import FarmerFinanceMatchCreate from "../roles/farmer/pages/FinanceMatch/MatchCreate";
import FarmerFinanceMatchResult from "../roles/farmer/pages/FinanceMatch/MatchResult";
import FarmerFinanceDetail from "../roles/farmer/pages/FinanceDetail";
// Trade 子页面
import FarmerOrderDetail from "../roles/farmer/pages/OrderDetail";
import FarmerOrderShip from "../roles/farmer/pages/OrderShip";
import FarmerRefunds from "../roles/farmer/pages/Refunds";
import FarmerOrderBatchShip from "../roles/farmer/pages/OrderBatchShip";
import FarmerOrderPrintLabels from "../roles/farmer/pages/OrderPrintLabels";
// Profile 子页面
import FarmerProfileEdit from "../roles/farmer/pages/ProfileEdit";
import FarmerWalletPanel from "../roles/farmer/pages/WalletPanel";
import FarmerBankCardManage from "../roles/farmer/pages/BankCardManage";
import FarmerReportPanel from "../roles/farmer/pages/ReportPanel";
import FarmerFeedback from "../roles/farmer/pages/Feedback";
import FarmerNotificationCenter from "../roles/farmer/pages/NotificationCenter";
import FarmerSettings from "../roles/farmer/pages/Settings";
import FarmerShippingAddressManage from "../roles/farmer/pages/ShippingAddressManage";
import FarmerKnowledgeFavorite from "../roles/farmer/pages/KnowledgeFavorite";
import FarmerQuestionAsk from "../roles/farmer/pages/QuestionAsk";
import FarmerAppointmentBook from "../roles/farmer/pages/AppointmentBook";

type FarmerAppProps = {
  initialTab?: string;
  initialSubRoute?: string;
};

export default function FarmerApp({ initialTab = "home", initialSubRoute }: FarmerAppProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [activeSubRoute, setActiveSubRoute] = useState<string | null>(initialSubRoute || null);

  useEffect(() => {
    const unsubscribeNav = onNavigationChange((tab) => {
      setActiveTab(tab);
      setActiveSubRoute(null); // 切换Tab时重置子路由
    });
    const unsubscribeSub = onSubRouteChange((tab, subRoute) => {
      if (tab === activeTab) {
        setActiveSubRoute(subRoute);
      }
    });
    return () => {
      unsubscribeNav();
      unsubscribeSub();
    };
  }, [activeTab]);

  const renderContent = () => {
    // 如果有子路由，优先渲染子路由
    if (activeSubRoute) {
      return renderSubRoute(activeTab, activeSubRoute);
    }

    // 否则渲染主Panel
    switch (activeTab) {
      case "home":
        return <FarmerHome />;
      case "finance":
        return <FarmerFinancePanel />;
      case "expert":
        return renderExpertSubRoute("overview");
      case "trade":
        return <FarmerProductList />;
      case "profile":
        return <FarmerProfilePanel />;
      case "cart":
        return <FarmerOrders />;
      default:
        return <FarmerHome />;
    }
  };

  const renderSubRoute = (tab: string, subRoute: string) => {
    switch (tab) {
      case "finance":
        return renderFinanceSubRoute(subRoute);
      case "trade":
        return renderTradeSubRoute(subRoute);
      case "expert":
        return renderExpertSubRoute(subRoute);
      case "profile":
        return renderProfileSubRoute(subRoute);
      default:
        return null;
    }
  };

  const renderFinanceSubRoute = (subRoute: string) => {
    // 解析子路由，支持参数（如 detail?id=xxx）
    const [route, params] = subRoute.split("?");
    const paramMap: Record<string, string> = {};
    if (params) {
      params.split("&").forEach((p) => {
        const [key, value] = p.split("=");
        paramMap[key] = value;
      });
    }

    switch (route) {
      case "list":
        return <FarmerFinancePanel />;
      case "apply":
        return <FarmerFinanceApply />;
      case "detail":
        return <FarmerFinanceDetail />;
      case "progress":
        return <FarmerFinanceProgress />;
      case "contract-sign":
        return <FarmerFinanceContractSign />;
      case "repay-plan":
        return <FarmerFinanceRepayPlan />;
      case "repay":
        return <FarmerFinanceRepay />;
      case "early-repay":
        return <FarmerFinanceEarlyRepay />;
      case "match":
        return <FarmerFinanceMatchIntro />;
      case "match/candidates":
        return <FarmerFinanceMatchCandidates />;
      case "match/detail":
        return <FarmerFinanceMatchDetail />;
      case "match/create":
        return <FarmerFinanceMatchCreate />;
      case "match/result":
        return <FarmerFinanceMatchResult />;
      default:
        return <FarmerFinancePanel />;
    }
  };

  const renderTradeSubRoute = (subRoute: string) => {
    const [route, params] = subRoute.split("?");
    const paramMap: Record<string, string> = {};
    if (params) {
      params.split("&").forEach((p) => {
        const [key, value] = p.split("=");
        paramMap[key] = value;
      });
    }

    switch (route) {
      case "products":
        return <FarmerProductList />;
      case "dashboard":
        return <FarmerProductDashboard />;
      case "orders":
        return <FarmerOrders />;
      case "order-detail":
        return <FarmerOrderDetail />;
      case "ship":
        return <FarmerOrderShip />;
      case "batch-ship":
        return <FarmerOrderBatchShip />;
      case "print-labels":
        return <FarmerOrderPrintLabels />;
      case "refunds":
        return <FarmerRefunds />;
      default:
        return <FarmerProductList />;
    }
  };

  const renderProfileSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "overview":
        return <FarmerProfilePanel />;
      case "edit":
        return <FarmerProfileEdit />;
      case "wallet":
        return <FarmerWalletPanel />;
      case "bank-card":
        return <FarmerBankCardManage />;
      case "report":
        return <FarmerReportPanel />;
      case "feedback":
        return <FarmerFeedback />;
      case "notifications":
        return <FarmerNotificationCenter />;
      case "settings":
        return <FarmerSettings />;
      case "shipping-address":
        return <FarmerShippingAddressManage />;
      default:
        return <FarmerProfilePanel />;
    }
  };

  const renderExpertSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "overview":
        return <FarmerExpertPanel />;
      case "question/ask":
        return <FarmerQuestionAsk />;
      case "appointment/book":
        return <FarmerAppointmentBook />;
      case "knowledge/favorite":
        return <FarmerKnowledgeFavorite />;
      default:
        return <FarmerExpertPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="pt-20">{renderContent()}</main>
      <Toaster />
    </div>
  );
}
