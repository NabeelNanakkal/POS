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
  Pagination,
  Tooltip
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
            { name: 'Product A', sku: 'SKU001', barcode: '123456789012', category: 'Electronics', retailPrice: 100, costPrice: 60, stock: 10 },
            { name: 'Product B', sku: 'SKU002', barcode: '987654321098', category: 'Clothing', retailPrice: 50, costPrice: 20, stock: 25 },
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
                                    <TableCell sx={{ fontSize: '0.7rem' }}>Barcode</TableCell>
                                    <TableCell sx={{ fontSize: '0.7rem' }}>Stock</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {previewData.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.sku}</TableCell>
                                        <TableCell sx={{ fontSize: '0.7rem' }}>{row.barcode || 'N/A'}</TableCell>
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
  { id: 1, name: 'Wireless Headphones', description: 'Noise cancelling', sku: 'WH-001', barcode: '123456789012', category: 'Electronics', retailPrice: 149.99, costPrice: 85.00, stock: 3, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80' },
  { id: 2, name: 'Mechanical Keyboard', description: 'RGB Backlit', sku: 'KB-RGB', barcode: '234567890123', category: 'Electronics', retailPrice: 89.99, costPrice: 45.00, stock: 12, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80' },
  { id: 3, name: 'Basic Cotton Tee', description: 'Unisex, Size M', sku: 'AP-TS', barcode: '345678901234', category: 'Clothing', retailPrice: 25.00, costPrice: 10.00, stock: 45, alertLimit: 10, status: 'In Stock', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'Smart Watch Series 5', description: 'GPS + Cellular', sku: 'SM-S5', barcode: '456789012345', category: 'Electronics', retailPrice: 299.00, costPrice: 180.00, stock: 8, alertLimit: 3, status: 'In Stock', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80' },
  { id: 5, name: 'Artisan Coffee Mug', description: 'Handmade Ceramic', sku: 'HM-MUG', barcode: '567890123456', category: 'Home & Garden', retailPrice: 18.50, costPrice: 6.00, stock: 24, alertLimit: 5, status: 'In Stock', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fbed20?auto=format&fit=crop&w=100&q=80' },
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
    const newProducts = data.map((item, index) => ({
        id: products.length + index + 1,
        name: item.name || 'Unknown Product',
        sku: item.sku || 'N/A',
        barcode: item.barcode || 'N/A',
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
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
      <FileUploadDialog 
        open={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImportData} 
      />

      {/* Quick Stats Row */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <StatCard title="Total Products" value="128" icon={<InventoryIcon />} color={theme.palette.primary.main} trend="+12%" />
        <StatCard title="Low Stock" value="5" icon={<WarningAmberIcon />} color={theme.palette.error.main} trend="-2" />
        <StatCard title="Categories" value="12" icon={<CategoryIcon />} color={theme.palette.success.main} />
        <StatCard title="Catalog Value" value="$12,450" icon={<PaidIcon />} color={theme.palette.warning.main} trend="+5.4%" />
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                        <MenuItem value="electronics">Electronics</MenuItem>
                        <MenuItem value="clothing">Clothing</MenuItem>
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
              onClick={() => setIsDrawerOpen(true)}
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
            {filteredProducts.map((product) => (
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
                            borderRadius: 2.5,
                            border: '2px solid white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                          }} 
                        />
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
            ))}
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
              <TableCell align="right" sx={{ py: 2.5, pr: 4 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
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
                    {String(index + 1).padStart(2, '0')}
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
                        borderRadius: 2, 
                        border: '2px solid white', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)' 
                      }} 
                    />
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
                  <Typography variant="body2" fontWeight={600} color="text.primary">{product.category}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight={900} color="primary.main">
                    ${product.retailPrice.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={product.stock < 5 ? 'Low Stock' : 'In Stock'} 
                    size="small" 
                    sx={{ 
                        fontWeight: 800, 
                        borderRadius: 2, 
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        bgcolor: product.stock < 5 ? alpha(theme.palette.error.main, 0.1) : alpha(theme.palette.success.main, 0.1), 
                        color: product.stock < 5 ? theme.palette.error.main : theme.palette.success.main,
                        border: '1px solid',
                        borderColor: product.stock < 5 ? alpha(theme.palette.error.main, 0.2) : alpha(theme.palette.success.main, 0.2),
                        boxShadow: (theme) => product.stock < 5 
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
            ))}
          </TableBody>
        </Table>
        
        <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', gap: 2 }}>
          <Typography variant="caption" color="text.secondary">Showing 1 to 5 of 128 results</Typography>
          <Pagination count={10} shape="rounded" size="small" />
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
            {/* Product Image Upload */}
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5, color: 'text.primary', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Product Discovery</Typography>
            <Box 
              sx={{ 
                border: '2px dashed #e2e8f0', 
                borderRadius: 5, 
                p: { xs: 3, sm: 5 }, 
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

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>SKU</Typography>
                  <TextField fullWidth size="small" placeholder="Enter SKU" defaultValue={selectedProduct?.sku || ''} InputProps={{ sx: { borderRadius: 2 } }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Barcode</Typography>
                  <TextField 
                    fullWidth 
                    size="small" 
                    placeholder="Scan Barcode" 
                    defaultValue={selectedProduct?.barcode || ''}
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
              </Stack>

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

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Retail Price</Typography>
                  <TextField fullWidth size="small" placeholder="$ 0.00" defaultValue={selectedProduct?.retailPrice || ''} InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Cost Price</Typography>
                  <TextField fullWidth size="small" placeholder="$ 0.00" defaultValue={selectedProduct?.costPrice || ''} InputProps={{ sx: { borderRadius: 2 }, startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
