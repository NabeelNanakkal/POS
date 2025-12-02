import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import animationData from 'assets/animations/UnderCunstruction.json';
import MainCard from 'ui-component/cards/MainCard';
import Lottie from 'lottie-react';

const SamplePage = ({name,error}) => {


  return (
    <MainCard
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          marginTop:"-10%"
        }}
      >
        {/* Lottie animation */}
        <Lottie
          animationData={animationData}
          loop={true}
          style={{
            width: "40%",
            height: "auto",
            filter: "grayscale(50%)",
            opacity:0.7 // Decrease grayscale

          }}
        />
        {/* Text */}
        <Typography variant="body2" sx={{ mt: 1 ,fontSize:"0.925rem" }}>
          
          {error?<>This Page is Not Found ⚠️</>:<>This <span style={{fontWeight:500}}>{name}</span> page is under construction ⚠️</>}
        </Typography>


      </Box>
    </MainCard>
  );
};

export default SamplePage;
