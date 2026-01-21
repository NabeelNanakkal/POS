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
  Divider
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import NoDataLottie from 'ui-component/NoDataLottie';
import BulkImportModal from 'ui-component/BulkImportModal';

import { fetchStores, createStore, updateStore, deleteStore, setStoresBulk } from 'container/StoreContainer/slice';
import { exportToExcel, importFromExcel } from 'utils/excelUtils';

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
        {trend && (
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
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Store?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
                    Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={onClose}
                        sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', border: '1px solid #e2e8f0', color: 'text.secondary' }}
                    >
                        Keep 
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

const StoreManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stores, loading } = useSelector((state) => state.store);
  
  // UI State
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '', code: '' });
  
  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  // Derived Data (Search, Filter, Sort)
  const filteredAndSortedStores = useMemo(() => {
    let result = [...(stores || [])];

    // Search
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lowSearch) || 
        s.code.toLowerCase().includes(lowSearch) ||
        s.location.toLowerCase().includes(lowSearch)
      );
    }

    // Filter Location
    if (filterLocation !== 'All') {
      result = result.filter(s => s.location === filterLocation);
    }

    // Sort
    result.sort((a, b) => {
      const isAsc = order === 'asc';
      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });

    return result || [];
  }, [stores, searchTerm, filterLocation, orderBy, order]);

  // Unique locations for filter
  const locations = useMemo(() => ['All', ...new Set((stores || []).map(s => s.location).filter(Boolean))], [stores]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpen = (store = null) => {
    if (store) {
      setCurrentStore(store);
      setFormData({ name: store.name, location: store.location, code: store.code });
    } else {
      setCurrentStore(null);
      setFormData({ name: '', location: '', code: '' });
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

  const handleExport = () => {
    exportToExcel(stores, 'Stores_Report');
  };

  const handleImport = (data) => {
    dispatch(setStoresBulk(data));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f8fafc', minHeight: '100vh', m: -3 }}>
      {/* Summary Cards */}
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 3, 
          mb: 4, 
          width: '100%' 
        }}
      >
          <StatCard title="Total Stores" value={stores?.length || 0} icon={StorefrontIcon} color="primary" trend={12} />
          <StatCard title="Active Status" value={stores?.filter(s => s.status === 'Active')?.length || 0} icon={CheckCircleIcon} color="success" trend={5} />
          <StatCard title="Total Staff" value="128" icon={PeopleIcon} color="warning" trend={-2} />
          <StatCard title="Growth Rate" value="14.2%" icon={TrendingUpIcon} color="secondary" trend={5.4} />
      </Box>

      {/* Filter & Action Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 4, 
          mb: 4, 
          border: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}
      >
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} alignItems={{ lg: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search stores by name, code or location..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }
            }}
            sx={{ flexGrow: 1 }}
          />
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              select
              size="small"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              sx={{ width: 160, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } } }}
            >
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>{loc === 'All' ? 'All Locations' : loc}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              size="small"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              sx={{ width: 140, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } } }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
            <Divider orientation="vertical" flexItem />
            <Stack direction="row" spacing={1.5}>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => setImportOpen(true)}
                startIcon={<FileUploadIcon sx={{ color: 'primary.main' }} />} 
                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, borderColor: 'divider', px: 2, whiteSpace: 'nowrap' }}
              >
                Import
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleExport}
                startIcon={<FileDownloadIcon sx={{ color: 'primary.main' }} />} 
                sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 800, borderColor: 'divider', px: 2, whiteSpace: 'nowrap' }}
              >
                Export
              </Button>
            </Stack>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpen()}
                sx={{ 
                    borderRadius: 3, 
                    px: 3, 
                    fontWeight: 800, 
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                }}
            >
              Add Store
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Main Table */}
      <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', width: 60 }}>SL</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    STORE INFORMATION
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                   <TableSortLabel
                    active={orderBy === 'code'}
                    direction={orderBy === 'code' ? order : 'asc'}
                    onClick={() => handleRequestSort('code')}
                  >
                    CODE
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ACTIVE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedStores.map((store, index) => (
                <TableRow key={store.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {String(index + 1).padStart(2, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2 }}>
                        <StorefrontIcon fontSize="small" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{store.name}</Typography>
                        <Typography variant="caption" color="text.secondary">Retail Outlet</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                      <Chip label={store.code} size="small" sx={{ borderRadius: 1, fontWeight: 700, bgcolor: 'grey.100', color: 'text.primary' }} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">{store.location}</Typography>
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
                        bgcolor: store.status === 'Active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                        color: store.status === 'Active' ? theme.palette.success.dark : theme.palette.warning.dark,
                        border: '1px solid',
                        borderColor: store.status === 'Active' ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.warning.main, 0.2),
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: store.status === 'Active' ? theme.palette.success.main : theme.palette.warning.main,
                          boxShadow: store.status === 'Active' ? `0 0 8px ${theme.palette.success.main}` : 'none'
                        }} 
                      />
                      <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {store.status === 'Active' ? 'In Operation' : 'Maintenance'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Store">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpen(store)} 
                            sx={{ 
                              color: 'text.secondary', 
                              bgcolor: 'white', 
                              border: '1px solid #eee',
                              borderRadius: 1.5,
                              '&:hover': { color: 'primary.main', borderColor: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Store">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(store)}
                            sx={{ 
                              color: 'text.secondary',
                              bgcolor: 'white', 
                              border: '1px solid #eee',
                              borderRadius: 1.5,
                              '&:hover': { color: 'error.main', borderColor: 'error.light', bgcolor: alpha(theme.palette.error.main, 0.05) }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredAndSortedStores || filteredAndSortedStores.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6 }}>
                    <NoDataLottie 
                        message={
                            <Box>
                                <Typography variant="h4" color="text.secondary" fontWeight={700}>No stores found</Typography>
                                <Typography variant="body2" color="text.secondary">Try adjusting your filters or add a new store</Typography>
                            </Box>
                        } 
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
          <Typography variant="h3" fontWeight={800}>
            {currentStore ? 'Edit Store' : 'Add New Store'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentStore ? 'Update details for this retail location' : 'Enter the details for a new retail storefront'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Store Code"
              placeholder="e.g. ST-001"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Store Name"
              placeholder="e.g. Main Street Branch"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Location"
              placeholder="e.g. City Center Mall"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!formData.name || !formData.code}
            sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
          >
            {currentStore ? 'Save Changes' : 'Create Store'}
          </Button>
        </DialogActions>
      </Dialog>

      <BulkImportModal 
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        title="Import Stores"
        sampleFileName="Store_Import"
        columns={['Name', 'Code', 'Location', 'Status']}
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
