import { useTheme } from '@emotion/react';
import { Box, Chip } from '@mui/material';
import React from 'react';

const Status = ({ status }) => {
  const theme = useTheme();

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Open':
        return `${theme.palette.statusTxt.pending}`;
      case 'Submitted':
        return `${theme.palette.statusTxt.create}`;
      case 'Closed':
      case 'Approved':
        return `${theme.palette.statusTxt.complete}`;
      case 'Loan Settled':
        return `${theme.palette.statusTxt.complete}`;
      case 'Call Connected':
        return `${theme.palette.statusTxt.create}`;
      case 'Re-Open':
        return `${theme.palette.statusTxt.ReOpen}`;
      case 'Valid':
        return `${theme.palette.statusTxt.complete}`;
      case 'Completed':
        return `${theme.palette.statusTxt.complete}`;
      case 'Invalid':
        return `${theme.palette.statusTxt.reject}`;
      case 'Switch Off':
      case 'Declined':
        return `${theme.palette.statusTxt.reject}`;
      case 'Wrong Number':
        return `${theme.palette.statusTxt.reject}`;
      case 'Expired':
        return `${theme.palette.statusTxt.reject}`;
      case 'A':
        return `${theme.palette.statusTxt.reject}`;
      case 'H':
        return `${theme.palette.statusTxt.pending}`;
      case 'P':
        return `${theme.palette.statusTxt.complete}`;
      case 'No Response':
        return `${theme.palette.statusTxt.pending}`;
      case 'Cancelled':
        return `${theme.palette.statusTxt.reject}`;
      case 'Disabled':
        return `${theme.palette.statusTxt.reject}`;
      case 'Pending':
      case 'Upcoming':
      case 'Pending For Approval':
        return `${theme.palette.statusTxt.pending}`;
      case 'Busy':
        return `${theme.palette.statusTxt.pending}`;
      case 'Out Of Coverage':
        return `${theme.palette.statusTxt.pending}`;
      default:
        return `${theme.palette.statusTxt.create}`;
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Open':
        return `${theme.palette.TablesStatus.pending}`;
      case 'Submitted':
        return `${theme.palette.TablesStatus.create}`;
      case 'Closed':
      case 'Approved':
        return `${theme.palette.TablesStatus.complete}`;
      case 'Loan Settled':
        return `${theme.palette.TablesStatus.complete}`;
      case 'Call Connected':
        return `${theme.palette.TablesStatus.create}`;
      case 'Re-Open':
        return `${theme.palette.TablesStatus.reOpen}`;
      case 'Valid':
        return `${theme.palette.TablesStatus.complete}`;
      case 'Completed':
        return `${theme.palette.TablesStatus.complete}`;
      case 'Invalid':
        return `${theme.palette.TablesStatus.reject}`;
      case 'Expired':
        return `${theme.palette.TablesStatus.reject}`;
      case 'A':
        return `${theme.palette.TablesStatus.reject}`;
      case 'H':
        return `${theme.palette.TablesStatus.pending}`;
      case 'P':
        return `${theme.palette.TablesStatus.complete}`;
      case 'Switch Off':
      case 'Declined':
        return `${theme.palette.TablesStatus.reject}`;
      case 'Wrong Number':
        return `${theme.palette.TablesStatus.reject}`;
      case 'No Response':
        return `${theme.palette.TablesStatus.pending}`;
      case 'Busy':
        return `${theme.palette.TablesStatus.pending}`;
      case 'Out Of Coverage':
        return `${theme.palette.TablesStatus.pending}`;
      case 'Cancelled':
        return `${theme.palette.TablesStatus.reject}`;
      case 'Disabled':
        return `${theme.palette.TablesStatus.reject}`;
      case 'Pending':
      case 'Upcoming':
      case 'Pending For Approval':
        return `${theme.palette.TablesStatus.pending}`;
      default:
        return `${theme.palette.TablesStatus.create}`;
    }
  };
  return (
    <Box>
      <Chip
        label={status || 'NA'}
        sx={{
          '&.MuiChip-root': {
            color: getStatusTextColor(status),
            backgroundColor: getStatusBgColor(status),
            textTransform: 'capitalize',
            fontSize: '12px',
            height: '24px',
            lineHeight: '20px', 
            padding: '0 8px',
            boxShadow: '0px -2px 2px rgba(255, 255, 255, 0.5), 0px 2px 2px rgba(240, 240, 240, 0.29)',
            border: `1px solid ${getStatusTextColor(status)}50` // light border based on text color
          },
          '& .MuiChip-label': {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            paddingTop: '3px',
            paddingBottom: '3px',
            padding: 0,

            '&::before': {
              content: '""',
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: getStatusTextColor(status)
            }
          }
        }}
      />
    </Box>
  );
};

export default Status;
