import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useBarcodeScanner } from 'hooks/useBarcodeScanner';
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
  DialogActions,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
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
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RedeemIcon from '@mui/icons-material/Redeem';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

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
              height: 130, 
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
      <Box sx={{ p: 1.5, flexGrow: 1, width: '100%' }}>
          <Typography
              variant="subtitle2"
              fontWeight={800}
              noWrap
              sx={{
                  mb: 0.3,
                  fontSize: '0.85rem',
                  color: 'text.primary',
                  letterSpacing: -0.2
              }}
          >
              {product.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.8 }}>#{product.sku}</Typography>
            <Typography variant="caption" color="divider">|</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.8 }}>BC: {product.barcode}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    display="block" 
                    sx={{ mb: -0.8, fontWeight: 700, fontSize: '0.6rem' }}
                >
                    Price
                </Typography>
                <Typography variant="subtitle1" fontWeight={900} color="primary.main" sx={{ fontSize: '1rem' }}>
                    ${product.price.toFixed(2)}
                </Typography>
              </Box>
              <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd(product);
                  }}
                  size="small"
                  sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                          bgcolor: 'primary.dark', 
                          transform: 'scale(1.1) rotate(10deg)',
                          boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`
                      }
                  }}
              >
                  <ShoppingCartOutlinedIcon sx={{ fontSize: '1rem' }} />
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

// Discount Dialog
const DiscountDialog = ({ open, onClose, discount, onApply }) => {
    const [value, setValue] = useState(discount || 0);
    const QUICK_DISCOUNTS = [0, 5, 10, 15, 18, 20, 25, 50];

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 4, width: '100%', maxWidth: 400, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalOfferOutlinedIcon color="primary" />
                Apply Discount
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter a percentage-based discount to apply to the subtotal.
                </Typography>
                
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="primary" gutterBottom>
                            DISCOUNT PERCENTAGE: {value}%
                        </Typography>
                        <TextField
                            fullWidth
                            type="number"
                            value={value}
                            onChange={(e) => setValue(Math.min(100, Math.max(0, Number(e.target.value))))}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                sx: { borderRadius: 2.5, fontWeight: 800, fontSize: '1.2rem' }
                            }}
                        />
                    </Box>

                    <Grid container spacing={1}>
                        {QUICK_DISCOUNTS.map((d) => (
                            <Grid size={{ xs: 4, sm: 3 }} key={d}>
                                <Button
                                    fullWidth
                                    variant={value === d ? 'contained' : 'outlined'}
                                    onClick={() => setValue(d)}
                                    sx={{ borderRadius: 2, fontWeight: 700 }}
                                >
                                    {d === 0 ? 'None' : `${d}%`}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={() => { onApply(value); onClose(); }} 
                    sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Note Dialog
const NoteDialog = ({ open, onClose, note, onSave }) => {
    const [value, setValue] = useState(note || '');

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <NoteAltOutlinedIcon color="primary" />
                Transaction Note
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add special instructions or internal notes for this transaction.
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Type your note here..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: 3 }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={() => { onSave(value); onClose(); }} 
                    sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                >
                    Save Note
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Barcode Dialog
const BarcodeDialog = ({ open, onClose, onAdd }) => {
    const [barcode, setBarcode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        const product = PRODUCTS.find(p => p.barcode === barcode);
        if (product) {
            onAdd(product);
            setBarcode('');
            setError('');
            onClose();
        } else {
            setError('Product not found for this barcode');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 400, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <QrCodeScannerIcon color="primary" /> Enter Barcode
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        autoFocus
                        label="Type Barcode"
                        placeholder="e.g. 123456789012"
                        value={barcode}
                        onChange={(e) => { setBarcode(e.target.value); setError(''); }}
                        error={!!error}
                        helperText={error}
                        sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                    />
                </form>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} sx={{ borderRadius: 2.5, px: 3, fontWeight: 800 }}>Add to Cart</Button>
            </DialogActions>
        </Dialog>
    );
};

// Reward Dialog
const RewardDialog = ({ open, onClose, customer }) => {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 400, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <RedeemIcon color="primary" /> Customer Rewards
            </DialogTitle>
            <DialogContent>
                {customer ? (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2), textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>Available Points</Typography>
                            <Typography variant="h2" fontWeight={900} color="primary.main">1,250</Typography>
                            <Typography variant="caption" color="text.secondary">Equivalent to <b>$12.50</b> credit</Typography>
                        </Box>
                        <Typography variant="subtitle2" fontWeight={800} sx={{ mt: 1 }}>Recent Transactions</Typography>
                        {[1, 2].map(i => (
                            <Stack key={i} direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Box>
                                    <Typography variant="body2" fontWeight={700}>Earned Points</Typography>
                                    <Typography variant="caption" color="text.secondary">Order #12{i}5 - 12 Dec 2025</Typography>
                                </Box>
                                <Typography color="success.main" fontWeight={800}>+45 pts</Typography>
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography color="text.secondary" variant="body2" sx={{ fontStyle: 'italic' }}>Please select a customer first to view rewards.</Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 700 }}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

// Pricelist Dialog
const PricelistDialog = ({ open, onClose, pricelist, onSelect }) => {
    const theme = useTheme();
    const PRICELISTS = [
        { id: 'standard', name: 'Standard Pricing', desc: 'Default retail prices' },
        { id: 'wholesale', name: 'Wholesale Pricing', desc: '5% discount on all items' },
        { id: 'vip', name: 'VIP Pricing', desc: '10% discount on all items' }
    ];

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ListAltIcon color="primary" /> Select Pricelist
            </DialogTitle>
            <DialogContent>
                <Stack spacing={1.5} sx={{ mt: 1 }}>
                    {PRICELISTS.map(list => (
                        <Paper
                            key={list.id}
                            component={CardActionArea}
                            onClick={() => { onSelect(list.id); onClose(); }}
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                border: '2px solid',
                                borderColor: pricelist === list.id ? 'primary.main' : 'divider',
                                bgcolor: pricelist === list.id ? alpha(theme.palette.primary.main, 0.05) : 'white',
                                transition: 'all 0.2s'
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight={800} color={pricelist === list.id ? 'primary.main' : 'text.primary'}>{list.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{list.desc}</Typography>
                                </Box>
                                {pricelist === list.id && <Chip label="Active" size="small" color="primary" sx={{ fontWeight: 700, borderRadius: 1.5 }} />}
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button fullWidth onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

// Refund Dialog
const RefundDialog = ({ open, onClose, externalScannedCode }) => {
    const theme = useTheme();
    const [orderId, setOrderId] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        if (externalScannedCode && open) {
            setOrderId(externalScannedCode);
        }
    }, [externalScannedCode, open]);

    useEffect(() => {
        if (!open) {
            setOrderId('');
            setIsScanning(false);
            setScanError(null);
        }
    }, [open]);

    useEffect(() => {
        let html5QrCode;
        let isMounted = true;

        if (isScanning && open) {
            const initScanner = async () => {
                await new Promise(resolve => setTimeout(resolve, 350));
                if (!isMounted) return;
                
                const element = document.getElementById("refund-reader");
                if (!element) return;

                try {
                    html5QrCode = new Html5Qrcode("refund-reader");
                    const config = { fps: 15, qrbox: { width: 250, height: 150 } };
                    
                    await html5QrCode.start(
                        { facingMode: "environment" }, 
                        config, 
                        (decodedText) => {
                            setOrderId(decodedText);
                            setIsScanning(false);
                        },
                        () => {}
                    );
                } catch (err) {
                    if (isMounted) {
                        setScanError("Unable to start camera.");
                        setIsScanning(false);
                    }
                }
            };
            initScanner();
        }

        return () => {
            isMounted = false;
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(() => {});
            }
        };
    }, [isScanning, open]);

    const handleSearch = () => {
        if (orderId) {
            alert(`Searching for Order: ${orderId}`);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 500, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AssignmentReturnIcon color="primary" /> Process Refund
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField 
                        fullWidth 
                        placeholder="Search Order ID or Receipt Number" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        InputProps={{ 
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} />, 
                            sx: { borderRadius: 3 } 
                        }} 
                    />
                    
                    <Box 
                        sx={{ 
                            position: 'relative',
                            py: isScanning ? 0 : 6, 
                            textAlign: 'center', 
                            border: '2px dashed', 
                            borderColor: isScanning ? 'primary.main' : 'divider', 
                            borderRadius: 4, 
                            bgcolor: isScanning ? 'black' : alpha(theme.palette.grey[100], 0.5),
                            overflow: 'hidden',
                            minHeight: 180,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: !isScanning ? 'pointer' : 'default'
                        }}
                        onClick={() => !isScanning && setIsScanning(true)}
                    >
                        {isScanning ? (
                            <div id="refund-reader" style={{ width: '100%' }}></div>
                        ) : (
                            <Stack spacing={1} alignItems="center">
                                <QrCodeScannerIcon sx={{ fontSize: '2.5rem', color: 'text.disabled', opacity: 0.5 }} />
                                <Typography color="text.disabled" variant="body2" fontWeight={600}>
                                    {scanError ? scanError : "Click to scan a receipt or use camera"}
                                </Typography>
                            </Stack>
                        )}
                        
                        {isScanning && (
                            <Button 
                                size="small" 
                                variant="contained" 
                                color="error"
                                onClick={(e) => { e.stopPropagation(); setIsScanning(false); }}
                                sx={{ position: 'absolute', bottom: 10, right: 10, borderRadius: 2 }}
                            >
                                Stop
                            </Button>
                        )}
                    </Box>

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <InfoOutlinedIcon sx={{ fontSize: '1rem' }} /> Refund policy: items must be returned within 30 days.
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    disabled={!orderId} 
                    sx={{ borderRadius: 2.5, px: 3, fontWeight: 800 }}
                >
                    Search Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Camera Scanner Dialog
const CameraScannerDialog = ({ open, onClose, onScan }) => {
    const scannerRef = useRef(null);
    const [scanError, setScanError] = useState(null);

    useEffect(() => {
        let html5QrCode;
        let isMounted = true;

        if (open) {
            const initScanner = async () => {
                // Give the Dialog some time to finish its opening animation/mounting
                await new Promise(resolve => setTimeout(resolve, 350));
                
                if (!isMounted) return;
                
                const element = document.getElementById("reader");
                if (!element) {
                    console.error("Scanner element not found");
                    return;
                }

                try {
                    html5QrCode = new Html5Qrcode("reader");
                    const config = { fps: 15, qrbox: { width: 250, height: 150 } };
                    
                    await html5QrCode.start(
                        { facingMode: "environment" }, 
                        config, 
                        (decodedText) => {
                            onScan(decodedText);
                            onClose();
                        },
                        (errorMessage) => {
                            // ignore noise
                        }
                    );
                } catch (err) {
                    if (isMounted) {
                        setScanError("Unable to start camera. Please ensure permissions are granted and no other app is using it.");
                    }
                }
            };

            initScanner();
        }

        return () => {
            isMounted = false;
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(err => console.error("Error stopping scanner", err));
            }
        };
    }, [open, onScan, onClose]);

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <QrCodeScannerIcon color="primary" /> Scan Barcode
                </Box>
                <IconButton onClick={onClose} size="small"><CancelIcon /></IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: 'black', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div id="reader" style={{ width: '100%' }}></div>
                    {scanError && (
                        <Typography color="error" variant="caption" sx={{ position: 'absolute', bottom: 10, bgcolor: 'rgba(255,255,255,0.9)', px: 2, py: 0.5, borderRadius: 1 }}>
                            {scanError}
                        </Typography>
                    )}
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                    Position the barcode within the frame to scan.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button fullWidth onClick={onClose} variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 700 }}>Close Camera</Button>
            </DialogActions>
        </Dialog>
    );
};

// Command Info Dialog
const InfoDialog = ({ open, onClose }) => {
    const theme = useTheme();
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, width: '100%', maxWidth: 450, p: 1 } }}>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <KeyboardOutlinedIcon color="primary" /> Command Info
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 3, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.1) }}>
                        <Typography variant="body2" fontWeight={800} color="primary.main" gutterBottom>SYSTEM STATUS</Typography>
                        <Stack spacing={1}>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Version</Typography><Typography variant="caption" fontWeight={700}>2.4.1-stable</Typography></Stack>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Database</Typography><Typography variant="caption" fontWeight={700} color="success.main">Connected</Typography></Stack>
                            <Stack direction="row" justifyContent="space-between"><Typography variant="caption" color="text.secondary">Terminal ID</Typography><Typography variant="caption" fontWeight={700}>TERM-0042</Typography></Stack>
                        </Stack>
                    </Box>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={800} gutterBottom>KEYBOARD SHORTCUTS</Typography>
                        <Grid container spacing={1}>
                            {[ {k: 'F1', d: 'Search Product'}, {k: 'F2', d: 'Add Customer'}, {k: 'F8', d: 'Hold Bill'}, {k: 'F12', d: 'Pay Now'}, {k: 'ESC', d: 'Cancel Action'} ].map(s => (
                                <Grid size={{ xs: 6 }} key={s.k}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ px: 0.8, py: 0.2, bgcolor: alpha(theme.palette.grey[200], 0.8), borderRadius: 1, border: '1px solid', borderColor: 'divider', fontSize: '0.65rem', fontWeight: 900 }}>{s.k}</Typography>
                                        <Typography variant="caption" color="text.secondary">{s.d}</Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button fullWidth onClick={onClose} variant="contained" sx={{ borderRadius: 2.5, fontWeight: 700 }}>Great, thanks!</Button>
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
  
  // New State for Discount and Note
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState('');
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // New features dialog states
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [isRewardDialogOpen, setIsRewardDialogOpen] = useState(false);
  const [isPricelistDialogOpen, setIsPricelistDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [pricelist, setPricelist] = useState('standard');

  // Hardware Scanner Hook
  const [lastScannedRefundCode, setLastScannedRefundCode] = useState('');
  useBarcodeScanner((code) => {
    if (isRefundDialogOpen) {
        setLastScannedRefundCode(code);
    } else {
        const product = PRODUCTS.find(p => p.barcode === code);
        if (product) {
            addToCart(product);
        }
    }
  });

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
        discount: discount,
        note: note,
        subtotal: subtotal,
        tax: tax,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    setHeldBills(prev => [newHeldBill, ...prev]);
    setCart([]);
    setCustomer(null);
    setDiscount(0);
    setNote('');
  };

  const handleResumeBill = (heldBill) => {
    setCart(heldBill.items);
    setCustomer(heldBill.customer);
    setDiscount(heldBill.discount || 0);
    setNote(heldBill.note || '');
    setHeldBills(prev => prev.filter(b => b.id !== heldBill.id));
    setIsHeldBillsDialogOpen(false);
  };

  const handleDeleteHeldBill = (id) => {
    setHeldBills(prev => prev.filter(b => b.id !== id));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCancelOrder = () => {
    setCart([]);
    setCustomer(null);
    setDiscount(0);
    setNote('');
    handleMenuClose();
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Pricelist Logic: applying special discounts based on pricelist
  const pricelistDiscountFactor = pricelist === 'wholesale' ? 0.05 : (pricelist === 'vip' ? 0.10 : 0);
  const pricelistDiscountAmount = subtotal * pricelistDiscountFactor;
  
  const discountAmount = (subtotal - pricelistDiscountAmount) * (discount / 100);
  const currentSubtotal = subtotal - pricelistDiscountAmount - discountAmount;
  const tax = currentSubtotal * 0.08;
  const total = currentSubtotal + tax;

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
                    onClick={() => setIsCameraScannerOpen(true)}
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
            <Grid container spacing={1.5}>
                {filteredProducts.map(product => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={product.id}>
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
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                            variant="subtitle2" 
                            fontWeight={800} 
                            noWrap 
                            sx={{ 
                                color: 'success.dark', 
                                lineHeight: 1.2,
                                textOverflow: 'ellipsis',
                                overflow: 'hidden'
                            }}
                        >
                            {customer.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ whiteSpace: 'nowrap' }}>
                                {customer.phone || 'No Phone'}
                            </Typography>
                            {customer.email && (
                                <>
                                    <Typography variant="caption" color="divider">|</Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        fontWeight={600}
                                        sx={{ 
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                        title={customer.email}
                                    >
                                        {customer.email}
                                    </Typography>
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
            <Grid size={{ xs: 3.5 }}>
                <Button 
                    fullWidth 
                    variant={discount > 0 ? "contained" : "outlined"} 
                    onClick={() => setIsDiscountDialogOpen(true)}
                    startIcon={<LocalOfferOutlinedIcon sx={{ display: { xs: 'none', lg: 'inline-flex' }, fontSize: '0.9rem !important' }} />} 
                    sx={{ 
                        borderRadius: 1.5, 
                        py: 0.8, 
                        fontSize: '0.65rem', 
                        fontWeight: 800,
                        bgcolor: discount > 0 ? alpha(theme.palette.primary.main, 1) : 'transparent',
                        color: discount > 0 ? 'white' : 'primary.main'
                    }}
                >
                    {discount > 0 ? `${discount}%` : '% Disc.'}
                </Button>
            </Grid>
            <Grid size={{ xs: 3.5 }}>
                <Button 
                    fullWidth 
                    variant={note ? "contained" : "outlined"} 
                    onClick={() => setIsNoteDialogOpen(true)}
                    startIcon={<NoteAltOutlinedIcon sx={{ display: { xs: 'none', lg: 'inline-flex' }, fontSize: '0.9rem !important' }} />} 
                    sx={{ 
                        borderRadius: 1.5, 
                        py: 0.8, 
                        fontSize: '0.65rem', 
                        fontWeight: 800,
                        bgcolor: note ? alpha(theme.palette.primary.main, 1) : 'transparent',
                        color: note ? 'white' : 'primary.main'
                    }}
                >
                    {note ? 'Edit Note' : 'Note'}
                </Button>
            </Grid>
            <Grid size={{ xs: 3.5 }}>
                <Button 
                    fullWidth 
                    variant="outlined" 
                    onClick={handleHoldBill}
                    disabled={cart.length === 0}
                    startIcon={<PauseCircleOutlineIcon sx={{ display: { xs: 'none', lg: 'inline-flex' }, fontSize: '0.9rem !important' }} />} 
                    sx={{ borderRadius: 1.5, py: 0.8, fontSize: '0.65rem', fontWeight: 800 }}
                >
                    Hold
                </Button>
            </Grid>
            <Grid size={{ xs: 1.5 }}>
                <IconButton 
                    onClick={handleMenuOpen}
                    sx={{ 
                        borderRadius: 1.5, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        bgcolor: isMenuOpen ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                        height: '100%',
                        width: '100%'
                    }}
                >
                    <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
                </IconButton>
            </Grid>
        </Grid>

        <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
                elevation: 3,
                sx: { 
                    borderRadius: 3, 
                    minWidth: 200, 
                    mt: 1,
                    '& .MuiMenuItem-root': { py: 1.2, px: 2 }
                }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={() => { handleMenuClose(); setIsBarcodeDialogOpen(true); }}>
                <ListItemIcon><QrCodeScannerIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Enter Barcode" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setIsRewardDialogOpen(true); }}>
                <ListItemIcon><RedeemIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Reward" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setIsPricelistDialogOpen(true); }}>
                <ListItemIcon><ListAltIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Pricelist" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setIsRefundDialogOpen(true); }}>
                <ListItemIcon><AssignmentReturnIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Refund" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); setIsInfoDialogOpen(true); }}>
                <ListItemIcon><KeyboardOutlinedIcon fontSize="small" /></ListItemIcon>
                <ListItemText primary="Command Info" primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleCancelOrder} sx={{ color: 'error.main' }}>
                <ListItemIcon><CancelIcon fontSize="small" color="error" /></ListItemIcon>
                <ListItemText primary="Cancel Order" primaryTypographyProps={{ variant: 'body2', fontWeight: 700 }} />
            </MenuItem>
        </Menu>

        {/* Totals */}
        <Stack spacing={1} sx={{ mb: 2.5 }}>
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" variant="body2">Subtotal</Typography>
                <Typography fontWeight={700} variant="body2">${subtotal.toFixed(2)}</Typography>
            </Stack>
            {pricelist !== 'standard' && (
                <Stack direction="row" justifyContent="space-between">
                    <Typography color="primary.main" variant="body2" fontWeight={600}>
                        {pricelist === 'wholesale' ? 'Wholesale Disc (5%)' : 'VIP Discount (10%)'}
                    </Typography>
                    <Typography fontWeight={700} variant="body2" color="primary.main">-${pricelistDiscountAmount.toFixed(2)}</Typography>
                </Stack>
            )}
            {discount > 0 && (
                <Stack direction="row" justifyContent="space-between">
                    <Typography color="error.main" variant="body2" fontWeight={600}>Discount ({discount}%)</Typography>
                    <Typography fontWeight={700} variant="body2" color="error.main">-${discountAmount.toFixed(2)}</Typography>
                </Stack>
            )}
            <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary" variant="body2">Tax (8%)</Typography>
                <Typography fontWeight={700} variant="body2">${tax.toFixed(2)}</Typography>
            </Stack>
            {note && (
                <Paper elevation={0} sx={{ p: 1, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), border: '1px dashed', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                        <NoteAltOutlinedIcon sx={{ fontSize: '1rem', color: 'warning.main', mt: 0.2 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', flex: 1 }}>
                            {note}
                        </Typography>
                    </Stack>
                </Paper>
            )}
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

        <DiscountDialog 
            open={isDiscountDialogOpen}
            onClose={() => setIsDiscountDialogOpen(false)}
            discount={discount}
            onApply={(v) => setDiscount(v)}
        />

        <NoteDialog 
            open={isNoteDialogOpen}
            onClose={() => setIsNoteDialogOpen(false)}
            note={note}
            onSave={(v) => setNote(v)}
        />

        <BarcodeDialog 
            open={isBarcodeDialogOpen}
            onClose={() => setIsBarcodeDialogOpen(false)}
            onAdd={addToCart}
        />

        <CameraScannerDialog
            open={isCameraScannerOpen}
            onClose={() => setIsCameraScannerOpen(false)}
            onScan={(code) => {
                const product = PRODUCTS.find(p => p.barcode === code);
                if (product) addToCart(product);
            }}
        />

        <RewardDialog 
            open={isRewardDialogOpen}
            onClose={() => setIsRewardDialogOpen(false)}
            customer={customer}
        />

        <PricelistDialog 
            open={isPricelistDialogOpen}
            onClose={() => setIsPricelistDialogOpen(false)}
            pricelist={pricelist}
            onSelect={(v) => setPricelist(v)}
        />

        <RefundDialog 
            open={isRefundDialogOpen}
            onClose={() => setIsRefundDialogOpen(false)}
            externalScannedCode={lastScannedRefundCode}
        />

        <InfoDialog 
            open={isInfoDialogOpen}
            onClose={() => setIsInfoDialogOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default PosTerminal;
