// Forced refresh: 2026-01-26 13:00
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Stack,
  Avatar,
  IconButton,
  InputAdornment,
  MenuItem,
  Tooltip,
  Chip,
  TableSortLabel,
  Switch,
  Grid,
  Divider,
  TablePagination
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';

import NoDataLottie from 'ui-component/NoDataLottie';
import BulkImportModal from 'ui-component/BulkImportModal';

import { fetchStores, createStore, updateStore, deleteStore, toggleStoreStatus, bulkCreateStore } from 'container/StoreContainer/slice';
import { exportToExcel } from 'utils/excelUtils';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  const theme = useTheme();
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: { xs: 2.5, sm: 3 }, 
        borderRadius: 4, 
        border: '1px solid #eee',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }
      }}
    >
      <Box 
        sx={{ 
          bgcolor: alpha(theme.palette[color].main, 0.1), 
          color: `${color}.main`, 
          width: { xs: 48, sm: 64 }, 
          height: { xs: 48, sm: 64 }, 
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Icon sx={{ fontSize: { xs: 28, sm: 35 } }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          noWrap 
          gutterBottom
        >
          {title}
        </Typography>
        <Typography variant={{ xs: 'h3', sm: 'h2' }} fontWeight={800} sx={{ mb: 0.5 }}>{value}</Typography>
        {trend !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <TrendingUpIcon fontSize="small" color={color} />
            <Typography variant="caption" fontWeight={700} color={`${color}.main`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', lg: 'inline' } }}>
              vs last month
            </Typography>
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, name }) => {
    const theme = useTheme();
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Store?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Are you sure you want to delete <strong>{name}</strong>?
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" fullWidth onClick={onClose} sx={{ borderRadius: 2 }}>Keep</Button>
                    <Button variant="contained" color="error" fullWidth onClick={onConfirm} sx={{ borderRadius: 2 }}>Delete</Button>
                </Stack>
            </Box>
        </Dialog>
    );
};

const StoreManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stores, pagination, stats, loading } = useSelector((state) => state.store);
  
  const primaryColor = '#f05a30'; // The orange-red from the image
  
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', code: '', address: '', phone: '', email: '', status: 'Open' 
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchStores({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        isActive: filterStatus
      }));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, page, rowsPerPage, searchTerm, filterStatus]);

  const sortedStores = useMemo(() => {
    let result = [...(stores || [])];
    result.sort((a, b) => {
      const isAsc = order === 'asc';
      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });
    return result;
  }, [stores, orderBy, order]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpen = (store = null) => {
    if (store) {
      setCurrentStore(store);
      setFormData({ 
        name: store.name || '', code: store.code || '', address: store.address || '', 
        phone: store.phone || '', email: store.email || '', status: store.status || 'Open'
      });
    } else {
      setCurrentStore(null);
      setFormData({ name: '', code: '', address: '', phone: '', email: '', status: 'Open' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = () => {
    if (currentStore) {
      dispatch(updateStore({ id: currentStore.id, ...formData }));
    } else {
      dispatch(createStore(formData));
    }
    handleClose();
  };

  const handleDelete = (store) => {
    setStoreToDelete(store);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (storeToDelete) {
      dispatch(deleteStore({ id: storeToDelete.id }));
      setIsDeleteDialogOpen(false);
      setStoreToDelete(null);
    }
  };

  const handleImport = (data) => {
    const mappedData = data.map(item => ({
      name: item['Store Name'] || item['Name'] || '',
      code: item['Store Code'] || item['Code'] || '',
      address: item['Store Address'] || item['Address'] || '',
      phone: item['Phone Number'] || item['Phone'] || '',
      email: item['Email Address'] || item['Email'] || '',
      status: item['Status'] || 'Open'
    }));
    dispatch(bulkCreateStore(mappedData));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', m: -3 }}>
      {/* Dynamic Summary Cards - Optimized to fill row */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: '1.5fr 1fr 1fr 1.5fr' 
          }, 
          gap: 3, 
          mb: 4, 
          width: '100%' 
        }}
      >
          <StatCard title="Total Stores" value={stats?.totalStores || 0} icon={StorefrontIcon} color="primary" trend={stats?.growth?.trend} />
          <StatCard title="Active Status" value={stats?.activeStores || 0} icon={CheckCircleIcon} color="success" />
          <StatCard title="Total Staff" value={stats?.totalStaff || 0} icon={PeopleIcon} color="warning" />
          <StatCard title="Growth Rate" value={`${stats?.growth?.value || 0}%`} icon={TrendingUpIcon} color="secondary" trend={stats?.growth?.trend} />
      </Box>

      {/* Modern Filter Bar from Image */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 4, 
          mb: 4, 
          border: '1px solid', 
          borderColor: '#edf2f7',
          bgcolor: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search stores by personnel name or email address..."
            size="small"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: primaryColor }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => { setSearchTerm(''); setPage(0); }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2, 
                bgcolor: '#f8fafc', 
                '& fieldset': { border: 'none' },
                fontSize: '0.875rem'
              }
            }}
            sx={{ flexGrow: 1 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              size="small"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(0); }}
              sx={{ 
                width: 140, 
                '& .MuiOutlinedInput-root': { 
                  borderRadius: 2, 
                  bgcolor: '#f8fafc', 
                  '& fieldset': { border: 'none' } 
                } 
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: 'center' }} />
            <Stack direction="row" spacing={1.5}>
              <Button 
                variant="outlined" 
                onClick={() => setImportOpen(true)}
                startIcon={<CloudDownloadIcon />} 
                sx={{ 
                  borderRadius: 2.5, 
                  textTransform: 'none', 
                  fontWeight: 700, 
                  color: primaryColor, 
                  borderColor: alpha(primaryColor, 0.2),
                  bgcolor: alpha(primaryColor, 0.02),
                  px: 2,
                  '&:hover': { bgcolor: alpha(primaryColor, 0.08), borderColor: primaryColor }
                }}
              >
                Import
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => exportToExcel(stores, 'Stores_Report')}
                startIcon={<CloudUploadIcon />} 
                sx={{ 
                  borderRadius: 2.5, 
                  textTransform: 'none', 
                  fontWeight: 700, 
                  color: primaryColor, 
                  borderColor: alpha(primaryColor, 0.2),
                  bgcolor: alpha(primaryColor, 0.02),
                  px: 2,
                  '&:hover': { bgcolor: alpha(primaryColor, 0.08), borderColor: primaryColor }
                }}
              >
                Export
              </Button>
            </Stack>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => handleOpen()}
              sx={{ 
                borderRadius: 2.5, 
                px: 3, 
                py: 1.1,
                fontWeight: 800, 
                textTransform: 'none',
                bgcolor: primaryColor,
                '&:hover': { bgcolor: '#d9441e' },
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
                boxShadow: `0 4px 12px ${alpha(primaryColor, 0.3)}`
              }}
            >
              Add Store
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Main Table from Image */}
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #edf2f7' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem', py: 2 }}>SL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>
                  <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>
                    STORE INFORMATION
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>
                  <TableSortLabel active={orderBy === 'code'} direction={orderBy === 'code' ? order : 'asc'} onClick={() => handleRequestSort('code')}>
                    STORE CODE
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>ADDRESS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>ACTIVE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.75rem' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedStores.map((store, index) => (
                <TableRow key={store.id} hover sx={{ '& td': { py: 2, borderBottom: '1px solid #f1f5f9' } }}>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {String(page * rowsPerPage + index + 1).padStart(2, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#1e293b' }}>{store.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{store.email || 'no-email@store.com'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={store.code || 'N/A'} size="small" sx={{ borderRadius: 1.5, fontWeight: 700, bgcolor: '#f1f5f9', color: '#475569' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{store.phone || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>{store.address || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box 
                      sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        px: 1.5, 
                        py: 0.5, 
                        borderRadius: 2,
                        bgcolor: store.status === 'Open' ? alpha(theme.palette.success.main, 0.1) : store.status === 'Closed' ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                        color: store.status === 'Open' ? theme.palette.success.dark : store.status === 'Closed' ? theme.palette.error.dark : theme.palette.warning.dark
                      }}
                    >
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: store.status === 'Open' ? theme.palette.success.main : store.status === 'Closed' ? theme.palette.error.main : theme.palette.warning.main }} />
                      <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {store.status || 'Open'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={!!store.isActive} 
                      onChange={(e) => dispatch(toggleStoreStatus({ id: store.id, isActive: e.target.checked }))}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleOpen(store)} sx={{ color: '#64748b', '&:hover': { color: primaryColor, bgcolor: alpha(primaryColor, 0.05) } }}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(store)} sx={{ color: '#64748b', '&:hover': { color: theme.palette.error.main, bgcolor: alpha(theme.palette.error.main, 0.05) } }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {(!sortedStores || sortedStores.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} sx={{ py: 8 }}>
                    <NoDataLottie message={<Typography variant="h5" color="text.secondary" fontWeight={600}>No stores found</Typography>} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={pagination?.total || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #edf2f7' }}
        />
      </Paper>

      {/* Modern Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="xs"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ px: 3, pt: 3 }}>
          <Typography variant="h3" fontWeight={800}>{currentStore ? 'Edit Store' : 'Add New Store'}</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <TextField fullWidth label="Store Code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Store Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField fullWidth multiline rows={2} label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            <TextField select fullWidth label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} sx={{ fontWeight: 700, color: '#64748b' }}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, borderRadius: 2, fontWeight: 700, bgcolor: primaryColor, '&:hover': { bgcolor: '#d9441e' } }}>
            {currentStore ? 'Save Changes' : 'Create Store'}
          </Button>
        </DialogActions>
      </Dialog>

      <BulkImportModal 
        open={importOpen} 
        onClose={() => setImportOpen(false)} 
        onImport={handleImport} 
        title="Import Stores" 
        columns={['Store Name', 'Store Code', 'Store Address', 'Phone Number', 'Email Address', 'Status']} 
      />
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
        name={storeToDelete?.name} 
      />
    </Box>
  );
};

export default StoreManagement;
