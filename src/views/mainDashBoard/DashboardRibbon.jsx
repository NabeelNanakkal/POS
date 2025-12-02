import React, { useState, useRef } from 'react';
import { Box, Typography, Button, Chip, Popover, FormControl, InputLabel, Select, MenuItem, Avatar, Badge, Tooltip, IconButton } from '@mui/material';
import { IconFilter, IconUsers, IconMapPin, IconChevronUp } from '@tabler/icons-react';

const MainCard = ({ children, sx, ...props }) => (
    <Box
        sx={{
            backgroundColor: 'white',
            borderRadius: 3,
            ...sx,
        }}
        {...props}
    >
        {children}
    </Box>
);

const DashboardRibbon = ({ handleToggle }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        zone: '',
        state: '',
    });
    const anchorRef = useRef(null); // Reference for the Popover anchor
    const zones = ['South', 'North', 'East', 'West'];
    const states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
        'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
        'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
        'Uttarakhand', 'West Bengal',
    ];

    const handleFilterOpen = () => {
        setFilterOpen(true);
    };

    const handleFilterClose = () => {
        setFilterOpen(false);
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value,
        });
    };

    const handleClearFilter = (filterType) => {
        setFilters({
            ...filters,
            [filterType]: '',
        });
    };

    const handleApplyFilters = () => {
        setFilterOpen(false); // Close Popover on apply
    };

    return (
        <MainCard sx={{ padding: 0, overflow: 'hidden' }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                    borderBottom: '1px solid #e9ecef',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Active Filters:
                    </Typography>
                    {filters.zone && (
                        <Chip
                            label={`Zone: ${filters.zone}`}
                            onDelete={() => handleClearFilter('zone')}
                            color="primary"
                            size="small"
                            icon={<IconMapPin size={16} />}
                        />
                    )}
                    {filters.state && (
                        <Chip
                            label={`State: ${filters.state}`}
                            onDelete={() => handleClearFilter('state')}
                            color="primary"
                            size="small"
                            icon={<IconMapPin size={16} />}
                        />
                    )}
                    {!filters.zone && !filters.state && (
                        <Typography variant="body2" color="text.disabled">
                            No filters applied
                        </Typography>
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Badge badgeContent={Object.values(filters).filter(Boolean).length} color="primary">
                        <Button
                            variant="contained"
                            startIcon={<IconFilter size={18} />}
                            onClick={handleFilterOpen}
                            size="small"
                            ref={anchorRef} // Attach ref to the button
                            sx={{
                                textTransform: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            }}
                        >
                            Add Filter
                        </Button>
                    </Badge>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 1.5,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconUsers size={16} />
                    <Typography variant="body2">
                        Showing data for {filters.zone || 'All Zones'} • {filters.state || 'All States'}
                    </Typography>
                </Box>
                <Tooltip title="Collapse filter panel">
                    <IconButton
                        size="small"
                        onClick={handleToggle}
                        sx={{
                            color: 'text.secondary',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.08)',
                                color: 'text.primary',
                            },
                        }}
                    >
                        <IconChevronUp size={16} />
                    </IconButton>
                </Tooltip>
            </Box>

            <Popover
                open={filterOpen}
                anchorEl={anchorRef.current}
                onClose={handleFilterClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 350, px: 4, py: 3 }, // Adjust width and padding
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="h6" fontSize={15} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconFilter size={20} />
                        Apply Filters
                    </Typography>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Zone</InputLabel>
                        <Select
                            name="zone"
                            value={filters.zone}
                            onChange={handleFilterChange}
                            label="Zone"
                        >
                            <MenuItem value="">
                                <em>All Zones</em>
                            </MenuItem>
                            {zones.map((zone) => (
                                <MenuItem key={zone} value={zone}>{zone}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size='small' fullWidth>
                        <InputLabel>State</InputLabel>
                        <Select
                            name="state"
                            value={filters.state}
                            onChange={handleFilterChange}
                            label="State"
                        >
                            <MenuItem value="">
                                <em>All States</em>
                            </MenuItem>
                            {states.map((state) => (
                                <MenuItem key={state} value={state}>{state}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
                        <Button onClick={handleFilterClose} variant="outlined" size="small">
                            Cancel
                        </Button>
                        <Button disabled onClick={handleApplyFilters} variant="contained" size="small">
                            Apply Filters
                        </Button>
                    </Box>
                </Box>
            </Popover>
        </MainCard>
    );
};

export default DashboardRibbon;