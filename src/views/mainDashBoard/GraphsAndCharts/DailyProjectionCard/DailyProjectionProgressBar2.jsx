
import React, { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { gridSpacing } from 'store/constant';

import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const DailyProjectionProgressBar2 = ({ isLoading }) => {

  const ScheduleData = useSelector((state) => state.commonMenu?.todaySchedule);

  const {
    totalProjectedVisits,
    totalCompletedVisits,
    totalProjectedAmount,
    totalCompletedAmount,
    visitsPercentage,
    collectionsPercentage,
  } = useMemo(() => {
    // Calculate totals from ScheduleData
    const totalProjectedVisits = ScheduleData?.length || 0;
    const totalCompletedVisits = ScheduleData?.filter(
      (visit) => visit.visitStatus === 'Closed'
    ).length || 0;
    const totalProjectedAmount = ScheduleData?.reduce(
      (sum, visit) => sum + (visit.expectedAmount || 0),
      0
    ) || 0;
    const totalCompletedAmount = ScheduleData?.reduce(
      (sum, visit) =>
        sum + (visit.collectionAmount || 0), 0
    ) || 0;

    // Calculate percentages, handling division by zero
    const visitsPercentage = totalProjectedVisits
      ? Math.round((totalCompletedVisits / totalProjectedVisits) * 100)
      : 0;
    // const collectionsPercentage = Math.round((totalCompletedAmount / 100) * 100)
    const collectionsPercentage = totalProjectedAmount
      ? Math.round((totalCompletedAmount / totalProjectedAmount) * 100)
      : 0;

    return {
      totalProjectedVisits,
      totalCompletedVisits,
      totalProjectedAmount,
      totalCompletedAmount,
      visitsPercentage,
      collectionsPercentage,
    };
  }, [ScheduleData]);


  const PercentageCard = ({ title, percentage, completed, completeText, projected, icon, color, unit = '' }) => (
    <Card sx={{ height: '100%', boxShadow: 0 }}>
      <CardContent sx={{ padding: "0px 16px 0px 16px" }}>
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
            mb: 1,
            '& .MuiLinearProgress-bar': {
              bgcolor: `${color}.main`,
            },
          }}
        />


        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
            <span style={{ fontWeight: 500, marginRight: "3px" }}>{unit}{projected.toLocaleString()}</span>
            Projected
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.85rem' }}>
            {/* {unit}{completed.toLocaleString()} completed */}
            <span style={{ fontWeight: 500, marginRight: "3px" }}>{unit}{completed.toLocaleString()}</span>
            {completeText}
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
        <Grid container spacing={gridSpacing} pt={0}>
          <Grid item xs={12} mt={'-20px'} pb={0}>
            <PercentageCard
              title="Collections"
              completeText="Collected"
              percentage={collectionsPercentage}
              completed={totalCompletedAmount}
              projected={totalProjectedAmount}
              icon={<AccountBalanceWalletIcon color="success" />}
              color="success"
              unit="₹"
            />
          </Grid>
          <Grid item xs={12} mt={0} >
            <PercentageCard
              title="Visits"
              completeText="Visited"
              percentage={visitsPercentage}
              completed={totalCompletedVisits}
              projected={totalProjectedVisits}
              icon={<VisibilityIcon color="primary" />}
              color="primary"
            />
          </Grid>
        </Grid>
        //   </CardContent>
        // </MainCard>
      )}
    </>
  );
};

DailyProjectionProgressBar2.propTypes = {
  isLoading: PropTypes.bool
};

export default DailyProjectionProgressBar2;
