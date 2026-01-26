import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchProducts, 
    adjustStock, 
    fetchProductStats 
} from 'container/ProductContainer/slice';
import { fetchStores } from 'container/StoreContainer/slice';
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
    
    if (searchString.includes('router') || searchString.includes('wi-fi') || searchString.includes('wifi')) return <RouterIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('monitor') || searchString.includes('screen') || searchString.includes('display')) return <MonitorIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('kb') || searchString.includes('keyboard')) return <KeyboardIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('mouse')) return <MouseIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('headset') || searchString.includes('audio') || searchString.includes('headphone')) return <HeadsetIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('camera') || searchString.includes('cam') || searchString.includes('video')) return <VideocamIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('laptop') || searchString.includes('notebook')) return <LaptopIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('disk') || searchString.includes('ssd') || searchString.includes('hdd') || searchString.includes('storage')) return <StorageIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('ram') || searchString.includes('memory') || searchString.includes('ddr')) return <MemoryIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('usb') || searchString.includes('flash') || searchString.includes('hub')) return <UsbIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('phone') || searchString.includes('mobile')) return <SmartphoneIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('print') || searchString.includes('ink')) return <PrintIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('cable') || searchString.includes('wire') || searchString.includes('adapter')) return <CableIcon sx={{ fontSize: '1.2rem' }} />;
    if (searchString.includes('processor') || searchString.includes('cpu') || searchString.includes('chip')) return <SettingsInputComponentIcon sx={{ fontSize: '1.2rem' }} />;
    
    return <InventoryIcon sx={{ fontSize: '1.2rem' }} />;
};

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
        onAdjust(product.id || product._id, adjustmentType, parseInt(quantity), reason);
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
    const dispatch = useDispatch();
    const { products, loading: productsLoading, stats } = useSelector((state) => state.product);
    const { stores, loading: storesLoading } = useSelector((state) => state.store);
    
    // Local state
    const [searchQuery, setSearchQuery] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);

    // Initial Fetch
    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: 100 })); // Fetch more for inventory view
        dispatch(fetchProductStats());
        dispatch(fetchStores());
    }, [dispatch]);

    const handleAdjustment = (id, type, qty, reason) => {
        dispatch(adjustStock({ 
            id, 
            type, 
            quantity: qty, 
            reason 
        }));
    };

    const handleOrder = (ids, qtys) => {
        setIsOrderDialogOpen(false);
        setIsOrderSuccessOpen(true);
        // In a real app, we would send this to the back-end to create POs
    };

    const filteredInventory = products.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.sku.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Match against real store names or "Main Warehouse" fallback
        const matchesWarehouse = warehouseFilter === 'all' || 
            (item.warehouseName || 'Main Warehouse') === warehouseFilter;
            
        return matchesSearch && matchesWarehouse;
    });

    // Use stats from Redux for cards, list for table
    const lowStockCount = stats?.lowStockCount || 0;
    const inventoryCount = stats?.totalProducts || 0;
    const itemsCommitted = products.reduce((acc, item) => acc + (item.committed || 0), 0);

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
                inventory={products} 
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
                <StatCard title="Total Inventory" value={inventoryCount} icon={<InventoryIcon />} color={theme.palette.primary.main} />
                <StatCard title="Low Stock Items" value={lowStockCount} icon={<WarningAmberIcon />} color={theme.palette.error.main} />
                <StatCard title="Stores" value={stores.length || 1} icon={<StoreIcon />} color={theme.palette.success.main} />
                <StatCard title="Committed Stock" value={itemsCommitted} icon={<HistoryIcon />} color={theme.palette.warning.main} />
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
                        <MenuItem value="all">All Stores</MenuItem>
                        {stores.map(store => (
                            <MenuItem key={store.id} value={store.name}>{store.name}</MenuItem>
                        ))}
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
                                            <Avatar 
                                              variant="rounded" 
                                              src={item.image} 
                                              sx={{ 
                                                width: 44, 
                                                height: 44, 
                                                borderRadius: 2,
                                                bgcolor: stringToColor(item.name || ''),
                                                color: 'white'
                                              }} 
                                            >
                                               {getProductIcon(item.name, typeof item.category === 'object' ? item.category.name : item.category)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800}>{item.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'Monospace' }}>{item.sku}</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={item.warehouseName || 'Main Warehouse'} 
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
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>{item.committed || 0}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={800}>{item.stock - (item.committed || 0)}</Typography>
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
