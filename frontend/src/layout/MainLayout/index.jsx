import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import SvgIcon from '@mui/material/SvgIcon';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// project imports
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContentStyled from './MainContentStyled';
import Customization from '../Customization';
import Loader from 'components/Loader';
import Breadcrumbs from 'components/extended/Breadcrumbs';

import useConfig from 'hooks/use-config';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { state: { borderRadius }, miniDrawer } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;

  useEffect(() => {
    handlerDrawerOpen(!miniDrawer);
  }, [miniDrawer]);

  useEffect(() => {
    downMD && handlerDrawerOpen(false);
  }, [downMD]);

  // horizontal menu-list bar : drawer

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* header */}

      {downMD &&
        <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
          <Toolbar sx={{ p: 1.5 }}>
            <Header />
          </Toolbar>
        </AppBar>}

      {/* menu / drawer */}
      <Sidebar sidebarHidden={sidebarHidden} setSidebarHidden={setSidebarHidden} />
      
      {/* Floating Sidebar Toggle (Only when hidden) */}
      {sidebarHidden && (
        <Fab 
          color="secondary" 
          aria-label="show sidebar" 
          onClick={() => setSidebarHidden(false)}
          sx={{ 
            position: 'fixed', 
            bottom: 30, 
            left: 30, 
            zIndex: 1300,
            transition: 'all 0.3s ease',
            bgcolor: 'secondary.main',
            color: 'white',
            '&:hover': { bgcolor: 'secondary.dark' }
          }}
        >
          <ChevronRightIcon />
        </Fab>
      )}

      {/* main content */}
      <MainContentStyled {...{ borderRadius, open: drawerOpen }}>
        <Box sx={{ ...{ px: 0,py:4 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* breadcrumb */}
          <Breadcrumbs />
          <Outlet />
          <Footer />
        </Box>
      </MainContentStyled>
      <Customization />
    </Box>
  );
}
