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
  Stack,
  Divider,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
  Dialog,
  Checkbox,
  Snackbar,
  Alert,
  alpha
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StoreIcon from '@mui/icons-material/Store';
import HistoryIcon from '@mui/icons-material/History';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

// Reuse MOCK_PRODUCTS for data consistency
const MOCK_PRODUCTS = [
  { 
    id: 1, name: 'Wireless Headphones', sku: 'WH-001', barcode: '123456789012', category: 'Electronics', 
    stock: 3, reorderPoint: 5, warehouseName: 'San Jose', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80',
    committed: 2, available: 1
  },
  { 
    id: 2, name: 'Mechanical Keyboard', sku: 'KB-RGB', barcode: '234567890123', category: 'Electronics', 
    stock: 12, reorderPoint: 5, warehouseName: 'San Jose', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=100&q=80',
    committed: 4, available: 8
  },
  { 
    id: 3, name: 'Gaming Mouse', sku: 'MS-GPRO', barcode: '345678901234', category: 'Electronics', 
    stock: 25, reorderPoint: 10, warehouseName: 'Main Warehouse', image: 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=100&q=80',
    committed: 5, available: 20
  },
  { 
    id: 4, name: '4K Monitor', sku: 'MN-4K27', barcode: '456789012345', category: 'Electronics', 
    stock: 8, reorderPoint: 3, warehouseName: 'San Jose', image: 'https://images.unsplash.com/photo-1527443210214-469bfb4b9b94?auto=format&fit=crop&w=100&q=80',
    committed: 1, available: 7
  },
  { 
    id: 5, name: 'Smart Watch', sku: 'SW-G5', barcode: '567890123456', category: 'Accessories', 
    stock: 45, reorderPoint: 15, warehouseName: 'Main Warehouse', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80',
    committed: 10, available: 35
  },
  { 
    id: 6, name: 'Laptop Backpack', sku: 'BP-LT15', barcode: '678901234567', category: 'Bags', 
    stock: 50, reorderPoint: 20, warehouseName: 'Main Warehouse', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=100&q=80',
    committed: 5, available: 45
  },
  { 
    id: 7, name: 'Coffee Mug', sku: 'MG-CER35', barcode: '789012345678', category: 'Kitchen', 
    stock: 120, reorderPoint: 30, warehouseName: 'Main Warehouse', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcc3d1?auto=format&fit=crop&w=100&q=80',
    committed: 20, available: 100
  },
  { 
    id: 8, name: 'Leather Wallet', sku: 'WL-LTR-BF', barcode: '890123456789', category: 'Accessories', 
    stock: 22, reorderPoint: 10, warehouseName: 'Main Warehouse', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=100&q=80',
    committed: 3, available: 19
  },
  { 
    id: 9, name: 'Desktop Speaker', sku: 'SP-DK20', barcode: '901234567890', category: 'Electronics', 
    stock: 15, reorderPoint: 5, warehouseName: 'San Jose', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=100&q=80',
    committed: 2, available: 13
  },
  { 
    id: 10, name: 'Webcam HD', sku: 'WC-HD10', barcode: '012345678901', category: 'Electronics', 
    stock: 18, reorderPoint: 8, warehouseName: 'San Jose', image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=100&q=80',
    committed: 4, available: 14
  }
];

const StatCard = ({ title, value, icon, color }) => {
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
            </Box>
        </Paper>
    );
};

