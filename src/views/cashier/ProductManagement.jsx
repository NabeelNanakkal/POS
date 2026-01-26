import { useEffect, useState, useMemo } from 'react';
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
  Avatar,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Drawer,
  Stack,
  Divider,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Checkbox,
  Breadcrumbs,
  Link,
  Pagination,
  Tooltip,
  Dialog,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CategoryIcon from '@mui/icons-material/Category';
import PaidIcon from '@mui/icons-material/Paid';
import RouterIcon from '@mui/icons-material/Router';
import MonitorIcon from '@mui/icons-material/Monitor';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HeadsetIcon from '@mui/icons-material/Headset';
import VideocamIcon from '@mui/icons-material/Videocam';
import LaptopIcon from '@mui/icons-material/Laptop';
import StorageIcon from '@mui/icons-material/Storage';
import MemoryIcon from '@mui/icons-material/Memory';
import MouseIcon from '@mui/icons-material/Mouse';
import UsbIcon from '@mui/icons-material/Usb';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import PrintIcon from '@mui/icons-material/Print';
import CableIcon from '@mui/icons-material/Cable';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';

import * as XLSX from 'xlsx';
import NoDataLottie from 'ui-component/NoDataLottie';

import { 
    fetchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    bulkCreateProducts, 
    searchProducts,
    fetchProductStats
} from 'container/ProductContainer/slice';
import { fetchCategories } from 'container/CategoryContainer/slice';
import { fetchStores } from 'container/StoreContainer/slice';

