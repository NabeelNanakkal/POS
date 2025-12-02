import { IconTriangleSquareCircleFilled, IconUserFilled, IconChartCandleFilled, IconCreditCardFilled } from '@tabler/icons-react';
import { generateMenuItems } from 'utils/generateMenuItems';
import { profileMenuConfig } from 'views/MenuConfigs/profileMenuConfig';
import { customersMenuConfig } from 'views/MenuConfigs/customersMenuConfig';
import { advancedMenuConfig } from 'views/MenuConfigs/advancedMenuConfig';
import { leadsMenuConfig } from 'views/MenuConfigs/leadsMenuConfig';
// import { entitiesMenuConfig } from 'views/MenuConfigs/entitiesMenuConfig';

// menus------------
const menuGroup = {
  id: 'menuGroup2',
  //   title: 'Menu Group 2',
  type: 'group',
  permittedRoles: ['all'],
  children: [
    {
      id: 'leads',
      title: 'Leads',
      type: 'collapse',
      breadcrumbs: true,
      icon: IconTriangleSquareCircleFilled,
      permittedRoles: ['all'],
      children: generateMenuItems('leads', leadsMenuConfig)
    },
    {
      id: 'profiles',
      title: 'Profiles',
      type: 'collapse',
      breadcrumbs: true,
      icon: IconCreditCardFilled,
      permittedRoles: ['all'],
      children: generateMenuItems('profiles', profileMenuConfig)
    },

    {
      id: 'customers',
      title: 'Customers',
      type: 'collapse',
      breadcrumbs: true,
      icon: IconUserFilled,
      permittedRoles: ['all'],
      children: generateMenuItems('customers', customersMenuConfig)
    },
    {
      id: 'adavanced',
      title: 'Adavanced Features',
      type: 'collapse',
      breadcrumbs: true,
      icon: IconChartCandleFilled,
      permittedRoles: ['all'],
      children: generateMenuItems('advanced', advancedMenuConfig)
    },
  ]
};

export default menuGroup;
