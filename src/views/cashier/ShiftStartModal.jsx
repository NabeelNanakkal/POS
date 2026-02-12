import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  Stack
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import LockClockOutlinedIcon from '@mui/icons-material/LockClockOutlined';

import { getCurrencySymbol } from 'utils/formatAmount';

const ShiftStartModal = ({ open, onClose, onConfirm, loading }) => {
  const theme = useTheme();
  const [openingBalance, setOpeningBalance] = useState('');

  const handleConfirm = () => {
    const val = parseFloat(openingBalance);
    if (val >= 0) {
      onConfirm(val);
    }
  };

  return (
    <Dialog 
      open={open} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2
          }}
        >
          <LockClockOutlinedIcon fontSize="large" />
        </Box>
        <Typography variant="h4" fontWeight={800}>
          Open Your Shift
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the opening cash amount in the drawer.
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
              Opening Cash Balance
            </Typography>
            <TextField
              fullWidth
              autoFocus
              placeholder="0.00"
              type="number"
              value={openingBalance}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseFloat(val) >= 0) {
                  setOpeningBalance(val);
                }
              }}
              inputProps={{ min: 0, step: "0.01" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography fontWeight={700} color="text.secondary">
                      {getCurrencySymbol()}
                    </Typography>
                  </InputAdornment>
                ),
                sx: {
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 4 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirm}
          disabled={!openingBalance || loading}
          sx={{
            py: 1.5,
            borderRadius: 2.5,
            fontSize: '1rem',
            fontWeight: 800,
            textTransform: 'none',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`
          }}
        >
          {loading ? 'Starting Shift...' : 'Start Shift'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftStartModal;
