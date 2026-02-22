import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
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
  Grid,
  TablePagination
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StarsIcon from '@mui/icons-material/Stars';

import NoDataLottie from 'components/NoDataLottie';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from 'container/customer/slice';
import { formatAmountWithComma } from 'utils/formatAmount';

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, customerName }) => {
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
        <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Customer?</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
          Are you sure you want to delete <strong>{customerName}</strong>? This action cannot be undone.
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

const Customers = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { customers, loading, pagination } = useSelector((state) => state.customer);


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    loyaltyPoints: 0,
    isActive: true
  });

  useEffect(() => {
    const formattedStart = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
    const formattedEnd = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
    dispatch(fetchCustomers({ page: page + 1, limit: rowsPerPage, startDate: formattedStart, endDate: formattedEnd }));
  }, [dispatch, page, rowsPerPage, startDate, endDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormState({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      loyaltyPoints: customer.loyaltyPoints || 0,
      isActive: customer.isActive !== false
    });
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setFormState({
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      loyaltyPoints: 0,
      isActive: true
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteCustomer({ id: customerToDelete._id || customerToDelete.id }));
    setIsDeleteDialogOpen(false);
    setCustomerToDelete(null);
  };

  const handleSaveCustomer = () => {
    if (selectedCustomer) {
      dispatch(updateCustomer({ id: selectedCustomer._id || selectedCustomer.id, ...formState }));
    } else {
      dispatch(createCustomer(formState));
    }
    setIsDrawerOpen(false);
  };

  const filteredCustomers = (Array.isArray(customers) ? customers : []).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.phone && c.phone.includes(searchQuery))
  );

  return (
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
        customerName={customerToDelete?.name}
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
          gap: 2,
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between'
        }}
      >
        <TextField 
          placeholder="Search by name, email, or phone..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, maxWidth: { md: 400 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
          }}
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DatePicker
              label="From"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: 160, bgcolor: 'white', borderRadius: 2 } 
                } 
              }}
            />
            <DatePicker
              label="To"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small', 
                  sx: { width: 160, bgcolor: 'white', borderRadius: 2 } 
                } 
              }}
            />
            {(startDate || endDate) && (
              <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                onClick={() => { setStartDate(null); setEndDate(null); }}
                sx={{ borderRadius: 2, height: 40 }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </LocalizationProvider>
        

      </Paper>

      {/* Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #eee' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Loyalty Points</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Last Visit</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Last Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
                <TableRow key={customer._id || customer.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" fontWeight={700} sx={{ fontSize: '1.2rem' }}>
                          {customer.name?.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={700}>{customer.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{customer.email || 'No email'}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{customer.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <StarsIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                      <Typography variant="body2" fontWeight={700} color="warning.main">
                        {customer.loyaltyPoints || 0}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {customer.lastPurchaseDate ? new Date(customer.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {formatAmountWithComma(customer.lastPurchaseAmount || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={700} color="success.main">
                      {formatAmountWithComma(customer.totalSpent || 0)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <NoDataLottie message="No customers found" />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={pagination?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      {/* Drawer */}
      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={800}>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</Typography>
          <IconButton onClick={() => setIsDrawerOpen(false)}><CloseIcon /></IconButton>
        </Box>

        <Stack spacing={3}>
          <TextField
            label="Customer Name"
            fullWidth
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
          
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          />

          <TextField
            label="Phone"
            fullWidth
            value={formState.phone}
            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
            required
          />

          <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 2 }}>Address</Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Street"
                fullWidth
                value={formState.address.street}
                onChange={(e) => setFormState({ ...formState, address: { ...formState.address, street: e.target.value } })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                fullWidth
                value={formState.address.city}
                onChange={(e) => setFormState({ ...formState, address: { ...formState.address, city: e.target.value } })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="State"
                fullWidth
                value={formState.address.state}
                onChange={(e) => setFormState({ ...formState, address: { ...formState.address, state: e.target.value } })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Zip Code"
                fullWidth
                value={formState.address.zipCode}
                onChange={(e) => setFormState({ ...formState, address: { ...formState.address, zipCode: e.target.value } })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Country"
                fullWidth
                value={formState.address.country}
                onChange={(e) => setFormState({ ...formState, address: { ...formState.address, country: e.target.value } })}
              />
            </Grid>
          </Grid>

          <TextField
            label="Loyalty Points"
            fullWidth
            type="number"
            value={formState.loyaltyPoints}
            onChange={(e) => {
                const val = e.target.value;
                if (val === '' || parseInt(val) >= 0) {
                    setFormState({ ...formState, loyaltyPoints: parseInt(val) || 0 });
                }
            }}
            inputProps={{ min: 0 }}
          />

          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleSaveCustomer}
            disabled={!formState.name || !formState.phone}
            sx={{ borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', mt: 'auto' }}
          >
            {selectedCustomer ? 'Update Customer' : 'Create Customer'}
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Customers;
