import { createBrowserRouter, Navigate } from 'react-router-dom';
import PlanetPage from '../pages/PlanetPage';
import StationPage from '../pages/StationPage';
import FarmerLayout from '../roles/farmer/FarmerLayout';
import BuyerLayout from '../roles/buyer/BuyerLayout';
import BankLayout from '../roles/bank/BankLayout';
import ExpertLayout from '../roles/expert/ExpertLayout';
import AdminLayout from '../roles/admin/AdminLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/planet" replace />,
  },
  {
    path: '/planet',
    element: <PlanetPage />,
  },
  {
    path: '/station/:role',
    element: <StationPage />,
  },
  {
    path: '/farmer/*',
    element: <FarmerLayout />,
  },
  {
    path: '/buyer/*',
    element: <BuyerLayout />,
  },
  {
    path: '/bank/*',
    element: <BankLayout />,
  },
  {
    path: '/expert/*',
    element: <ExpertLayout />,
  },
  {
    path: '/admin/*',
    element: <AdminLayout />,
  },
]);
