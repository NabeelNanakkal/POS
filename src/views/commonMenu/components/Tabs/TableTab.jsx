import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Collapse,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  useMediaQuery,
  InputAdornment,
  FormControlLabel,
  Switch,
  Chip,
  Tooltip,
  Autocomplete
} from '@mui/material';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import ImagePreviewField from 'ui-component/ImagePreviewField';
import { useTheme } from '@mui/material/styles';
import { UploadFile } from '@mui/icons-material';
import dayjs from 'dayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ConfirmDialog from 'ui-component/ConfirmDialog';

const TableTab = ({ drawerItems = [], tableData = [], formik, title = '', mode, haveTabs = true }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const rows = formik.values[title] || [];
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteField, setDeleteField] = useState(null);

  const getButtonDisabledSx = (mode) => ({
    '&.Mui-disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'auto', // keep button "visible" but disabled
      opacity: 0.6,
      color: mode === 'view' ? '#999' : 'inherit',
      //   backgroundColor: mode === 'view' ? '#f0f0f0' : 'inherit',
      borderColor: mode === 'view' ? '#ccc' : 'inherit'
    }
  });

  const handleDeleteFile = (fieldName) => {
    setDeleteField(fieldName);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteField) {
      setFormData((prev) => ({
        ...prev,
        [deleteField]: null
      })); // updates / deletes the formData with the values, ie the local state.

      // also reset in Formik
      formik.setFieldValue(deleteField, null); // updates/ deletes the formik values
    }

    setDeleteDialogOpen(false);
    setDeleteField(null);
  };

  const getNestedValue = (obj, path) => {
    // runs for every data in the config, but the output  only changes if there is '.' in any of the fields in the config.
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  const handleChange = (e, field) => {
    // replaces the fields if present and adds if field is not present.
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    // Save preview for UI
    const previewUrl = URL.createObjectURL(file);

    // Store both preview & file info in state
    setFormData({
      ...formData,
      [field]: {
        file, // actual file object, can be uploaded later
        fileName: file.name, // display name
        url: previewUrl // for preview
      }
    });
  };

  const handleSubmit = () => {
    const rowData = {};

    drawerItems.forEach((item) => {
      let value = formData[item.fieldName] ?? '';

      if (item.type === 'file') {
        value = value ? value.url || value.fileName || '' : ''; // <-- always a string
        // value = value ? { fileName: value.fileName, url: value.url } : null; // for documents section or else the upper code is used.
      }

      if (item.type === 'objectDate' && value?.iso) {
        value = value.iso;
      }

      rowData[item.fieldName] = value;
    });

    const updatedRows = [...(formik.values[title] || [])];

    if (editIndex !== null) {
      updatedRows[editIndex] = rowData;
    } else {
      updatedRows.push(rowData);
    }

    formik.setFieldValue(title, updatedRows);
    setFormData({});
    setEditIndex(null);
    setShowForm(false);
  };

  const handleEditClick = (row, index) => {
    const flatRow = {};
    drawerItems.forEach((item) => {
      let value = row[item.fieldName] || '';

      if (item.type === 'objectDate' && value) {
        value = { __type: 'Date', iso: value }; // convert string to object for DatePicker
      }

      if (item.type === 'file' && value) {
        value = { url: value }; // convert URL string to object for preview
      }

      flatRow[item.fieldName] = value;
    });

    setFormData(flatRow);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteClick = (row, index) => {
    const updatedRows = [...(formik.values[title] || [])];
    updatedRows.splice(index, 1);
    formik.setFieldValue(title, updatedRows);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            disabled={mode?.toLowerCase() === 'view'}
            onClick={() => {
              setFormData({});
              setEditIndex(null);
              setShowForm((prev) => !prev);
            }}
            sx={{
              mb: 1,

              ...getButtonDisabledSx(mode)
            }}
          >
            {editIndex !== null ? `Edit ${title}` : `+ Add ${title}`}
          </Button>
        </Box>

        {/* Add/Edit Form */}
        <Collapse in={showForm}>
          <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9', mb: 2 }}>
            <Stack direction={isSmall ? 'column' : 'row'} spacing={2}>
              {drawerItems.map((item) => {
                // === FILE TYPE ===
                if (item.type === 'file') {
                  return (
                    <TextField
                      key={item.fieldName}
                      fullWidth
                      label={item.label}
                      size="small"
                      variant="outlined"

                      value={formData[item.fieldName]?.fileName || ''}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            {formData[item.fieldName] ? (
                              <ImagePreviewField
                                imageSrc={formData[item.fieldName]?.url}
                                fileName={formData[item.fieldName]?.fileName || 'Uploaded File'}
                                label={item.label}
                                fieldName={item.fieldName}
                                letDelete={true}
                                onDelete={handleDeleteFile}
                                isDrawer={true}
                              />
                            ) : (
                              <Tooltip title="Upload File" arrow>
                                <IconButton component="label">
                                  <UploadFile />
                                  <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                      if (e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        handleFileChange(item.fieldName, file);
                                      }
                                    }}
                                  />
                                </IconButton>
                              </Tooltip>
                            )}
                          </InputAdornment>
                        )
                      }}
                    />
                  );
                }

                // === BOOLEAN TYPE ===
                if (item.type === 'boolean') {
                  return (
                    <FormControlLabel
                      key={item.fieldName}
                      control={
                        <Switch
                          checked={!!formData[item.fieldName]}
                          onChange={(e) => handleChange({ target: { value: e.target.checked } }, item.fieldName)}
                          disabled={mode?.toLowerCase() === 'view' || item?.isNotEditable}

                        />
                      }
                      label={item.label}
                    />
                  );
                }

                // === OBJECT DATE TYPE ===
                if (item.type === 'objectDate') {
                  const isYearOnly = item.dateType === 'year'; // custom property to distinguish year vs full date

                  return (
                    <LocalizationProvider key={item.fieldName} dateAdapter={AdapterDayjs}>
                      <DatePicker
                        views={isYearOnly ? ['year'] : ['year', 'month', 'day']} // :point_left: year only or full date
                        label={item.label}
                        value={formData[item.fieldName]?.iso ? dayjs(formData[item.fieldName].iso) : null}
                        onChange={(newValue) => {
                          if (!newValue) {
                            setFormData({ ...formData, [item.fieldName]: null });
                            return;
                          }
                          setFormData({
                            ...formData,
                            [item.fieldName]: {
                              __type: 'Date',
                              iso: newValue.toISOString()
                            }
                          });
                        }}
                        format={isYearOnly ? 'YYYY' : 'D MMM YYYY'}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: Boolean(formik.touched[item.fieldName] && formik.errors[item.fieldName]),
                            helperText: formik.touched[item.fieldName] && formik.errors[item.fieldName],
                            disabled: mode?.toLowerCase() === 'view' || item?.isNotEditable,
                            InputLabelProps: { shrink: true },
                            sx: {
                              ...(item?.isNotEditable && {
                                cursor: 'not-allowed',
                                '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: 'inherit', cursor: 'not-allowed' },
                                '& .MuiOutlinedInput-root.Mui-disabled': { backgroundColor: 'transparent', cursor: 'not-allowed' },
                                '& .MuiFormLabel-root.Mui-disabled': { color: 'inherit' },
                                '& .MuiIconButton-root': { pointerEvents: 'none', cursor: 'not-allowed' },
                                '& .MuiSvgIcon-root': { color: 'inherit', cursor: 'not-allowed' }
                              })
                            }
                          }
                        }}
                      />
                    </LocalizationProvider>
                  );
                }

                // === AUTOCOMPLETE TYPE ===
                if (item.type === 'autocomplete') {
                  return (
                    <Autocomplete
                      key={item.fieldName}
                      disablePortal
                      disabled={mode === 'view' || item?.isNotEditable}
                      options={item?.options ?? []} // array of objects: { label, value }
                      value={item?.options?.find((opt) => String(opt.value) === String(formik.values[item.fieldName])) || null}
                      onChange={(event, newValue) => {
                        const selectedValue = newValue ? newValue.value : '';
                        setFormData((prev) => ({ ...prev, [item.fieldName]: selectedValue })); // <-- store in formData
                        formik.setFieldValue(item.fieldName, selectedValue); // <-- store in Formik
                      }}
                      getOptionLabel={(option) => option.label || ''} // what shows in the dropdown
                      isOptionEqualToValue={(option, value) => option.value === value?.value} // correctly compare objects
                      sx={{
                        width: '100%',
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={item.label}
                          size="small"
                        />
                      )}
                    />
                  );
                }

                // === DEFAULT TEXT INPUT ===
                return (
                  <TextField
                    key={item.fieldName}
                    label={item.label}
                    size="small"
                    type={item.type || 'text'}
                    value={formData[item.fieldName] || ''}
                    onChange={(e) => handleChange(e, item.fieldName)}
                    fullWidth
                    {...(item.type === 'date' ? { InputLabelProps: { shrink: true } } : {})}
                    disabled={mode?.toLowerCase() === 'view' || item?.isNotEditable}
                  />
                );
              })}

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  alignSelf: 'flex-start'
                }}
              >
                {editIndex !== null ? 'Update' : 'Submit'}
              </Button>
            </Stack>
          </Box>
        </Collapse>

        {/* Table */}
        {rows.length > 0 && (
          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              maxHeight: haveTabs ? 300 : 400,
              overflowY: 'auto',
              overflowX: 'auto',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '0.1px solid #ccc',
              '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px'
              },
              '&::-webkit-scrollbar-track': {
                borderRadius: '10px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#cfcccc',
                borderRadius: '10px'
              }
            }}
          >
            <Table stickyHeader sx={{ minWidth: 650, tableLayout: 'fixed' }}>
              <TableHead
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 3,
                  backgroundColor: 'background.paper',
                  '& .MuiTableCell-head': {
                    background: `linear-gradient(180deg, ${theme.palette.background.tableHead} 0%, ${theme.palette.background.paper} 100%)`,
                    borderBottom: '1px solid #ccc',
                    padding: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }
                }}
              >
                <TableRow>
                  <TableCell>Sl. No</TableCell> {/* Add this */}
                  {drawerItems.map((col) => (
                    <TableCell key={col.label}>{col.label}</TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={drawerItems.length + 1} align="center" sx={{ padding: 2 }}>
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: mode === 'view' ? 'default' : 'pointer',
                        '&:hover': { backgroundColor: '#fafafa' },
                        height: 50,
                        '& td, & th': {
                          paddingTop: 0,
                          paddingBottom: 0,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }
                      }}
                    >
                      <TableCell>{rowIndex + 1}</TableCell> {/* Serial number column */}
                      {drawerItems.map((col, colIndex) => {
                        let value = getNestedValue(row, col.fieldName); // <-- use this
                        if (col.type === 'file') {
                          value = value || null; // URL string
                          return (
                            <TableCell key={colIndex}>
                              {value ? (
                                <ImagePreviewField
                                  imageSrc={typeof value === 'string' ? value : value.url} // <-- ensure string
                                  fileName={col.label}
                                  label={col.label}
                                  isDrawer
                                />
                              ) : (
                                '--'
                              )}
                            </TableCell>
                          );
                        }

                        if (col.type === 'boolean') {
                          return (
                            <TableCell key={colIndex}>
                              {value === true ? (
                                <Chip label="Yes" size="small" variant="outlined" sx={{ borderColor: 'green', color: 'green' }} />
                              ) : value === false ? (
                                <Chip label="No" size="small" variant="outlined" sx={{ borderColor: 'red', color: 'red' }} />
                              ) : (
                                '--'
                              )}
                            </TableCell>
                          );
                        }

                        if (col.type === 'objectDate') {
                          return <TableCell key={colIndex}>{value ? dayjs(value).format('DD-MM-YYYY') : '--'}</TableCell>;
                        }

                        if (col.type === 'autocomplete') {
                          const selectedOption = col.options?.find((opt) => String(opt.value) === String(value));
                          return <TableCell key={colIndex}>{selectedOption ? selectedOption.label : '--'}</TableCell>;
                        }

                        return <TableCell key={colIndex}>{value || '--'}</TableCell>;
                      })}
                      {/* Actions */}
                      <TableCell sx={{ paddingLeft: 1 }}>
                        <IconButton
                          disabled={mode === 'view'}
                          onClick={() => handleEditClick(row, rowIndex)}
                          sx={{
                            ...getButtonDisabledSx(mode),
                            color: '#4343eeff'
                          }}
                        >
                          <IconEdit size={20} />
                        </IconButton>

                        <IconButton
                          disabled={mode === 'view'}
                          onClick={() => handleDeleteClick(row, rowIndex)}
                          sx={{
                            ...getButtonDisabledSx(mode),
                            color: '#da200cff'
                          }}
                        >
                          <IconTrash size={20} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </>
  );
};

export default TableTab;
