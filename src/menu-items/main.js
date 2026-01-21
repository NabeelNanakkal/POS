// assets
import { 
  IconLayoutDashboard, 
  IconDeviceGamepad2, 
  IconBuildingStore, 
  IconUsers, 
  IconPackage, 
  IconArchive, 
  IconReceipt2, 
  IconReportAnalytics 
} from '@tabler/icons-react';

// ==============================|| POS MENU ITEMS ||============================== //

const main = {
  id: 'main',
  type: 'group',
  permittedRoles: ['all'],
  children: [
    {
      id: 'admin-dashboard',
      title: 'Admin Dashboard',
      type: 'item',
      url: '/admin/dashboard',
      icon: IconLayoutDashboard,
      permittedRoles: ['TenantAdmin'],
      breadcrumbs: false
    },
    {
      id: 'admin-stores',
      title: 'Store Management',
      type: 'item',
      url: '/admin/stores',
      icon: IconBuildingStore,
      permittedRoles: ['TenantAdmin'],
      breadcrumbs: false
    },
    {
      id: 'admin-employees',
      title: 'Employee Management',
      type: 'item',
      url: '/admin/employees',
      icon: IconUsers,
      permittedRoles: ['TenantAdmin'],
      breadcrumbs: false
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/pos/dashboard',
      icon: IconLayoutDashboard,
      permittedRoles: ['Manager', 'Cashier'],
      breadcrumbs: false
    },
    {
      id: 'terminal',
      title: 'POS Terminal',
      type: 'item',
      url: '/pos/terminal',
      icon: IconDeviceGamepad2,
      permittedRoles: ['Cashier', 'Manager'],
      breadcrumbs: false
    },
    {
      id: 'shift',
      title: 'Shift Management',
      type: 'item',
      url: '/pos/shift',
      icon: IconReceipt2,
      permittedRoles: ['Cashier', 'Manager'],
      breadcrumbs: false
    },
    {
      id: 'products',
      title: 'Product Management',
      type: 'item',
      url: '/pos/products',
      icon: IconPackage,
      permittedRoles: ['Manager'],
      breadcrumbs: false
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/pos/inventory',
      icon: IconArchive,
      permittedRoles: ['Manager'],
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/pos/reports',
      icon: IconReportAnalytics,
      permittedRoles: ['Manager', 'TenantAdmin'],
      breadcrumbs: false
    }
  ]
};

export default main;
