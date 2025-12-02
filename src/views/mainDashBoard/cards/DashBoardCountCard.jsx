import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import { IconGavel } from "@tabler/icons-react";
import StatusCount from 'ui-component/StatusCount';
import { useNavigate } from 'react-router-dom';

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const DashBoardCountCard = ({ isLoading, randomH1, randomH2, data, route = "/main/home" }) => {
  const theme = useTheme();
  const navigate = useNavigate()

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary',
            overflow: 'hidden',
            position: 'relative',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
            '&:after': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: randomH1,
              background: theme.palette.secondary[200],
              borderRadius: '40%',
              top: { xs: -105, sm: -85 },
              right: { xs: -140, sm: -95 }
            },
            '&:before': {
              content: '""',
              position: 'absolute',
              width: 210,
              height: randomH2,
              background: theme.palette.secondary[200],
              borderRadius: '30%',
              top: { xs: -155, sm: -125 },
              right: { xs: -70, sm: -15 },
              opacity: 0.5
            }
          }}
        >
          <Box
            onClick={() => { navigate(route) }}
            sx={{ p: 2, cursor: "pointer" }}>
            <Grid container direction="column">
              <Grid>
                <Grid container gap={1} alignItems="center">
                  <Grid sx={{ display: "flex" }} item>
                    {
                      data?.icon || <IconGavel fontSize="15px" stroke={2} sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                    }
                  </Grid>
                  <Grid>
                    <Typography variant="h3" sx={{ mr: 0.8, }}>
                      {data?.totalCount || 0}</Typography>
                  </Grid>
                  <Typography variant="h4" sx={{ mr: 1, }}> {data?.title || "Data"}</Typography>
                </Grid>

              </Grid>
              <Grid my={1} >
                <Grid container spacing={1}>
                  {data?.counts && data?.counts?.map((item, index) => (
                    <Grid key={index} size={{ xs: 4 }}>
                      <StatusCount status={item.label || "N/A"} count={item.count || 0} route={route} routeParam={item?.routeParams} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
};

DashBoardCountCard.propTypes = {
  isLoading: PropTypes.bool
};

export default React.memo(DashBoardCountCard);
