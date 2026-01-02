import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  TextField,
  IconButton,
  Button,
  Chip,
  Divider,
  Stack,
  Avatar,
  CardActionArea,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useOutletContext } from 'react-router-dom';

// Animations
import Lottie from 'lottie-react';
import noDataAnimation from 'assets/animations/noDataLottie.json';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StorefrontIcon from '@mui/icons-material/Storefront';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import GridViewIcon from '@mui/icons-material/GridView';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

// Mock Data
const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: GridViewIcon },
  { id: 'apparel', name: 'Apparel', icon: ShoppingBagIcon },
  { id: 'electronics', name: 'Electronics', icon: LocalShippingOutlinedIcon },
  { id: 'snacks', name: 'Snacks', icon: StorefrontIcon },
];

const PRODUCTS = [
  { id: 1, name: 'Noise Cancelling Headphones', price: 129.0, sku: 'NC-HEAD-001', barcode: '123456789012', stock: '12 Left', stockType: 'warning', category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Smart Watch Series 5', price: 249.0, sku: 'SW-SERIES-5', barcode: '234567890123', stock: 'In Stock', stockType: 'success', category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Running Sneakers Pro', price: 89.99, sku: 'SP-RUN-PRO', barcode: '345678901234', stock: 'Low Stock', stockType: 'error', category: 'apparel', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Genuine Leather Wallet', price: 45.0, sku: 'AC-LTH-WLT', barcode: '456789012345', stock: 'In Stock', stockType: 'success', category: 'apparel', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Organic Cotton Tee', price: 25.0, sku: 'CL-COT-TEE', barcode: '567890123456', stock: '100+', stockType: 'success', category: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Espresso Maker Pro', price: 199.0, sku: 'COF-MAK-PRO', barcode: '678901234567', stock: 'In Stock', stockType: 'success', category: 'electronics', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=300&q=80' },
  { id: 10, name: 'Gourmet Mix Nuts', price: 15.0, sku: 'SNK-NIX-NUT', barcode: '789012345678', stock: '50+', stockType: 'success', category: 'snacks', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80' },
  { id: 11, name: 'Premium Dark Chocolate', price: 8.5, sku: 'SNK-DRK-CHO', barcode: '890123456789', stock: 'In Stock', stockType: 'success', category: 'snacks', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=300&q=80' },
];

const ProductCard = ({ product, onAdd }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      bgcolor: 'white',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'translateY(-6px)',
        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)',
        '& img': {
          transform: 'scale(1.1) rotate(2deg)'
        }
      }
    }}
  >
    <CardActionArea 
      onClick={() => onAdd(product)} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'stretch' 
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <Box sx={{ 
              height: 180, 
              overflow: 'hidden', 
              bgcolor: 'grey.50',
              position: 'relative'
          }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  height: '40%', 
                  background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
                  pointerEvents: 'none'
                }} 
              />
          </Box>
          <Chip
              label={product.stock}
              size="small"
              sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontWeight: 800,
                  height: 22,
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  backdropFilter: 'blur(8px)',
                  bgcolor: (theme) => alpha(theme.palette[product.stockType].main, 0.85),
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette[product.stockType].main, 0.3)}`
              }}
          />
      </Box>
      <Box sx={{ p: 2.5, flexGrow: 1, width: '100%' }}>
          <Typography
              variant="subtitle2"
              fontWeight={800}
              noWrap
              sx={{
                  mb: 0.5,
                  fontSize: '0.95rem',
                  color: 'text.primary',
                  letterSpacing: -0.2
              }}
          >
              {product.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8 }}>#{product.sku}</Typography>
            <Typography variant="caption" color="divider">|</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.8 }}>BC: {product.barcode}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    display="block" 
                    sx={{ mb: -0.5, fontWeight: 700 }}
                >
                    Price
                </Typography>
                <Typography variant="h5" fontWeight={900} color="primary.main">
                    ${product.price.toFixed(2)}
                </Typography>
              </Box>
              <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(product);
                  }}
                  size="medium"
                  sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 42,
                      height: 42,
                      borderRadius: 3,
                      boxShadow: (theme) => `0 6px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                          bgcolor: 'primary.dark', 
                          transform: 'scale(1.1) rotate(10deg)',
                          boxShadow: (theme) => `0 8px 20px ${alpha(theme.palette.primary.main, 0.35)}`
                      }
                  }}
              >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: '1.2rem' }} />
              </IconButton>
          </Stack>
      </Box>
    </CardActionArea>
  </Paper>
);

