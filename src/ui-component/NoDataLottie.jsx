import React from "react";
import Lottie from "lottie-react";
import animationData from "assets/animations/Blocks loading.json";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const NoDataLottie = ({ message, marginTop, size }) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                opacity: 0.7,
                marginTop: marginTop || 0
            }}
        >
            <Lottie
                animationData={animationData}
                loop={true}
                style={{
                    width: size || "12%",
                    height: "auto",
                }}
            />
            <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                {typeof message === 'string' ? (
                    <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        {message}
                    </Typography>
                ) : (
                    message || <Typography variant="body1" color="text.secondary" fontWeight={600}>No Records Found</Typography>
                )}
            </Box>
        </div>
    );
};

export default NoDataLottie;
