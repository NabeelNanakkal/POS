import { useState } from 'react';
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
  Badge
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

// Animations
import Lottie from 'lottie-react';
import noDataAnimation from 'assets/animations/noDataLottie.json';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentsIcon from '@mui/icons-material/Payments';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import GridViewIcon from '@mui/icons-material/GridView';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';


// Mock Data
const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: GridViewIcon },
  { id: 'apparel', name: 'Apparel', icon: ShoppingBagIcon },
  { id: 'electronics', name: 'Electronics', icon: LocalShippingOutlinedIcon },
  { id: 'snacks', name: 'Snacks', icon: StorefrontIcon },
];

const PRODUCTS = [
  { id: 1, name: 'Noise Cancelling Headphones', price: 129.00, oldPrice: 149.00, sku: 'NC-HEAD-001', stock: '12 Left', stockType: 'warning', category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80' },
  { id: 2, name: 'Smart Watch Series 5', price: 249.00, sku: 'SW-SERIES-5', stock: 'In Stock', stockType: 'success', category: 'electronics', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80' },
  { id: 3, name: 'Running Sneakers Pro', price: 89.99, sku: 'SP-RUN-PRO', stock: 'Low Stock', stockType: 'error', category: 'apparel', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80' },
//   { id: 4, name: 'Classic Denim Jacket', price: 65.00, sku: 'CL-DNM-JKT', stock: 'In Stock', stockType: 'success', category: 'apparel', image: 'https://images.unsplash.com/photo-1544648156-532a3f0f1301?auto=format&fit=crop&w=300&q=80' },
  { id: 5, name: 'Genuine Leather Wallet', price: 45.00, sku: 'AC-LTH-WLT', stock: 'In Stock', stockType: 'success', category: 'apparel', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=300&q=80' },
  { id: 6, name: 'Organic Cotton Tee', price: 25.00, sku: 'CL-COT-TEE', stock: '100+', stockType: 'success', category: 'apparel', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80' },
//   { id: 7, name: 'Bluetooth Speaker Mini', price: 39.00, sku: 'BT-SPK-MINI', stock: '25 Left', stockType: 'warning', category: 'electronics', image: 'https://images.unsplash.com/photo-1608156639585-34a0727037ae?auto=format&fit=crop&w=300&q=80' },
  { id: 8, name: 'Espresso Maker Pro', price: 199.00, sku: 'COF-MAK-PRO', stock: 'In Stock', stockType: 'success', category: 'electronics', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=300&q=80' },
//   { id: 9, name: 'Yoga Mat Premium', price: 49.00, sku: 'FIT-MAT-PREM', stock: 'In Stock', stockType: 'success', category: 'snacks', image: 'https://images.unsplash.com/photo-1592432678886-f1454652939e?auto=format&fit=crop&w=300&q=80' },
  { id: 10, name: 'Gourmet Mix Nuts', price: 15.00, sku: 'SNK-NIX-NUT', stock: '50+', stockType: 'success', category: 'snacks', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80' },
  { id: 11, name: 'Premium Dark Chocolate', price: 8.50, sku: 'SNK-DRK-CHO', stock: 'In Stock', stockType: 'success', category: 'snacks', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=300&q=80' },
//   { id: 12, name: 'Stainless Steel Bottle', price: 22.00, sku: 'HLT-SS-BOT', stock: 'Low Stock', stockType: 'error', category: 'electronics', image: 'https://images.unsplash.com/photo-1602143399827-bd939e9407d7?auto=format&fit=crop&w=300&q=80' },
];

const ProductCard = ({ product, onAdd }) => (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 4,
      overflow: 'hidden',
      bgcolor: 'white',
      border: '1px solid',
      borderColor: '#eee',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px -4px rgba(0,0,0,0.12)'
      }
    }}
  >
    <CardActionArea onClick={() => onAdd(product)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Box sx={{ position: 'relative', width: '100%' }}>
          <Box sx={{ height: 180, overflow: 'hidden', bgcolor: 'grey.50' }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          <Chip
              label={product.stock}
              size="small"
              color={product.stockType}
              sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  fontWeight: 800,
                  height: 18,
                  fontSize: '0.6rem',
                  backdropFilter: 'blur(4px)',
                  bgcolor: (theme) => alpha(theme.palette[product.stockType].main, 0.9),
                  color: 'white'
              }}
          />
      </Box>
      <Box sx={{ p: 2, flexGrow: 1, width: '100%' }}>
          <Typography
              variant="subtitle2"
              fontWeight={700}
              noWrap
              sx={{
                  mb: 0.2,
                  fontSize: '0.85rem'
              }}
          >
              {product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1, fontSize: '0.65rem' }}>#{product.sku}</Typography>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                  ${product.price.toFixed(2)}
              </Typography>
              <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(product);
                  }}
                  size="small"
                  sx={{
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      width: 28,
                      height: 28,
                      '&:hover': { bgcolor: 'primary.main', color: 'white' }
                  }}
              >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: '1.1rem' }} />
              </IconButton>
          </Stack>
      </Box>
    </CardActionArea>
  </Paper>
);

