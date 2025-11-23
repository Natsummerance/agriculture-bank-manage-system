import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import ExpertDashboardPage from "../roles/expert/pages/Dashboard";
import ExpertFinancePanel from "../roles/expert/pages/ExpertFinancePanel";
import ExpertQAList from "../roles/expert/pages/QAList";
import ExpertKnowledge from "../roles/expert/pages/Knowledge";
import ExpertProfilePanel from "../roles/expert/pages/ExpertProfilePanel";
import { onNavigationChange } from "../utils/navigationEvents";
import { onSubRouteChange } from "../utils/subRouteNavigation";
// Expert 子页面
import ExpertCalendarPage from "../roles/expert/pages/Calendar";
import ExpertAppointmentManage from "../roles/expert/pages/AppointmentManage";
import ExpertQADetail from "../roles/expert/pages/QADetail";
import ExpertArticleEdit from "../roles/expert/pages/ArticleEdit";
import ExpertIncomePanel from "../roles/expert/pages/ExpertIncomePanel";
import ExpertQualificationUpload from "../roles/expert/pages/QualificationUpload";
import ExpertServicePrice from "../roles/expert/pages/ServicePrice";
import ExpertFarmerReview from "../roles/expert/pages/FarmerReview";

type ExpertAppProps = {
  initialTab?: string;
  initialSubRoute?: string;
};

export default function ExpertApp({ initialTab = "home", initialSubRoute }: ExpertAppProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [activeSubRoute, setActiveSubRoute] = useState<string | null>(initialSubRoute || null);

  useEffect(() => {
    const unsubscribeNav = onNavigationChange((tab) => {
      setActiveTab(tab);
      setActiveSubRoute(null);
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
    if (activeSubRoute) {
      return renderSubRoute(activeTab, activeSubRoute);
    }

    switch (activeTab) {
      case "home":
        return <ExpertDashboardPage />;
      case "finance":
        return <ExpertIncomePanel />;
      case "expert":
        return <ExpertQAList />;
      case "trade":
        return <ExpertKnowledge />;
      case "profile":
        return <ExpertProfilePanel />;
      case "cart":
      default:
        return <ExpertDashboardPage />;
    }
  };

  const renderSubRoute = (tab: string, subRoute: string) => {
    switch (tab) {
      case "expert":
        return renderExpertSubRoute(subRoute);
      case "trade":
        return renderKnowledgeSubRoute(subRoute);
      case "finance":
        return renderFinanceSubRoute(subRoute);
      case "profile":
        return renderProfileSubRoute(subRoute);
      default:
        return null;
    }
  };

  const renderExpertSubRoute = (subRoute: string) => {
    const [route, params] = subRoute.split("?");
    switch (route) {
      case "qa/list":
        return <ExpertQAList />;
      case "qa/detail":
        return <ExpertQADetail />;
      case "calendar":
        return <ExpertCalendarPage />;
      case "appointment":
        return <ExpertAppointmentManage />;
      default:
        return <ExpertQAList />;
    }
  };

  const renderKnowledgeSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "list":
        return <ExpertKnowledge />;
      case "edit":
        return <ExpertArticleEdit />;
      case "detail":
        return <ExpertKnowledge />; // TODO: 创建详情页
      default:
        return <ExpertKnowledge />;
    }
  };

  const renderFinanceSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "income":
        return <ExpertIncomePanel />;
      default:
        return <ExpertIncomePanel />;
    }
  };

  const renderProfileSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "qualification":
        return <ExpertQualificationUpload />;
      case "price":
        return <ExpertServicePrice />;
      case "farmer-review":
        return <ExpertFarmerReview />;
      default:
        return <ExpertProfilePanel />;
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


