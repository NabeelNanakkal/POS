import { useTheme } from '@emotion/react';
import { Box, Chip, Divider, Tooltip } from '@mui/material';
import React from 'react';
import { motion } from 'framer-motion'; // Adding subtle animations

const StatusCount = ({ status, count = 0, route, routeParam }) => {

    const theme = useTheme();

    const getStatusTextColor = (status) => {
        switch (status) {
            case 'Open': return theme.palette.statusTxt.pending;
            case 'Submitted': return theme.palette.statusTxt.create;
            case 'Closed': return theme.palette.statusTxt.complete;
            case 'Approved': return theme.palette.statusTxt.complete;
            case 'Executed': return theme.palette.statusTxt.complete;
            case 'Loan Settled': return theme.palette.statusTxt.complete;
            case 'Call Connected': return theme.palette.statusTxt.create;
            case 'Re-Open': return theme.palette.statusTxt.ReOpen;
            case 'Valid': return theme.palette.statusTxt.complete;
            case 'Active': return theme.palette.statusTxt.complete;
            case 'Invalid': return theme.palette.statusTxt.reject;
            case 'Switch Off': return theme.palette.statusTxt.reject;
            case 'Wrong Number': return theme.palette.statusTxt.reject;
            case 'Expired': return theme.palette.statusTxt.reject;
            case 'Skipped': return theme.palette.statusTxt.reject;
            case 'RTP/LT Required': return theme.palette.statusTxt.reject;
            case 'No Response': return theme.palette.statusTxt.pending;
            case 'Cancelled': return theme.palette.statusTxt.reject;
            case 'Disabled': return theme.palette.statusTxt.reject;
            case 'Pending': return theme.palette.statusTxt.pending;
            case 'To Be Verified': return theme.palette.statusTxt.pending;
            case 'To Be Visited': return theme.palette.statusTxt.pending;
            case 'To Be Contacted': return theme.palette.statusTxt.pending;
            case 'Pending For Approval': return theme.palette.statusTxt.pending;
            case 'Busy': return theme.palette.statusTxt.pending;
            case 'Out Of Coverage': return theme.palette.statusTxt.pending;
            default: return theme.palette.statusTxt.create;
        }
    };

    const getStatusBgColor = (status) => {
        switch (status) {
            case 'Open': return theme.palette.TablesStatus.pending;
            case 'Submitted': return theme.palette.TablesStatus.create;
            case 'Closed': return theme.palette.TablesStatus.create;
            case 'Approved': return theme.palette.TablesStatus.create;
            case 'Executed': return theme.palette.TablesStatus.complete;
            case 'Loan Settled': return theme.palette.TablesStatus.complete;
            case 'Call Connected': return theme.palette.TablesStatus.create;
            case 'Re-Open': return theme.palette.TablesStatus.reOpen;
            case 'Valid': return theme.palette.TablesStatus.complete;
            case 'Active': return theme.palette.TablesStatus.complete;
            case 'Invalid': return theme.palette.TablesStatus.reject;
            case 'Expired': return theme.palette.TablesStatus.reject;
            case 'Skipped': return theme.palette.TablesStatus.reject;
            case 'RTP/LT Required': return theme.palette.TablesStatus.reject;
            case 'Switch Off': return theme.palette.TablesStatus.reject;
            case 'Wrong Number': return theme.palette.TablesStatus.reject;
            case 'No Response': return theme.palette.TablesStatus.pending;
            case 'Busy': return theme.palette.TablesStatus.pending;
            case 'Out Of Coverage': return theme.palette.TablesStatus.pending;
            case 'Cancelled': return theme.palette.TablesStatus.reject;
            case 'Disabled': return theme.palette.TablesStatus.reject;
            case 'Pending': return theme.palette.TablesStatus.pending;
            case 'Pending For Approval': return theme.palette.TablesStatus.pending;
            case 'To Be Verified': return theme.palette.TablesStatus.pending;
            case 'To Be Visited': return theme.palette.TablesStatus.pending;
            case 'To Be Contacted': return theme.palette.TablesStatus.pending;
            default: return theme.palette.TablesStatus.create;
        }
    };

    return (
        <Box sx={{ width: '100%', perspective: 1000 }}>
            <motion.div
                whileHover={{ scale: 1.03, rotateX: 2 }}
                // whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
            >
                <Chip
                    onClick={(event) => {
                        event.stopPropagation();
                        if (route && routeParam) {
                            const url = route;
                            const state = JSON.stringify({
                                item: [
                                    {
                                        field: routeParam.field || routeParam.fieldName,
                                        value: routeParam.value,
                                    },
                                ],
                            });
                            const encodedState = encodeURIComponent(state);
                            window.location.href = `${url}?state=${encodedState}`;
                        } else {
                            return
                        }
                    }}
                    size="small"
                    sx={{
                        '&.MuiChip-root': {
                            color: getStatusTextColor(status),
                            background: `linear-gradient(135deg, ${getStatusBgColor(status)} 0%, ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0,0,0,0.05)'} 100%)`,
                            textTransform: 'capitalize',
                            height: '32px',
                            width: '100%',
                            borderRadius: '12px',
                            border: `1px solid ${theme.palette.divider}20`,
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(3px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.11)',
                                borderColor: `${theme.palette.divider}40`,
                            },
                        },
                        '& .MuiChip-label': {
                            width: '100%',
                            padding: '0 6px',
                            display: 'flex',
                            alignItems: 'center',
                        },
                    }}
                    label={
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            gap: 0.3,
                        }}>
                            <Tooltip
                                title={status}
                                placement="top"

                            >
                                <Box sx={{
                                    flex: '1 1 auto',
                                    textAlign: 'left',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '11px',
                                    paddingLeft: '2px',
                                }}>
                                    {status}
                                </Box>
                            </Tooltip>
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    // height: 16,
                                    mx: 0.1,
                                    my: 0.6,
                                    borderColor: `${getStatusTextColor(status)}80`,
                                    opacity: 0.7,
                                }}
                            />
                            <Tooltip
                                title={` ${count}`}
                                placement="top"
                            >
                                <Box sx={{
                                    flex: '0 0 auto',
                                    fontSize: '11px',
                                    minWidth: '24px',
                                    textAlign: 'center',
                                    background: `${getStatusTextColor(status)}20`,
                                    borderRadius: '10px',
                                    padding: '2px 6px',
                                }}>
                                    {count}
                                </Box>
                            </Tooltip>
                        </Box>
                    }
                />
            </motion.div>
        </Box>
    );
};

export default StatusCount;