import { lazy } from 'react';

// menu configration for common component---------------------
import { getUser } from 'utils/getUser';
import Loadable from 'ui-component/Loadable';
import ErrorFallback from 'ui-component/ErrorFallback';
import { filterRoutesByRole } from 'utils/filterRoutesByRole';
import { profileMenuConfig } from 'views/MenuConfigs/profileMenuConfig';
import { customersMenuConfig } from 'views/MenuConfigs/customersMenuConfig';
import { advancedMenuConfig } from 'views/MenuConfigs/advancedMenuConfig';
import { leadsMenuConfig } from 'views/MenuConfigs/leadsMenuConfig';
import TelecallerDashboard from 'views/dashboards/userDashboard';
import LeadsAssignedList from 'views/leads/userLeads';
import TeamMembers from 'views/team-members';

const CommonMenu = Loadable(lazy(() => import('views/commonMenu')));
// const Dashboard = Loadable(lazy(() => import('views/mainDashBoard')));

// fallback page----
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AdminDashboard = Loadable(lazy(() => import('views/dashboards/adminDashboard')));


// -----------------------------------------------

const generateChildRoutes = (configs) => {
  return Object.keys(configs).map((key) => ({
    path: configs[key]?.routerConfigs?.path,
    element: <CommonMenu menuConfig={configs[key]} />,
    permittedRoles: configs[key].permittedRoles
  }));
};

const MenuRoutes = {
  path: '/',
  errorElement: <ErrorFallback />,
  children: filterRoutesByRole(
    [
      {
        path: '/',
        element: <SamplePage error={true} />,
        permittedRoles: ['all']
      },

      {
        path: 'main',
        permittedRoles: ['all'],
        children: [
          {
            path: 'admin',
            element: <AdminDashboard />,
            // Admin routes: only PlatformAdmin and TenantAdmin
            permittedRoles: ['all']
          },
          {
            path: 'all-leads',
            element: <LeadsAssignedList />,
            permittedRoles: ['all']
          },
            {
            path: 'team',
            element: <TeamMembers />,
            permittedRoles: ['all']
          },
          {
            path: 'user',
            element: <TelecallerDashboard />,
            // Telecaller routes
            permittedRoles: ['all']
          },
          {
            path: 'assigned-leads',
            element: <LeadsAssignedList/>,
            permittedRoles: ['all']
          }
        ]
      },
      
      {
        // entities routes removed (legality-specific)
      },
      // {
      //   path: 'leads',
      //   permittedRoles: ['all'],
      //   children: generateChildRoutes(leadsMenuConfig)
      // },
      {
        path: 'profiles',
        // Profiles (and other management menus) are not visible to Telecaller
        permittedRoles: ['all', '!Telecaller'],
        children: generateChildRoutes(profileMenuConfig)
      },
      {
        path: 'customers',
        // Customers management hidden for Telecaller
        permittedRoles: ['all', '!Telecaller'],
        children: generateChildRoutes(customersMenuConfig)
      },
      {
        path: 'advanced',
        // Advanced menu hidden for Telecaller
        permittedRoles: ['all', '!Telecaller'],
        children: generateChildRoutes(advancedMenuConfig)
      },

      // route failing fall back
      {
        path: '*',
        element: <SamplePage error={true} name={'Page Not Found'} />,
        permittedRoles: ['all']
      }
    ],
    getUser()?.role
  )
};

export default MenuRoutes;
