import backgroundImage from 'assets/images//logo.svg';
const styles = (theme) => ({
  Checkbox: {
    '&.Mui-checked': {
      color: theme.palette.primary.main
    },
    '& .MuiSvgIcon-root': {
      fontSize: { xs: 12, sm: 20 },
      marginRight: '0px'
    }
  },
  inputField: {
    height: '50px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '6px !important'
    },
    '& .MuiInputBase-input.MuiOutlinedInput-input': {
      fontSize: { xs: '16px', sm: '20px' },
      fontWeight: 300,
      opacity: 0.5
    },
    '@media (max-height: 600px)': {
      height: '45px',
      padding: '2px 8px'
    },
    '& legend': { display: 'none' },
    '& fieldset': { top: 0 }
  },
  btnIcon: {
    color: theme.palette.text.boxtext,
    opacity: '.6'
  },
  stackForm: {
    textDecoration: 'none',
    cursor: 'pointer',
    color: '#121212',
    marginTop: '10px',
    marginTop: '10px !important',
    fontSize: { xs: '10px', sm: '12px', md: '14px' }
  },
  stackBox: {
    width: '100%',
    px: { xs: 1, sm: 2 }
  },
  termsConditions: {
    fontSize: { xs: '6.5px', sm: '9px', md: '10px', lg: '14px', xl: '17px' },
    marginLeft: '0px',
    '@media screen and (min-width: 1200px) and (max-width: 1305px)': {
      fontSize: '15px'
    },
    '@media screen and (min-width: 950px) and (max-width: 1200px)': {
      fontSize: '10px'
    }
  },
  btnLogin: {
    paddingX: '40px',
    backgroundColor: theme.palette.primary.main,
    '&:hover': { backgroundColor: theme.palette.primary.main }
  },
  FormControlLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%'
  },
  eyeIcon: {
    fontSize: '18px'
  },
  ADREdge: {
    color: theme.palette.primary.main,
    fontWeight: 'bold'
  },
  loginBg: {
    // backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    // height: '100vh',
  },
  loginGrid: {
    width: { xs: '90%', sm: '450px', md: '50%' }
  },
  authCardWrapper: {
    // height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 3,
    borderRadius: '40px',
    paddingTop: '0',
    '@media (max-height: 550px)': {
      overflow: 'scroll',
      scrollbarWidth: 'none',
      mSoverflowStyle: 'none'
    }
  },
  iconBox: {
    mt: 0,
    display: 'flex',
    justifyContent: 'center'
  },
  welcomeBack: {
    fontSize: { md: '35px' },
    '@media (max-height: 700px)': {
      fontSize: '24px'
    }
  },
  title: {
    fontSize: { md: '20px' },
    '@media (max-height: 700px)': {
      fontSize: '13px'
    }
  },
  iconGrid: {
    mb: 3,
    '@media (max-height: 700px)': {
      mb: 1
    }
  },
  contactBox: {
    position: 'absolute',
    bottom: '5%',
    right: '8%',
    color: '#F5F5F5',
    zIndex: 10,
    display: { xs: 'none', md: 'block' }
  },
  logoImg: {
    maxWidth: '100%',
    height: 'auto'
  },
  loginBg: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  inputLabel: {
    fontSize: '0.875rem',
    backgroundColor: 'white',
    px: 0.5
  },
  authCardWrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 3,
    borderRadius: '40px',
    paddingTop: '0',
    '@media (max-height: 550px)': {
      overflow: 'scroll',
      scrollbarWidth: 'none',
      mSoverflowStyle: 'none'
    }
  },
  signUp: {
    textDecoration: 'none',
    fontSize: { xs: '7px', sm: '10px', md: '14px', lg: '16px', xl: '20px' },
    display: 'flex',
    justifyContent: 'center'
  },
  formBox: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  resLogin: {
    display: 'inline',
    color: theme.palette.primary.url,
    fontSize: '15px',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline'
    }
  },
  signUpTxt: {
    color: theme.palette.primary.url,
    textDecoration: 'none',
    ml: '4px',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
});

export default styles;
