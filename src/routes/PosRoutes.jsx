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

// Super Admin Pages
const SuperAdminDashboard = Loadable(lazy(() => import('views/superAdmin/SuperAdminDashboard')));

// Master Data Pages
const Categories = Loadable(lazy(() => import('views/cashier/Categories')));
const Customers = Loadable(lazy(() => import('views/cashier/Customers')));
const PaymentMethods = Loadable(lazy(() => import('views/cashier/PaymentMethods')));
const Discounts = Loadable(lazy(() => import('views/cashier/Discounts')));

import AuthGuard from './AuthGuard';

// ==============================|| POS ROUTING ||============================== //

// Dashboard Wrapper for Role-based redirection
const DashboardWrapper = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user?.role?.toUpperCase() || '';
  // Show Admin Dashboard for any Admin role
  const isAnyAdmin = userRole === 'SUPER_ADMIN' || userRole === 'STORE_ADMIN' || userRole === 'TENANTADMIN';
  
  return isAnyAdmin ? <AdminDashboard /> : <MainDashboard />;
};

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
          path: 'pos/:storeCode',
          children: [
            {
              path: 'dashboard',
              element: <AuthGuard permittedRoles={['all']}><DashboardWrapper /></AuthGuard>
            },
            {
              path: 'terminal',
              element: <AuthGuard permittedRoles={['CASHIER', 'MANAGER', 'STORE_ADMIN']}><PosTerminal /></AuthGuard>
            },
            {
              path: 'products',
              element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><ProductManagement /></AuthGuard>
            },
            {
              path: 'inventory',
              element: <AuthGuard permittedRoles={['MANAGER', 'INVENTORY_MANAGER', 'STORE_ADMIN']}><InventoryManagement /></AuthGuard>
            },
            {
              path: 'shift',
              element: <AuthGuard permittedRoles={['CASHIER', 'MANAGER', 'STORE_ADMIN']}><ShiftManagement /></AuthGuard>
            },
            {
              path: 'customers',
              element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><Customers /></AuthGuard>
            },
            {
              path: 'stores',
              element: <AuthGuard permittedRoles={['STORE_ADMIN']}><StoreManagement /></AuthGuard>
            },
            {
              path: 'employees',
              element: <AuthGuard permittedRoles={['STORE_ADMIN']}><EmployeeManagement /></AuthGuard>
            },
            {
              path: 'settings',
              children: [
                {
                  path: 'categories',
                  element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><Categories /></AuthGuard>
                },
                {
                  path: 'payment-methods',
                  element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><PaymentMethods /></AuthGuard>
                },
                {
                  path: 'discounts',
                  element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><Discounts /></AuthGuard>
                }
              ]
            },
            {
              path: 'reports',
              element: <AuthGuard permittedRoles={['MANAGER', 'STORE_ADMIN']}><Reports /></AuthGuard>
            }
          ]
        },
        {
          path: 'super-admin',
          children: [
            {
              path: 'dashboard',
              element: <AuthGuard permittedRoles={['SUPER_ADMIN']}><SuperAdminDashboard /></AuthGuard>
            }
          ]
        }
      ]
    }
  ]
};

export default PosRoutes;
