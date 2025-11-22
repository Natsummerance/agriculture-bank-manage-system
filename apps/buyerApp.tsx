import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation";
import { Toaster } from "../components/ui/sonner";
import BuyerHome from "../roles/buyer/pages/Home";
import BuyerFinancePanel from "../roles/buyer/pages/BuyerFinancePanel";
import BuyerExpertPanel from "../roles/buyer/pages/BuyerExpertPanel";
import BuyerProductList from "../roles/buyer/pages/ProductList";
import BuyerProfilePanel from "../roles/buyer/pages/BuyerProfilePanel";
import BuyerCart from "../roles/buyer/pages/Cart";
import BuyerOrders from "../roles/buyer/pages/Orders";
import { onNavigationChange } from "../utils/navigationEvents";
import { onSubRouteChange } from "../utils/subRouteNavigation";
// Trade 子页面
import BuyerDemand from "../roles/buyer/pages/Demand";
import BuyerMyDemands from "../roles/buyer/pages/MyDemands";
import BuyerDemandQuotes from "../roles/buyer/pages/DemandQuotes";
import BuyerProductDetail from "../roles/buyer/pages/ProductDetail";
import BuyerProductCompare from "../roles/buyer/pages/ProductCompare";
import BuyerRefundProgress from "../roles/buyer/pages/RefundProgress";
import BuyerProductReview from "../roles/buyer/pages/ProductReview";
import BuyerAddressManage from "../roles/buyer/pages/AddressManage";
import BuyerCouponInvite from "../roles/buyer/pages/CouponInvite";
import { navigateToSubRoute } from "../utils/subRouteNavigation";

type BuyerAppProps = {
  initialTab?: string;
  initialSubRoute?: string;
};

export default function BuyerApp({ initialTab = "home", initialSubRoute }: BuyerAppProps) {
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
        return <BuyerHome />;
      case "finance":
        return <BuyerFinancePanel />;
      case "expert":
        return <BuyerExpertPanel />;
      case "trade":
        return <BuyerProductList />;
      case "profile":
        return <BuyerProfilePanel />;
      case "cart":
        return <BuyerCart />;
      default:
        return <BuyerHome />;
    }
  };

  const renderSubRoute = (tab: string, subRoute: string) => {
    switch (tab) {
      case "trade":
        return renderTradeSubRoute(subRoute);
      case "profile":
        return renderProfileSubRoute(subRoute);
      default:
        return null;
    }
  };

  const renderTradeSubRoute = (subRoute: string) => {
    const [route, params] = subRoute.split("?");
    switch (route) {
      case "products":
        return <BuyerProductList />;
      case "product/detail":
        return <BuyerProductDetail />;
      case "product/compare":
        return <BuyerProductCompare />;
      case "product/review":
        return <BuyerProductReview />;
      case "order/refund-progress":
        return <BuyerRefundProgress />;
      case "demand/create":
        return <BuyerDemand />;
      case "demand/list":
        return <BuyerMyDemands />;
      case "demand/quotes":
        return <BuyerDemandQuotes />;
      case "demand/detail":
        return <BuyerMyDemands />;
      default:
        return <BuyerProductList />;
    }
  };

  const renderProfileSubRoute = (subRoute: string) => {
    const [route] = subRoute.split("?");
    switch (route) {
      case "address":
        return <BuyerAddressManage />;
      case "invite":
        return <BuyerCouponInvite />;
      default:
        return <BuyerProfilePanel />;
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


