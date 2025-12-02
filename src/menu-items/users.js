// assets
import { IconDashboard } from '@tabler/icons-react';
import { generateMenuItems } from 'utils/generateMenuItems';
import { signupsMenuConfig } from 'views/MenuConfigs/signupsMenuConfig';

// constant

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const signups = {
  id: 'users',
  title: 'Users',
  type: 'group',
  permittedRoles: ["all"],
  children: generateMenuItems('signups', signupsMenuConfig),

};

export default signups;
