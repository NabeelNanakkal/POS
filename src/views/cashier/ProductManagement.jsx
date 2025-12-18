import { useState } from 'react';
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
  Pagination
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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CategoryIcon from '@mui/icons-material/Category';
import PaidIcon from '@mui/icons-material/Paid';
import * as XLSX from 'xlsx';

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
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' }
            }}
        >
            <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 3, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: alpha(color, 0.1),
                color: color
            }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Typography>
                <Typography variant="h4" fontWeight={800}>{value}</Typography>
                {trend && (
                    <Typography variant="caption" sx={{ color: trend.startsWith('+') ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        {trend} <Typography component="span" variant="caption" color="text.secondary">vs last month</Typography>
                    </Typography>
                )}
            </Box>
        </Paper>
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
            { name: 'Product A', sku: 'SKU001', category: 'Electronics', retailPrice: 100, costPrice: 60, stock: 10 },
            { name: 'Product B', sku: 'SKU002', category: 'Clothing', retailPrice: 50, costPrice: 20, stock: 25 },
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");
        XLSX.writeFile(wb, "sample_products.csv");
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
                                    <TableCell sx={{ fontSize: '0.7rem' }}>Name</TableCell>
                                    <TableCell sx={{ fontSize: '0.7rem' }}>SKU</TableCell>
                                    <TableCell sx={{ fontSize: '0.7rem' }}>Stock</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.sku}</TableCell>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.stock}</TableCell>
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

const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', description: 'Noise cancelling', sku: 'WH-001-BLK', category: 'Electronics', retailPrice: 149.99, costPrice: 85.00, stock: 3, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Mechanical Keyboard', description: 'RGB Backlit', sku: 'KB-RGB-PRO', category: 'Electronics', retailPrice: 89.99, costPrice: 45.00, stock: 12, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: 'Basic Cotton Tee', description: 'Unisex, Size M', sku: 'AP-TS-002', category: 'Clothing', retailPrice: 25.00, costPrice: 10.00, stock: 45, alertLimit: 10, status: 'In Stock', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'Smart Watch Series 5', description: 'GPS + Cellular', sku: 'SM-S5-GPS', category: 'Electronics', retailPrice: 299.00, costPrice: 180.00, stock: 8, alertLimit: 3, status: 'In Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80' },
  { id: 5, name: 'Artisan Coffee Mug', description: 'Handmade Ceramic', sku: 'HM-MUG-01', category: 'Home & Garden', retailPrice: 18.50, costPrice: 6.00, stock: 24, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?auto=format&fit=crop&w=100&q=80' },
];