// Customer Collection Dialog
const CustomerDialog = ({ open, onClose, onSave, initialData }) => {
    const [data, setData] = useState(initialData || { name: '', phone: '', email: '' });
    const theme = useTheme();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PersonAddAltOutlinedIcon color="primary" />
                Customer Information
            </DialogTitle>
            <DialogContent>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block', fontWeight: 600 }}>
                    Collect customer details for loyalty points and receipt history.
                </Typography>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <TextField 
                        fullWidth 
                        label="Full Name" 
                        placeholder="John Doe"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PersonOutlineOutlinedIcon fontSize="small" /></InputAdornment>,
                            sx: { borderRadius: 2.5 }
                        }}
                    />
                    <TextField 
                        fullWidth 
                        label="Phone Number" 
                        placeholder="+1 (234) 567-890"
                        value={data.phone}
                        onChange={(e) => setData({ ...data, phone: e.target.value })}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment>,
                            sx: { borderRadius: 2.5 }
                        }}
                    />
                    <TextField 
                        fullWidth 
                        label="Email Address" 
                        placeholder="john@example.com"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment>,
                            sx: { borderRadius: 2.5 }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>Skip</Button>
                <Button 
                    variant="contained" 
                    onClick={() => { onSave(data); onClose(); }} 
                    disabled={!data.name}
                    sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                >
                    Save Customer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Held Bills Dialog
