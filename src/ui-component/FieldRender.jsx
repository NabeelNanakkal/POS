import React from 'react';
import {
    Grid,
    Divider,
    Tooltip,
    Checkbox,
    TextField,
    Typography,
    IconButton,
    Autocomplete,
    InputAdornment,
    FormControlLabel,
} from '@mui/material';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import CommonButton from '../views/commonMenu/components/Buttons/CommonButton';
import { UploadFile } from '@mui/icons-material';
import ImagePreviewField from './ImagePreviewField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { IconExternalLink, IconFolderSymlink } from '@tabler/icons-react';
import { getFormattedValue, parseDateValue, visibility } from 'utils/fieldUtils';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

const FieldRender = ({
    item,
    role,
    mode,
    index,
    formik,
    menuConfig,
    selectedData,
    getFieldSize,
    getDisabledSx,
    setSelectedData,
    handleDeleteFile,
    handleFileChange,
}) => {

    if (!visibility(item, selectedData, role) || (item.type === 'button' && !isButtonAccessible(item))) {
        return null;
    }
    return (
        <Grid size={{ xs: 12, md: getFieldSize(item.size) }} display={item?.display || ''} key={index}>
            {item.type === 'boolean' ? (
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ paddingLeft: '12px' }}
                            checked={
                                selectedData[item.fieldName] === 'TRUE' ||
                                selectedData[item.fieldName] === true ||
                                selectedData[item.fieldName] === 1 ||
                                selectedData[item.fieldName] === 'Yes'
                            }
                            disabled={mode === 'view'}
                            readOnly
                            disableRipple
                        />
                    }
                    label={item.label}
                />
            ) : item.type === 'divider' ? (
                <Divider sx={{ marginTop: '5px' }} textAlign="center">
                    {item?.label}
                </Divider>
            ) : item.type === 'button' ? (
                <CommonButton
                    sx={{ marginTop: 0.5, py: 1 }}
                    label={item.label}
                    toolTip={item.toolTip}
                    actionType={item.action}
                    variant={item.variant || 'outlined'}
                    color={item.color || 'primary'}
                    size={item.size || 'small'}
                    endIcon={item.icon || ''}
                    data={{ data: selectedData, setSelectedData: setSelectedData }}
                    menuConfig={menuConfig}
                    disabled={mode === 'view'}
                />
            ) : item.type === 'image' ? (
                <TextField
                    fullWidth
                    label={item.label}
                    readOnly
                    disabled={mode === 'view'}
                    variant="outlined"
                    sx={{
                        ...getDisabledSx(mode)
                    }}
                    InputProps={{
                        readOnly: true,
                        sx: {
                            ...getDisabledSx(mode),
                            pr: '20px'
                        },
                        endAdornment: (
                            <InputAdornment position="end">
                                {selectedData[item.fieldName] ? (
                                    <ImagePreviewField
                                        imageSrc={selectedData[item.fieldName]}
                                        label={item.label}
                                        fileName={item.fileName}
                                        isDrawer={true}
                                        onDelete={mode === 'view' ? undefined : handleDeleteFile}
                                        letDelete={mode !== 'view'}
                                        fieldName={item.fieldName}
                                    />
                                ) : (
                                    <Tooltip title="Upload File" arrow>
                                        <span>
                                            <IconButton
                                                component="label"
                                                size="small"
                                                disabled={mode === 'view'}
                                                sx={{
                                                    pointerEvents: mode === 'view' ? 'none' : 'auto',
                                                    cursor: mode === 'view' ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                <UploadFile />
                                                <input
                                                    type="file"
                                                    hidden
                                                    disabled={mode === 'view'}
                                                    onChange={(e) => {
                                                        if (e.target.files.length > 0) {
                                                            handleFileChange(item.fieldName, e.target.files[0]);
                                                        }
                                                    }}
                                                />
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                )}
                            </InputAdornment>
                        )
                    }}
                />
            ) : item.type === 'nameWithSalutation' ? (
                <TextField
                    label={item.label}
                    disabled={mode === 'view' || item?.isNotEditable}
                    variant="outlined"
                    fullWidth
                    name={item.fieldName}
                    value={formik.values[item.fieldName] ?? ''}
                    onChange={(e) => {
                        formik.handleChange(e);
                        formik.setFieldTouched(item.fieldName, true, false);
                    }}
                    sx={{
                        ...getDisabledSx(mode)
                    }}
                    InputLabelProps={{
                        sx: { ml: 8.6, px: 1, backgroundColor: 'white' }
                    }}
                    InputProps={{
                        sx: { pl: 0 },
                        startAdornment: (
                            <Autocomplete
                                disablePortal
                                disableClearable
                                disabled={mode === 'view'}
                                options={item?.options ?? []}
                                value={formik.values[item.salutationFieldName]}
                                onChange={(event, newValue) => {
                                    formik.setFieldValue(item.salutationFieldName, newValue);
                                }}
                                ListboxProps={{
                                    sx: {
                                        maxHeight: 134,
                                        overflowY: 'auto',
                                        '&::-webkit-scrollbar': { width: '6px' },
                                        '&::-webkit-scrollbar-track': { background: '#f0f0f0', borderRadius: '50%' },
                                        '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '50%' },
                                        '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                                        scrollbarWidth: 'thin',
                                        scrollbarColor: '#888 #f0f0f0'
                                    }
                                }}
                                sx={{
                                    minWidth: 75,
                                    marginRight: '8px',
                                    '& .MuiOutlinedInput-root': {
                                        height: 51,
                                        pr: '10px !important',
                                        '& fieldset': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                                        '&.Mui-focused fieldset': { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                                    },
                                    '& .MuiAutocomplete-input': { padding: '2px 3px !important' },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Salutation"
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                                            '& input::placeholder': { textAlign: 'center' },
                                            ...getDisabledSx(mode)
                                        }}
                                    />
                                )}
                            />
                        )
                    }}
                />
            ) : item.type === 'objectDate' ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={item.label}
                        disabled={mode === 'view' || item?.isNotEditable}
                        value={parseDateValue(formik.values[item.fieldName])}
                        onChange={(newValue) => {
                            const fieldValue = newValue && newValue.isValid() ? newValue.toISOString() : null;
                            formik.setFieldValue(item.fieldName, fieldValue, true);
                            setTimeout(() => {
                                formik.setFieldTouched(item.fieldName, true, true);
                            }, 0);
                        }}
                        format="D MMM YYYY"
                        onClose={() => formik.setFieldTouched(item.fieldName, true)}
                        sx={{ width: '100%' }}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: item.required,
                                error: Boolean(formik.touched[item.fieldName] && formik.errors[item.fieldName]),
                                helperText:
                                    formik.touched[item.fieldName] && formik.errors[item.fieldName]
                                        ? formik.errors[item.fieldName]
                                        : item.helperText || ''
                            }
                        }}
                    />
                </LocalizationProvider>
            ) : item.type === 'time' ? (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                        label={item.label}
                        disabled={mode === 'view' || item?.isNotEditable}
                        value={parseDateValue(formik.values[item.fieldName])}
                        onChange={(newValue) => {
                            if (!newValue || !newValue.isValid()) {
                                formik.setFieldValue(item.fieldName, null, true);
                                setTimeout(() => {
                                    formik.setFieldTouched(item.fieldName, true, true);
                                }, 0);
                                return;
                            }
                            const currentDate = parseDateValue(formik.values[item.fieldName]);
                            const baseDate = currentDate && currentDate.isValid() ? currentDate : dayjs();
                            const updated = baseDate.hour(newValue.hour()).minute(newValue.minute()).second(0).millisecond(0);
                            formik.setFieldValue(item.fieldName, updated.isValid() ? updated.toISOString() : null, true);
                            setTimeout(() => {
                                formik.setFieldTouched(item.fieldName, true, true);
                            }, 0);
                        }}
                        format="hh:mm A"
                        onClose={() => formik.setFieldTouched(item.fieldName, true)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                required: item.required,
                                error: Boolean(formik.touched[item.fieldName] && formik.errors[item.fieldName]),
                                helperText:
                                    formik.touched[item.fieldName] && formik.errors[item.fieldName]
                                        ? formik.errors[item.fieldName]
                                        : item.helperText || '',
                                InputProps: {
                                    readOnly: item?.isNotEditable,
                                    sx: getDisabledSx(mode)
                                }
                            }
                        }}
                    />
                </LocalizationProvider>
            ) : item.type === 'autocomplete' ? (
                <Autocomplete
                    disablePortal
                    disabled={mode === 'view' || item?.isNotEditable}
                    options={item?.options ?? []}
                    value={formik.values[item.fieldName]}
                    onChange={(event, newValue) => {
                        formik.setFieldValue(item.fieldName, newValue, true);
                    }}
                    onBlur={() => formik.setFieldTouched(item.fieldName, true)}
                    sx={{
                        width: '100%',
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={item.fieldName}
                            sx={{
                                ...getDisabledSx(mode)
                            }}
                            error={Boolean(formik.touched[item.fieldName] && formik.errors[item.fieldName])}
                            helperText={
                                formik.touched[item.fieldName] && formik.errors[item.fieldName]
                                    ? formik.errors[item.fieldName]
                                    : item.helperText || ''
                            }
                        />
                    )}
                />
            ) : (
                <TextField
                    label={item.label}
                    disabled={mode === 'view' || item?.isNotEditable}
                    variant="outlined"
                    fullWidth
                    name={item.fieldName}
                    value={
                        item.type === 'url' || item.type === 'redirect'
                            ? getFormattedValue(item, selectedData)
                            : item.type === 'number'
                                ? formik.values[item.fieldName] ?? '' // Use raw Formik value for number
                                : item.type === 'date' ||
                                    item.type === 'cash' ||
                                    item.type === 'dateTime' ||
                                    item.type === 'duration' ||
                                    item.type === 'distance'
                                    ? getFormattedValue(item, selectedData)
                                    : (formik.values[item.fieldName] ?? '')
                    }
                    onChange={(e) => {
                        if (item.type === 'number') {
                            // Parse number input as integer
                            const value = e.target.value ? parseInt(e.target.value, 10) : '';
                            formik.setFieldValue(item.fieldName, isNaN(value) ? '' : value);
                        } else {
                            formik.handleChange(e);
                        }
                        formik.setFieldTouched(item.fieldName, true, false);
                    }}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.touched[item.fieldName] && formik.errors[item.fieldName])}
                    helperText={
                        formik.touched[item.fieldName] && formik.errors[item.fieldName]
                            ? formik.errors[item.fieldName]
                            : item.helperText || ''
                    }
                    sx={{
                        ...getDisabledSx(mode),
                        ...(item?.isNotEditable && {
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'inherit',
                                cursor: 'not-allowed'
                            },
                            '& .MuiOutlinedInput-root.Mui-disabled': {
                                backgroundColor: 'transparent',
                                cursor: 'not-allowed'
                            },
                            '& .MuiFormLabel-root.Mui-disabled': {
                                color: 'inherit'
                            }
                        })
                    }}
                    multiline={!!item.multiline}
                    type={item.type === 'number' ? 'number' : 'text'} // Set input type to number
                    InputProps={{
                        startAdornment:
                            (item.type === 'url' && selectedData[item.fieldName]) ||
                                (item.type === 'redirect' && selectedData[item.fieldName]) ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {item.type === 'url' && selectedData[item.fieldName] ? (
                                        <Tooltip title={item.hint || 'Open URL'}>
                                            <a
                                                style={{
                                                    color: '#147bdb',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'auto',
                                                    textOverflow: 'unset',
                                                    display: 'inline',
                                                    textDecoration: 'none'
                                                }}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    navigator.clipboard
                                                        .writeText(selectedData[item?.fieldName])
                                                        .then(() => {
                                                            toast.info('Copied to clipboard', { autoClose: 1000 });
                                                        })
                                                        .catch((err) => {
                                                            console.error('Failed to copy: ', err);
                                                            toast.error('Failed to copy to clipboard');
                                                        });
                                                    if (!selectedData[item.fieldName]?.startsWith('http')) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                href={
                                                    selectedData[item.fieldName]
                                                        ? selectedData[item.fieldName].startsWith('http://') ||
                                                            selectedData[item.fieldName].startsWith('https://')
                                                            ? selectedData[item.fieldName]
                                                            : `https://${selectedData[item.fieldName]}`
                                                        : undefined
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {selectedData[item.fieldName]}
                                                <IconExternalLink style={{ marginBottom: '-3px' }} size={18} stroke={2} />
                                            </a>
                                        </Tooltip>
                                    ) : item.type === 'redirect' && selectedData[item.fieldName] ? (
                                        <Tooltip title={item.hint || 'Redirect'}>
                                            <Typography
                                                style={{
                                                    color: '#466685',
                                                    fontWeight: 500,
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    display: 'inline-block',
                                                    width: `${getFieldSize(item.size) * 65}px`
                                                }}
                                                onClick={() => {
                                                    const url = item.url;
                                                    const state = JSON.stringify({
                                                        ...(item.isRedirectByID
                                                            ? {
                                                                isById: true,
                                                                id: selectedData[item.idField ? item.idField : item.fieldName]
                                                            }
                                                            : {
                                                                item: [
                                                                    {
                                                                        field: item.paramField || item.fieldName,
                                                                        value: selectedData[item.fieldName]
                                                                    },
                                                                    ...(item.additionalParam
                                                                        ? [
                                                                            {
                                                                                field: item.additionalParam,
                                                                                value: selectedData[item.additionalParam]
                                                                            }
                                                                        ]
                                                                        : [])
                                                                ]
                                                            }),
                                                        doDrawerOpen: true
                                                    });
                                                    const encodedState = encodeURIComponent(state);
                                                    if (item.currentTab) {
                                                        window.location.href = `${url}?state=${encodedState}`;
                                                    } else {
                                                        window.open(`${url}?state=${encodedState}`, '_blank');
                                                    }
                                                }}
                                            >
                                                {selectedData[item.fieldName]}
                                                <IconFolderSymlink
                                                    style={{ marginBottom: '-3px', marginLeft: '8px' }}
                                                    size={18}
                                                    stroke={2}
                                                />
                                            </Typography>
                                        </Tooltip>
                                    ) : null}
                                </div>
                            ) : null
                    }}
                />
            )}
        </Grid>
    );
};

export default FieldRender;