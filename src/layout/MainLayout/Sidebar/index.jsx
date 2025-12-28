import { memo, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';

import useMediaQuery from '@mui/material/useMediaQuery';
// import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
// import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuList from './MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

// assets
import { IconChevronLeft, IconChevronRight, IconMenu2, IconSettingsFilled, IconX } from '@tabler/icons-react';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useTheme } from '@emotion/react';
import Typography from '@mui/material/Typography'

// ==============================|| SIDEBAR DRAWER ||============================== //

function Sidebar({ sidebarHidden, setSidebarHidden }) {
  if (sidebarHidden) return null;

  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { state: { miniDrawer }, mode } = useConfig();
  const theme = useTheme();

  const logo = useMemo(
    () => (
      <Box sx={{
        display: 'flex',
        px: drawerOpen ? 2 : 1,
        py: 0,
        columnGap: 1,
        alignItems: "center",
        minHeight: "60px",
        position: 'sticky',
        top: 0,
        bgcolor: theme.palette.grey[50],
        zIndex: 10,
        justifyContent: "space-between"
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, overflow: 'hidden' }}>
          {drawerOpen && <LogoSection />}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'flex-end', flexShrink: 0 }}>
          <Avatar
            variant="rounded"
            sx={{
              height: "24px",
              width: "24px",
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: 'background.paper',
              color: 'error.main',
              borderRadius: 1.5,
              '&:hover': {
                bgcolor: 'error.lighter',
                color: 'error.dark'
              },
              boxShadow: `1px 3px 5px ${theme.palette.grey[100]}`
            }}
            onClick={() => setSidebarHidden(true)}
            color="inherit"
          >
             <IconX stroke={2} size={16} />
          </Avatar>

        <Avatar
          variant="rounded"
          sx={{
            height: "24px",
            width: "24px",
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
    
            transition: 'all .2s ease-in-out',
            bgcolor: 'background.paper',
            color: 'secondary.dark',
            borderRadius: 10,
            '&:hover': {
              bgcolor: 'secondary.light',
              // color: 'secondary.light'
            },
            boxShadow: `1px 3px 5px ${theme.palette.grey[100]}`
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
          color="inherit"

        >
          {/* <IconMenu2 stroke={1.5} size="20px" /> */}

          {drawerOpen ? <IconChevronLeft stroke={2} size={18} /> : <IconChevronRight stroke={2} size={18} />}


        </Avatar>
        </Box>
      </Box>
    ),
    [drawerOpen, theme, setSidebarHidden]
  );

  const footer = useMemo(
    () => (
      <Box sx={{
        display: 'flex',
        px: 2,
        py: 0,
        columnGap: 1.5,
        alignItems: "center",
        minHeight: "60px",
        position: 'sticky',
        bottom: 0,

        bgcolor: theme.palette.grey[100],
        zIndex: 10,
        borderTop: `1px solid ${theme.palette.divider}`
      }}>
        {/* Replace this with your UserProfile section */}
        {drawerOpen && <Box sx={{ flex: 1 }}> <Typography variant="button" color={theme.palette.grey[500]}>User Profile</Typography> </Box>}

        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            bgcolor: 'secondary.light',
            color: 'secondary.dark',
            '&:hover': {
              bgcolor: 'secondary.dark',
              color: 'secondary.light'
            }
          }}
          color="inherit"
        >
          <IconSettingsFilled stroke={1.5} size="20px" />
        </Avatar>
      </Box>
    ),
    [drawerOpen, theme]
  );

  const drawer = useMemo(() => {
    let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '0px' };
    if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '0px' };

    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Fixed Header */}
        {logo}

        {/* Scrollable Menu Area */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {downMD ? (
            <Box sx={drawerSX}>
              <MenuList />
            </Box>
          ) : (
            <PerfectScrollbar style={{ height: '100%', ...drawerSX }}>
              <MenuList />
            </PerfectScrollbar>
          )}
        </Box>

        {/* Fixed Footer */}
        {footer}
      </Box>
    );
  }, [downMD, drawerOpen, mode, logo, footer]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          sx={{
            '& .MuiDrawer-paper': {
              mt: downMD ? 0 : 6,
              zIndex: 1099,
              width: drawerWidth,
              background: theme.palette.grey[75],
              color: 'text.primary',
              borderRight: 'none',
              height: 'auto',
              minHeight: "100vh"
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(Sidebar);