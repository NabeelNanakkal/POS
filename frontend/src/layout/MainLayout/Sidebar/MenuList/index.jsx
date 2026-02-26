import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { filterMenuByRole } from 'utils/filterMenuByRole';
import { getUser } from 'utils/getUser';
import { useGetMenuMaster } from 'api/menu';
import { selectPermissions } from 'container/permission/slice';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const user = getUser();
  const role = user?.role || '';
  const permissions = useSelector(selectPermissions);

  if (import.meta.env.DEV) console.debug('[MenuList] user:', user, 'role:', role, 'menuMaster:', menuMaster);

  const filteredItems = useMemo(() => {
    const items = filterMenuByRole(menuItem, role, permissions);
    if (import.meta.env.DEV) console.debug('[MenuList] filteredItems:', items);
    return items;
  }, [role, permissions, menuMaster]);

  const navItems = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>
      {navItems}
    </Box>
  );
};

export default MenuList;
