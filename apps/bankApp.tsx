import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import BankDashboardPage from "../roles/bank/pages/Dashboard";
import BankFinancePanel from "../roles/bank/pages/BankFinancePanel";
import BankExpertPanel from "../roles/bank/pages/BankExpertPanel";
import BankRiskDashboard from "../roles/bank/pages/RiskDashboard";
import BankProfilePanel from "../roles/bank/pages/BankProfilePanel";
import BankAppApproval from "../roles/bank/pages/AppApproval";
import { onNavigationChange } from "../utils/navigationEvents";
import { onSubRouteChange } from "../utils/subRouteNavigation";
// Finance 子页面
import BankLoanProducts from "../roles/bank/pages/LoanProducts";
import BankApprovalDetail from "../roles/bank/pages/BankApprovalDetail";
import BankScoringCard from "../roles/bank/pages/BankScoringCard";
import BankDisbursement from "../roles/bank/pages/BankDisbursement";
import BankPostLoan from "../roles/bank/pages/PostLoan";
import BankReconciliation from "../roles/bank/pages/BankReconciliation";
import BankContractGenerate from "../roles/bank/pages/ContractGenerate";
import BankOverdueAlert from "../roles/bank/pages/OverdueAlert";
import BankApplicationDownload from "../roles/bank/pages/ApplicationDownload";

type BankAppProps = {
  initialTab?: string;
  initialSubRoute?: string;
};

export default function BankApp({ initialTab = "home", initialSubRoute }: BankAppProps) {
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
        return <BankDashboardPage />;
      case "finance":
        return <BankFinancePanel />;
      case "expert":
        return <BankExpertPanel />;
      case "trade":
        return <BankRiskDashboard />;
      case "profile":
        return <BankProfilePanel />;
      case "cart":
        return <BankAppApproval />;
      default:
        return <BankDashboardPage />;
    }
  };

  const renderSubRoute = (tab: string, subRoute: string) => {
    switch (tab) {
      case "finance":
        return renderFinanceSubRoute(subRoute);
      default:
        return null;
    }
  };

  const renderFinanceSubRoute = (subRoute: string) => {
    const [route, params] = subRoute.split("?");
    switch (route) {
      case "products":
        return <BankLoanProducts />;
      case "approval/list":
        return <BankAppApproval />;
      case "approval/detail":
        return <BankApprovalDetail />;
      case "scoring":
        return <BankScoringCard />;
      case "disbursement":
        return <BankDisbursement />;
      case "post-loan":
        return <BankPostLoan />;
      case "reconciliation":
        return <BankReconciliation />;
      case "contract":
        return <BankContractGenerate />;
      case "overdue":
        return <BankOverdueAlert />;
      case "download":
        return <BankApplicationDownload />;
      default:
        return <BankFinancePanel />;
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


