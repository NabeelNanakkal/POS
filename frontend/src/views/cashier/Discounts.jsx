import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Drawer,
  Stack,
  Dialog,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Grid,
  Switch,
  FormControlLabel,
  Autocomplete
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PercentIcon from '@mui/icons-material/Percent';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import NoDataLottie from 'components/NoDataLottie';
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } from 'container/discount/slice';
import { fetchProducts } from 'container/product/slice';
import { fetchCategories } from 'container/category/slice';
import { getCurrencySymbol } from 'utils/formatAmount';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, discountName }) => {
  const theme = useTheme();
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{ 
        sx: { 
          borderRadius: 5, 
          p: 1, 
          maxWidth: 400, 
          width: '100%',
          boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
        } 
      }}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.error.main, 0.1), color: 'error.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
          <WarningAmberIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Discount?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
          Are you sure you want to delete <strong>{discountName}</strong>? This action cannot be undone.
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={onClose}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', border: '1px solid #e2e8f0', color: 'text.secondary' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            fullWidth 
            onClick={onConfirm}
            sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', boxShadow: `0 8px 16px ${alpha(theme.palette.error.main, 0.2)}` }}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};

const Discounts = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { discounts, loading } = useSelector((state) => state.discount);
  const { products } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formState, setFormState] = useState({
    name: '',
    code: '',
    description: '',
    type: 'PERCENTAGE',
    value: 0,
    applicableTo: 'ALL_PRODUCTS',
    products: [],
    categories: [],
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    validFrom: dayjs(),
    validTo: dayjs().add(30, 'day'),
    isActive: true,
    usageLimit: null
  });

  useEffect(() => {
    dispatch(fetchDiscounts());
    dispatch(fetchProducts({ page: 1, limit: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleEditClick = (discount) => {
    setSelectedDiscount(discount);
    setFormState({
      name: discount.name || '',
      code: discount.code || '',
      description: discount.description || '',
      type: discount.type || 'PERCENTAGE',
      value: discount.value || 0,
      applicableTo: discount.applicableTo || 'ALL_PRODUCTS',
      products: discount.products || [],
      categories: discount.categories || [],
      minPurchaseAmount: discount.minPurchaseAmount || 0,
      maxDiscountAmount: discount.maxDiscountAmount || null,
      validFrom: discount.validFrom ? dayjs(discount.validFrom) : dayjs(),
      validTo: discount.validTo ? dayjs(discount.validTo) : dayjs().add(30, 'day'),
      isActive: discount.isActive !== false,
      usageLimit: discount.usageLimit || null
    });
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDiscount(null);
    setFormState({
      name: '',
      code: '',
      description: '',
      type: 'PERCENTAGE',
      value: 0,
      applicableTo: 'ALL_PRODUCTS',
      products: [],
      categories: [],
      minPurchaseAmount: 0,
      maxDiscountAmount: null,
      validFrom: dayjs(),
      validTo: dayjs().add(30, 'day'),
      isActive: true,
      usageLimit: null
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (discount) => {
    setDiscountToDelete(discount);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteDiscount({ id: discountToDelete._id || discountToDelete.id }));
    setIsDeleteDialogOpen(false);
    setDiscountToDelete(null);
  };

  const handleSaveDiscount = () => {
    const payload = {
      ...formState,
      validFrom: formState.validFrom.toISOString(),
      validTo: formState.validTo.toISOString(),
      products: formState.products.map(p => p._id || p.id || p),
      categories: formState.categories.map(c => c._id || c.id || c)
    };

    if (selectedDiscount) {
      dispatch(updateDiscount({ id: selectedDiscount._id || selectedDiscount.id, ...payload }));
    } else {
      dispatch(createDiscount(payload));
    }
    setIsDrawerOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDiscounts = (discounts && Array.isArray(discounts) ? discounts : []).filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.code && d.code.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const validFrom = dayjs(d.validFrom);
    const validTo = dayjs(d.validTo);
    
    let matchesDate = true;
    if (filterDateFrom) {
      matchesDate = matchesDate && (validTo.isAfter(filterDateFrom) || validTo.isSame(filterDateFrom, 'day'));
    }
    if (filterDateTo) {
      matchesDate = matchesDate && (validFrom.isBefore(filterDateTo) || validFrom.isSame(filterDateTo, 'day'));
    }

    return matchesSearch && matchesDate;
  });

  const paginatedDiscounts = filteredDiscounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setPage(0);
  };

  const isValidDiscount = (discount) => {
    const now = new Date();
    const validFrom = new Date(discount.validFrom);
    const validTo = new Date(discount.validTo);
    return discount.isActive && now >= validFrom && now <= validTo;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        height: '100vh', 
        overflowY: 'auto', 
        bgcolor: '#f8fafc',
        m: -3,
        backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
      }}>
        <DeleteConfirmationDialog 
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          discountName={discountToDelete?.name}
        />

        {/* Toolbar */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4, 
            borderRadius: 4, 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems="center"
            sx={{ width: '100%' }}
          >
            {/* Search Field */}
            <Box sx={{ flex: 1.5, minWidth: { md: 250 } }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search discounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: 3, 
                    bgcolor: 'white', 
                    border: '1px solid #f1f5f9', 
                    '& fieldset': { border: 'none' },
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                  }
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} sx={{ flexGrow: 1, justifyContent: { md: 'flex-end' } }}>
              <DatePicker
                label="Valid From"
                value={filterDateFrom}
                onChange={(newValue) => setFilterDateFrom(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small',
                    sx: { 
                      maxWidth: 150, 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3, 
                        bgcolor: 'white',
                        border: '1px solid #f1f5f9',
                        '& fieldset': { border: 'none' },
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                      } 
                    }
                  }
                }}
              />
              <DatePicker
                label="Valid To"
                value={filterDateTo}
                onChange={(newValue) => setFilterDateTo(newValue)}
                slotProps={{ 
                  textField: { 
                    size: 'small',
                    sx: { 
                      maxWidth: 150, 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: 3, 
                        bgcolor: 'white',
                        border: '1px solid #f1f5f9',
                        '& fieldset': { border: 'none' },
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                      } 
                    }
                  }
                }}
              />
              <IconButton 
                onClick={handleClearFilters}
                disabled={!searchQuery && !filterDateFrom && !filterDateTo}
                sx={{ 
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  color: 'error.main',
                  borderRadius: 2,
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                  '&.Mui-disabled': { bgcolor: 'transparent' }
                }}
              >
                <RestartAltIcon />
              </IconButton>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontWeight: 800, 
                  px: 3, 
                  height: 40,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                  '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
                }}
              >
                Add Discount
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 4, 
            border: '1px solid', 
            borderColor: 'divider', 
            overflow: 'hidden',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.02)'
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', py: 2 }}>Discount</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Value</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Validity</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Usage Count</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Total Savings</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', textAlign: 'right', pr: 3 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDiscounts.length > 0 ? (
                  paginatedDiscounts.map((discount) => (
                    <TableRow key={discount._id || discount.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', display: 'flex' }}>
                            <LocalOfferIcon sx={{ fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{discount.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontFamily="monospace">{discount.code}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={discount.type} 
                          size="small" 
                          icon={discount.type === 'PERCENTAGE' ? <PercentIcon /> : undefined}
                          sx={{ 
                            fontWeight: 700, 
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.info.main, 0.1),
                            color: theme.palette.info.main
                          }} 
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="warning.main">
                          {discount.type === 'PERCENTAGE' ? `${discount.value}%` : `${getCurrencySymbol()}${discount.value.toLocaleString()}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(discount.validFrom).toLocaleDateString()} - {new Date(discount.validTo).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                          {discount.usageCount || 0} {discount.usageLimit ? `/ ${discount.usageLimit}` : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="success.main" fontWeight={800}>
                          {getCurrencySymbol()}{(discount.totalDiscountAmount || 0).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={isValidDiscount(discount) ? 'Active' : 'Inactive'} 
                          size="small" 
                          sx={{ 
                            fontWeight: 800, 
                            borderRadius: 2,
                            bgcolor: isValidDiscount(discount) ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                            color: isValidDiscount(discount) ? theme.palette.success.main : theme.palette.error.main
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => handleEditClick(discount)} sx={{ color: 'primary.main' }}>
                            <EditOutlinedIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteClick(discount)} sx={{ color: 'error.main' }}>
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <NoDataLottie message="No discounts found" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredDiscounts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ 
              mt: 2,
              '& .MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                fontWeight: 700,
                color: 'text.secondary'
              }
            }}
          />
        </Paper>

        {/* Drawer */}
        <Drawer 
          anchor="right" 
          open={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          PaperProps={{ 
            sx: { 
              width: { xs: '100%', sm: 600 }, 
              p: 3, 
              overflowY: 'auto'
            } 
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4,
            '& .MuiFormLabel-asterisk': {
              color: 'red'
            }
          }}>
            <Typography variant="h4" fontWeight={800}>{selectedDiscount ? 'Edit Discount' : 'Add Discount'}</Typography>
            <IconButton onClick={() => setIsDrawerOpen(false)}><CloseIcon /></IconButton>
          </Box>

          <Stack spacing={3} sx={{ 
            '& .MuiFormLabel-asterisk': {
              color: 'red'
            }
          }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Discount Name"
                  fullWidth
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Discount Code"
                  fullWidth
                  value={formState.code}
                  onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                  required
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={2}
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth required>
                  <InputLabel>Discount Type</InputLabel>
                  <Select
                    value={formState.type}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                    label="Discount Type"
                  >
                    <MenuItem value="PERCENTAGE">Percentage</MenuItem>
                    <MenuItem value="FIXED_AMOUNT">Fixed Amount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label={formState.type === 'PERCENTAGE' ? 'Percentage (%)' : `Amount (${getCurrencySymbol()})`}
                  fullWidth
                  type="number"
                  value={formState.value}
                  onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                          setFormState({ ...formState, value: parseFloat(val) || 0 });
                      }
                  }}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
            </Grid>

            <FormControl fullWidth>
              <InputLabel>Applicable To</InputLabel>
              <Select
                value={formState.applicableTo}
                onChange={(e) => setFormState({ ...formState, applicableTo: e.target.value })}
                label="Applicable To"
              >
                <MenuItem value="ALL_PRODUCTS">All Products</MenuItem>
                <MenuItem value="SPECIFIC_PRODUCTS">Specific Products</MenuItem>
                <MenuItem value="SPECIFIC_CATEGORIES">Specific Categories</MenuItem>
              </Select>
            </FormControl>

            {formState.applicableTo === 'SPECIFIC_PRODUCTS' && (
              <Autocomplete
                multiple
                options={products || []}
                getOptionLabel={(option) => option.name || ''}
                value={formState.products}
                onChange={(e, newValue) => setFormState({ ...formState, products: newValue })}
                renderInput={(params) => <TextField {...params} label="Select Products" />}
              />
            )}

            {formState.applicableTo === 'SPECIFIC_CATEGORIES' && (
              <Autocomplete
                multiple
                options={categories || []}
                getOptionLabel={(option) => option.name || ''}
                value={formState.categories}
                onChange={(e, newValue) => setFormState({ ...formState, categories: newValue })}
                renderInput={(params) => <TextField {...params} label="Select Categories" />}
              />
            )}

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Min Purchase Amount"
                  fullWidth
                  type="number"
                  value={formState.minPurchaseAmount}
                  onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                          setFormState({ ...formState, minPurchaseAmount: parseFloat(val) || 0 });
                      }
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Max Discount Amount"
                  fullWidth
                  type="number"
                  value={formState.maxDiscountAmount || ''}
                  onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                          setFormState({ ...formState, maxDiscountAmount: parseFloat(val) || null });
                      }
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Valid From"
                  value={formState.validFrom}
                  onChange={(newValue) => setFormState({ ...formState, validFrom: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="Valid To"
                  value={formState.validTo}
                  onChange={(newValue) => setFormState({ ...formState, validTo: newValue })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Usage Limit (Optional)"
              fullWidth
              type="number"
              value={formState.usageLimit || ''}
              onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || parseInt(val) >= 0) {
                      setFormState({ ...formState, usageLimit: parseInt(val) || null });
                  }
              }}
              inputProps={{ min: 0 }}
              helperText="Leave empty for unlimited usage"
            />

            <FormControlLabel
              control={
                <Switch 
                  checked={formState.isActive} 
                  onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                />
              }
              label="Active"
            />

            <Button 
              variant="contained" 
              fullWidth 
              onClick={handleSaveDiscount}
              disabled={!formState.name || !formState.code || !formState.value}
              sx={{ borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', mt: 'auto' }}
            >
              {selectedDiscount ? 'Update Discount' : 'Create Discount'}
            </Button>
          </Stack>
        </Drawer>
      </Box>
    </LocalizationProvider>
  );
};

export default Discounts;
