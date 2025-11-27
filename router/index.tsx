import { createBrowserRouter } from 'react-router-dom';
import Landing3DPage from '../components/Landing3DPage';
import RoleStationRoute from '../components/auth/RoleStationRoute';
import FarmerLayout from '../roles/farmer/FarmerLayout';
import BuyerLayout from '../roles/buyer/BuyerLayout';
import BankLayout from '../roles/bank/BankLayout';
import ExpertLayout from '../roles/expert/ExpertLayout';
import AdminLayout from '../roles/admin/AdminLayout';
import FarmerHome from '../roles/farmer/pages/Home';
import FarmerProductList from '../roles/farmer/pages/ProductList';
import ProductDashboard from '../roles/farmer/pages/ProductDashboard';
import ProductImport from '../roles/farmer/pages/ProductImport';
import FarmerOrders from '../roles/farmer/pages/Orders';
import FarmerFinance from '../roles/farmer/pages/Finance';
import FarmerWallet from '../roles/farmer/pages/Wallet';
import FarmerReport from '../roles/farmer/pages/Report';
import FinanceProgress from '../roles/farmer/pages/FinanceProgress';
import FinanceEarlyRepay from '../roles/farmer/pages/FinanceEarlyRepay';
import FinanceContractSign from '../roles/farmer/pages/FinanceContractSign';
import FinanceList from '../roles/farmer/pages/FinanceList';
import FinanceDetail from '../roles/farmer/pages/FinanceDetail';
import MatchIntro from '../roles/farmer/pages/FinanceMatch/MatchIntro';
import MatchCandidates from '../roles/farmer/pages/FinanceMatch/MatchCandidates';
import MatchDetail from '../roles/farmer/pages/FinanceMatch/MatchDetail';
import MatchCreate from '../roles/farmer/pages/FinanceMatch/MatchCreate';
import MatchResult from '../roles/farmer/pages/FinanceMatch/MatchResult';
import BuyerHome from '../roles/buyer/pages/Home';
import BuyerProductList from '../roles/buyer/pages/ProductList';
import BuyerCart from '../roles/buyer/pages/Cart';
import BuyerOrders from '../roles/buyer/pages/Orders';
import BuyerDemand from '../roles/buyer/pages/Demand';
import BuyerCoupon from '../roles/buyer/pages/Coupon';
import BankDashboardPage from '../roles/bank/pages/Dashboard';
import BankAppApproval from '../roles/bank/pages/AppApproval';
import BankLoanProducts from '../roles/bank/pages/LoanProducts';
import BankPostLoan from '../roles/bank/pages/PostLoan';
import BankRiskDashboard from '../roles/bank/pages/RiskDashboard';
import ExpertDashboardPage from '../roles/expert/pages/Dashboard';
import ExpertQAList from '../roles/expert/pages/QAList';
import ExpertCalendarPage from '../roles/expert/pages/Calendar';
import ExpertKnowledge from '../roles/expert/pages/Knowledge';
import ExpertIncome from '../roles/expert/pages/Income';
import AdminDashboardPage from '../roles/admin/pages/Dashboard';
import AdminUserManage from '../roles/admin/pages/UserManage';
import AdminProductAudit from '../roles/admin/pages/ProductAudit';
import AdminOrderMonitor from '../roles/admin/pages/OrderMonitor';
import AdminContentAudit from '../roles/admin/pages/ContentAudit';
import AdminPermissionManage from '../roles/admin/pages/PermissionManage';
import FarmerRefunds from '../roles/farmer/pages/Refunds';
import AdminRefundDisputes from '../roles/admin/pages/RefundDisputes';
import StarGateApp from '../pages/StarGateApp';
import FarmerApp from '../apps/farmerApp';
import BuyerApp from '../apps/buyerApp';
import BankApp from '../apps/bankApp';
import ExpertApp from '../apps/expertApp';
import AdminApp from '../apps/adminApp';
import NotFound from '../components/NotFound';
import ExpertLiveStreamPage from '@/roles/expert/pages/ExpertLiveStreamPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing3DPage />,
  },
  {
    path: '/select-role',
    element: <RoleStationRoute />,
  },
  {
    path: '/app',
    element: <StarGateApp />,
  },
  {
    path: '/farmer-app',
    element: <FarmerApp />,
  },
  {
    path: '/buyer-app',
    element: <BuyerApp />,
  },
  {
    path: '/bank-app',
    element: <BankApp />,
  },
  {
    path: '/expert-app',
    element: <ExpertApp />,
  },
  {
    path: '/admin-app',
    element: <AdminApp />,
  },
  // 独立金融入口：按角色区分
  {
    path: '/finance-farmer',
    element: <FarmerApp initialTab="finance" />,
  },
  {
    path: '/finance-buyer',
    element: <BuyerApp initialTab="finance" />,
  },
  {
    path: '/finance-bank',
    element: <BankApp initialTab="finance" />,
  },
  {
    path: '/finance-expert',
    element: <ExpertApp initialTab="finance" />,
  },
  {
    path: '/finance-admin',
    element: <AdminApp initialTab="finance" />,
  },
  {
    path: '/farmer',
    element: <FarmerLayout />,
    children: [
      {
        index: true,
        element: <FarmerHome />,
  },
      { path: 'products', element: <FarmerProductList /> },
      { path: 'products/dashboard', element: <ProductDashboard /> },
      { path: 'products/import', element: <ProductImport /> },
      { path: 'orders', element: <FarmerOrders /> },
      { path: 'refunds', element: <FarmerRefunds /> },
      { path: 'finance', element: <FarmerFinance /> },
      { path: 'finance/list', element: <FinanceList /> },
      { path: 'finance/detail/:id', element: <FinanceDetail /> },
      { path: 'finance/progress', element: <FinanceProgress /> },
      { path: 'finance/early-repay', element: <FinanceEarlyRepay /> },
      { path: 'finance/contract-sign', element: <FinanceContractSign /> },
      { path: 'finance/match', element: <MatchIntro /> },
      { path: 'finance/match/candidates', element: <MatchCandidates /> },
      { path: 'finance/match/detail/:id', element: <MatchDetail /> },
      { path: 'finance/match/create', element: <MatchCreate /> },
      { path: 'finance/match/result', element: <MatchResult /> },
      { path: 'wallet', element: <FarmerWallet /> },
      { path: 'report', element: <FarmerReport /> },
    ],
  },
  {
    path: '/buyer',
    element: <BuyerLayout />,
    children: [
      {
        index: true,
        element: <BuyerHome />,
      },
      { path: 'products', element: <BuyerProductList /> },
      { path: 'cart', element: <BuyerCart /> },
      { path: 'orders', element: <BuyerOrders /> },
      { path: 'demand', element: <BuyerDemand /> },
      { path: 'coupon', element: <BuyerCoupon /> },
    ],
  },
  {
    path: '/bank',
    element: <BankLayout />,
    children: [
      { index: true, element: <BankDashboardPage /> },
      { path: 'approval', element: <BankAppApproval /> },
      { path: 'products', element: <BankLoanProducts /> },
      { path: 'post-loan', element: <BankPostLoan /> },
      { path: 'risk-dashboard', element: <BankRiskDashboard /> },
    ],
  },
  {
    path: '/expert',
    element: <ExpertLayout />,
    children: [
      { index: true, element: <ExpertDashboardPage /> },
      { path: 'qa', element: <ExpertQAList /> },
      { path: 'calendar', element: <ExpertCalendarPage /> },
      { path: 'knowledge', element: <ExpertKnowledge /> },
      { path: 'income', element: <ExpertIncome /> },
      {
        path: "live", // 对应 LiveStreamButton.tsx 中调用的 "live"
        element: <ExpertLiveStreamPage />, // 新增直播页面路由
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUserManage /> },
      { path: 'product-audit', element: <AdminProductAudit /> },
      { path: 'order-monitor', element: <AdminOrderMonitor /> },
      { path: 'content-audit', element: <AdminContentAudit /> },
      { path: 'permission', element: <AdminPermissionManage /> },
      { path: 'refund-disputes', element: <AdminRefundDisputes /> },
    ],
  },
  // 404 处理 - 必须放在最后
  {
    path: '*',
    element: <NotFound />,
  },
]);
