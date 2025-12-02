import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

// project imports
import config from 'config';
import { useTheme } from '@mui/material/styles';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection() {
  const theme = useTheme();
  return (
    <Link 
      component={RouterLink} 
      to={config.basename} 
      aria-label="theme-logo"
      sx={{ textDecoration: 'none' }}
    >
      <Typography 
        variant="h1" 
        sx={{ 
          fontWeight: 900,
          color: theme.palette.primary.main,
          mt: 1
        }}
      >
        BIZOWICE  
      </Typography>
    </Link>
  );
}