const HeldBillsDialog = ({ open, onClose, heldBills, onResume, onDelete }) => {
    const theme = useTheme();

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 4, width: '100%', maxWidth: 500, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryIcon color="primary" />
                Held Bills ({heldBills.length})
            </DialogTitle>
            <DialogContent>
                {heldBills.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary">No bills currently on hold.</Typography>
                    </Box>
                ) : (
                    <Stack spacing={1.5} sx={{ mt: 1 }}>
                        {heldBills.map((bill) => (
                            <Paper 
                                key={bill.id}
                                variant="outlined" 
                                sx={{ 
                                    p: 2, 
                                    borderRadius: 3, 
                                    '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.02) }
                                }}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={800}>
                                            {bill.customer ? bill.customer.name : 'Guest'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            {bill.items.length} items • ${bill.total.toFixed(2)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                            {new Date(bill.timestamp).toLocaleTimeString()}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={1}>
                                        <Button 
                                            size="small" 
                                            color="error"
                                            onClick={() => onDelete(bill.id)}
                                            sx={{ minWidth: 'auto', px: 1 }}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </Button>
                                        <Button 
                                            variant="contained" 
                                            size="small"
                                            onClick={() => onResume(bill)}
                                            sx={{ borderRadius: 2, fontWeight: 700 }}
                                        >
                                            Resume
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

const PosTerminal = () => {
  const theme = useTheme();
  const { handlerDrawerOpen: setDrawerOpen } = useOutletContext() || {};
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutPosition, setLayoutPosition] = useState('right');
  const [cart, setCart] = useState([
    { ...PRODUCTS[0], quantity: 1, id: PRODUCTS[0].id },
    { ...PRODUCTS[2], quantity: 1, id: PRODUCTS[2].id },
    { ...PRODUCTS[5], quantity: 2, id: PRODUCTS[5].id },
  ]);
  const [customer, setCustomer] = useState(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [heldBills, setHeldBills] = useState([]);
  const [isHeldBillsDialogOpen, setIsHeldBillsDialogOpen] = useState(false);

  useEffect(() => {
    const savedLayout = localStorage.getItem('posLayoutPosition');
    if (savedLayout) setLayoutPosition(savedLayout);
  }, []);

  useEffect(() => {
    if (layoutPosition === 'left' && setDrawerOpen) {
      setDrawerOpen(false);
    }
  }, [layoutPosition, setDrawerOpen]);

  const toggleLayout = () => {
    const newPos = layoutPosition === 'right' ? 'left' : 'right';
    setLayoutPosition(newPos);
    localStorage.setItem('posLayoutPosition', newPos);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
        p.name.toLowerCase().includes(searchLower) || 
        (p.sku && p.sku.toLowerCase().includes(searchLower)) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0)); 
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    
    const newHeldBill = {
        id: Date.now(),
        items: [...cart],
        customer: customer,
        subtotal: subtotal,
        tax: tax,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    setHeldBills(prev => [newHeldBill, ...prev]);
    setCart([]);
    setCustomer(null);
  };

  const handleResumeBill = (heldBill) => {
    // If current cart has items, we could ask to merge or replace. 
    // To keep it simple as per request, we'll replace or just add them.
    // Usually "Resume" means loading that specific transaction.
    
    // For now, let's just replace the current state if it's empty, or add to it.
    // If the user wants to "move to next customer", holding current and starting new is the key.
    
    setCart(heldBill.items);
    setCustomer(heldBill.customer);
    setHeldBills(prev => prev.filter(b => b.id !== heldBill.id));
    setIsHeldBillsDialogOpen(false);
  };

  const handleDeleteHeldBill = (id) => {
    setHeldBills(prev => prev.filter(b => b.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <Box sx={{ 
        display: 'flex', 
        flexDirection: {
            xs: 'column-reverse',
            md: layoutPosition === 'left' ? 'row-reverse' : 'row'
        },
        height: { xs: 'auto', md: '100vh' }, 
        bgcolor: '#f4f7fa', 
        overflow: { xs: 'auto', md: 'hidden' }, 
        m: -3 
    }}>
      {/* Products Column */}
      <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: { xs: 2, sm: 3 }, 
          overflow: { xs: 'visible', md: 'hidden' },
          minHeight: { xs: '100vh', md: 'auto' }
      }}>
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField 
                fullWidth
                size="small"
                placeholder="Search products or scan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" fontSize="small" />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 2, bgcolor: 'white' }
                }}
            />
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<QrCodeScannerIcon />}
                    sx={{ flex: 1, borderRadius: 2, px: 3, whiteSpace: 'nowrap', bgcolor: 'white', border: '1px solid #ddd', color: 'text.primary', textTransform: 'none' }}
                >
                    Scan
                </Button>
                <Tooltip title={`Swap Sidebar to ${layoutPosition === 'right' ? 'Left' : 'Right'}`}>
                    <IconButton 
                        onClick={toggleLayout}
                        sx={{ 
                            borderRadius: 2, 
                            border: '1px solid #ddd', 
                            bgcolor: 'white',
                            '&:hover': { bgcolor: 'primary.lighter' }
                        }}
                    >
                        <SwapHorizIcon color="primary" />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Box>

        <Stack 
            direction="row" 
            spacing={1.5} 
            sx={{ 
                mb: 3, 
                overflowX: 'auto', 
                pb: 1,
                '&::-webkit-scrollbar': { height: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.200', borderRadius: 2 }
            }}
        >
            {CATEGORIES.map(cat => (
                <Button
                    key={cat.id}
                    size="small"
                    startIcon={<cat.icon sx={{ fontSize: '1rem !important' }} />}
                    variant={selectedCategory === cat.id ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory(cat.id)}
                    sx={{ 
                        borderRadius: 2, 
                        px: 2.5, 
                        py: 0.8, 
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: selectedCategory === cat.id ? 'primary.main' : 'white',
                        color: selectedCategory === cat.id ? 'white' : 'text.primary',
                        border: '1px solid',
                        borderColor: selectedCategory === cat.id ? 'primary.main' : '#ddd',
                        minWidth: 'fit-content'
                    }}
                >
                    {cat.name}
                </Button>
            ))}
        </Stack>

        <Box sx={{ 
            flex: 1, 
            overflowY: { xs: 'visible', md: 'auto' }, 
            pr: { md: 1 },
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 3 }
        }}>
            <Grid container spacing={2}>
                {filteredProducts.map(product => (
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3, xxl: 2 }} key={product.id}>
                        <ProductCard product={product} onAdd={addToCart} />
                    </Grid>
                ))}
            </Grid>
        </Box>
      </Box>

      {/* Cart Column */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: 400 }, 
          bgcolor: 'white', 
          borderLeft: { md: layoutPosition === 'right' ? '1px solid' : 'none' }, 
          borderRight: { md: layoutPosition === 'left' ? '1px solid' : 'none' },
          borderBottom: { xs: '1px solid', md: 'none' },
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, sm: 2.5 },
          maxHeight: { xs: '60vh', md: '100%' },
          position: { xs: 'sticky', md: 'relative' },
          top: 0,
          zIndex: 10
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="h5" fontWeight={800}>Cart Items ({cart.length})</Typography>
                {heldBills.length > 0 && (
                    <Badge badgeContent={heldBills.length} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 800 } }}>
                        <IconButton 
                            size="small" 
                            onClick={() => setIsHeldBillsDialogOpen(true)}
                            sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
                        >
                            <HistoryIcon fontSize="small" color="primary" />
                        </IconButton>
                    </Badge>
                )}
            </Stack>
            <Button 
                size="small" 
                startIcon={<PersonAddAltOutlinedIcon />} 
                onClick={() => setIsCustomerDialogOpen(true)}
                sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none', 
                    fontWeight: 700,
                    bgcolor: customer ? alpha(theme.palette.success.main, 0.08) : alpha(theme.palette.primary.main, 0.08),
                    color: customer ? 'success.main' : 'primary.main',
                    px: 1.5,
                    border: '1px solid',
                    borderColor: customer ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                        bgcolor: customer ? alpha(theme.palette.success.main, 0.12) : alpha(theme.palette.primary.main, 0.12)
                    }
                }}
            >
                {customer ? 'Edit Customer' : 'Add Customer'}
            </Button>
        </Stack>

        {customer && (
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 1.5, 
                    mb: 2, 
                    borderRadius: 3, 
                    bgcolor: alpha(theme.palette.success.main, 0.03), 
                    border: '1px dashed',
                    borderColor: alpha(theme.palette.success.main, 0.3)
                }}
            >
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                        <PersonOutlineOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'success.dark', lineHeight: 1.2 }}>{customer.name}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{customer.phone || 'No Phone'}</Typography>
                            {customer.email && (
                                <>
                                    <Typography variant="caption" color="divider">|</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>{customer.email}</Typography>
                                </>
                            )}
                        </Stack>
                    </Box>
                    <IconButton size="small" onClick={() => setCustomer(null)} sx={{ color: 'text.disabled' }}>
                        <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                </Stack>
            </Paper>
        )}

        <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            pr: 0.5,
            '&::-webkit-scrollbar': { width: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.200', borderRadius: 2 }
        }}>
            {cart.length === 0 ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8, py: 4 }}>
                    <Box sx={{ width: 140, mb: -2 }}>
                        <Lottie animationData={noDataAnimation} loop={true} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Your cart is empty
                    </Typography>
                </Box>
            ) : (
                cart.map(item => (
                    <Paper key={item.id} elevation={0} sx={{ p: 1, mb: 1.5, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid transparent', '&:hover': { borderColor: 'primary.lighter' } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar variant="rounded" src={item.image} sx={{ width: 50, height: 50, borderRadius: 1.5 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.8rem' }}>{item.name}</Typography>
                                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                    ${item.price.toFixed(2)}
                                </Typography>
                            </Box>
                            <Stack alignItems="flex-end" spacing={0.5}>
                                <IconButton size="small" color="error" onClick={() => removeFromCart(item.id)} sx={{ p: 0.5 }}>
                                    <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                                <Stack direction="row" sx={{ bgcolor: 'white', borderRadius: 1, p: 0.2, border: '1px solid #eee' }} alignItems="center">
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, -1)} sx={{ p: 0.2 }}><RemoveIcon sx={{ fontSize: '0.8rem' }} /></IconButton>
                                    <Typography sx={{ px: 0.8, fontWeight: 700, fontSize: '0.75rem' }}>{item.quantity}</Typography>
                                    <IconButton size="small" onClick={() => updateQuantity(item.id, 1)} sx={{ p: 0.2, color: 'primary.main' }}><AddIcon sx={{ fontSize: '0.8rem' }} /></IconButton>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Paper>
                ))
            )}
        </Box>

        {/* Actions */}
        <Grid container spacing={1} sx={{ mt: 2, mb: 2.5 }}>
            <Grid size={{ xs: 4 }}><Button fullWidth variant="outlined" startIcon={<LocalOfferOutlinedIcon sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontSize: '0.9rem !important' }} />} sx={{ borderRadius: 1.5, py: 0.8, fontSize: '0.65rem', fontWeight: 800 }}>% Disc.</Button></Grid>
            <Grid size={{ xs: 4 }}><Button fullWidth variant="outlined" startIcon={<NoteAltOutlinedIcon sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontSize: '0.9rem !important' }} />} sx={{ borderRadius: 1.5, py: 0.8, fontSize: '0.65rem', fontWeight: 800 }}>Note</Button></Grid>
            <Grid size={{ xs: 4 }}>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={handleHoldBill}
                    disabled={cart.length === 0}
                    startIcon={<PauseCircleOutlineIcon sx={{ display: { xs: 'none', sm: 'inline-flex' }, fontSize: '0.9rem !important' }} />} 
                    sx={{ borderRadius: 1.5, py: 0.8, fontSize: '0.65rem', fontWeight: 800 }}
                >
                    Hold
                </Button>
            </Grid>
        </Grid>

        {/* Totals */}
        <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" variant="body2">Subtotal</Typography>
                <Typography fontWeight={700} variant="body2">${subtotal.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" variant="body2">Tax (8%)</Typography>
                <Typography fontWeight={700} variant="body2">${tax.toFixed(2)}</Typography>
            </Stack>
            <Divider sx={{ my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={800}>Total</Typography>
                <Typography variant="h3" fontWeight={900} color="primary.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>${total.toFixed(2)}</Typography>
            </Stack>
        </Stack>

        <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            onClick={() => {
                if (!customer && cart.length > 0) {
                    setIsCustomerDialogOpen(true);
                } else {
                    // Normal payment logic
                    alert('Processing Payment for ' + (customer ? customer.name : 'Guest'));
                }
            }}
            endIcon={<KeyboardArrowDownIcon sx={{ transform: 'rotate(-90deg)' }} />}
            sx={{ 
                py: { xs: 1.5, sm: 1.8 }, 
                borderRadius: 2.5, 
                fontWeight: 800,
                fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
        >
            Pay ${total.toFixed(2)}
        </Button>

        <CustomerDialog 
            open={isCustomerDialogOpen} 
            onClose={() => setIsCustomerDialogOpen(false)} 
            onSave={(data) => setCustomer(data)}
            initialData={customer}
        />

        <HeldBillsDialog 
            open={isHeldBillsDialogOpen}
            onClose={() => setIsHeldBillsDialogOpen(false)}
            heldBills={heldBills}
            onResume={handleResumeBill}
            onDelete={handleDeleteHeldBill}
        />
      </Box>
    </Box>
  );
};

export default PosTerminal;