const PosTerminal = () => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([
    { ...PRODUCTS[0], quantity: 1, id: PRODUCTS[0].id },
    { ...PRODUCTS[2], quantity: 1, id: PRODUCTS[2].id },
    { ...PRODUCTS[5], quantity: 2, id: PRODUCTS[5].id },
  ]);

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
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

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f4f7fa', overflow: 'hidden', m: -3 }}>
      
      {/* 1. Main Center Content (Products) */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3, overflow: 'hidden' }}>
        
        {/* Search & Categories Bar */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
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
            <Button 
                variant="outlined" 
                size="small"
                startIcon={<QrCodeScannerIcon />}
                sx={{ borderRadius: 2, px: 3, whiteSpace: 'nowrap', bgcolor: 'white', border: '1px solid #ddd', color: 'text.primary', textTransform: 'none' }}
            >
                Scan
            </Button>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ mb: 3, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.200', borderRadius: 2 } }}>
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
                        minWidth: 'fit-content',
                        whiteSpace: 'nowrap',
                        '&:hover': { bgcolor: selectedCategory === cat.id ? 'primary.dark' : 'grey.50' }
                    }}
                >
                    {cat.name}
                </Button>
            ))}
        </Stack>

        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 3 } }}>
            <Grid container spacing={2}>
                {filteredProducts.map(product => (
                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }} key={product.id}>
                        <ProductCard product={product} onAdd={addToCart} />
                    </Grid>
                ))}
            </Grid>
        </Box>
      </Box>

      {/* 2. Right Sidebar (Cart) */}
      <Box 
        sx={{ 
          width: 400, 
          bgcolor: 'white', 
          borderLeft: '1px solid', 
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          p: 2.5
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
            <Typography variant="h5" fontWeight={800}>Cart Items ({cart.length})</Typography>
            <Button size="small" variant="text" sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem' }}>+ New</Button>
        </Stack>

        <Box sx={{ flex: 1, overflowY: 'auto', pr: 0.5, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.200', borderRadius: 2 }, display: 'flex', flexDirection: 'column' }}>
            {cart.length === 0 ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.8 }}>
                    <Box sx={{ width: 200, mb: -2 }}>
                        <Lottie animationData={noDataAnimation} loop={true} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Your cart is empty
                    </Typography>
                </Box>
            ) : (
                cart.map(item => (
                    <Paper 
                        key={item.id} 
                        elevation={0} 
                        sx={{ p: 1, mb: 1.5, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid transparent', '&:hover': { borderColor: 'primary.lighter' } }}
                    >
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

        {/* Cart Actions */}
        <Grid container spacing={1} sx={{ mt: 2, mb: 2.5 }}>
            <Grid size={{ xs: 4 }}>
                <Button fullWidth variant="outlined" startIcon={<LocalOfferOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />} sx={{ borderRadius: 1.5, py: 0.8, textTransform: 'uppercase', fontSize: '0.55rem', fontWeight: 800 }}>% Disc.</Button>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <Button fullWidth variant="outlined" startIcon={<NoteAltOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />} sx={{ borderRadius: 1.5, py: 0.8, textTransform: 'uppercase', fontSize: '0.55rem', fontWeight: 800 }}>Note</Button>
            </Grid>
            <Grid size={{ xs: 4 }}>
                <Button fullWidth variant="outlined" startIcon={<LocalShippingOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />} sx={{ borderRadius: 1.5, py: 0.8, textTransform: 'uppercase', fontSize: '0.55rem', fontWeight: 800 }}>Ship</Button>
            </Grid>
        </Grid>

        {/* Totals Section */}
        <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" fontWeight={500} variant="body2">Subtotal</Typography>
                <Typography fontWeight={700} variant="body2">${subtotal.toFixed(2)}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" fontWeight={500} variant="body2">Tax (8%)</Typography>
                <Typography fontWeight={700} variant="body2">${tax.toFixed(2)}</Typography>
            </Stack>
            <Divider sx={{ my: 0.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={800}>Total</Typography>
                <Typography variant="h3" fontWeight={900} color="primary.main">${total.toFixed(2)}</Typography>
            </Stack>
        </Stack>

        <Button 
            fullWidth 
            variant="contained" 
            size="large"
            endIcon={<KeyboardArrowDownIcon sx={{ transform: 'rotate(-90deg)' }} />}
            sx={{ 
                py: 1.8, 
                borderRadius: 2.5, 
                textTransform: 'none', 
                fontSize: '1rem', 
                fontWeight: 800,
                boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
            }}
        >
            Pay ${total.toFixed(2)}
        </Button>
      </Box>

    </Box>
  );
};

export default PosTerminal;
