import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// eslint-disable-next-line react/prop-types
const RoleSelector = ({ icon, title, isSelected, onSelect }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));
  const isLg = useMediaQuery(theme.breakpoints.down('lg'));
  const isXl = useMediaQuery(theme.breakpoints.down('xl'));

  // Define responsive image size
  const imageSize = isXs ? '60px' : isSm ? '80px' : isMd ? '100px' : isLg ? '90px' : isXl ? '140px' : '140';

  return (
    <Box
      textAlign="center"
      sx={{
        p: 1,
        borderRadius: '50px',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
      onClick={onSelect}
    >
      <Box
        textAlign="center"
        sx={{
          p: 1,
          borderRadius: '50px',
          cursor: 'pointer',
          position: 'relative',
          height: imageSize,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      // onClick={onSelect}
      >
        {isSelected && (
          <Box
            sx={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.palette.background.paper,
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            ✓
          </Box>
        )}
        <img
          src={icon}
          alt={title}
          style={{
            borderRadius: '50%',
            border: isSelected ? `2px solid ${theme.palette.background.primary}` : 'none', // 🔥 updated
            height: imageSize,
            width: imageSize
          }}
        />
      </Box>
      <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500, fontSize: isXs ? '12px' : '14px', minWidth: '120px' }}>
        {title}
      </Typography>
    </Box>
  );
};

export default RoleSelector;
