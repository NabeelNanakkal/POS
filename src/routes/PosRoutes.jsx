import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import PosLayout from 'layout/PosLayout';

// render - POS Dashboard & Terminal
const MainDashboard = Loadable(lazy(() => import('views/cashier/MainDashboard')));
const PosTerminal = Loadable(lazy(() => import('views/cashier/PosTerminal')));
const ProductManagement = Loadable(lazy(() => import('views/cashier/ProductManagement')));
const Reports = Loadable(lazy(() => import('views/cashier/Reports')));

// ==============================|| POS ROUTING ||============================== //

const PosRoutes = {
  path: '/',
  children: [
    // Consolidated POS Routes under PosLayout
    {
      path: '/pos',
      element: <PosLayout />,
      children: [
        {
          path: '', // /pos
          element: <Navigate to="/pos/dashboard" replace />
        },
        {
          path: 'dashboard', // /pos/dashboard
          element: <MainDashboard />
        },
        {
          path: 'terminal', // /pos/terminal
          element: <PosTerminal />
        },
        {
          path: 'products', // /pos/products
          element: <ProductManagement />
        },
        {
          path: 'reports', // /pos/reports
          element: <Reports />
        }
      ]
    }
  ]
};

export default PosRoutes;
