import React from "react";
import Lottie from "lottie-react";
import animationData from "assets/animations/noDataLottie.json";
import Typography from '@mui/material/Typography'

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
            <Typography sx={{ padding: "16px" }} variant="body1" color="initial"> {message ? message : "No Records Found"}</Typography>
        </div>
    );
};

export default NoDataLottie;
