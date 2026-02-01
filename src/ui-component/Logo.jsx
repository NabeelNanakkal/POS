// material-ui
import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/Logos/retailos_logo.png';
// import logo2 from 'assets/images/logo2.svg';

// project imports

/**
 * if you want to use image instead of <svg> uncomment following.
 *
//  * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

export default function Logo({width="180"}) {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Logo" width="100" />
     *
     */

    <img src={logo} alt="Logo" width={width} />


  );
}
