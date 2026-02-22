import React from 'react';
import { Typography } from '@mui/material';

const Priority = ({ priority }) => {
    let color;
    switch (priority.toLowerCase()) {
        case 'high':
            color = '#eb412f'; // Darker and subtler red
            break;
        case 'medium':
            color = '#e67e22'; // Slightly darker orange
            break;
        case 'low':
            color = '#f1c40f'; // Slightly darker yellow
            break;
        default:
            color = '#7f8c8d'; // Subtle grey
    }

    return (
        <Typography style={{ color }}>
            {priority || 'No Priority'}
        </Typography>
    );
};

export default Priority;
