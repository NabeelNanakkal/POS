

import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import config from 'config';

export default function Footer() {
  return (
    <Box
      sx={{
        display:"flex",
        alignItems: 'center',
        justifyContent: 'center',
        py: 0.5,
        width:"100%",
      }}
    >
      <Typography sx={{textAlign:"center",opacity:0.5 ,fontSize:10}} variant="caption">
        &copy; All rights reserved Bizowice V 1.0.0
      </Typography>
     
    </Box>
  );
}
