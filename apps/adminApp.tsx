import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import AdminDashboardPage from "../roles/admin/pages/Dashboard";
import AdminFinancePanel from "../roles/admin/pages/AdminFinancePanel";
import AdminExpertPanel from "../roles/admin/pages/AdminExpertPanel";
import AdminProductAudit from "../roles/admin/pages/ProductAudit";
import AdminProfilePanel from "../roles/admin/pages/AdminProfilePanel";
import AdminOrderMonitor from "../roles/admin/pages/OrderMonitor";
import { onNavigationChange } from "../utils/navigationEvents";
import { onSubRouteChange } from "../utils/subRouteNavigation";
// Admin 子页面
import AdminContentAudit from "../roles/admin/pages/ContentAudit";
import AdminExpertAudit from "../roles/admin/pages/ExpertAudit";
import AdminOperationLog from "../roles/admin/pages/OperationLog";
import AdminPermissionManage from "../roles/admin/pages/PermissionManage";
import AdminSystemConfig from "../roles/admin/pages/SystemConfig";
import AdminBannerManage from "../roles/admin/pages/BannerManage";
import AdminCouponIssue from "../roles/admin/pages/CouponIssue";
import AdminGrayRelease from "../roles/admin/pages/GrayRelease";
// Profile 子页面
import AdminProfileEdit from "../roles/admin/pages/ProfileEdit";
import AdminNotificationCenter from "../roles/admin/pages/NotificationCenter";

type AdminAppProps = {
  initialTab?: string;
  initialSubRoute?: string;
};

export default function AdminApp({ initialTab = "home", initialSubRoute }: AdminAppProps) {
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
        return <AdminDashboardPage />;
      case "finance":
        return <AdminFinancePanel />;
      case "expert":
        return <AdminExpertPanel />;
      case "trade":
        return <AdminProductAudit />;
      case "profile":
        return <AdminProfilePanel />;
      case "cart":
        return <AdminOrderMonitor />;
      default:
        return <AdminDashboardPage />;
    }
  };

  const renderSubRoute = (tab: string, subRoute: string) => {
    switch (tab) {
      case "expert":
        return renderExpertSubRoute(subRoute);
      case "trade":
        return renderTradeSubRoute(subRoute);
      case "profile":
        return renderProfileSubRoute(subRoute);
      case "home":
        return renderHomeSubRoute(subRoute);
      default:
        return null;
    }
  };

  const renderExpertSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "content":
        return <AdminContentAudit />;
      case "expert":
        return <AdminExpertAudit />;
      default:
        return <AdminExpertPanel />;
    }
  };

  const renderTradeSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "product":
        return <AdminProductAudit />;
      default:
        return <AdminProductAudit />;
    }
  };

  const renderProfileSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "overview":
        return <AdminProfilePanel />;
      case "edit":
        return <AdminProfileEdit />;
      case "permission":
        return <AdminPermissionManage />;
      case "log":
        return <AdminOperationLog />;
      case "config":
        return <AdminSystemConfig />;
      case "notifications":
        return <AdminNotificationCenter />;
      default:
        return <AdminProfilePanel />;
    }
  };

  const renderHomeSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "banner":
        return <AdminBannerManage />;
      case "coupon":
        return <AdminCouponIssue />;
      case "gray":
        return <AdminGrayRelease />;
      default:
        return <AdminDashboardPage />;
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


