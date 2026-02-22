import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import useConfig from 'hooks/use-config';

// assets
import User1 from 'assets/images/users/user-round.svg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { userLogOut } from 'container/auth/slice';
import { getUser } from 'utils/getUser';
import { closeShift } from 'container/shift/slice';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';
import CloseIcon from '@mui/icons-material/Close';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {

  const theme = useTheme();
  const dispatch = useDispatch()

  const { state: { borderRadius }, state } = useConfig();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); 
  const [shiftEndDialogOpen, setShiftEndDialogOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true); // Open confirmation dialog
  };

  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);
    
    const user = getUser();
    const isCashier = user?.role?.toUpperCase() === 'CASHIER';
    if (isCashier && localStorage.getItem('isShiftOpen') === 'true') {
      setShiftEndDialogOpen(true);
    } else {
      dispatch(userLogOut());
    }
  };

  const handleShiftEndLogout = () => {
    localStorage.removeItem('isShiftOpen');
    localStorage.removeItem('shiftData');
    dispatch(closeShift({}));
    dispatch(userLogOut());
    setShiftEndDialogOpen(false);
  };

  const handleJustLogout = () => {
    dispatch(userLogOut());
    setShiftEndDialogOpen(false);
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };


  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={User1}
            alt="user-images"
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                          <Typography variant="h4">Good Morning,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            Johne Doe
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">Project Admin</Typography>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        slotProps={{ input: { 'aria-label': 'weight' } }}
                      />
                      <Divider />
                    </Box>
                    <Box
                      sx={{
                        p: 2,
                        py: 0,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { width: 5 }
                      }}
                    >
                      {/* <Divider /> */}
                      <Card sx={{ display: "none", bgcolor: 'primary.light', my: 2 }}>
                        <CardContent>
                          <Grid container spacing={3} direction="column">
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Start DND Mode</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    color="primary"
                                    checked={sdm}
                                    onChange={(e) => setSdm(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid>
                              <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="subtitle1">Allow Notifications</Typography>
                                </Grid>
                                <Grid>
                                  <Switch
                                    checked={notification}
                                    onChange={(e) => setNotification(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Divider />
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': { mt: 0.5 }
                        }}
                      >
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 0}>
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 1}>
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid container spacing={1} sx={{ justifyContent: 'space-between' }}>
                                <Grid>
                                  <Typography variant="body2">Social Profile</Typography>
                                </Grid>
                                <Grid>
                                  <Chip
                                    label="02"
                                    variant="filled"
                                    size="small"
                                    color="warning"
                                    sx={{ '& .MuiChip-label': { mt: 0.25 } }}
                                  />
                                </Grid>
                              </Grid>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton sx={{ borderRadius: `${borderRadius}px` }} selected={selectedIndex === 4} onClick={handleLogoutClick} // Changed to new handler
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>


      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            maxWidth: '400px', // Control dialog width
            borderRadius: '12px', // Rounded corners
            boxShadow: theme.shadows[8],
          }
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '1.1rem',
            fontWeight: 500,
            pb: 1,
            pt: 2,
            px: 3
          }}
        >
          <IconLogout stroke={1.5} size="1.3rem" color={theme.palette.grey[600]} />
          Confirm Logout
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1 }}>
          <DialogContentText
            id="alert-dialog-description"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: '0.95rem',
              lineHeight: 1.5
            }}
          >
            Are you sure you want to logout from your account?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            pt: 1,
            justifyContent: 'flex-end',
            gap: 1
          }}
        >
          <Button
            onClick={handleLogoutCancel}
            variant="outlined"
            color="secondary"
            sx={{
              minWidth: '80px',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                borderColor: theme.palette.grey[400],
                backgroundColor: theme.palette.grey[100]
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="primary"
            autoFocus
            sx={{
              minWidth: '80px',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark
              }
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
        open={shiftEndDialogOpen}
        onClose={() => setShiftEndDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex' }}>
            <LockClockOutlinedIcon />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800}>Shift End Options</Typography>
            <Typography variant="caption" color="text.secondary">Select an action to continue logout</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <DialogContentText sx={{ mb: 3 }}>
            Would you like to end your active shift before logging out, or just logout and keep the shift open?
          </DialogContentText>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleShiftEndLogout}
              startIcon={<LockClockOutlinedIcon />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              End Shift & Logout
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleJustLogout}
              startIcon={<IconLogout size="1.2rem" />}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              Logout (Keep Shift Open)
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShiftEndDialogOpen(false)} sx={{ fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
