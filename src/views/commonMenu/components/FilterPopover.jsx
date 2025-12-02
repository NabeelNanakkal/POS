import React from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  IconButton,
  Chip,
  Divider,
  Autocomplete
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonData } from 'container/masterDataContainer/slice';
import { IconCircleMinus } from '@tabler/icons-react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { lighten } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

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
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const booleanValues = [{ value: 'true' }, { value: 'false' }];

  return (
    <Popover open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ mt: 1 }}>
      <Box sx={{ paddingY: 2, paddingX: 2, margin: 2, maxWidth: '600px' }}>
        <Grid container width="100%" gap={1}>
          {filters?.map((filter, index) => {
            const isDateField = filter?.field?.type === 'date' || filter?.field?.type === 'dateTime';
            return (
              <Grid size={{ xs: 12 }} key={`${filter.field.fieldName}-${index}`} spacing={1} alignItems="center">
                <Grid spacing={1} container>
                  <Grid size={{ xs: 0.8 }} alignContent="center">
                    <Chip size="small" label={index + 1} />
                  </Grid>
                  <Grid size={{ xs: 3.6 }}>
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
                          const isDisabled = filters.some((f) => f.field?.fieldName === column.fieldName);
                          return (
                            <MenuItem key={column.fieldName} value={column} disabled={isDisabled}>
                              {column.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>

                  {!isDateField && (
                    <Grid size={{ xs: 2.5 }}>
                      <FormControl size="small" fullWidth>
                        <InputLabel>
                          Operator
                        </InputLabel>
                        <Select
                          value={filter.operator || ''}
                          onChange={(e) => handleOperatorChange(index, e.target.value)}
                          defaultValue={'eq'}
                          disabled={!filter.field || filter.field === ''}
                          sx={{
                            bgcolor: 'white',
                            width: "100%",
                            textAlign: 'left',
                            '& .MuiSelect-select': {
                              textAlign: 'left',
                            }
                          }}
                          label="Operator"
                        >
                          {filter?.field?.filterData?.operators?.map((op, idx) => (
                            <MenuItem key={idx} value={op}>
                              {op}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {/* Value field */}
                  <Grid size={{ xs: isDateField ? 6.5 : 4 }} xs={isDateField ? 6.5 : 4}>
                    {isDateField ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 6 }}>
                            <DatePicker
                              label="Start Date"
                              value={filter?.value?.gte ? dayjs(filter?.value?.gte) : null}
                              onChange={(newValue) => {
                                handleFilterValueChange(index, {
                                  ...filter.value,
                                  gte: newValue ? dayjs(newValue).format('YYYY-MM-DD') : null
                                });
                              }}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                  sx: {
                                    bgcolor: 'white',
                                    '& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
                                      padding: '10px 2px 10px 10px'
                                    }
                                  }
                                }
                              }}
                              format="DD-MM-YYYY"
                            />
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <DatePicker
                              label="End Date"
                              value={filter?.value?.lte ? dayjs(filter?.value?.lte) : null}
                              onChange={(newValue) => {
                                handleFilterValueChange(index, {
                                  ...filter.value,
                                  lte: newValue ? dayjs(newValue).format('YYYY-MM-DD') : null
                                });
                              }}
                              minDate={filter.startDate ? dayjs(filter.startDate) : undefined}
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  fullWidth: true,
                                  sx: {
                                    bgcolor: 'white',
                                    '& .MuiInputBase-input.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
                                      padding: '10px 2px 10px 10px'
                                    }
                                  }
                                }
                              }}
                              format="DD-MM-YYYY"
                            />
                          </Grid>
                        </Grid>
                      </LocalizationProvider>
                    ) : filter?.operator === 'in' ? (
                      <Autocomplete
                        multiple
                        fullWidth
                        options={(filter?.field?.filterData?.values || filterData || []).filter(Boolean)}
                        getOptionLabel={(option) => option[filter?.field?.filterData?.mappingKey || 'value'] || ''}
                        defaultValue={[]}
                        onChange={(_, newValue) => handleFilterValueChange(index, newValue, filterData)}
                        onFocus={filter?.field?.filterData?.apiEndpoint ? () => hanldeDropDownDatafetch(filter) : undefined}
                        onInputChange={(e) => {
                          if (filter?.field?.filterData?.apiEndpoint && e?.target?.value) {
                            dispatch(
                              getCommonData({
                                endPoint: filter?.field?.filterData?.apiEndpoint,
                                params: {
                                  searchField: filter?.field?.filterData?.mappingKey || 'value',
                                  searchTerm: e.target.value,
                                  baseFilter: filter?.field?.filterData?.baseFilter || {}
                                }
                              })
                            );
                          }
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option && option[filter?.field?.filterData?.mappingKey || 'value'] === value?.fieldName
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
                        options={filter?.field?.type === 'boolean' ? booleanValues : filter?.field?.filterData?.values || filterData || []}
                        fullWidth
                        getOptionLabel={(option) => option[filter?.field?.filterData?.mappingKey || 'value'] || ''}
                        value={
                          filter.value
                            ? filter?.options?.find(
                              (option) => option[filter?.field?.filterData?.mappingKey || 'value'] === filter?.value
                            ) || null
                            : null
                        }
                        onFocus={filter?.field?.filterData?.apiEndpoint ? () => hanldeDropDownDatafetch(filter) : undefined}
                        onInputChange={
                          filter?.field?.filterData?.apiEndpoint
                            ? (e, value) => {
                              if (e && e.target) {
                                dispatch(
                                  getCommonData({
                                    endPoint: filter?.field?.filterData?.apiEndpoint,
                                    params: {
                                      searchField: filter?.field?.filterData?.mappingKey || 'value',
                                      searchTerm: e.target.value,
                                      baseFilter: filter?.field?.filterData?.baseFilter || {}
                                    }
                                  })
                                );
                              }
                            }
                            : undefined
                        }
                        onChange={(_, newValue) => {
                          handleFilterValueChange(
                            index,
                            newValue ? newValue[filter?.field?.filterData?.mappingKey || 'value'] : '',
                            filter?.field?.type === 'boolean' ? booleanValues : filter?.field?.filterData?.values || filterData || []
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

                  <Grid size={{ xs: 1 }}>
                    <IconButton size="small" onClick={() => removeFilter(index)}>
                      <IconCircleMinus stroke={1} />
                    </IconButton>
                  </Grid>
                  <Grid size={{ xs: 12 }} p={0}>
                    <Divider sx={{ my: 0 }} />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <Grid size={{ xs: 12 }}>
            <Grid container justifyContent={'space-between'}>
              <Grid>
                <Grid container>
                  <Grid>
                    <Button
                      size="small"
                      disabled={filters.length >= filterables.length}
                      sx={{
                        borderRadius: '7px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textDecoration: 'none',
                        '&.Mui-disabled': {
                          color: theme.palette.text.disabled
                        }
                      }}
                      onClick={addNewFilter}
                    >
                      + Add
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      size="small"
                      sx={{
                        borderRadius: '7px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textDecoration: 'none',
                      }}
                      onClick={clearFilters}
                    >
                      Clear All
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid mr={4}>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    borderRadius: '7px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textDecoration: 'none',

                  }}
                  onClick={hanldeFilterApply}
                >
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Popover>
  );
};

export default FilterPopover;
