import React from 'react';
import { Grid, Box, CardContent, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DailyProjectionProgressBar from './DailyProjectionProgressBar';

const DailyProjectionCard = ({ isLoading }) => {

    const currentIndex = 0;
    const charts = [
        { component: <DailyProjectionProgressBar isLoading={isLoading} />, title: 'Total Activity' },
    ];


    return (
        <Box sx={{ position: 'relative', width: '100%', }}>
            <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <MainCard
                    content={false}
                    sx={{ width: '100%', maxWidth: '100%', padding: "0px" }}
                >
                    <CardContent sx={{
                        padding: "16px 16px 0px 16px", "&:last-child": {
                            paddingBottom: 0,
                        },
                    }} >
                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 25 }} />
                                <Typography variant="h4">Daily Data Progress</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            {charts[currentIndex].component}
                        </Grid>
                    </CardContent>
                </MainCard>
            </Box>
        </Box>
    );
};

export default React.memo(DailyProjectionCard);