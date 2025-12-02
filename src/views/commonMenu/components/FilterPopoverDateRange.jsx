import React from 'react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Popover, Select, TextField, Checkbox, ListItemText, IconButton, Chip, Divider, Autocomplete } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonData } from 'container/masterDataContainer/slice';
import { IconCircleMinus } from '@tabler/icons-react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { display } from '@mui/system';


const FilterPopover = ({
    anchorEl,
    filters,
    handleClose,
    handleFilterByChange,
    handleOperatorChange,
    handleFilterValueChange,
    hanldeFilterApply,
    hanldeDropDownDatafetch,
    clearFilters,
    addNewFilter,
    removeFilter,
    filterables
}) => {

    const filterData = useSelector((state) => state.masterData?.masterDatalist || []);
    const dispatch = useDispatch()

    const open = Boolean(anchorEl);

    const booleanValues = [
        { value: "true" },
        { value: "false" },
    ]

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Box sx={{ paddingY: 2, paddingX: 2, margin: 2, maxWidth: "500px" }}>
                <Grid container gap={1} >
                    {filters?.map((filter, index) => {
                        return (
                            <Grid key={`${filter.field.fieldName}-${index}`} container spacing={1} alignItems="center">
                                <Grid item xs={1}>
                                    <Chip size="small" label={index + 1} /></Grid>
                                <Grid item xs={3.8}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Filter by</InputLabel>
                                        <Select
                                            value={filter.field || ''}
                                            onChange={(e) => handleFilterByChange(index, e.target.value)}
                                            sx={{
                                                bgcolor: 'white',
                                                width: "100%",
                                                textAlign: 'left',
                                                '& .MuiSelect-select': {
                                                    textAlign: 'left',
                                                }
                                            }}
                                            label="Filter by"
                                        >
                                            {filterables?.map((column) => {
                                                const isDisabled = filters.some((filter) => filter.field?.fieldName === column.fieldName);

                                                return (
                                                    <MenuItem key={column.fieldName} value={column} disabled={isDisabled}>
                                                        {column.label}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Box sx={{ display: "none" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer components={['DateRangePicker']}>
                                            <DateRangePicker
                                                localeText={{ start: 'Check-in', end: 'Check-out' }}
                                                slotProps={{ textField: { size: 'small' } }} // Makes input fields smaller
                                            />
                                        </DemoContainer>
                                    </LocalizationProvider>
                                </Box>
                                <Grid item xs={2.2}>
                                    <FormControl size="small" fullWidth>
                                        <InputLabel>Operator</InputLabel>
                                        <Select
                                            value={filter.operator || ''}
                                            onChange={(e) => handleOperatorChange(index, e.target.value)}
                                            defaultValue={"eq"}
                                            disabled={!filter.field || filter.field == ""}
                                            sx={{
                                                bgcolor: 'white',
                                                width: "100%",
                                                textAlign: 'left',
                                                '& .MuiSelect-select': {
                                                    textAlign: 'left',
                                                }
                                            }} label="Operator"
                                        >
                                            {filter?.field?.filterData?.operators && filter?.field?.filterData?.operators.map((op, index) => {
                                                return (
                                                    <MenuItem key={index} value={op}>{op}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    {filter?.operator === 'in' ? (
                                        <Autocomplete
                                            multiple
                                            fullWidth
                                            options={(filter?.field?.filterData?.values || filterData || []).filter(Boolean)}
                                            getOptionLabel={(option) => option[filter?.field?.filterData?.mappingKey || "value"] || ""}
                                            defaultValue={[]}
                                            onChange={(_, newValue) => {
                                                handleFilterValueChange(index, newValue, filterData);
                                            }}
                                            onFocus={
                                                filter?.field?.filterData?.apiEndpoint
                                                    ? () => hanldeDropDownDatafetch(filter)
                                                    : undefined
                                            }
                                            onInputChange={(e) => {
                                                if (filter?.field?.filterData?.apiEndpoint && e?.target?.value) {
                                                    dispatch(
                                                        getCommonData({
                                                            endPoint: filter?.field?.filterData?.apiEndpoint,
                                                            params: {
                                                                searchField: filter?.field?.filterData?.mappingKey || "value",
                                                                searchTerm: e.target.value,
                                                            },
                                                        })
                                                    );
                                                }
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option && option[filter?.field?.filterData?.mappingKey || "value"] === value?.fieldName
                                            }

                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Values"
                                                    variant="outlined"
                                                    size="small"
                                                    multiline={false}
                                                    sx={{ bgcolor: 'white', width: '100%' }}
                                                />
                                            )}
                                        />

                                    ) : filter.operator === 'eq' ? (
                                        <Autocomplete
                                            size="small"
                                            options={filter?.field?.type == "boolean" ? booleanValues : filter?.field?.filterData?.values ? filter?.field?.filterData?.values : filterData || []}
                                            fullWidth
                                            getOptionLabel={(option) => option[filter?.field?.filterData?.mappingKey || "value"] || ""}
                                            value={
                                                filter.value
                                                    ? filter?.options.find((option) => option[filter?.field?.filterData?.mappingKey || "value"] == filter.value) || null
                                                    : null
                                            }
                                            onFocus={
                                                filter?.field?.filterData?.apiEndpoint
                                                    ? () => hanldeDropDownDatafetch(filter)
                                                    : undefined
                                            }
                                            onInputChange={
                                                filter?.field?.filterData?.apiEndpoint
                                                    ? (e, value) => {
                                                        if (e && e.target) {
                                                            dispatch(getCommonData({
                                                                endPoint: filter?.field?.filterData?.apiEndpoint,
                                                                params: {
                                                                    searchField: filter?.field?.filterData?.mappingKey || "value",
                                                                    searchTerm: e.target.value
                                                                }
                                                            }));
                                                        }
                                                    }
                                                    : undefined
                                            }
                                            onChange={(_, newValue) => {
                                                const currentOptions = filter?.field?.type == "boolean" ? booleanValues : filter?.field?.filterData?.values || filterData || [];
                                                handleFilterValueChange(
                                                    index,
                                                    newValue ? newValue[filter?.field?.filterData?.mappingKey || "value"] : '',
                                                    currentOptions
                                                );
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Value"
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ bgcolor: 'white', width: '100%' }}
                                                />
                                            )}
                                            isOptionEqualToValue={(option, value) => option.fieldName === value}
                                        />

                                    ) : (
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Value"
                                            variant="outlined"
                                            value={filter.value || ''}
                                            onChange={(e) => handleFilterValueChange(index, e.target.value)}
                                            sx={{ bgcolor: 'white', width: '100%' }}
                                        />
                                    )}
                                </Grid>

                                <Grid item xs={1}>
                                    <IconButton size="small" onClick={() => removeFilter(index)}>
                                        <IconCircleMinus stroke={1} />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={12} p={0}>
                                    <Divider sx={{ my: 0 }} />
                                </Grid>
                            </Grid>
                        )
                    })}

                    <Grid item xs={12}>
                        <Grid container justifyContent={"space-between"} >
                            <Grid item>
                                <Grid container  >
                                    <Grid item>
                                        <Button
                                            size='small'
                                            sx={{
                                                borderRadius: '7px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                            onClick={addNewFilter}>
                                            + Add
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            size='small'
                                            sx={{
                                                borderRadius: '7px',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    textDecoration: 'underline'
                                                }
                                            }}
                                            onClick={clearFilters}>
                                            Clear All
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid mr={4} item>
                                <Button
                                    variant='contained'
                                    size='small'
                                    sx={{
                                        borderRadius: '7px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                    onClick={hanldeFilterApply}
                                >
                                    {/* {gettingCountloading ? <CircularProgress size="23px" />
                                        : "Apply"} */}
                                    Apply
                                </Button>


                            </Grid>
                        </Grid>

                    </Grid>

                </Grid>
            </Box>
        </Popover >
    );
};

export default FilterPopover;
