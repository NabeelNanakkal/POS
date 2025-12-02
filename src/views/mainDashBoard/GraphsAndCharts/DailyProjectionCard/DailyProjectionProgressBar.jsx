
import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupIcon from '@mui/icons-material/Group';

import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';


const DailyProjectionProgressBar = ({ isLoading }) => {

  const activityCounts = useSelector((state) => state.dashboard.activityCounts);

  const {
    visitsPercentage,
    collectionsPercentage,
    userPercentage
  } = useMemo(() => {
    const visitsPercentage = activityCounts?.scheduledActivityCount
      ? Math.round((activityCounts?.totalCount / activityCounts?.scheduledActivityCount) * 100)
      : 0;
    const collectionsPercentage = activityCounts?.expectedAmountScheduledToday
      ? Math.round((activityCounts?.collectionAmountTotal / activityCounts?.expectedAmountScheduledToday) * 100)
      : 0;
    const userPercentage = activityCounts?.expectedAmountScheduledToday
      ? Math.round((activityCounts?.checkinCount / activityCounts?.activeUserCount) * 100)
      : 0;

    return {
      visitsPercentage,
      collectionsPercentage,
      userPercentage
    };
  }, [activityCounts]);


  const PercentageCard = ({ title, percentage, completed, actualTextLable, totalTextLabel, projected, icon, color, unit = '' }) => (
    <Card sx={{ height: '100%', boxShadow: 0, pb: 0 }}>
      <CardContent sx={{
        padding: "0px 8px 0px 8px", "&:last-child": {
          paddingBottom: 2,
        }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: `${color}.light`,
                mr: 1,
              }}
            >
              {React.cloneElement(icon, { sx: { fontSize: 16 } })}
            </Box>
            <Typography variant="h6" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
              {title}
            </Typography>
          </Box>
          <Typography variant="h6" color={color} fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
            {percentage}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: `${color}.light`,
            mb: 0.6,
            '& .MuiLinearProgress-bar': {
              bgcolor: `${color}.main`,
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 500, marginRight: "3px" }}>{unit}{projected?.toLocaleString()}</span>
            {totalTextLabel || "Total"}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
            {/* {unit}{completed.toLocaleString()} completed */}
            <span style={{ fontWeight: 500, marginRight: "3px" }}>{unit}{completed?.toLocaleString()}</span>
            {actualTextLable || "Completed"}
          </Typography>
        </Box>

      </CardContent>
    </Card>
  );

  return (
    <>
      {isLoading ? (
        <SkeletonPopularCard />
      ) : (
        <Grid container  >
          <Grid size={{ xs: 12 }} pb={0}>
            <PercentageCard
              title="Progress 1"
              actualTextLable="Done"
              totalTextLabel="To Be Done"
              percentage={collectionsPercentage}
              completed={activityCounts?.collectionAmountTotal}
              projected={activityCounts?.expectedAmountScheduledToday}
              icon={<AccountBalanceWalletIcon color="success" />}
              color="success"
              unit="₹"
            />
          </Grid>
          <Grid size={{ xs: 12 }} mt={0} >
            <PercentageCard
              title="Progress 2"
              actualTextLable="Done"
              totalTextLabel="To Be Done"
              percentage={visitsPercentage}
              completed={activityCounts?.totalCount}
              projected={activityCounts?.scheduledActivityCount}
              icon={<VisibilityIcon color="secondary" />}
              color="secondary"
            />
          </Grid>
         
        </Grid>
        //   </CardContent>
        // </MainCard>
      )}
    </>
  );
};

DailyProjectionProgressBar.propTypes = {
  isLoading: PropTypes.bool
};

export default DailyProjectionProgressBar;