const AdjustmentDialog = ({ open, onClose, product, onAdjust }) => {
    const [adjustmentType, setAdjustmentType] = useState('add');
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('Damaged');
    const theme = useTheme();

    const handleConfirm = () => {
        onAdjust(product.id, adjustmentType, parseInt(quantity), reason);
        setQuantity('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 400 } }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>Stock Adjustment</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Adjust stock for <strong>{product?.name}</strong> (SKU: {product?.sku})
                </Typography>

                <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant={adjustmentType === 'add' ? 'contained' : 'outlined'} 
                            fullWidth 
                            onClick={() => setAdjustmentType('add')}
                            startIcon={<AddIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Add
                        </Button>
                        <Button 
                            variant={adjustmentType === 'remove' ? 'contained' : 'outlined'} 
                            fullWidth 
                            color="error"
                            onClick={() => setAdjustmentType('remove')}
                            startIcon={<RemoveIcon />}
                            sx={{ borderRadius: 2 }}
                        >
                            Remove
                        </Button>
                    </Box>

                    <TextField 
                        label="Quantity" 
                        type="number" 
                        fullWidth 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        InputProps={{ sx: { borderRadius: 2 } }}
                    />

                    <FormControl fullWidth>
                        <Typography variant="caption" fontWeight={700} sx={{ mb: 1, ml: 1 }}>REASON FOR ADJUSTMENT</Typography>
                        <Select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="Damaged">Damaged</MenuItem>
                            <MenuItem value="Stock In">New Stock Arrived</MenuItem>
                            <MenuItem value="Return">Customer Return</MenuItem>
                            <MenuItem value="Correction">Inventory Correction</MenuItem>
                        </Select>
                    </FormControl>

                    <Button 
                        variant="contained" 
                        fullWidth 
                        size="large"
                        onClick={handleConfirm}
                        disabled={!quantity || quantity <= 0}
                        sx={{ borderRadius: 3, py: 1.5, fontWeight: 700, mt: 1 }}
                    >
                        Confirm Adjustment
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
};

const OrderStockDialog = ({ open, onClose, inventory, onOrder }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [orderQuantities, setOrderQuantities] = useState({});
    const theme = useTheme();

    // Auto-select low stock items on open
    useState(() => {
        if (open) {
            const lowStockItems = inventory.filter(i => i.stock < i.reorderPoint);
            setSelectedItems(lowStockItems.map(i => i.id));
            
            const initialQtys = {};
            lowStockItems.forEach(i => {
                initialQtys[i.id] = (i.reorderPoint * 2) - i.stock;
            });
            setOrderQuantities(initialQtys);
        }
    }, [open]);

    const handleToggle = (id) => {
        const item = inventory.find(i => i.id === id);
        if (selectedItems.includes(id)) {
            setSelectedItems(prev => prev.filter(item => item !== id));
        } else {
            setSelectedItems(prev => [...prev, id]);
            if (!orderQuantities[id]) {
                setOrderQuantities(prev => ({ ...prev, [id]: Math.max(10, (item.reorderPoint * 2) - item.stock) }));
            }
        }
    };

    const handleQtyChange = (id, val) => {
        setOrderQuantities(prev => ({ ...prev, [id]: parseInt(val) || 0 }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 5, p: 0 } }}>
            <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h3" fontWeight={900}>Restock Inventory</Typography>
                    <Typography variant="body2" color="text.secondary">Create a new Purchase Order for your vendors</Typography>
                </Box>
                <Chip 
                    label={`${selectedItems.length} Items Selected`} 
                    color="primary" 
                    variant="outlined" 
                    sx={{ fontWeight: 800, borderRadius: 2 }} 
                />
            </Box>

            <Box sx={{ maxHeight: 500, overflowY: 'auto', p: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary' }}>PRODUCT</TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary' }}>ON HAND</TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary' }}>REORDER PT</TableCell>
                            <TableCell sx={{ fontWeight: 800, fontSize: '0.7rem', color: 'text.secondary', width: 120 }}>ORDER QTY</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {inventory.map((item) => {
                            const isSelected = selectedItems.includes(item.id);
                            const isLowStock = item.stock < item.reorderPoint;
                            return (
                                <TableRow key={item.id} sx={{ bgcolor: isLowStock && !isSelected ? alpha(theme.palette.error.main, 0.02) : 'transparent' }}>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isSelected} onChange={() => handleToggle(item.id)} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar variant="rounded" src={item.image} sx={{ width: 36, height: 36, borderRadius: 1.5 }} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800} sx={{ color: isLowStock ? 'error.main' : 'text.primary' }}>{item.name}</Typography>
                                                <Typography variant="caption" color="text.secondary">SKU: {item.sku}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>{item.stock}</TableCell>
                                    <TableCell sx={{ color: 'text.disabled', fontWeight: 700 }}>{item.reorderPoint}</TableCell>
                                    <TableCell>
                                        <TextField 
                                            size="small" 
                                            type="number" 
                                            disabled={!isSelected}
                                            value={orderQuantities[item.id] || ''}
                                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                                            InputProps={{ sx: { borderRadius: 2, fontSize: '0.85rem' } }}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Box>

            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <Button 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    disabled={selectedItems.length === 0}
                    onClick={() => onOrder(selectedItems, orderQuantities)}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 800, boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}` }}
                >
                    Create Purchase Order
                </Button>
            </Box>
        </Dialog>
    );
};

const OrderSuccessDialog = ({ open, onClose }) => {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 5, p: 1, maxWidth: 400, width: '100%', textAlign: 'center' } }}>
            <Box sx={{ p: 4 }}>
                <Box sx={{ 
                    width: 80, height: 80, borderRadius: '50%', bgcolor: alpha(theme.palette.success.main, 0.1), color: 'success.main',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3
                }}>
                    <ShoppingCartCheckoutIcon sx={{ fontSize: 48 }} />
                </Box>
                <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>PO Generated!</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Purchase Order **#PO-7842** has been generated and sent to the corresponding vendors.
                </Typography>
                <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    onClick={onClose}
                    sx={{ borderRadius: 3, py: 1.5, fontWeight: 800, color: 'white' }}
                >
                    Done
                </Button>
            </Box>
        </Dialog>
    );
};

const InventoryManagement = () => {
    const theme = useTheme();
    const [inventory, setInventory] = useState(MOCK_PRODUCTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

    const handleAdjustment = (id, type, qty, reason) => {
        setInventory(prev => prev.map(item => {
            if (item.id === id) {
                const newStock = type === 'add' ? item.stock + qty : Math.max(0, item.stock - qty);
                return { ...item, stock: newStock, available: newStock - item.committed };
            }
            return item;
        }));
    };

    const handleOrder = (ids, qtys) => {
        setIsOrderDialogOpen(false);
        setIsOrderSuccessOpen(true);
        // In a real app, we would send this to the back-end to create POs
    };

    const filteredInventory = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesWarehouse = warehouseFilter === 'all' || item.warehouseName === warehouseFilter;
        return matchesSearch && matchesWarehouse;
    });

    const lowStockCount = inventory.filter(p => p.stock < p.reorderPoint).length;
    const totalInventoryValue = inventory.reduce((acc, item) => acc + (item.stock * 100), 0); // Simplified value calculation

    return (
        <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            height: '100vh', 
            overflowY: 'auto', 
            bgcolor: '#f8fafc',
            m: -3,
            backgroundImage: `radial-gradient(at 0% 0%, ${alpha(theme.palette.primary.main, 0.03)} 0, transparent 50%)`,
        }}>
            
            <AdjustmentDialog 
                open={isAdjustmentOpen} 
                onClose={() => setIsAdjustmentOpen(false)}
                product={selectedProduct}
                onAdjust={handleAdjustment}
            />

            <OrderStockDialog 
                open={isOrderDialogOpen} 
                onClose={() => setIsOrderDialogOpen(false)} 
                inventory={inventory} 
                onOrder={handleOrder}
            />

            <OrderSuccessDialog 
                open={isOrderSuccessOpen} 
                onClose={() => setIsOrderSuccessOpen(false)} 
            />

            {/* Header & Title */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h2" fontWeight={900} color="text.primary">Inventory Control</Typography>
                    <Typography variant="body1" color="text.secondary">Real-time stock monitoring & warehouse management</Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={() => setIsOrderDialogOpen(true)}
                    sx={{ borderRadius: 3, px: 3, py: 1.2, fontWeight: 700 }}
                >
                    Order Stock
                </Button>
            </Box>

            {/* Stats Overview */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
                <StatCard title="Total Inventory" value={inventory.length} icon={<InventoryIcon />} color={theme.palette.primary.main} />
                <StatCard title="Low Stock Items" value={lowStockCount} icon={<WarningAmberIcon />} color={theme.palette.error.main} />
                <StatCard title="Warehouses" value="2" icon={<StoreIcon />} color={theme.palette.success.main} />
                <StatCard title="Recent Activity" value="12 Today" icon={<HistoryIcon />} color={theme.palette.warning.main} />
            </Box>

            {/* Filter Toolbar */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 4, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'white', border: '1px solid #f1f5f9' }}>
                <TextField 
                    placeholder="Search by product name or SKU..."
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1 }}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>,
                        sx: { borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }
                    }}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select 
                        value={warehouseFilter}
                        onChange={(e) => setWarehouseFilter(e.target.value)}
                        sx={{ borderRadius: 3, bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }}
                    >
                        <MenuItem value="all">All Warehouses</MenuItem>
                        <MenuItem value="San Jose">San Jose Branch</MenuItem>
                        <MenuItem value="Main Warehouse">Central Warehouse</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            {/* Inventory Table */}
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 5, border: '1px solid #eee', bgcolor: 'white' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary', pl: 4 }}>Product Details</TableCell>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>Warehouse</TableCell>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>Stock In-Hand</TableCell>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>Committed</TableCell>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>Available</TableCell>
                            <TableCell sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.7rem', color: 'text.secondary' }}>Reorder Pt</TableCell>
                            <TableCell align="right" sx={{ pr: 4 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredInventory.map((item) => {
                            const isLowStock = item.stock < item.reorderPoint;
                            return (
                                <TableRow key={item.id} hover sx={{ transition: '0.3s' }}>
                                    <TableCell sx={{ pl: 4, py: 2 }}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar variant="rounded" src={item.image} sx={{ width: 44, height: 44, borderRadius: 2 }} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800}>{item.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Monospace' }}>{item.sku}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={item.warehouseName} 
                                            size="small" 
                                            sx={{ fontWeight: 700, bgcolor: '#f1f5f9', color: 'text.secondary' }} 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800} color={isLowStock ? 'error.main' : 'text.primary'}>
                                            {item.stock} Units
                                        </Typography>
                                        {isLowStock && (
                                            <Typography variant="caption" color="error" fontWeight={600} sx={{ display: 'block' }}>
                                                Below limit
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>{item.committed}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800}>{item.available}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.disabled" fontWeight={700}>{item.reorderPoint}</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ pr: 4 }}>
                                        <Tooltip title="Stock Adjustment">
                                            <IconButton 
                                                size="small" 
                                                onClick={() => {
                                                    setSelectedProduct(item);
                                                    setIsAdjustmentOpen(true);
                                                }}
                                                sx={{ 
                                                    color: 'primary.main', 
                                                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                                }}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InventoryManagement;
