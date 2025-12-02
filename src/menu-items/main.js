// assets
import { IconLayoutDashboard , IconUser, IconUserCheck, IconUserQuestion, IconCircleCheck, IconCircleX } from '@tabler/icons-react';

// constant
// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'main',
  type: 'group',
  permittedRoles: ["all"],
  children: [
    // {
    //   id: 'home',
    //   title: 'Home',
    //   type: 'item',
    //   url: '/main/home',
    //   permittedRoles: ["all"],
    //   icon: IconHomeFilled,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'alarms',
    //   title: 'Alarms',
    //   type: 'item',
    //   url: '/main/alarms',
    //   permittedRoles: ["all"],
    //   icon: IconAlertTriangleFilled,
    //   breadcrumbs: false
    // },
    // Admin-only items
    {
      id: 'admin',
      title: 'Admin Dashboard',
      type: 'item',
      url: '/main/admin',
      permittedRoles: ['all'],
      icon: IconLayoutDashboard,
      breadcrumbs: false
    },
    {
      id: 'all-leads',
      title: 'All Leads',
      type: 'item',
      url: '/main/all-leads',
      permittedRoles: ['all'],
      icon: IconUserQuestion,
      breadcrumbs: false
    },
{
      id: 'team',
      title: 'Team',
      type: 'item',
      url: '/main/team',
      permittedRoles: ['all'],
      icon: IconUserQuestion,
      breadcrumbs: false
    },
    // Telecaller-only items
    {
      id: 'user',
      title: 'Dashboard',
      type: 'item',
      url: '/main/user',
      permittedRoles: ['all'],
      icon: IconUser,
      breadcrumbs: false
    },
    {
      id: 'assigned-leads',
      title: 'Assigned Leads',
      type: 'item',
      url: '/main/assigned-leads',
      permittedRoles: ['all'],
      icon: IconUserCheck,
      breadcrumbs: false
    },

  ]
};

export default dashboard;
