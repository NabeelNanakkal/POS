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
const StoreManagement = Loadable(lazy(() => import('views/admin/StoreManagement')));
const EmployeeManagement = Loadable(lazy(() => import('views/admin/EmployeeManagement')));
const AdminDashboard = Loadable(lazy(() => import('views/admin/AdminDashboard')));

import AuthGuard from './AuthGuard';

// ==============================|| POS ROUTING ||============================== //

const PosRoutes = {
  path: '/',
  errorElement: <ErrorFallback />,
  children: [
    {
      path: '/',
      element: (
        <AuthGuard>
          <PosLayout />
        </AuthGuard>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />
        },
        {
          path: 'pos',
          children: [
            {
              path: 'dashboard',
              element: <AuthGuard permittedRoles={['all']}><MainDashboard /></AuthGuard>
            },
            {
              path: 'terminal',
              element: <AuthGuard permittedRoles={['CASHIER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']}><PosTerminal /></AuthGuard>
            },
            {
              path: 'products',
              element: <AuthGuard permittedRoles={['MANAGER', 'ADMIN', 'SUPER_ADMIN']}><ProductManagement /></AuthGuard>
            },
            {
              path: 'inventory',
              element: <AuthGuard permittedRoles={['MANAGER', 'INVENTORY_MANAGER', 'ADMIN', 'SUPER_ADMIN']}><InventoryManagement /></AuthGuard>
            },
            {
              path: 'shift',
              element: <AuthGuard permittedRoles={['CASHIER', 'MANAGER', 'ADMIN', 'SUPER_ADMIN']}><ShiftManagement /></AuthGuard>
            },
            {
              path: 'reports',
              element: <AuthGuard permittedRoles={['MANAGER', 'ADMIN', 'SUPER_ADMIN']}><Reports /></AuthGuard>
            }
          ]
        },
        {
          path: 'admin',
          children: [
            {
              path: 'dashboard',
              element: <AuthGuard permittedRoles={['ADMIN', 'SUPER_ADMIN']}><AdminDashboard /></AuthGuard>
            },
            {
              path: 'stores',
              element: <AuthGuard permittedRoles={['ADMIN', 'SUPER_ADMIN']}><StoreManagement /></AuthGuard>
            },
            {
              path: 'employees',
              element: <AuthGuard permittedRoles={['ADMIN', 'SUPER_ADMIN']}><EmployeeManagement /></AuthGuard>
            }
          ]
        }
      ]
    }
  ]
};

export default PosRoutes;
