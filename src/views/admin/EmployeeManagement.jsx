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
  MenuItem,
  Stack,
  Avatar,
  IconButton,
  InputAdornment,
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
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import BadgeIcon from '@mui/icons-material/Badge';
import StorefrontIcon from '@mui/icons-material/Storefront';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ClearIcon from '@mui/icons-material/Clear';

import NoDataLottie from 'ui-component/NoDataLottie';
import BulkImportModal from 'ui-component/BulkImportModal';

import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee, bulkCreateEmployees, resetPassword, fetchStats } from 'container/EmployeeContainer/slice';
import { fetchStores } from 'container/StoreContainer/slice';
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
        {/* Trend removed at user request */}
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
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Personnel?</Typography>
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

const EmployeeManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { employees, stats, loading: empLoading, error: empError } = useSelector((state) => state.employee);
  const { stores, loading: storeLoading } = useSelector((state) => state.store);
  
  // UI State
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [personToDelete, setPersonToDelete] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: '', 
    storeId: '',
    password: '' 
  });
  
  const [resetPasswordData, setResetPasswordData] = useState({
    id: '',
    name: '',
    password: '',
    open: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStore, setFilterStore] = useState('All');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchStores());
    dispatch(fetchStats());
  }, [dispatch]);

  const apiStats = stats || {
    totalBox: { value: 0, trend: null },
    accountBox: { value: 0, trend: null },
    managerBox: { value: 0, trend: null },
    cashierBox: { value: 0, trend: null }
  };

  // Derived Data (Search, Filter, Sort)
  const filteredAndSortedEmployees = useMemo(() => {
    let result = [...(employees || [])];

    // Search
    if (searchTerm) {
      const lowSearch = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.name.toLowerCase().includes(lowSearch) || 
        e.email.toLowerCase().includes(lowSearch)
      );
    }

    // Filter Role
    if (filterRole !== 'All') {
      result = result.filter(e => e.role === filterRole);
    }

    // Filter Store
    if (filterStore !== 'All') {
      result = result.filter(e => e.storeId === filterStore);
    }

    // Sort
    result.sort((a, b) => {
      const isAsc = order === 'asc';
      if (a[orderBy] < b[orderBy]) return isAsc ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return isAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, searchTerm, filterRole, filterStore, orderBy, order]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleOpen = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setFormData({ name: employee.name, email: employee.email, role: employee.role, storeId: employee.storeId });
    } else {
      setCurrentEmployee(null);
      setFormData({ name: '', email: '', role: '', storeId: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowPassword(false);
  };

  const handleSubmit = () => {
    if (currentEmployee) {
      dispatch(updateEmployee({ id: currentEmployee.id, ...formData }));
    } else {
      dispatch(createEmployee(formData));
    }
    handleClose();
  };

  const handleDelete = (emp) => {
    setPersonToDelete(emp);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (personToDelete) {
      dispatch(deleteEmployee({ id: personToDelete.id }));
      setIsDeleteDialogOpen(false);
      setPersonToDelete(null);
    }
  };

  const handleExport = () => {
    exportToExcel(employees, 'Employees_Report');
  };

  const handleImport = (data) => {
    // Map Excel columns to backend expected field names
    const mappedData = data.map(item => ({
      name: item.Name || item.name,
      email: item.Email || item.email,
      role: (item.Role || item.role || 'CASHIER').toUpperCase(),
      storeId: item.StoreID || item.StoreId || item.storeId,
      password: item.Password || item.password || 'Welcome@123'
    }));
    dispatch(bulkCreateEmployees(mappedData));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return theme.palette.error.main;
      case 'MANAGER': return theme.palette.warning.main;
      case 'CASHIER': return theme.palette.success.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box 
      sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: '#f8fafc', 
        minHeight: '100vh', 
        m: -3,
        '& input::-ms-reveal, & input::-ms-clear': { display: 'none' }
      }}
    >
      {empError && (
        <Paper sx={{ p: 2, mb: 4, bgcolor: alpha(theme.palette.error.main, 0.05), border: '1px solid', borderColor: alpha(theme.palette.error.main, 0.2), borderRadius: 3 }}>
          <Typography color="error" fontWeight={700}>Error: {empError}</Typography>
        </Paper>
      )}
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
          <StatCard title="Total Staff" value={apiStats.totalBox.value} icon={PeopleAltIcon} color="primary" />
          <StatCard title="Accountants" value={apiStats.accountBox.value} icon={AdminPanelSettingsIcon} color="error" />
          <StatCard title="Managers" value={apiStats.managerBox.value} icon={SupervisorAccountIcon} color="warning" />
          <StatCard title="Cashiers" value={apiStats.cashierBox.value} icon={BadgeIcon} color="success" />
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
              placeholder="Search by personnel name or email address..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
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
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                sx={{ width: 150, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } } }}
              >
                  <MenuItem value="All">All Roles</MenuItem>
                  <MenuItem value="ADMIN">Accountant</MenuItem>
                  <MenuItem value="MANAGER">Manager</MenuItem>
                  <MenuItem value="CASHIER">Cashier</MenuItem>
              </TextField>
              <TextField
                select
                size="small"
                value={filterStore}
                onChange={(e) => setFilterStore(e.target.value)}
                sx={{ width: 180, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } } }}
              >
                  <MenuItem value="All">All Stores</MenuItem>
                  {stores.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </TextField>
              <Divider orientation="vertical" flexItem />
              <Stack direction="row" spacing={1.5}>
                <Button 
                    variant="outlined" 
                    color="inherit" 
                    onClick={() => setImportOpen(true)}
                    startIcon={<CloudDownloadIcon sx={{ color: 'primary.main' }} />} 
                    sx={{ 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      fontWeight: 800, 
                      borderColor: alpha(theme.palette.primary.main, 0.2), 
                      px: 2.5, 
                      whiteSpace: 'nowrap',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main
                      }
                    }}
                >
                    Import
                </Button>
                <Button 
                    variant="outlined" 
                    color="inherit" 
                    onClick={handleExport}
                    startIcon={<CloudUploadIcon sx={{ color: 'primary.main' }} />} 
                    sx={{ 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      fontWeight: 800, 
                      borderColor: alpha(theme.palette.primary.main, 0.2), 
                      px: 2.5, 
                      whiteSpace: 'nowrap',
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.main
                      }
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
                    borderRadius: 3, 
                    px: 3, 
                    fontWeight: 800, 
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'fit-content',
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                }}
              >
                Hire Staff
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
                    PERSONNEL INFORMATION
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ROLE</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>STORE LOCATION</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>STATUS</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>ACTIVE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary' }}>ACTIONS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedEmployees.map((emp, index) => (
                <TableRow key={emp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {String(index + 1).padStart(2, '0')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: alpha(getRoleColor(emp.role), 0.1), color: getRoleColor(emp.role), fontWeight: 800 }}>
                        {emp.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>{emp.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip 
                        label={emp.role === 'ADMIN' ? 'Accountant' : emp.role.charAt(0) + emp.role.slice(1).toLowerCase()} 
                        size="small" 
                            sx={{ 
                                fontWeight: 700, 
                                borderRadius: 1.5,
                                bgcolor: alpha(getRoleColor(emp.role), 0.1),
                                color: getRoleColor(emp.role)
                            }}
                        />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <StorefrontIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="body2" fontWeight={600}>{stores.find(s => s.id === emp.storeId)?.name || 'N/A'}</Typography>
                    </Stack>
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
                        bgcolor: emp.status === 'Online' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                        color: emp.status === 'Online' ? theme.palette.success.dark : theme.palette.error.dark,
                        border: '1px solid',
                        borderColor: emp.status === 'Online' ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.error.main, 0.2),
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: emp.status === 'Online' ? theme.palette.success.main : theme.palette.error.main,
                          boxShadow: emp.status === 'Online' ? `0 0 8px ${theme.palette.success.main}` : 'none'
                        }} 
                      />
                      <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {emp.status || 'Offline'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={emp.active} 
                      onChange={(e) => dispatch(updateEmployee({ id: emp.id, isActive: e.target.checked }))}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Personnel">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpen(emp)} 
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
                        <Tooltip title="Reset Password">
                          <IconButton 
                            size="small" 
                            onClick={() => setResetPasswordData({ id: emp.id, name: emp.name, password: '', open: true })}
                            sx={{ 
                              color: 'text.secondary', 
                              bgcolor: 'white', 
                             border: '1px solid #eee',
                              borderRadius: 1.5,
                              '&:hover': { color: 'warning.main', borderColor: 'warning.light', bgcolor: alpha(theme.palette.warning.main, 0.05) }
                            }}
                          >
                            <VpnKeyOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Personnel">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(emp)}
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
              {filteredAndSortedEmployees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6 }}>
                    <NoDataLottie 
                        message={
                            <Box>
                                <Typography variant="h4" color="text.secondary" fontWeight={700}>No personnel found</Typography>
                                <Typography variant="body2" color="text.secondary">Try adjusting your filters or hire a new member</Typography>
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
            {currentEmployee ? 'Edit Personnel' : 'Hire New Employee'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentEmployee ? 'Update employee profile and assigned roles' : 'Add a new member to your professional team'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Work Email"
              type="email"
              placeholder="e.g. john@retailos.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              select
              label="Job Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              <MenuItem value="CASHIER">Cashier</MenuItem>
              <MenuItem value="MANAGER">Manager</MenuItem>
              <MenuItem value="ADMIN">Account</MenuItem>
            </TextField>
            {!currentEmployee && (
              <TextField
                fullWidth
                label="Login Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank for default (Welcome@123)"
                error={!!formData.password && formData.password.length < 6}
                helperText={!!formData.password && formData.password.length < 6 ? "Password must be at least 6 characters" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            )}
            <TextField
              fullWidth
              select
              label="Primary Store"
              value={formData.storeId}
              onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {stores.map((s) => (
                <MenuItem key={s.id || s._id} value={s.id || s._id}>{s.name}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!formData.name || !formData.role || !formData.storeId || (!!formData.password && formData.password.length < 6)}
            sx={{ px: 4, borderRadius: 2, fontWeight: 700 }}
          >
            {currentEmployee ? 'Save Changes' : 'Complete Hiring'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog 
        open={resetPasswordData.open} 
        onClose={() => {
          setResetPasswordData({ ...resetPasswordData, open: false });
          setShowResetPassword(false);
        }} 
        maxWidth="xs" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Reset Password for {resetPasswordData.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="New Password"
            type={showResetPassword ? 'text' : 'password'}
            value={resetPasswordData.password}
            onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
            error={!!resetPasswordData.password && resetPasswordData.password.length < 6}
            helperText={!!resetPasswordData.password && resetPasswordData.password.length < 6 ? "Password must be at least 6 characters" : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showResetPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => {
            setResetPasswordData({ ...resetPasswordData, open: false });
            setShowResetPassword(false);
          }} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!resetPasswordData.password || resetPasswordData.password.length < 6}
            onClick={() => {
              dispatch(resetPassword({ id: resetPasswordData.id, password: resetPasswordData.password }));
              setResetPasswordData({ ...resetPasswordData, open: false });
              setShowResetPassword(false);
            }}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>

      <BulkImportModal 
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        title="Import Personnel"
        sampleFileName="Employee_Import"
        columns={['Name', 'Email', 'Role', 'StoreID', 'Password']}
      />

      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
        name={personToDelete?.name} 
      />
    </Box>
  );
};

export default EmployeeManagement;
