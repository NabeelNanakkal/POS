// assets
import {
  IconLayoutDashboard,
  IconDeviceGamepad2,
  IconBuildingStore,
  IconUsers,
  IconPackage,
  IconArchive,
  IconReceipt2,
  IconReportAnalytics,
  IconDatabase,
  IconCategory,
  IconUserCircle,
  IconCreditCard,
  IconDiscount,
  IconBinaryTree,
  IconSettings,
  IconPlugConnected,
  IconCash,
  IconPrinter,
  IconBarcode
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
      url: '/pos/dashboard',
      icon: IconLayoutDashboard,
      permittedRoles: ['STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'admin-stores',
      title: 'Store Management',
      type: 'item',
      url: '/pos/stores',
      icon: IconBuildingStore,
      permittedRoles: ['STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'admin-employees',
      title: 'Employee Management',
      type: 'item',
      url: '/pos/employees',
      icon: IconUsers,
      permittedRoles: ['STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/pos/dashboard',
      icon: IconLayoutDashboard,
      permittedRoles: ['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'terminal',
      title: 'POS Terminal',
      type: 'item',
      url: '/pos/terminal',
      icon: IconDeviceGamepad2,
      permittedRoles: ['CASHIER'],
      breadcrumbs: false
    },
    {
      id: 'cash-management',
      title: 'Cash Management',
      type: 'item',
      url: '/pos/cash-management',
      icon: IconCash,
      permittedRoles: ['CASHIER', 'MANAGER', 'STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'barcode-print',
      title: 'Barcode Print',
      type: 'item',
      url: '/pos/barcode-print',
      icon: IconBarcode,
      permittedRoles: ['MANAGER', 'STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'shift',
      title: 'Shift Management',
      type: 'item',
      url: '/pos/shift',
      icon: IconReceipt2,
      permittedRoles: ['MANAGER'],
      breadcrumbs: false
    },
    {
      id: 'products',
      title: 'Product Management',
      type: 'item',
      url: '/pos/products',
      icon: IconPackage,
      permittedRoles: ['MANAGER', 'STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/pos/inventory',
      icon: IconArchive,
      permittedRoles: ['MANAGER', 'INVENTORY_MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/pos/reports',
      icon: IconReportAnalytics,
      permittedRoles: ['MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/pos/customers',
      icon: IconUserCircle,
      permittedRoles: ['MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'collapse',
      icon: IconSettings,
      permittedRoles: ['MANAGER', 'STORE_ADMIN'],
      children: [
        {
          id: 'categories',
          title: 'Categories',
          type: 'item',
          url: '/pos/settings/categories',
          icon: IconBinaryTree,
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'discounts',
          title: 'Discounts',
          type: 'item',
          url: '/pos/settings/discounts',
          icon: IconDiscount,
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'integrations',
          title: 'Integrations',
          type: 'item',
          url: '/pos/settings/integrations',
          icon: IconPlugConnected,
          permittedRoles: ['STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'printing',
          title: 'Printing',
          type: 'item',
          url: '/pos/settings/printing',
          icon: IconPrinter,
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default main;
