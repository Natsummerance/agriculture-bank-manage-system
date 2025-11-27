import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import ExpertDashboardPage from "../roles/expert/pages/Dashboard";
import ExpertFinancePanel from "../roles/expert/pages/ExpertFinancePanel";
import ExpertQAList from "../roles/expert/pages/QAList";
import ExpertKnowledge from "../roles/expert/pages/Knowledge";
import ExpertKnowledgeDetail from "../roles/expert/pages/KnowledgeDetail";
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
// Profile 子页面
import ExpertProfileEdit from "../roles/expert/pages/ProfileEdit";
import ExpertNotificationCenter from "../roles/expert/pages/NotificationCenter";
import ExpertBankCardManage from "../roles/expert/pages/BankCardManage";

//直播
import ExpertLiveStreamPage from "../roles/expert/pages/ExpertLiveStreamPage"; 

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
    
    // 关键修复：确保能接收跨 Tab 的子路由事件（例如从 home/dashboard 跳转到 expert/live）
    const unsubscribeSub = onSubRouteChange((tab, subRoute) => {
      console.log(`[ExpertApp] Received sub-route event: Tab=${tab}, SubRoute=${subRoute}`);
      
      if (tab === 'expert') { 
        // 只要是 'expert' 相关的子路由事件，就更新 activeTab 和 activeSubRoute
        setActiveTab(tab); 
        setActiveSubRoute(subRoute);
      } else if (tab === activeTab) {
        // 如果事件是当前 Tab 内部的切换
        setActiveSubRoute(subRoute);
      }
    });

    return () => {
      unsubscribeNav();
      unsubscribeSub();
    };
  }, []);

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
    // subRoute 可能是 "live" 或 "live/join?appointmentId=1"
    const [route, params] = subRoute.split("?"); 
    
    switch (route) {
      // 专家自己进入推流模式 (ExpertDashboardPage 上的按钮)
      case "live":
        return <ExpertLiveStreamPage mode="publish" />;
        
      // 农户或买家进入会议模式 (FarmerExpertPanel 上的按钮)
      case "live/join":
        // params 是 URL 参数字符串 (例如 "appointmentId=1")
        return <ExpertLiveStreamPage mode="join" params={params} />; 
        
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
      case "knowledge/list":
        return <ExpertKnowledge />;
      case "edit":
        return <ExpertArticleEdit />;
      case "detail":
        return <ExpertKnowledgeDetail />;
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
      case "overview":
        return <ExpertProfilePanel />;
      case "edit":
        return <ExpertProfileEdit />;
      case "qualification":
        return <ExpertQualificationUpload />;
      case "price":
        return <ExpertServicePrice />;
      case "farmer-review":
        return <ExpertFarmerReview />;
      case "notifications":
        return <ExpertNotificationCenter />;
      case "bank-card":
        return <ExpertBankCardManage />;
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


