import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogContent, DialogActions, Select, MenuItem, Button,
    FormControl, InputLabel, Typography, Box, DialogTitle, Grid, CircularProgress, Chip,

    Checkbox
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getDataByFilter } from 'container/commonMenuContainer/slice';
import { IconTableExport, IconFilter, } from '@tabler/icons-react';
import { downloadCSV, downloadExcel } from 'utils/exportFiles';
import { formatCamelCaseToTitle } from 'utils/formateCamelCaseString';

const DEFAULT_FILE_TYPES = [
    { label: 'Excel', value: 'xlsx' },
    { label: 'CSV', value: 'csv' },

];

const ExportFileModal = ({ open, handleClose, menuConfig, addOnFilters }) => {
    const dispatch = useDispatch();
    const [previewData, setPreviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const downloadDocOptions = menuConfig?.tableStructure?.downloadDocOptions || {};
    const baseFilter = menuConfig?.baseFilter || null;
    const defaultSort = menuConfig?.defaultSort || null;
    const user = JSON.parse(localStorage.getItem("user"))
    const exportEndPoint = menuConfig?.tableStructure?.downloadDocOptions?.exportEndPoint
    const {
        fileName: baseFileName = 'data',
        dateField,
        dateFieldName,
        exclude = [],
        fileTypes = {}
    } = downloadDocOptions;

    const [localFilters, setLocalFilters] = useState(addOnFilters?.filter((f) => f.field !== dateField) || []);


    const [hasDateField, setHasDateField] = useState(!!dateField)
    const [dateFieldEnabled, setDateFieldEnabled] = useState(!!dateField)

    useEffect(() => {
        setHasDateField(!!dateField)
        setDateFieldEnabled(!!dateField)
    }, [downloadDocOptions])

    const hasBaseFilter = !!baseFilter;
    const hasAddOnFilters = addOnFilters?.filter((f) => f.field !== dateField).length > 0;

    const FILE_TYPES = Object.keys(fileTypes).length > 0
        ? Object.entries(fileTypes)
            .filter(([_, config]) => config.isDownloadable)
            .map(([value, config]) => ({
                label: value.toUpperCase(),
                value: value === 'xlsx' ? 'excel' : value
            }))
        : DEFAULT_FILE_TYPES;

    const today = dayjs().format('DD/MM/YYYY');

    const dataByFilter = useSelector((state) => state.commonMenu?.dataByFilter);
    const dataByFilterCount = useSelector((state) => state.commonMenu?.dataByFilterCount);
    const fetching = useSelector((state) => state.commonMenu?.loading);

    const initialValues = {
        ...(hasDateField && {
            startDate: dayjs(addOnFilters?.find((f) => f.field == dateField)?.value?.gte).format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY'),
            endDate: dayjs(addOnFilters?.find((f) => f.field == dateField)?.value?.lte).format('DD/MM/YYYY') || dayjs().format('DD/MM/YYYY'),
        }),
        fileType: FILE_TYPES[0]?.value || 'excel',
    };

    const validationSchema = Yup.object().shape({
        ...(hasDateField && {
            startDate: Yup.string()
                .required('From date is required')
                .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'Date must be in DD/MM/YYYY format'),
            endDate: Yup.string()
                .required('To date is required')
                .matches(/^(\d{2})\/(\d{2})\/(\d{4})$/, 'Date must be in DD/MM/YYYY format')
                .test('valid-range', 'To date must be after start date', function (value) {
                    const { startDate } = this.parent;
                    if (!startDate || !value) return true;
                    return dayjs(value, 'DD/MM/YYYY').isAfter(dayjs(startDate, 'DD/MM/YYYY')) ||
                        dayjs(value, 'DD/MM/YYYY').isSame(dayjs(startDate, 'DD/MM/YYYY'));
                }),
        }),
        fileType: Yup.string()
            .required('File type is required')
            .oneOf(FILE_TYPES.map(type => type.value), 'Invalid file type'),
    });

    const resetStates = () => {
        setPreviewData(null);
        setIsLoading(false);
        setLocalFilters(addOnFilters?.filter((f) => f.field !== dateField) || []);
    };

    const handleDialogClose = () => {
        resetStates();
        handleClose();
    };

    const fetchData = async (filters, startDate = today, endDate = today) => {
        setIsLoading(true);
        try {
            let filterData = hasBaseFilter ? { ...baseFilter } : {};
            if (hasAddOnFilters) {
                filters.forEach(filter => {
                    if (filter.field) {
                        if (filter.operator === 'eq' || filter.operator === 'is') {
                            filterData[filter.field] = filter.value;
                        } else if (filter.value && typeof filter.value === 'object' && (filter.value.gte || filter.value.lte)) {
                            filterData[filter.field] = {
                                ...(filter.value.gte && { gte: filter.value.gte }),
                                ...(filter.value.lte && { lte: filter.value.lte }),
                            };
                        }
                    }
                });
            }

            if (hasDateField && startDate && endDate) {
                const fromDate = dayjs(startDate, 'DD/MM/YYYY');
                const toDate = dayjs(endDate, 'DD/MM/YYYY');
                if (fromDate.isValid() && toDate.isValid()) {
                    filterData = {
                        ...filterData,
                        [dateField]: {
                            gte: fromDate.format('YYYY-MM-DD'),
                            lte: toDate.format('YYYY-MM-DD'),
                        },
                    };
                } else {
                    console.log("%c [ invalid date ]==========-137", "font-size:14px; background:white; color:black;", "startDate:", startDate, "endDate:", endDate);
                    setIsLoading(false);
                    return;
                }
            }

            const isRestrictedUser = user?.role == "State Head"

            const updatedFilterData = isRestrictedUser
                ? { ...filterData, stateHead: user.id }
                : filterData;

            dispatch(getDataByFilter({
                isNonIndexEndPoint: exportEndPoint ? true : false,
                docName: exportEndPoint || menuConfig?.apiEndPoint,
                fliterData: updatedFilterData,
                sortField: defaultSort?.sortField || null,
                sortOrder: defaultSort?.sortOrder || null,
            }));
        } catch (error) {
            console.error("Fetching data failed:", error);
            setPreviewData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            const initialFilters = addOnFilters?.filter((f) => f.field !== dateField) || [];
            setLocalFilters(initialFilters);
        }
    }, [open, addOnFilters, menuConfig, baseFilter]);

    useEffect(() => {
        if (dataByFilter !== undefined) {
            setPreviewData(dataByFilter || []);
        }
    }, [dataByFilter]);

    const stringifyFilters = (filters) => {
        if (!filters || filters.length === 0) return '';

        const filterStrings = filters.map((filter) => {
            if (!filter?.operator) return '';

            const field = formatCamelCaseToTitle(filter.field);
            let value = '';
            if (filter.operator === 'eq' || filter.operator === 'is') {
                value = filter.value;
            } else if (filter.value && typeof filter.value === 'object') {
                const { gte, lte } = filter.value;
                value = gte && lte ? `${gte}_to_${lte}` : gte ? `gte_${gte}` : `lte_${lte}`;
            }
            return `${field}_${filter.operator}_${value}`;
        });

        return filterStrings
            .filter(Boolean)
            .join('_')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .slice(0, 100);
    };


    const handleSubmit = async (values) => {

        try {
            setIsExporting(true);
            if (previewData && previewData.length > 0) {
                const fileTypeKey = values.fileType === 'excel' ? 'xlsx' : values.fileType;
                const specificFileConfig = fileTypes[fileTypeKey] || {};

                let fileName = specificFileConfig.fileName || baseFileName;

                if (hasDateField) {
                    const fileStartDate = dayjs(values.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    const fileEndDate = dayjs(values.endDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
                    fileName = `${fileName}_${fileStartDate}_to_${fileEndDate}`;
                }

                const filterString = stringifyFilters(localFilters);
                if (filterString) {
                    fileName = `${fileName}(${filterString})`;
                }
                fileName = fileName.replace(/undefined/g, '');
                const configs = {
                    fileName,
                    exclude,
                };

                setTimeout(() => {
                    if (values.fileType === 'csv') {
                        downloadCSV(configs.fileName, previewData, menuConfig?.drawerConfigs?.items || menuConfig?.drawerConfigs?.tabs[0]?.items, configs.exclude);
                    } else if (values.fileType === 'excel') {
                        downloadExcel(configs.fileName, previewData, menuConfig?.drawerConfigs?.items || menuConfig?.drawerConfigs?.tabs[0]?.items, configs.exclude);
                    }
                    setIsExporting(false)
                }, 0);

            }
        } catch (error) {
            console.error("Export failed:", error);
            setIsExporting(false);
        }
    };

    const renderFilterValue = (filter) => {

        if (filter.operator === 'eq' || filter.operator === 'is') {
            return filter.value;
        } else if (filter.value && typeof filter.value === 'object') {
            const { gte, lte } = filter.value;
            const formattedGte = gte ? dayjs(gte, 'YYYY-MM-DD').format('DD-MM-YYYY') : null;
            const formattedLte = lte ? dayjs(lte, 'YYYY-MM-DD').format('DD-MM-YYYY') : null;
            return formattedGte && formattedLte ? `${formattedGte} to ${formattedLte}` : formattedGte ? `>= ${formattedGte}` : `<= ${formattedLte}`;
        }
        return '';
    };

    const handleRemoveFilter = (indexToRemove, values) => {
        const updatedFilters = localFilters.filter((_, index) => index !== indexToRemove);
        setLocalFilters(updatedFilters);
        fetchData(updatedFilters, hasDateField ? values.startDate : null, hasDateField ? values.endDate : null);
    };

    const handleDefaultDateBoolean = (value) => {
        setDateFieldEnabled(value)
    }

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            sx={{ '& .MuiDialog-paper': { width: '500px', maxWidth: '90vw', padding: 2 } }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnMount={false}
            >
                {({ values, errors, touched, setFieldValue, isValid }) => {
                    useEffect(() => {
                        if (open) {
                            if (dateFieldEnabled) {
                                fetchData(localFilters, values.startDate, values.endDate);
                            } else {
                                fetchData(localFilters, null, null);
                            }
                        }
                    }, [values.startDate, values.endDate, dateFieldEnabled]);

                    return (
                        <Form>
                            <DialogTitle
                                sx={{
                                    px: 3,
                                    py: 1,
                                    borderBottom: '1px dashed #e6e6e6',
                                    fontSize: '1.1rem',
                                    color: 'gray',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                <IconTableExport size={25} stroke={2} style={{ marginRight: '12px' }} />
                                Export {menuConfig?.title} Data
                            </DialogTitle>

                            <DialogContent sx={{ py: 1, px: 2 }}>
                                <Grid container spacing={1}>
                                    <Grid p={0} item xs={12}>
                                        <Box sx={{ my: 1, bgcolor: '#f9fafb', p: 2, borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ mb: 2, fontWeight: 500, color: '#424242' }}
                                            >
                                                Export Settings
                                            </Typography>

                                            {hasAddOnFilters && (
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 500,
                                                            color: '#424242',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            mb: 1
                                                        }}
                                                    >
                                                        <IconFilter size={16} style={{ marginRight: '6px' }} />
                                                        Applied Filters({localFilters?.length})
                                                    </Typography>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: 1,
                                                            maxHeight: '120px',
                                                            overflowY: 'auto',
                                                            bgcolor: '#ffffff',
                                                            border: '1px solid #e0e0e6',
                                                            borderRadius: 1,
                                                            p: 1
                                                        }}
                                                    >
                                                        {localFilters.map((filter, index) => (
                                                            <Chip
                                                                size='small'
                                                                key={index}
                                                                label={`${formatCamelCaseToTitle(filter.field)} ${filter.operator === 'eq' ? '=' : ':'} ${renderFilterValue(filter)}`}
                                                                onDelete={() => handleRemoveFilter(index, values)}
                                                                sx={{
                                                                    bgcolor: '#f1f1f1',
                                                                    color: '#292929',
                                                                    '&:hover': {
                                                                        color: '#000',
                                                                    },
                                                                    fontSize: '0.775rem'
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}

                                            {/* { && ( */}
                                            <>
                                                {hasDateField &&
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <Grid container spacing={2} pb={1}>
                                                            <Grid item xs={5.25}>
                                                                <DatePicker
                                                                    label={`${formatCamelCaseToTitle(dateFieldName || dateField)} From *`}
                                                                    disabled={isLoading || fetching || !dateFieldEnabled}
                                                                    value={values.startDate ? dayjs(values.startDate, 'DD/MM/YYYY') : null}
                                                                    onChange={(newValue) => {
                                                                        const formattedDate = newValue ? newValue.format('DD/MM/YYYY') : null;
                                                                        setFieldValue('startDate', formattedDate);
                                                                        if (formattedDate && values.endDate) {
                                                                            fetchData(localFilters, formattedDate, values.endDate);
                                                                        }
                                                                    }}
                                                                    minDate={dayjs().subtract(1, 'year')}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: 'small',
                                                                            fullWidth: true,
                                                                            error: touched.startDate && !!errors.startDate,
                                                                            helperText: touched.startDate && errors.startDate,
                                                                            sx: { bgcolor: 'white' },
                                                                        },
                                                                    }}
                                                                    format="DD/MM/YYYY"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={5.25}>
                                                                <DatePicker
                                                                    label={`${formatCamelCaseToTitle(dateFieldName || dateField)} To *`}
                                                                    disabled={isLoading || fetching || !dateFieldEnabled}
                                                                    value={values.endDate ? dayjs(values.endDate, 'DD/MM/YYYY') : null}
                                                                    onChange={(newValue) => {
                                                                        const formattedDate = newValue ? newValue.format('DD/MM/YYYY') : null;
                                                                        setFieldValue('endDate', formattedDate);
                                                                        if (values.startDate && formattedDate) {
                                                                            fetchData(localFilters, values.startDate, formattedDate);
                                                                        }
                                                                    }}
                                                                    minDate={values.startDate ? dayjs(values.startDate, 'DD/MM/YYYY') : dayjs()}
                                                                    slotProps={{
                                                                        textField: {
                                                                            size: 'small',
                                                                            fullWidth: true,
                                                                            error: touched.endDate && !!errors.endDate,
                                                                            helperText: touched.endDate && errors.endDate,
                                                                            sx: { bgcolor: 'white', margin: "0px", padding: "0px" },
                                                                        },
                                                                    }}

                                                                    format="DD/MM/YYYY"
                                                                />
                                                            </Grid>
                                                            <Grid item sx={{ paddingLeft: "0px" }} xs={1.5}>
                                                                <Checkbox
                                                                    size="small"
                                                                    checked={dateFieldEnabled}
                                                                    onChange={(event) => handleDefaultDateBoolean(event.target.checked)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </LocalizationProvider>
                                                }
                                            </>


                                            {/* )} */}

                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel sx={{ top: '-6px' }}>File Type *</InputLabel>
                                                <Select
                                                    size="small"
                                                    value={values.fileType}
                                                    onChange={(e) => setFieldValue('fileType', e.target.value)}
                                                    label="File Type *"
                                                    error={touched.fileType && !!errors.fileType}
                                                    sx={{ bgcolor: 'white' }}
                                                >
                                                    {FILE_TYPES.map((option) => (
                                                        <MenuItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {touched.fileType && errors.fileType && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                                                        {errors.fileType}
                                                    </Typography>
                                                )}
                                            </FormControl>

                                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                                {(isLoading || fetching) ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                        <CircularProgress size={20} thickness={5} sx={{ color: 'gray' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Loading data...
                                                        </Typography>
                                                    </Box>
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        color={previewData && previewData.length > 0 ? "" : "#ef6c00"}
                                                    >
                                                        {previewData !== null ?
                                                            (previewData.length > 0 ?
                                                                `Total ${dataByFilterCount} records (${previewData.length} Loaded)` :
                                                                "No records found" + (hasDateField ? " for the selected date range" : "")) :
                                                            "No records found!"}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ mt: 1, display: 'block', textAlign: 'center' }}
                                            >
                                                Note: Maximum 10,000 records can be exported at a time.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </DialogContent>

                            <DialogActions sx={{ px: 3, py: 2, borderTop: '1px dashed #e6e6e6' }}>
                                <Button
                                    onClick={handleDialogClose}
                                    variant="outlined"
                                    color="secondary"
                                    sx={{ mr: 1 }}
                                >
                                    Close
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={!isValid || isLoading || !previewData || previewData.length === 0 || fetching || isExporting}
                                >
                                    {isExporting ? "Exporting ..." : "Export"}
                                </Button>
                            </DialogActions>
                        </Form>
                    );
                }}
            </Formik>
        </Dialog>
    );
};

export default ExportFileModal;