// Components
const StatCard = ({ title, value, icon, color, trend }) => {
    const theme = useTheme();
    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 2.5, 
                flex: 1, 
                borderRadius: 4, 
                border: '1px solid #eee',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                    borderColor: alpha(color, 0.2)
                }
            }}
        >
            <Box sx={{ 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: alpha(color, 0.08), 
                color: color,
                display: 'flex'
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Typography>
                <Typography variant="h3" fontWeight={800}>{value}</Typography>
                {trend && (
                    <Typography variant="caption" sx={{ color: trend.startsWith('+') ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        {trend} <Typography component="span" variant="caption" color="text.secondary">vs last month</Typography>
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};

// UI Helper: Generate consistent colors from strings
const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 45%)`;
};

// UI Helper: Get context-aware icon based on name
const getProductIcon = (name = '', categoryName = '') => {
    const searchString = `${name} ${categoryName}`.toLowerCase();
    
    if (searchString.includes('router') || searchString.includes('wi-fi') || searchString.includes('wifi')) return <RouterIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('monitor') || searchString.includes('screen') || searchString.includes('display')) return <MonitorIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('kb') || searchString.includes('keyboard')) return <KeyboardIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('mouse')) return <MouseIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('headset') || searchString.includes('audio') || searchString.includes('headphone')) return <HeadsetIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('camera') || searchString.includes('cam') || searchString.includes('video')) return <VideocamIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('laptop') || searchString.includes('notebook')) return <LaptopIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('disk') || searchString.includes('ssd') || searchString.includes('hdd') || searchString.includes('storage')) return <StorageIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('ram') || searchString.includes('memory') || searchString.includes('ddr')) return <MemoryIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('usb') || searchString.includes('flash') || searchString.includes('hub')) return <UsbIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('phone') || searchString.includes('mobile')) return <SmartphoneIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('print') || searchString.includes('ink')) return <PrintIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('cable') || searchString.includes('wire') || searchString.includes('adapter')) return <CableIcon sx={{ fontSize: '1.4rem' }} />;
    if (searchString.includes('processor') || searchString.includes('cpu') || searchString.includes('chip')) return <SettingsInputComponentIcon sx={{ fontSize: '1.4rem' }} />;
    
    return <InventoryIcon sx={{ fontSize: '1.4rem' }} />;
};

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, productName }) => {
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
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Delete Product?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
                    Are you sure you want to delete <strong>{productName}</strong>? This action cannot be undone.
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

const UpdateConfirmationDialog = ({ open, onClose, onConfirm, productName }) => {
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
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <EditOutlinedIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Update Product?</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, px: 2 }}>
                    Are you sure you want to save the changes for <strong>{productName}</strong>? All modifications will be updated immediately.
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={onClose}
                        sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', border: '1px solid #e2e8f0', color: 'text.secondary' }}
                    >
                        Review
                    </Button>
                    <Button 
                        variant="contained" 
                        color="success"
                        fullWidth 
                        onClick={onConfirm}
                        sx={{ borderRadius: 3, py: 1.2, fontWeight: 800, textTransform: 'none', color: 'white', boxShadow: `0 8px 16px ${alpha(theme.palette.success.main, 0.2)}` }}
                    >
                        Update
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
};


const FileUploadDialog = ({ open, onClose, onImport }) => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                setPreviewData(data.slice(0, 5)); // Preview first 5 rows
            };
            reader.readAsBinaryString(selectedFile);
        }
    };

    const downloadSampleCSV = () => {
        const sampleData = [
            { 
                "Item Name": 'Product A', 
                "Description": 'Noise cancelling wireless headphones', 
                "Rate": 149.99, 
                "Product Type": 'Goods', 
                "Account": 'Sales', 
                "Usage unit": 'pcs', 
                "Purchase Description": 'Bulk purchase from vendor', 
                "Purchase Rate": 85.00, 
                "Item Type": 'Inventory', 
                "Purchase Account": 'Cost of Goods Sold', 
                "Inventory Account": 'Inventory Asset', 
                "Reorder Point": 5, 
                "Vendor": 'TechSupplies Inc', 
                "Initial Stock": 10, 
                "Initial Stock Rate": 85.00, 
                "Warehouse Name": 'Main Warehouse', 
                "Tax Name": 'VAT', 
                "Tax Type": 'Percentage', 
                "Tax Percentage": 15, 
                "Exemption Reason": '', 
                "Status": 'Active'
            }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Inventory_Template");
        XLSX.writeFile(wb, "Batch_Import_Template.xlsx");
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 500, p: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={800}>Batch Import</Typography>
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Upload your product data in CSV or Excel format. You can download our template to see the required format.
            </Typography>

            <Button 
                variant="outlined" 
                startIcon={<FileDownloadIcon />} 
                onClick={downloadSampleCSV}
                sx={{ mb: 4, borderRadius: 2, textTransform: 'none' }}
            >
                Download Sample Template
            </Button>

            <Box 
                component="label"
                sx={{ 
                    border: '2px dashed #ddd', 
                    borderRadius: 4, 
                    p: 4, 
                    textAlign: 'center', 
                    mb: 4,
                    cursor: 'pointer',
                    display: 'block',
                    '&:hover': { bgcolor: '#f8fafc', borderColor: 'primary.main' }
                }}
            >
                <input type="file" hidden onChange={handleFileChange} accept=".csv, .xlsx, .xls" />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" fontWeight={600} color="primary.main">
                    {file ? file.name : "Click to select a file"}
                </Typography>
                <Typography variant="caption" color="text.secondary">CSV, XLS, XLSX up to 10MB</Typography>
            </Box>

            {previewData.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Data Extraction Preview (First 5 items)</Typography>
                    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800 }}>Item Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800 }}>Rate</TableCell>
                                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800 }}>Stock</TableCell>
                                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800 }}>Vendor</TableCell>
                                    <TableCell sx={{ fontSize: '0.65rem', fontWeight: 800 }}>Tax %</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ fontSize: '0.65rem' }}>{row["Item Name"]}</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem' }}>{row["Rate"]}</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem' }}>{row["Initial Stock"] || row["stock"]}</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem' }}>{row["Vendor"] || 'N/A'}</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem' }}>{row["Tax Percentage"]}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Button 
                variant="contained" 
                fullWidth 
                disabled={!file}
                onClick={() => onImport(previewData)}
                sx={{ borderRadius: 2, height: 48, fontWeight: 700, textTransform: 'none', mt: 'auto' }}
            >
                Import {previewData.length} Products
            </Button>
        </Drawer>
    );
};



const ProductManagement = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { products, loading, pagination, stats, error: empError } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { stores } = useSelector((state) => state.store);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
  const [showActive, setShowActive] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
    dispatch(fetchCategories());
    dispatch(fetchStores());
    dispatch(fetchProductStats());
  }, [dispatch]);
  
  // Form State
  const [formState, setFormState] = useState({});

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    // Extract ID if category is populated as an object
    const categoryId = typeof product.category === 'object' ? (product.category.id || product.category._id) : product.category;
    setFormState({ ...product, category: categoryId } || {});
    setIsDrawerOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setFormState({
        name: '',
        description: '',
        retailPrice: '',
        productType: 'Goods',
        account: 'Sales',
        usageUnit: 'pcs',
        purchaseDescription: '',
        purchaseRate: '',
        inventoryAccount: 'Inventory Asset',
        reorderPoint: 50,
        vendor: '',
        stock: '',
        initialStockRate: '',
        warehouseName: 'Main Warehouse',
        taxName: 'None',
        taxType: 'Percentage',
        taxPercentage: '',
        exemptionReason: '',
        status: 'Active'
    });
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteProduct({ id: productToDelete.id || productToDelete._id }));
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmUpdate = () => {
    dispatch(updateProduct({ id: selectedProduct.id || selectedProduct._id, ...formState, refetch: true }));
    setIsUpdateConfirmOpen(false);
    setIsDrawerOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = () => {
    if (selectedProduct) {
        setIsUpdateConfirmOpen(true);
    } else {
        dispatch(createProduct({ ...formState, refetch: true }));
        setIsDrawerOpen(false);
    }
  };

  const handleImportData = (data) => {
    const productsToImport = data.map((item) => ({
        name: item["Item Name"] || 'Unknown Product',
        description: item["Description"] || '',
        retailPrice: parseFloat(item["Rate"]) || 0,
        productType: item["Product Type"] || 'Goods',
        account: item["Account"] || 'Sales',
        usageUnit: item["Usage unit"] || 'pcs',
        purchaseDescription: item["Purchase Description"] || '',
        purchaseRate: parseFloat(item["Purchase Rate"]) || 0,
        itemType: item["Item Type"] || 'Inventory',
        purchaseAccount: item["Purchase Account"] || 'Cost of Goods Sold',
        inventoryAccount: item["Inventory Account"] || 'Inventory Asset',
        reorderPoint: parseInt(item["Reorder Point"]) || 50,
        vendor: item["Vendor"] || 'N/A',
        stock: parseInt(item["Initial Stock"]) || 0,
        initialStockRate: parseFloat(item["Initial Stock Rate"]) || 0,
        warehouseName: item["Warehouse Name"] || 'Default',
        taxName: item["Tax Name"] || 'None',
        taxType: item["Tax Type"] || 'None',
        taxPercentage: parseFloat(item["Tax Percentage"]) || 0,
        exemptionReason: item["Exemption Reason"] || '',
        status: item["Status"] || 'Active',
        sku: `SKU-${Math.floor(Math.random() * 10000)}`,
        barcode: `BC-${Math.floor(Math.random() * 100000000)}`
    }));
    dispatch(bulkCreateProducts({ products: productsToImport }));
    setIsImportOpen(false);
  };

  const filteredProducts = (products || []).filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status can be 'Active'/'Inactive' or boolean isActive
    const productActive = p.status ? p.status === 'Active' : p.isActive !== false;
    const matchesStatus = showActive ? productActive : !productActive;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        height: '100vh', 
        overflowY: 'auto', 
        bgcolor: '#f8fafc',
        m: -3,
        backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
    }}>
      <FileUploadDialog 
        open={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImportData} 
      />

      {/* Quick Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <StatCard title="Total Products" value={stats?.totalProducts || 0} icon={<InventoryIcon />} color={theme.palette.primary.main} />
        <StatCard title="Low Stock" value={stats?.lowStockCount || 0} icon={<WarningAmberIcon />} color={theme.palette.error.main} />
        <StatCard title="Categories" value={stats?.totalCategories || 0} icon={<CategoryIcon />} color={theme.palette.success.main} />
        <StatCard title="Catalog Value" value={`$${(stats?.catalogValue || 0).toLocaleString()}`} icon={<PaidIcon />} color={theme.palette.warning.main} />
      </Box>

      {/* Refined Tool Bar */}
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
          direction={{ xs: 'column', lg: 'row' }} 
          spacing={2} 
          alignItems={{ xs: 'stretch', lg: 'center' }}
          justifyContent="space-between"
        >
          {/* Search & Filters Group */}
          <Stack 
            direction={{ xs: 'column', md: 'row' }} 
            spacing={2} 
            sx={{ flex: 1 }}
          >
            <TextField 
              placeholder="Search items by name, SKU or barcode..."
              size="small"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                dispatch(fetchProducts({ page: 1, limit: 10, search: val }));
              }}
              sx={{ flex: { md: 2, lg: 1.5 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
              }}
            />
            
            <Stack direction="row" spacing={1.5} sx={{ flex: 1 }}>
                <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
                    <Select 
                        defaultValue="all" 
                        sx={{ borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }}
                    >
                        <MenuItem value="all">Categories</MenuItem>
                        {(categories || []).map(cat => (
                            <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ flex: 1, minWidth: 140 }}>
                    <Select 
                        defaultValue="all" 
                        sx={{ borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }}
                    >
                        <MenuItem value="all">Stock</MenuItem>
                        <MenuItem value="in-stock">In Stock</MenuItem>
                        <MenuItem value="low-stock">Low Stock</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
          </Stack>

          {/* Actions Group */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={1.5} 
            alignItems="center"
          >
            <Stack direction="row" spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<CloudDownloadIcon sx={{ color: 'primary.main' }} />}
                onClick={() => setIsImportOpen(true)}
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontWeight: 800, 
                  px: 2.5, 
                  height: 40,
                  border: '2px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1), 
                  color: 'text.primary', 
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-1px)'
                  } 
                }}
              >
                Import
              </Button>
              <Button 
                fullWidth
                variant="outlined" 
                startIcon={<CloudUploadIcon sx={{ color: 'primary.main' }} />}
                sx={{ 
                  borderRadius: 3, 
                  textTransform: 'none', 
                  fontWeight: 800, 
                  px: 2.5, 
                  height: 40,
                  border: '2px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1), 
                  color: 'text.primary', 
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateY(-1px)'
                  } 
                }}
              >
                Export
              </Button>
            </Stack>
            
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
                  whiteSpace: 'nowrap',
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                  '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
              }}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Products Table/Card View */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Stack spacing={2}>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <Paper 
                      key={product.id} 
                      elevation={0} 
                      sx={{ 
                        p: 2.5, 
                        borderRadius: 5, 
                        border: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'rgba(255,255,255,0.8)', 
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                          borderColor: 'primary.light',
                          '&::before': {
                            opacity: 1
                          }
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          bgcolor: 'primary.main',
                          opacity: 0,
                          transition: 'opacity 0.3s ease'
                        }
                      }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar 
                              variant="rounded" 
                              src={product.image} 
                              sx={{ 
                                width: 64, 
                                height: 64, 
                                borderRadius: 3, 
                                border: '2px solid white', 
                                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                bgcolor: stringToColor(product.name),
                                color: 'white'
                              }} 
                            >
                              {getProductIcon(product.name, typeof product.category === 'object' ? product.category.name : product.category)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" fontWeight={800} sx={{ color: 'text.primary', mb: 0.2 }}>{product.name}</Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'text.secondary', fontWeight: 600 }}>SKU: {product.sku}</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'text.secondary', fontWeight: 600 }}>|</Typography>
                                    <Typography variant="caption" sx={{ fontFamily: 'Monospace', color: 'text.secondary', fontWeight: 600 }}>BC: {product.barcode}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                                    <Typography variant="h5" fontWeight={900} color="primary.main">${product.retailPrice.toFixed(2)}</Typography>
                                    <Chip 
                                        label={product.stock < 5 ? 'Low Stock' : 'In Stock'} 
                                        size="small" 
                                        sx={{ 
                                            fontWeight: 800, 
                                            borderRadius: 2,
                                            fontSize: '0.65rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                            bgcolor: product.stock < 5 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1),
                                            color: product.stock < 5 ? theme.palette.error.main : theme.palette.success.main,
                                            border: '1px solid',
                                            borderColor: product.stock < 5 ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.success.main, 0.2),
                                            backdropFilter: 'blur(4px)',
                                            boxShadow: (theme) => product.stock < 5 
                                              ? `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`
                                              : `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`
                                        }} 
                                    />
                                </Stack>
                            </Box>
                            <Stack spacing={1}>
                                <IconButton 
                                  size="medium" 
                                  onClick={() => handleEditClick(product)} 
                                  sx={{ 
                                    color: 'primary.main', 
                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                  }}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="medium" 
                                  onClick={() => handleDeleteClick(product)}
                                  sx={{ 
                                    color: 'error.main', 
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                    borderRadius: 2,
                                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                                  }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Paper>
                ))
            ) : (
                <Paper elevation={0} sx={{ p: 5, borderRadius: 5, border: '1px solid', borderColor: 'divider' }}>
                    <NoDataLottie message="No products found matching your search" />
                </Paper>
            )}
        </Stack>
      </Box>

      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
            display: { xs: 'none', sm: 'block' },
            borderRadius: 6, 
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.04)'
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow sx={{ bgcolor: alpha('#f8fafc', 0.8), backdropFilter: 'blur(10px)' }}>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5, pl: 4 }}>SL</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Product Information</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Barcode</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Retail Price</TableCell>
              <TableCell sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1, py: 2.5 }}>Stock Status</TableCell>
              <TableCell align="right" sx={{ py: 2.5, pr: 4 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={showActive} 
                      onChange={(e) => setShowActive(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="caption" fontWeight={800} sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {showActive ? 'Active' : 'Inactive'}
                    </Typography>
                  }
                  labelPlacement="start"
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TableRow 
                    key={product.id}
                    hover
                    sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.primary.main, 0.03),
                          '& .side-indicator': { opacity: 1 }
                        }
                    }}
                  >
                    <TableCell sx={{ py: 3, pl: 4, position: 'relative' }}>
                      <Box 
                        className="side-indicator" 
                        sx={{ 
                          position: 'absolute', 
                          left: 0, 
                          top: '15%', 
                          bottom: '15%', 
                          width: 4, 
                          bgcolor: 'primary.main', 
                          borderRadius: '0 4px 4px 0', 
                          opacity: 0, 
                          transition: 'opacity 0.3s ease' 
                        }} 
                      />
                      <Typography variant="body2" fontWeight={800} color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                        {String(((pagination?.page - 1) * pagination?.limit) + index + 1).padStart(2, '0')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={2.5} alignItems="center">
                        <Avatar 
                          variant="rounded" 
                          src={product.image} 
                          sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: 2.5, 
                            border: '2px solid white', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            bgcolor: stringToColor(product.name),
                            color: 'white'
                          }} 
                        >
                          {getProductIcon(product.name, typeof product.category === 'object' ? product.category.name : product.category)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'text.primary', mb: 0.2 }}>{product.name}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{product.description}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Monospace', 
                          color: 'text.secondary', 
                          bgcolor: '#f1f5f9', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1.5, 
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {product.sku}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'Monospace', 
                          color: 'text.secondary', 
                          bgcolor: '#f1f5f9', 
                          px: 1, 
                          py: 0.5, 
                          borderRadius: 1.5, 
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        {product.barcode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="text.primary">
                        {typeof product.category === 'object' ? product.category.name : product.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={900} color="primary.main">
                        ${product.retailPrice.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={product.stock <= (product.reorderPoint || 0) ? 'Low Stock' : 'In Stock'} 
                        size="small" 
                        sx={{ 
                            fontWeight: 800, 
                            borderRadius: 2, 
                            px: 1.5,
                            py: 0.5,
                            fontSize: '0.65rem',
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            bgcolor: product.stock <= (product.reorderPoint || 0) ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1), 
                            color: product.stock <= (product.reorderPoint || 0) ? theme.palette.error.main : theme.palette.success.main,
                            border: '1px solid',
                            borderColor: product.stock <= (product.reorderPoint || 0) ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.success.main, 0.2),
                            boxShadow: (theme) => product.stock <= (product.reorderPoint || 0) 
                              ? `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`
                              : `0 4px 12px ${alpha(theme.palette.success.main, 0.2)}`
                        }} 
                      />
                      <Typography variant="caption" display="block" sx={{ mt: 0.8, fontWeight: 700, color: 'text.secondary', ml: 0.5, opacity: 0.8 }}>
                        {product.stock} Units left
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 4 }}>
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Edit Product">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(product); }} 
                            sx={{ 
                              color: 'text.secondary', 
                              bgcolor: 'white', 
                              border: '1px solid #eee',
                              '&:hover': { color: 'primary.main', borderColor: 'primary.light', bgcolor: alpha(theme.palette.primary.main, 0.05) }
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Product">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteClick(product); }}
                            sx={{ 
                              color: 'text.secondary',
                              bgcolor: 'white', 
                              border: '1px solid #eee',
                              '&:hover': { color: 'error.main', borderColor: 'error.light', bgcolor: alpha(theme.palette.error.main, 0.05) }
                            }}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell colSpan={8} sx={{ py: 10 }}>
                        <NoDataLottie message="No products found matching your search" />
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        
        <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {(pagination?.page - 1) * pagination?.limit + 1} to {Math.min(pagination?.page * pagination?.limit, pagination?.total)} of {pagination?.total} results
          </Typography>
          <Pagination 
            count={pagination?.pages || 1} 
            page={pagination?.page || 1}
            onChange={(e, val) => dispatch(fetchProducts({ page: val, limit: 10, search: searchQuery }))}
            shape="rounded" 
            size="small" 
          />
        </Box>
      </TableContainer>

      {/* Edit/Add Product Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {setIsDrawerOpen(false); setSelectedProduct(null);}}
        PaperProps={{ sx: { width: { xs: '100%', sm: 500 }, p: 0 } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Drawer Header */}
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', bgcolor: 'white' }}>
            <Box>
                <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary' }}>{selectedProduct ? 'Edit Product' : 'Add New Product'}</Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{selectedProduct ? 'Update existing product information' : 'Fill in the details to create a new item'}</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
                <IconButton onClick={() => setIsDrawerOpen(false)} size="small" sx={{ borderRadius: 2, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Stack>
          </Box>

          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            {/* Product Image Upload - AT TOP */}
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: 'text.primary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Product Image</Typography>
            <Box 
              sx={{ 
                border: '2px dashed #e2e8f0', 
                borderRadius: 5, 
                p: { xs: 3, sm: 4 }, 
                textAlign: 'center', 
                mb: 4,
                cursor: 'pointer',
                transition: '0.3s',
                bgcolor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                '&:hover': { bgcolor: '#fff', borderColor: 'primary.main', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }
              }}
            >
              <Avatar 
                variant="rounded" 
                src={formState.image} 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: 4, 
                  border: '3px solid white', 
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  bgcolor: stringToColor(formState.name || 'New Product'),
                  color: 'white',
                  fontSize: '2rem'
                }}
              >
                {getProductIcon(formState.name, '')}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={700} color="text.primary">Drop your image here, or <Typography component="span" variant="body2" color="primary.main" fontWeight={800}>browse</Typography></Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>Supports PNG, JPG (Max 5MB)</Typography>
              </Box>
            </Box>

            {/* 21 Fields in Sequential Order */}
            <Stack spacing={3}>
              {/* 1. Item Name */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Item Name</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Enter item name" 
                    value={formState.name || ''} 
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 2. Description */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Description</Typography>
                <TextField 
                    multiline 
                    rows={3} 
                    fullWidth 
                    size="small" 
                    placeholder="Enter product description" 
                    value={formState.description || ''} 
                    onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 3. Category */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Category</Typography>
                <FormControl fullWidth size="small">
                    <Select
                        value={formState.category || ''}
                        onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                        sx={{ borderRadius: 2 }}
                    >
                        {(categories || []).map(cat => (
                            <MenuItem key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Box>

              {/* 4. Rate */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Rate (Retail Price)</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="0.00" 
                    value={formState.retailPrice || ''} 
                    onChange={(e) => setFormState({ ...formState, retailPrice: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} 
                />
              </Box>

              {/* 4. Product Type */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Product Type</Typography>
                <FormControl fullWidth size="small">
                  <Select 
                    value={formState.productType || 'Goods'} 
                    onChange={(e) => setFormState({ ...formState, productType: e.target.value })}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Goods">Goods</MenuItem>
                    <MenuItem value="Service">Service</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* 5. Account */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Account (Sales)</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Sales" 
                    value={formState.account || 'Sales'} 
                    onChange={(e) => setFormState({ ...formState, account: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 6. Usage unit */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Usage Unit</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="pcs" 
                    value={formState.usageUnit || 'pcs'} 
                    onChange={(e) => setFormState({ ...formState, usageUnit: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              <Divider />

              {/* 7. Purchase Description */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Purchase Description</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Description for purchase" 
                    value={formState.purchaseDescription || ''} 
                    onChange={(e) => setFormState({ ...formState, purchaseDescription: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 8. Purchase Rate */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Purchase Rate</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="0.00" 
                    value={formState.purchaseRate || ''} 
                    onChange={(e) => setFormState({ ...formState, purchaseRate: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} 
                />
              </Box>

              {/* 9. Item Type */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Item Type</Typography>
                <Select 
                    fullWidth 
                    size="small" 
                    value={formState.itemType || 'Inventory'} 
                    onChange={(e) => setFormState({ ...formState, itemType: e.target.value })}
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="Inventory">Inventory</MenuItem>
                    <MenuItem value="Non-Inventory">Non-Inventory</MenuItem>
                </Select>
              </Box>

              {/* 10. Purchase Account */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Purchase Account</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Cost of Goods Sold" 
                    value={formState.purchaseAccount || 'Cost of Goods Sold'} 
                    onChange={(e) => setFormState({ ...formState, purchaseAccount: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 11. Inventory Account */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Inventory Account</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Inventory Asset" 
                    value={formState.inventoryAccount || 'Inventory Asset'} 
                    onChange={(e) => setFormState({ ...formState, inventoryAccount: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              <Divider />

              {/* 12. Reorder Point */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Reorder Point</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    type="number" 
                    placeholder="5" 
                    value={formState.reorderPoint || ''} 
                    onChange={(e) => setFormState({ ...formState, reorderPoint: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 13. Vendor */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Vendor</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Vendor Name" 
                    value={formState.vendor || ''} 
                    onChange={(e) => setFormState({ ...formState, vendor: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 14. Initial Stock */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Initial Stock</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    type="number" 
                    placeholder="0" 
                    value={formState.stock || ''} 
                    onChange={(e) => setFormState({ ...formState, stock: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 15. Initial Stock Rate */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Initial Stock Rate</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    type="number" 
                    placeholder="0.00" 
                    value={formState.initialStockRate || ''} 
                    onChange={(e) => setFormState({ ...formState, initialStockRate: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} 
                />
              </Box>

              {/* 16. Store Name */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Store (Location)</Typography>
                <FormControl fullWidth size="small">
                    <Select 
                        value={formState.warehouseName || ''} 
                        onChange={(e) => setFormState({ ...formState, warehouseName: e.target.value })}
                        displayEmpty
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value="" disabled>Select Store</MenuItem>
                        {(stores || []).map((store) => (
                            <MenuItem key={store.id} value={store.name}>{store.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
              </Box>

              <Divider />

              {/* 17. Tax Name */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Tax Name</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="VAT" 
                    value={formState.taxName || 'None'} 
                    onChange={(e) => setFormState({ ...formState, taxName: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 18. Tax Type */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Tax Type</Typography>
                <Select 
                    fullWidth 
                    size="small" 
                    value={formState.taxType || 'Percentage'} 
                    onChange={(e) => setFormState({ ...formState, taxType: e.target.value })}
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="Percentage">Percentage</MenuItem>
                    <MenuItem value="Flat">Flat</MenuItem>
                    <MenuItem value="None">None</MenuItem>
                </Select>
              </Box>

              {/* 19. Tax Percentage */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Tax Percentage</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    type="number" 
                    placeholder="15" 
                    value={formState.taxPercentage || ''} 
                    onChange={(e) => setFormState({ ...formState, taxPercentage: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 }, endAdornment: <InputAdornment position="end">%</InputAdornment> }} 
                />
              </Box>

              {/* 20. Exemption Reason */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Exemption Reason</Typography>
                <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Reason if exempt" 
                    value={formState.exemptionReason || ''} 
                    onChange={(e) => setFormState({ ...formState, exemptionReason: e.target.value })}
                    InputProps={{ sx: { borderRadius: 2 } }} 
                />
              </Box>

              {/* 21. Status */}
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Status</Typography>
                <Select 
                    fullWidth 
                    size="small" 
                    value={formState.status || 'Active'} 
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    sx={{ borderRadius: 2 }}
                >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Box>

          {/* Drawer Footer */}
          <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9', bgcolor: 'white', display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                fullWidth
                onClick={() => setIsDrawerOpen(false)}
                sx={{ borderRadius: 3, height: 52, fontWeight: 800, textTransform: 'none', border: '1px solid #e2e8f0', color: 'text.secondary', bgcolor: '#f8fafc', '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' } }}
            >
              Cancel
            </Button>
            <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSaveProduct}
                sx={{ 
                    borderRadius: 3, 
                    height: 52, 
                    fontWeight: 800, 
                    textTransform: 'none', 
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                    '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
                }}
            >
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Box>
        </Box>
      </Drawer>
      <UpdateConfirmationDialog 
        open={isUpdateConfirmOpen} 
        onClose={() => setIsUpdateConfirmOpen(false)} 
        onConfirm={handleConfirmUpdate} 
        productName={selectedProduct?.name} 
      />
      <DeleteConfirmationDialog 
        open={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleConfirmDelete} 
        productName={productToDelete?.name} 
      />
    </Box>
  );
};

export default ProductManagement;
