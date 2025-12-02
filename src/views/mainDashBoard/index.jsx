import  { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { gridSpacing } from 'store/constant';
import DashBoardCountCard from './cards/DashBoardCountCard';
import { IconGavel, IconHeartHandshake, IconUsersGroup, IconLicense, IconAlertTriangle, IconFilter } from '@tabler/icons-react';
import TotalActivityBarChart from './GraphsAndCharts/TotalActivityBarChart';
import { getActivityCounts, getCardCounts } from 'container/dashBoardContainer/slice';
import DailyProjectionCard from './GraphsAndCharts/DailyProjectionCard';
import DashboardRibbon from './DashboardRibbon';
import { Box, Badge, IconButton, Collapse, Tooltip, } from '@mui/material';
// import CollectionCard from './CollectionCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [isRibbonOpen, setIsRibbonOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
    dispatch(getCardCounts());
    dispatch(getActivityCounts());
  }, []);

  const cardCounts = useSelector((state) => state.dashboard.cardCounts);
  const activityCounts = useSelector((state) => state.dashboard.activityCounts);
  const BOxRef = useRef()

  const handleToggleRibbon = () => {
    setIsRibbonOpen(!isRibbonOpen);
    BOxRef.scrollTo({ top: 0, behavior: 'smooth' })
  };

  return (
    <Box ref={BOxRef} sx={{ position: 'relative' }}>
      {cardCounts &&
        <Box sx={{ display: "none", position: 'fixed', top: 100, right: 50, zIndex: 1000 }}>
          <Badge badgeContent={0} color="primary">
            <Tooltip title="Dashboard Filter">
              <IconButton
                sx={{
                  opacity: isRibbonOpen ? 0 : 1,
                  visibility: isRibbonOpen ? 'hidden' : 'visible',
                  pointerEvents: isRibbonOpen ? 'none' : 'auto',
                  transform: isRibbonOpen ? 'scale(0.95)' : 'scale(1)',
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  backgroundColor: isRibbonOpen ? 'rgba(237, 237, 237, 0.51)' : 'rgba(0,0,0,0.1)',
                  color: isRibbonOpen ? '#fff' : '#000',
                  transition: 'all 0.4s ease',
                  animation: 'growAndGlow 0.7s ease-in-out forwards',
                  '@keyframes growAndGlow': {
                    '0%': {
                      transform: 'scale(0.8)',
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      boxShadow: '0 0 0 rgba(0,0,0,0.1)',
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      backgroundColor: 'rgba(236, 236, 236, 0.71)',
                      boxShadow: '0 0 12px 4px rgba(255, 255, 255, 0.45)',
                    },
                    '100%': {
                      transform: 'scale(1)',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(236, 236, 236, 0.81)',
                    transform: 'scale(1.05)',
                  },
                }}
                color="inherit"
                size="large"
                onClick={handleToggleRibbon}
              >
                <IconFilter size={18} />
              </IconButton>
            </Tooltip>
          </Badge>
        </Box>}

      <Grid container spacing={gridSpacing}>
        <Collapse sx={{ width: "100%", display: "none" }} in={isRibbonOpen}
          timeout={400}>
          <Grid size={{ xs: 12 }} sx={{
            marginLeft: gridSpacing,
            marginTop: gridSpacing,
            boxShadow: '4px 3px 20px #1212121',
            transformOrigin: 'top',
          }}>
            {isRibbonOpen &&
              <DashboardRibbon handleToggle={handleToggleRibbon} />
            }
          </Grid>
        </Collapse>

        <Grid size={{ xs: 12 }}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <DashBoardCountCard
                isLoading={isLoading}
                randomH1={Math.floor(Math.random() * 90) + 100}
                randomH2={Math.floor(Math.random() * 90) + 100}
                data={{
                  title: 'Card 1',
                  totalCount: cardCounts?.loanAccounts?.total || 0,
                  icon: <IconLicense fontSize="15px" stroke={1} sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />,
                  counts: [
                    { label: 'New', count: cardCounts?.loanAccounts?.New || 0, routeParams: { field: 'status', value: 'New' } },
                    { label: 'Loan Settled', count: cardCounts?.loanAccounts?.LoanSettled || 0, routeParams: { field: 'status', value: 'Loan Settled' } },
                    { label: 'Closed', count: cardCounts?.loanAccounts?.Closed || 0, routeParams: { field: 'status', value: 'Closed' } },
                  ],
                }}
                route="/masterList/agreements"
              />
            </Grid>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <DashBoardCountCard
                isLoading={isLoading}
                randomH1={Math.floor(Math.random() * 90) + 100}
                randomH2={Math.floor(Math.random() * 90) + 100}
                data={{
                  title: 'Card 2',
                  totalCount: cardCounts?.parties?.total || 0,
                  icon: <IconUsersGroup fontSize="15px" stroke={1} sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />,
                  counts: [
                    { label: 'To Be Verified', count: cardCounts?.parties?.isVerifiedFalse || 0, routeParams: { field: 'isVerified', value: 'false' } },
                    { label: 'To Be Visited', count: cardCounts?.parties?.hasVisitedFalse || 0, routeParams: { field: 'hasVisited', value: 'false' } },
                    { label: 'To Be Contacted', count: cardCounts?.parties?.hasContactedFalse || 0, routeParams: { field: 'hasContacted', value: 'false' } },
                  ],
                }}
                route="/masterList/parties"
              />
            </Grid>
            <Grid size={{ lg: 4, md: 6, sm: 6, xs: 12 }}>
              <DashBoardCountCard
                route="/masterList/legalTool"
                isLoading={isLoading}
                randomH1={Math.floor(Math.random() * 90) + 100}
                randomH2={Math.floor(Math.random() * 90) + 100}
                data={{
                  title: 'Card 5',
                  totalCount: cardCounts?.legalTools?.total || 0,
                  icon: <IconGavel fontSize="15px" stroke={1} sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />,
                  counts: [
                    { label: 'Expired', count: cardCounts?.legalTools?.Expired || 0, routeParams: { field: 'ltStatus', value: 'Expired' } },
                    { label: 'Live', count: cardCounts?.legalTools?.Live || 0, routeParams: { field: 'ltStatus', value: 'Live' } },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, md: 8 }} >
              <TotalActivityBarChart activityCounts={activityCounts} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DashBoardCountCard
                isLoading={isLoading}
                randomH1={Math.floor(Math.random() * 90) + 100}
                randomH2={Math.floor(Math.random() * 90) + 100}
                data={{
                  title: 'Card 3',
                  totalCount: cardCounts?.settlements?.total || 0,
                  icon: <IconHeartHandshake fontSize="15px" stroke={1} sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />,
                  counts: [
                    { label: 'Approved', count: cardCounts?.settlements?.approved || 0, routeParams: { field: 'approval_status', value: 'Approved' } },
                    { label: 'Pending For Approval', count: cardCounts?.settlements?.pendingForApproval || 0, routeParams: { field: 'approval_status', value: 'Pending For Approval' } },
                  ],
                }}
                route="/masterList/settlements"
              />
              <br />
              <DashBoardCountCard
                isLoading={isLoading}
                randomH1={Math.floor(Math.random() * 90) + 100}
                randomH2={Math.floor(Math.random() * 90) + 100}
                data={{
                  title: 'Card 4',
                  totalCount: cardCounts?.parties?.skippedParties + cardCounts?.parties?.ltParties || 0,
                  icon: <IconAlertTriangle size={21} fontSize="10px" color="#8f0112" stroke={1.5} />,
                  counts: [
                    { label: 'Skipped', count: cardCounts?.parties?.skippedParties || 0, routeParams: { field: 'partyStatus', value: 'Skip' } },
                    { label: 'RTP/LT Required', count: cardCounts?.parties?.ltParties || 0, routeParams: { field: 'partyStatus', value: 'Refused To Pay/ Legal Tool Required' } },
                  ],
                }}
                route="/masterList/parties"
              />
              <br />
              <DailyProjectionCard isLoading={isLoading} activityCounts={activityCounts} />
              {/* <CollectionCard isLoading={isLoading} cardCounts={cardCounts} /> */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

// export const Button1 = <button
//   onClick={() => window.open('https://finportal.integrofinserv.com/masterList/parties?state=%7B%22item%22%3A%5B%7B%22field%22%3A%22partyId%22%2C%22value%22%3A%22BHUNESHWAR%20%20YADAV%22%7D%5D%2C%22doDrawerOpen%22%3Atrue%7D', 'popupwindow', 'width=300', 'height=400')}
// >
//   open pop-up
// </button>