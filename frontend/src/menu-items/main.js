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
  IconBarcode,
  IconShield,
  IconChartInfographic,
  IconCalendarStats,
  IconBrandWhatsapp,
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
      module: 'dashboard',
      permittedRoles: ['MANAGER', 'CASHIER', 'INVENTORY_MANAGER', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'terminal',
      title: 'POS Terminal',
      type: 'item',
      url: '/pos/terminal',
      icon: IconDeviceGamepad2,
      module: 'orders',
      permittedRoles: ['CASHIER'],
      breadcrumbs: false
    },
    {
      id: 'cash-management',
      title: 'Cash Management',
      type: 'item',
      url: '/pos/cash-management',
      icon: IconCash,
      module: 'cash_management',
      permittedRoles: ['CASHIER', 'MANAGER', 'STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'barcode-print',
      title: 'Barcode Print',
      type: 'item',
      url: '/pos/barcode-print',
      icon: IconBarcode,
      module: 'products',
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
      module: 'products',
      permittedRoles: ['MANAGER', 'STORE_ADMIN'],
      breadcrumbs: false
    },
    {
      id: 'inventory',
      title: 'Inventory',
      type: 'item',
      url: '/pos/inventory',
      icon: IconArchive,
      module: 'inventory',
      permittedRoles: ['MANAGER', 'INVENTORY_MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'reports',
      title: 'Reports',
      type: 'item',
      url: '/pos/reports',
      icon: IconReportAnalytics,
      module: 'reports',
      permittedRoles: ['MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'zoho-reports',
      title: 'Zoho Reports',
      type: 'item',
      url: '/pos/zoho-reports',
      icon: IconChartInfographic,
      module: 'reports',
      permittedRoles: ['MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'daily-summary',
      title: 'Daily Summary',
      type: 'item',
      url: '/pos/daily-summary',
      icon: IconCalendarStats,
      module: 'reports',
      permittedRoles: ['MANAGER', 'STORE_ADMIN', 'ACCOUNTANT'],
      breadcrumbs: false
    },
    {
      id: 'customers',
      title: 'Customers',
      type: 'item',
      url: '/pos/customers',
      icon: IconUserCircle,
      module: 'customers',
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
          module: 'categories',
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'discounts',
          title: 'Discounts',
          type: 'item',
          url: '/pos/settings/discounts',
          icon: IconDiscount,
          module: 'discounts',
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'integrations',
          title: 'Integrations',
          type: 'item',
          url: '/pos/settings/integrations',
          icon: IconPlugConnected,
          module: 'integrations',
          permittedRoles: ['STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'printing',
          title: 'Printing',
          type: 'item',
          url: '/pos/settings/printing',
          icon: IconPrinter,
          module: 'settings',
          permittedRoles: ['MANAGER', 'STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'role-management',
          title: 'Role Management',
          type: 'item',
          url: '/pos/settings/role-management',
          icon: IconShield,
          permittedRoles: ['STORE_ADMIN'],
          breadcrumbs: false
        },
        {
          id: 'notification-settings',
          title: 'Notification Settings',
          type: 'item',
          url: '/pos/settings/notification-settings',
          icon: IconBrandWhatsapp,
          permittedRoles: ['STORE_ADMIN'],
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default main;
