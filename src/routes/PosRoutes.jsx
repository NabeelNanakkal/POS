import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import PosLayout from 'layout/PosLayout';
import ErrorFallback from 'ui-component/ErrorFallback';

// render - POS Dashboard & Terminal
const MainDashboard = Loadable(lazy(() => import('views/cashier/MainDashboard')));
const PosTerminal = Loadable(lazy(() => import('views/cashier/PosTerminal')));
const ProductManagement = Loadable(lazy(() => import('views/cashier/ProductManagement')));
const InventoryManagement = Loadable(lazy(() => import('views/cashier/InventoryManagement')));
const ShiftManagement = Loadable(lazy(() => import('views/cashier/ShiftManagement')));
const Reports = Loadable(lazy(() => import('views/cashier/Reports')));

// ==============================|| POS ROUTING ||============================== //

const PosRoutes = {
  path: '/',
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/',
      element: <PosLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/pos/dashboard" replace />
        },
        {
          path: 'pos',
          children: [
            {
              path: 'dashboard',
              element: <MainDashboard />
            },
            {
              path: 'terminal',
              element: <PosTerminal />
            },
            {
              path: 'products',
              element: <ProductManagement />
            },
            {
              path: 'inventory',
              element: <InventoryManagement />
            },
            {
              path: 'shift',
              element: <ShiftManagement />
            },
            {
              path: 'reports',
              element: <Reports />
            }
          ]
        }
      ]
    }
  ]
};

export default PosRoutes;
