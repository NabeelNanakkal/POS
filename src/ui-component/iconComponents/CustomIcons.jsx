import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

const CustomIcons = ({ src }) => {
  const theme = useTheme();

  return (
    <Box
      component="img"
      src={src}
      alt="icon"
      sx={{
        filter: 'brightness(100) invert(1)',
        // '&:hover': { 
        //   backgroundColor: '#5c3d88', // exact hex color
        //           }
      }}
    />
  );
};

export default CustomIcons;
