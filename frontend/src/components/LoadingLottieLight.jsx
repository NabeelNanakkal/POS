import React from "react";
import Lottie from "lottie-react";
import animationData from "assets/animations/loadingLottieDark.json";
import Typography from '@mui/material/Typography'

const LoadingLottieLight = () => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                opacity: 0.6,
                overflow:"hidden"
            }}
        >
            <Lottie
                animationData={animationData}
                loop={true}
                style={{
                    marginTop:"-5%",
                    width: "25%",
                    height: "auto",
                }}
            />
            <Typography sx={{ marginTop: "-5%" }} variant="body1" color="initial">Loading ...</Typography>
        </div>
    );
};



export default LoadingLottieLight