const ProductManagement = () => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleImportData = (data) => {
    // Generate new IDs for imported products and add to list
    const newProducts = data.map((item, index) => ({
        id: products.length + index + 1,
        name: item.name || 'Unknown Product',
        sku: item.sku || 'N/A',
        category: item.category || 'Uncategorized',
        retailPrice: parseFloat(item.retailPrice) || 0,
        costPrice: parseFloat(item.costPrice) || 0,
        stock: parseInt(item.stock) || 0,
        description: 'Imported product',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=100&q=80'
    }));
    setProducts([...products, ...newProducts]);
    setIsImportOpen(false);
  };

  return (
    <Box sx={{ 
        p: 4, 
        height: '100vh', 
        overflowY: 'auto', 
        bgcolor: '#f8fafc', // Slightly lighter blue-grey for premium feel
        m: -3,
        backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%), radial-gradient(at 50% 0%, ${alpha(theme.palette.primary.main, 0.05)} 0, transparent 50%)`,
    }}>
      <FileUploadDialog 
        open={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImportData} 
      />

      {/* Quick Stats Row */}
      <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
        <StatCard title="Total Products" value="128" icon={<InventoryIcon />} color={theme.palette.primary.main} trend="+12%" />
        <StatCard title="Low Stock" value="5" icon={<WarningAmberIcon />} color={theme.palette.error.main} trend="-2" />
        <StatCard title="Categories" value="12" icon={<CategoryIcon />} color={theme.palette.success.main} />
        <StatCard title="Catalog Value" value="$12,450" icon={<PaidIcon />} color={theme.palette.warning.main} trend="+5.4%" />
      </Stack>

      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<FileUploadIcon />}
            onClick={() => setIsImportOpen(true)}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 3, border: '1px solid #e2e8f0', color: 'text.primary', bgcolor: 'white', '&:hover': { border: '1px solid #cbd5e1', bgcolor: '#f1f5f9' } }}
          >
            Import
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700, px: 3, border: '1px solid #e2e8f0', color: 'text.primary', bgcolor: 'white', '&:hover': { border: '1px solid #cbd5e1', bgcolor: '#f1f5f9' } }}
          >
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setIsDrawerOpen(true)}
            sx={{ 
                borderRadius: 3, 
                textTransform: 'none', 
                fontWeight: 800, 
                px: 4, 
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`,
                '&:hover': { boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}` }
            }}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {/* Filters Bar */}
      <Paper 
        elevation={0} 
        sx={{ 
            p: 2.5, 
            mb: 4, 
            borderRadius: 5, 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            display: 'flex', 
            gap: 2, 
            alignItems: 'center', 
            flexWrap: 'wrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.03)'
        }}
      >
        <TextField 
          placeholder="Search items by name, SKU or barcode..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flex: 1, minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: { borderRadius: 3, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }
          }}
        />
        
        <Stack direction="row" spacing={1.5}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select 
                defaultValue="all" 
                sx={{ borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }}
            >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
            </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select 
                defaultValue="all" 
                sx={{ borderRadius: 3, height: 40, bgcolor: 'white', border: '1px solid #f1f5f9', '& fieldset': { border: 'none' } }}
            >
                <MenuItem value="all">Stock Status</MenuItem>
                <MenuItem value="in-stock">In Stock</MenuItem>
                <MenuItem value="low-stock">Low Stock</MenuItem>
            </Select>
            </FormControl>

            <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />} 
                sx={{ borderRadius: 3, textTransform: 'none', px: 3, height: 40, border: '1px solid #f1f5f9', bgcolor: 'white', color: 'text.secondary', fontWeight: 600 }}
            >
                More Filters
            </Button>
        </Stack>
      </Paper>

      {/* Products Table Container */}
      <TableContainer 
        component={Paper} 
        elevation={0} 
        sx={{ 
            borderRadius: 6, 
            border: '1px solid rgba(255, 255, 255, 0.3)', 
            bgcolor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden',
            boxShadow: '0 12px 48px rgba(0,0,0,0.04)'
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', width: 60 }}>SL</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Product</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>SKU</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem' }}>Stock</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow 
                key={product.id}
                hover
                sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                    transition: '0.2s',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) }
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="body2" fontWeight={700} color="text.disabled" sx={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar variant="rounded" src={product.image} sx={{ width: 44, height: 44, borderRadius: 2 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700}>{product.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{product.description}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'Monospace', color: 'text.secondary' }}>{product.sku}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{product.category}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={700}>${product.retailPrice.toFixed(2)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.stock < 5 ? 'Low Stock' : 'In Stock'} 
                    size="small" 
                    variant="soft"
                    sx={{ 
                        fontWeight: 800, 
                        borderRadius: 2, 
                        px: 1,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        bgcolor: product.stock < 5 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1), 
                        color: product.stock < 5 ? theme.palette.error.main : theme.palette.success.main 
                    }} 
                  />
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, fontWeight: 600, color: 'text.secondary', ml: 1 }}>
                    {product.stock} units available
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleEditClick(product)} sx={{ color: 'text.secondary' }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'error.light' }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination placeholder */}
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee' }}>
          <Typography variant="caption" color="text.secondary">Showing 1 to 5 of 128 results</Typography>
          <Pagination count={10} shape="rounded" size="small" />
        </Box>
      </TableContainer>

      {/* Edit/Add Product Drawer */}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {setIsDrawerOpen(false); setSelectedProduct(null);}}
        PaperProps={{ sx: { width: 500, p: 0 } }}
      >
        <Box sx={{ h: '100%', display: 'flex', flexDirection: 'column' }}>
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
            {/* Product Image Upload */}
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: 'text.primary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Product Discovery</Typography>
            <Box 
              sx={{ 
                border: '2px dashed #e2e8f0', 
                borderRadius: 5, 
                p: 5, 
                textAlign: 'center', 
                mb: 4,
                cursor: 'pointer',
                transition: '0.3s',
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#fff', borderColor: 'primary.main', boxShadow: '0 8px 24px rgba(0,0,0,0.05)' }
              }}
            >
              <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <CloudUploadIcon sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography variant="body2" fontWeight={700} color="text.primary">Drop your image here, or <Typography component="span" variant="body2" color="primary.main" fontWeight={800}>browse</Typography></Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>Supports PNG, JPG, JPEG (Max 5MB)</Typography>
            </Box>

            {/* Form Fields */}
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Product Name</Typography>
                <TextField fullWidth size="small" placeholder="Enter product name" defaultValue={selectedProduct?.name || ''} InputProps={{ sx: { borderRadius: 2 } }} />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>SKU / Barcode</Typography>
                <TextField 
                  fullWidth 
                  size="small" 
                  placeholder="Scan or enter SKU" 
                  defaultValue={selectedProduct?.sku || ''}
                  InputProps={{ 
                    sx: { borderRadius: 2 },
                    endAdornment: (
                        <InputAdornment position="end">
                            <QrCodeScannerIcon color="action" fontSize="small" />
                        </InputAdornment>
                    )
                  }} 
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Category</Typography>
                <FormControl fullWidth size="small">
                  <Select defaultValue={selectedProduct?.category.toLowerCase() || 'electronics'} sx={{ borderRadius: 2 }}>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="clothing">Clothing</MenuItem>
                    <MenuItem value="home">Home & Garden</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Description</Typography>
                <TextField multiline rows={3} fullWidth size="small" placeholder="Enter product description" defaultValue={selectedProduct?.description || ''} InputProps={{ sx: { borderRadius: 2 } }} />
              </Box>

              <Divider />

              <Typography variant="overline" color="text.secondary" fontWeight={800}>Pricing & Inventory</Typography>

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Retail Price</Typography>
                  <TextField fullWidth size="small" placeholder="$ 0.00" defaultValue={selectedProduct?.retailPrice || ''} InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Cost Price</Typography>
                  <TextField fullWidth size="small" placeholder="$ 0.00" defaultValue={selectedProduct?.costPrice || ''} InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Stock Qty</Typography>
                  <TextField fullWidth size="small" placeholder="0" defaultValue={selectedProduct?.stock || ''} InputProps={{ sx: { borderRadius: 2 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Alert Limit</Typography>
                  <TextField fullWidth size="small" placeholder="0" defaultValue={selectedProduct?.alertLimit || ''} InputProps={{ sx: { borderRadius: 2 } }} />
                </Box>
              </Stack>
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
    </Box>
  );
};

export default ProductManagement;
