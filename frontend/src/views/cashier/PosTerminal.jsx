import { useState, useEffect, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useBarcodeScanner } from 'hooks/use-barcode-scanner';
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
  ListItemText,
  Alert,
  Collapse
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useOutletContext, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Animations
import Lottie from 'lottie-react';
import emptyCartAnimation from 'assets/animations/Shopping Cart Loader.json';
import emptyProductsAnimation from 'assets/animations/empty.json';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import StorefrontIcon from '@mui/icons-material/Storefront';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import HistoryIcon from '@mui/icons-material/History';
import GridViewIcon from '@mui/icons-material/GridView';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CancelIcon from '@mui/icons-material/Cancel'; // Ensure this is imported
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RedeemIcon from '@mui/icons-material/Redeem';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';

// Mock Data
import { fetchProducts } from 'container/product/slice';
import { fetchStores } from 'container/store/slice';
import { fetchDiscounts } from 'container/discount/slice';
import { useSelector, useDispatch } from 'react-redux';
import customerService from 'services/customer.service';
import orderService from 'services/order.service';
import cashSessionService from 'services/cashSession.service';
import printerService from 'services/printer.service';
import ReceiptTemplate from 'components/print/ReceiptTemplate';
import config from 'config';
import { formatAmountWithComma, getCurrencySymbol } from 'utils/formatAmount';
// Helper to match ProductManagement color logic
const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 45%)`;
};

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
              {product.image ? (
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
              ) : (
                  <Avatar 
                    variant="square" 
                    sx={{ 
                        width: '100%', 
                        height: '100%', 
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 700
                    }}
                  >
                    {product.name.substring(0, 2).toUpperCase()}
                  </Avatar>
              )}

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
              label={product.stock <= (product.reorderPoint || 0) ? 'Low Stock' : `${product.stock} In Stock`}
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
                  bgcolor: (theme) => product.stock <= (product.reorderPoint || 0) ? alpha(theme.palette.error.main, 0.85) : alpha(theme.palette.success.main, 0.85),
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette[product.stock <= (product.reorderPoint || 0) ? 'error' : 'success'].main, 0.3)}`
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
                    {formatAmountWithComma(product.retailPrice || product.price || 0)}
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
    const [step, setStep] = useState('search'); // 'search' or 'form'
    const [data, setData] = useState(initialData || { name: '', phone: '', email: '' });
    const [searchPhone, setSearchPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [foundCustomer, setFoundCustomer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            if (initialData) {
                setData(initialData);
                setStep('form');
            } else {
                setStep('search');
                setSearchPhone('');
                setFoundCustomer(null);
                setData({ name: '', phone: '', email: '' });
                setError('');
            }
        }
    }, [open, initialData]);

    // Debounced Search Effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (step === 'search' && searchPhone.length >= 5) {
                handleSearch();
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchPhone, step]);

    const handleSearch = async () => {
        if (!searchPhone || searchPhone.length < 5) return;
        setLoading(true);
        setError('');
        try {
            const res = await customerService.getCustomers({ search: searchPhone });
            if (res.data.customers && res.data.customers.length > 0) {
                // Determine exact match or best match
                const match = res.data.customers.find(c => c.phone === searchPhone) || res.data.customers[0];
                setFoundCustomer(match);
            } else {
                setFoundCustomer(null);
            }
        } catch (err) {
            console.error(err);
            setError('Error searching customer');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        setData({ name: '', phone: searchPhone, email: '' });
        setStep('form');
    };

    const handleSelectFound = () => {
        onSave(foundCustomer);
        onClose();
    };

    const handleSaveNew = async () => {
        try {
            setLoading(true);
            let res;
            if (data._id) {
                // Update existing customer
                res = await customerService.updateCustomer(data._id, data);
            } else {
                // Create new customer
                res = await customerService.createCustomer(data);
            }
            onSave(res.data); // Use the returned customer with ID
            onClose();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 409) {
                 alert("Customer with this phone already exists!");
            } else {
                 alert("Failed to save customer");
            }
        } finally {
             setLoading(false);
        }
    };

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
                {step === 'search' ? 'Find Customer' : 'Customer Information'}
            </DialogTitle>
            <DialogContent>
                {step === 'search' ? (
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Enter phone number to search or add new customer.
                        </Typography>
                        <TextField 
                            fullWidth 
                            autoFocus
                            label="Phone Number" 
                            placeholder="+1 (234) 567-890"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment>,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearch} disabled={!searchPhone || loading} edge="end" color="primary">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                                sx: { borderRadius: 2.5 }
                            }}
                        />
                        {loading && <Typography variant="caption" align="center" sx={{ display: 'block' }}>Searching...</Typography>}
                        {error && <Typography variant="caption" align="center" color="error" sx={{ display: 'block', fontWeight: 700 }}>{error}</Typography>}
                        
                        {foundCustomer && (
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: alpha('#4caf50', 0.05), borderColor: '#4caf50' }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar sx={{ bgcolor: 'success.main' }}>{foundCustomer.name.charAt(0)}</Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" fontWeight={700}>{foundCustomer.name}</Typography>
                                        <Typography variant="caption" display="block">{foundCustomer.phone}</Typography>
                                        {foundCustomer.loyaltyPoints > 0 && (
                                            <Chip label={`${foundCustomer.loyaltyPoints} pts`} size="small" color="primary" sx={{ mt: 0.5, height: 20, fontSize: '0.65rem' }} />
                                        )}
                                    </Box>
                                    <Button variant="contained" size="small" onClick={handleSelectFound} color="success" sx={{ fontWeight: 700 }}>
                                        Select
                                    </Button>
                                </Stack>
                            </Paper>
                        )}

                        {!foundCustomer && searchPhone.length > 3 && !loading && (
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                startIcon={<AddIcon />} 
                                onClick={handleCreateNew}
                                sx={{ borderRadius: 2, py: 1, borderStyle: 'dashed' }}
                            >
                                Add New Customer
                            </Button>
                        )}
                    </Stack>
                ) : (
                    <>
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
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
                {step === 'form' && (
                    <Button 
                        variant="contained" 
                        onClick={handleSaveNew} 
                        disabled={!data.name || loading}
                        sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                    >
                        {loading ? 'Saving...' : 'Save & Select'}
                    </Button>
                )}
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
const DiscountDialog = ({ open, onClose, discounts, currentDiscount, onApply, subtotal }) => {
    const [selectedId, setSelectedId] = useState(currentDiscount?._id || null);
    const [manualPercent, setManualPercent] = useState(currentDiscount?.type === 'PERCENTAGE' && !currentDiscount?._id ? currentDiscount.value : 0);

    const handleApply = () => {
        if (selectedId) {
            const disc = discounts.find(d => d._id === selectedId);
            
            // Check minimum purchase amount
            if (disc.minPurchaseAmount && subtotal < disc.minPurchaseAmount) {
                toast.error(`Minimum purchase of ${formatAmountWithComma(disc.minPurchaseAmount)} required for this discount.`);
                return;
            }
            
            onApply(disc);
        } else if (manualPercent > 0) {
            onApply({
                name: 'Manual Discount',
                type: 'PERCENTAGE',
                value: manualPercent,
                isManual: true
            });
        } else {
            onApply(null);
        }
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 4, width: '100%', maxWidth: 500, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocalOfferOutlinedIcon color="primary" />
                Select Discount
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Choose a pre-configured discount or enter a manual percentage.
                </Typography>
                
                <Stack spacing={3}>
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="primary" sx={{ mb: 1, display: 'block' }}>
                            AVAILABLE DISCOUNTS
                        </Typography>
                        <Grid container spacing={1.5}>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    fullWidth
                                    variant={!selectedId && manualPercent === 0 ? 'contained' : 'outlined'}
                                    onClick={() => { setSelectedId(null); setManualPercent(0); }}
                                    sx={{ borderRadius: 2, fontWeight: 700, justifyContent: 'flex-start', px: 2 }}
                                >
                                    None / Clear Discount
                                </Button>
                            </Grid>
                            {discounts.map((d) => (
                                <Grid size={{ xs: 12 }} key={d._id}>
                                    <Paper
                                        onClick={() => { setSelectedId(d._id); setManualPercent(0); }}
                                        sx={{
                                            p: 2,
                                            borderRadius: 3,
                                            cursor: 'pointer',
                                            border: '2px solid',
                                            borderColor: selectedId === d._id ? 'primary.main' : 'transparent',
                                            bgcolor: selectedId === d._id ? alpha('#2563eb', 0.05) : '#f8fafc',
                                            transition: 'all 0.2s',
                                            '&:hover': { bgcolor: alpha('#2563eb', 0.08) }
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={800}>{d.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                    Code: {d.code} • {d.type === 'PERCENTAGE' ? `${d.value}% Off` : `${formatAmountWithComma(d.value)} Off`}
                                                </Typography>
                                                {d.minPurchaseAmount > 0 && (
                                                    <Typography variant="caption" color="primary.main" fontWeight={700} display="block" sx={{ mt: 0.5 }}>
                                                        Min. Purchase: {formatAmountWithComma(d.minPurchaseAmount)}
                                                    </Typography>
                                                )}
                                            </Box>
                                            {selectedId === d._id && <CheckCircleIcon color="primary" />}
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    <Divider>
                        <Typography variant="caption" fontWeight={700} color="text.disabled">OR MANUAL PERCENTAGE</Typography>
                    </Divider>

                    <Box>
                        <TextField
                            fullWidth
                            type="number"
                            label="Manual Discount %"
                            value={manualPercent}
                            onChange={(e) => {
                                setManualPercent(Math.min(100, Math.max(0, Number(e.target.value))));
                                setSelectedId(null);
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                sx: { borderRadius: 2.5, fontWeight: 800 }
                            }}
                        />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleApply} 
                    sx={{ borderRadius: 2, px: 4, fontWeight: 800 }}
                >
                    Apply Discount
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
        // Use real products prop which will be passed down or available via context if not strict
        // But here BarcodeDialog doesn't have access to PRODUCTS list directly if we remove it.
        // We will pass `products` as prop or use a callback that handles it.
        // For now, let's assume `onAdd` handles the lookup or we find it here.
        // Actually, BarcodeDialog is a child. We should pass the product to onAdd.
        // We'll fix this in the main component.
        onAdd(barcode); // Pass barcode string to parent to handle lookup
        setBarcode('');
        setError('');
        onClose();
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
                            <Typography variant="caption" color="text.secondary">Equivalent to <b>{formatAmountWithComma(12.50)}</b> credit</Typography>
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


// project imports
import { toast } from 'react-toastify';

// Checkout Dialog with Payment Keyboard
const CheckoutDialog = ({ open, onClose, cart, customer, discount, note, subtotal, tax, total, pricelistDiscountAmount, discountAmount, pricelist, onPaymentComplete, onDiscount, onNote, onHold, onMenuOpen, onUpdateItemPrice, allowedPaymentModes }) => {
    const theme = useTheme();
    const [paymentAmount, setPaymentAmount] = useState('');
    const [recordedPayments, setRecordedPayments] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [editItem, setEditItem] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    
    useEffect(() => {
        if (open) {
            setPaymentAmount('');
            setRecordedPayments([]);
            setPaymentMethod('cash');
        }
    }, [open]);

    const handleEditPrice = (item) => {
        setEditItem(item);
        setNewPrice(item.price.toString());
    };

    const saveNewPrice = () => {
        if (editItem && newPrice !== '' && !isNaN(newPrice)) {
            const val = parseFloat(newPrice);
            if (val >= 0) {
                onUpdateItemPrice(editItem.id, val);
                setEditItem(null);
                setNewPrice('');
            } else {
                toast.error('Price cannot be negative');
            }
        }
    };

    const handleKeyPress = (value) => {
        if (value === 'backspace') {
            setPaymentAmount(prev => prev.slice(0, -1));
        } else if (value === '.' && paymentAmount.includes('.')) {
            return; // Don't allow multiple decimals
        } else {
            setPaymentAmount(prev => prev + value);
        }
    };

    const handleQuickAmount = (amount) => {
        if (amount === 'exact') {
            setPaymentAmount(total.toFixed(2));
        } else {
            const current = parseFloat(paymentAmount || '0');
            setPaymentAmount((current + amount).toFixed(2));
        }
    };

    const currentInputAmount = parseFloat(paymentAmount || '0');
    const totalPaid = recordedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = total - totalPaid;
    const change = totalPaid - total;
    const isValidPayment = totalPaid >= (total - 0.01); // Added tolerance for floating point precision

    const handleAddPayment = (methodValue) => {
        const amountToAdd = paymentAmount ? parseFloat(paymentAmount) : remainingBalance;
        
        if (amountToAdd <= 0) return;

        // Prevent entering above total money
        if (amountToAdd > (remainingBalance + 0.01)) { // Added 0.01 tolerance for float precision
            toast.error(`Payment exceeds remaining balance of ${formatAmountWithComma(remainingBalance)}`);
            return;
        }

        setRecordedPayments(prev => [...prev, { method: methodValue, amount: amountToAdd }]);
        setPaymentAmount('');
    };

    const handleRemovePayment = (index) => {
        setRecordedPayments(prev => prev.filter((_, i) => i !== index));
    };

    const handleCompletePayment = async () => {
        if (!isValidPayment) {
            alert('Insufficient payment amount!');
            return;
        }
        
        await onPaymentComplete(recordedPayments, totalPaid, change);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            // onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperProps={{ 
                sx: { 
                    borderRadius: 4, 
                    height: '90vh',
                    maxHeight: 800,
                    overflow: 'hidden'
                } 
            }}
        >
            <DialogTitle component="div" sx={{ 
                m: 0,
                p: 0, // Reset to 0 and apply padding to children or sx
                fontWeight: 800, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                borderBottom: '2px solid', 
                borderColor: 'primary.light', 
                py: 1.25, // Slightly reduced from 1.5
                px: 2.5,
                // bgcolor: alpha(theme.palette.primary.main, 0.04),
                // background: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.main, 0.01)})`,
                position: 'sticky',
                top: 0,
                zIndex: 1
            }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ 
                        p: 0.8, 
                        borderRadius: 2, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        boxShadow: '0 4px 10px ' + alpha(theme.palette.primary.main, 0.3)
                    }}>
                        <CreditCardOutlinedIcon sx={{ fontSize: '1.5rem' }} />
                    </Box>
                    {customer ? (
                        <Box>
                            <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ lineHeight: 1.1, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>
                                {customer.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" fontWeight={700} sx={{ mt: 0.1, letterSpacing: '0.01em', opacity: 0.9, fontSize: '0.875rem' }}>
                                {customer.phone || 'No Phone Number'}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ fontSize: '1.4rem' }}>
                            Checkout
                        </Typography>
                    )}
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CancelIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 0 }}>
                <Grid container sx={{ height: '100%' }}>
                    {/* Left Side - Cart Summary */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ borderRight: { md: '1px solid' }, borderColor: 'divider', pt: 1.5, pb: 3, px: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Order Summary</Typography>
                        


                        {/* Cart Items */}
                        <Box sx={{ 
                            maxHeight: 240,
                            overflowY: 'auto', 
                            mb: 2, 
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            bgcolor: 'grey.50',
                            p: 1.5,
                            '&::-webkit-scrollbar': { width: 4 } 
                        }}>
                            {cart.map((item, index) => (
                                <Paper key={index} elevation={0} sx={{ 
                                    p: 1.5, 
                                    mb: 1.25, 
                                    borderRadius: 2.5, 
                                    bgcolor: 'white', 
                                    border: '1px solid',
                                    borderColor: item.isPriceOverridden ? 'primary.light' : 'grey.100',
                                    transition: 'all 0.2s',
                                    '&:hover': { borderColor: 'primary.light', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }
                                }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ flex: 1 }}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography variant="body1" fontWeight={700} color="text.primary" sx={{ fontSize: '0.9rem' }}>{item.name}</Typography>
                                                {item.isPriceOverridden && (
                                                    <Chip label="Price Adjusted" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                                                )}
                                            </Stack>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                                                 <Chip label={`x${item.quantity}`} size="small" sx={{ height: 18, bgcolor: 'primary.lighter', color: 'primary.main', fontWeight: 800, fontSize: '0.65rem' }} />
                                                 <Stack direction="row" alignItems="center" spacing={0.5} onClick={() => handleEditPrice(item)} sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}>
                                                     <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textDecoration: item.isPriceOverridden ? 'line-through' : 'none' }}>
                                                        @ {formatAmountWithComma(item.originalPrice || item.price)}
                                                    </Typography>
                                                    {item.isPriceOverridden && (
                                                        <Typography variant="body2" color="primary.main" fontWeight={700} sx={{ fontSize: '0.75rem' }}>
                                                            {formatAmountWithComma(item.price)}
                                                        </Typography>
                                                    )}
                                                    <EditOutlinedIcon sx={{ fontSize: '0.8rem', color: 'text.disabled' }} />
                                                 </Stack>
                                            </Stack>
                                        </Box>
                                        <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ fontSize: '0.95rem' }}>
                                            {formatAmountWithComma(item.price * item.quantity)}
                                        </Typography>
                                    </Stack>
                                </Paper>
                            ))}
                        </Box>

                        {/* Actions Grid */}
                        <Grid container spacing={1.5} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 3 }}>
                                <Button 
                                    fullWidth 
                                    variant={discount > 0 ? "contained" : "outlined"} 
                                    onClick={onDiscount}
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 0.5,
                                        height: 38,
                                        fontWeight: 800,
                                        borderWidth: discount > 0 ? 0 : 2,
                                        bgcolor: discount > 0 ? 'primary.main' : 'transparent',
                                        '&:hover': { borderWidth: discount > 0 ? 0 : 2 }
                                    }}
                                >
                                    <LocalOfferOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Button 
                                    fullWidth 
                                    variant={note ? "contained" : "outlined"} 
                                    onClick={onNote}
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 0.5,
                                        height: 38,
                                        fontWeight: 800,
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    <NoteAltOutlinedIcon sx={{ fontSize: '1.2rem' }} />
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    onClick={onHold}
                                    disabled={cart.length === 0}
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 0.5, 
                                        height: 38,
                                        fontWeight: 800, 
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    <PauseCircleOutlineIcon sx={{ fontSize: '1.2rem' }} />
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 3 }}>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    onClick={onMenuOpen}
                                    sx={{ 
                                        borderRadius: 2, 
                                        py: 0.5, 
                                        height: 38,
                                        fontWeight: 800, 
                                        borderWidth: 2,
                                        '&:hover': { borderWidth: 2 }
                                    }}
                                >
                                    <MoreVertIcon sx={{ fontSize: '1.2rem' }} />
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Note Display (Optional, since button is clearer now) */}
                        {note && (
                            <Paper elevation={0} sx={{ p: 1.5, mb: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05), border: '1px dashed', borderColor: alpha(theme.palette.warning.main, 0.2) }}>
                                <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <NoteAltOutlinedIcon sx={{ fontSize: '1rem', color: 'warning.main', mt: 0.2 }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        {note}
                                    </Typography>
                                </Stack>
                            </Paper>
                        )}

                        {/* Totals */}
                        <Stack spacing={1.5}>

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                <Typography variant="body2" fontWeight={700}>{formatAmountWithComma(subtotal)}</Typography>
                            </Stack>
                            {pricelist !== 'standard' && (
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                        {pricelist === 'wholesale' ? 'Wholesale Disc (5%)' : 'VIP Discount (10%)'}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">-{formatAmountWithComma(pricelistDiscountAmount)}</Typography>
                                </Stack>
                            )}
                            {discount > 0 && (
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="error.main" fontWeight={600}>Discount ({discount}%)</Typography>
                                    <Typography variant="body2" fontWeight={700} color="error.main">-{formatAmountWithComma(discountAmount)}</Typography>
                                </Stack>
                            )}
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Tax (8%)</Typography>
                                <Typography variant="body2" fontWeight={700}>{formatAmountWithComma(tax)}</Typography>
                            </Stack>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={800}>Total</Typography>
                                <Typography variant="h4" fontWeight={900} color="primary.main">{formatAmountWithComma(total)}</Typography>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Right Side - Payment Keyboard */}
                    <Grid size={{ xs: 12, md: 6 }} sx={{ pt: 1.5, pb: 3, px: 3, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>Payment</Typography>
                        
                        {/* Payment Method Selection */}
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            {(() => {
                                const defaultModes = [
                                    { value: 'cash', label: 'Cash', icon: '💵' },
                                    { value: 'card', label: 'Card', icon: '💳' }
                                ];
                                const modes = (allowedPaymentModes && allowedPaymentModes.length > 0)
                                    ? allowedPaymentModes
                                    : defaultModes;
                                return modes.map(pm => {
                                    // Handle both object (from population) and string (if not populated)
                                    const method = typeof pm === 'object' ? {
                                        value: pm.value,
                                        label: pm.name,
                                        icon: pm.icon || '💰'
                                    } : {
                                        value: pm,
                                        label: pm.charAt(0).toUpperCase() + pm.slice(1),
                                        icon: pm === 'cash' ? '💵' : pm === 'card' ? '💳' : '💰'
                                    };
                                    
                                    return (
                                        <Button
                                            key={method.value}
                                            fullWidth
                                            variant="outlined"
                                            onClick={() => handleAddPayment(method.value)}
                                            sx={{ 
                                                py: 1, 
                                                borderRadius: 2,
                                                fontWeight: 700,
                                                fontSize: '0.85rem'
                                            }}
                                        >
                                            <Stack alignItems="center" spacing={0.25}>
                                                <Typography sx={{ fontSize: '1.25rem' }}>{method.icon}</Typography>
                                                <Typography 
                                                    variant="caption" 
                                                    fontWeight={700}
                                                    sx={{ fontSize: '0.7rem' }}
                                                >
                                                    {method.label}
                                                </Typography>
                                            </Stack>
                                        </Button>
                                    );
                                });
                            })()}
                        </Stack>

                        {/* Amount Display */}
                        <Paper elevation={0} sx={{ p: 2, mb: 1, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom display="block" sx={{ fontSize: '0.7rem' }}>
                                Amount Tendered
                            </Typography>
                            <Typography variant="h4" fontWeight={900} color="primary.main" sx={{ mb: 1.5, minHeight: 40, fontSize: '1.75rem' }}>
                                {getCurrencySymbol()} {paymentAmount || '0.00'}
                            </Typography>
                            
                            {/* Recorded Payments List */}
                            {recordedPayments.length > 0 && (
                                <Box sx={{ mt: 1, mb: 2, maxHeight: 100, overflowY: 'auto', p: 1, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                                    {recordedPayments.map((p, idx) => (
                                        <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'capitalize', color: 'text.primary' }}>
                                                    {p.method}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatAmountWithComma(p.amount)}
                                                </Typography>
                                            </Stack>
                                            <IconButton size="small" onClick={() => handleRemovePayment(idx)} sx={{ p: 0.2 }}>
                                                <CancelIcon sx={{ fontSize: '0.9rem', color: 'error.light' }} />
                                            </IconButton>
                                        </Stack>
                                    ))}
                                </Box>
                            )}
                            
                            <Stack direction="row" justifyContent="space-between" sx={{ pt: 1.5, borderTop: '1px dashed', borderColor: 'divider' }}>
                                <Typography variant="body2" fontWeight={600}>
                                    {totalPaid >= total ? 'Change' : 'Balance Due'}
                                </Typography>
                                <Typography variant="h6" fontWeight={800} color={totalPaid >= total ? 'success.main' : 'error.main'}>
                                    {formatAmountWithComma(totalPaid >= total ? change : Math.abs(remainingBalance))}
                                </Typography>
                            </Stack>
                            
                            {totalPaid > 0 && (
                                <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Total Paid</Typography>
                                    <Typography variant="caption" fontWeight={700}>{formatAmountWithComma(totalPaid)}</Typography>
                                </Stack>
                            )}
                        </Paper>

                        {/* Numeric Keyboard */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                            <Grid container spacing={1.5} sx={{ width: '100%' }}>
                                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace'].map((key) => (
                                    <Grid size={{ xs: 4 }} key={key}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            onClick={() => handleKeyPress(key)}
                                            sx={{
                                                height: '100%',
                                                minHeight: 38, // Reduced from 55 to match action buttons
                                                borderRadius: 2,
                                                fontWeight: 800,
                                                fontSize: '1rem', // Reduced from 1.25rem
                                                bgcolor: key === 'backspace' ? 'error.main' : 'white',
                                                color: key === 'backspace' ? 'white' : 'text.primary',
                                                boxShadow: '0 2px 0 #e0e0e0', // Thinner shadow
                                                border: '1px solid',
                                                borderColor: key === 'backspace' ? 'error.dark' : 'grey.300',
                                                transition: 'all 0.1s',
                                                '&:active': {
                                                    transform: 'translateY(2px)',
                                                    boxShadow: 'none'
                                                },
                                                '&:hover': {
                                                    bgcolor: key === 'backspace' ? 'error.dark' : 'grey.50',
                                                    color: key === 'backspace' ? 'white' : 'text.primary'
                                                }
                                            }}
                                        >
                                            {key === 'backspace' ? <CancelIcon sx={{ fontSize: '1.2rem' }} /> : key}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        {/* Clear Button */}
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => setPaymentAmount('')}
                            color="error"
                            sx={{ mt: 1, py: 1, borderRadius: 2, fontWeight: 700 }}
                        >
                            Reset Input
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ py: 1.25, px: 2.5, borderTop: '1px solid', borderColor: 'divider' }}>
                <Button onClick={onClose} variant="outlined" sx={{ px: 3, py: 1, borderRadius: 2, fontWeight: 700, fontSize: '0.85rem' }}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleCompletePayment} 
                    variant="contained" 
                    disabled={!isValidPayment}
                    sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 800, fontSize: '0.9rem' }}
                >
                    Complete Payment
                </Button>
            </DialogActions>

            {/* Price Edit Dialog */}
            <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Update Price</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField 
                            fullWidth 
                            label="New Price" 
                            type="number"
                            value={newPrice} 
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || parseFloat(val) >= 0) {
                                    setNewPrice(val);
                                }
                            }}
                            autoFocus
                            inputProps={{ min: 0, step: "0.01" }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">{getCurrencySymbol()}</InputAdornment>,
                                sx: { fontWeight: 700, fontSize: '1.2rem' }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditItem(null)} color="inherit">Cancel</Button>
                    <Button onClick={saveNewPrice} variant="contained" disabled={!newPrice}>Update Price</Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

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
      }
const PosTerminal = () => {
  const theme = useTheme();
  const { storeCode } = useParams();
  // Redux hooks
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.login);
  const { stores } = useSelector((state) => state.store);
  const { discounts } = useSelector((state) => state.discount);

  // Initial Fetch logic
  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchDiscounts());
  }, [dispatch]);

  useEffect(() => {
    // Determine warehouse filter
    let warehouseName = '';
    if (user?.store) {
        if (typeof user.store === 'object') {
            warehouseName = user.store.name;
        } else if (stores.length > 0) {
             const s = stores.find(st => st.id === user.store || st._id === user.store);
             if (s) warehouseName = s.name;
        }
    }

    dispatch(fetchProducts({ 
        page: 1, 
        limit: 1000, // Fetch large batch for POS 
        warehouseName: warehouseName,
        isActive: true
    }));
  }, [dispatch, user, stores]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutPosition, setLayoutPosition] = useState('right');
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
  const [heldBills, setHeldBills] = useState([]);
  const [isHeldBillsDialogOpen, setIsHeldBillsDialogOpen] = useState(false);
  
  // New State for Discount and Note
  const [selectedDiscount, setSelectedDiscount] = useState(null);
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
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  
  const [storeConfig, setStoreConfig] = useState(null);

  useEffect(() => {
    let storeToUse = null;
    
    // Find store ID by storeCode from URL
    if (storeCode && stores.length > 0) {
        storeToUse = stores.find(s => s.code === storeCode);
        if (storeToUse) {
            // Priority 1: Use the data already in Redux stores list if available
            setStoreConfig(storeToUse);
        } else {
            console.warn(`Store with code ${storeCode} not found in stores list`);
        }
    }
    
    // Fallback: If not found in stores list, or we want a fresh fetch anyway
    const storeIdToFetch = storeToUse ? (storeToUse._id || storeToUse.id) : (user?.store ? (typeof user.store === 'object' ? (user.store._id || user.store.id) : user.store) : null);

    if (storeIdToFetch) {
        const token = localStorage.getItem('token'); 
        
        axios.get(`${config.ip}/stores/${storeIdToFetch}`, {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
        })
        .then(res => {
            if (res.data && res.data.data) {
                setStoreConfig(res.data.data);
            }
        })
        .catch(err => {
            console.error('Failed to fetch store config:', err);
        });
    }
  }, [user, storeCode, stores]);
  const [pricelist, setPricelist] = useState('standard');

  // Live clock
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cash session state
  const [activeSession, setActiveSession] = useState(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [sessionBannerDismissed, setSessionBannerDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cashSessionService.getActive()
      .then(res => {
        setActiveSession(res.data?.data || null);
      })
      .catch(() => {
        setActiveSession(null);
      })
      .finally(() => {
        setSessionChecked(true);
      });
  }, []);

  const showSessionWarning = sessionChecked && !activeSession && !sessionBannerDismissed;

  // Print config + receipt state
  const [printConfig, setPrintConfig] = useState(null);
  const [lastCompletedOrder, setLastCompletedOrder] = useState(null);

  useEffect(() => {
    printerService.getConfig()
      .then((res) => setPrintConfig(res.data?.data || null))
      .catch(() => {});
  }, []);

  // Hardware Scanner Hook
  const [lastScannedRefundCode, setLastScannedRefundCode] = useState('');
  useBarcodeScanner((code) => {
    if (isRefundDialogOpen) {
        setLastScannedRefundCode(code);
    } else {
        const product = products.find(p => p.barcode === code);
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
    // Optional: Drawer logic if needed
  }, []);

  const toggleLayout = () => {
    const newPos = layoutPosition === 'right' ? 'left' : 'right';
    setLayoutPosition(newPos);
    localStorage.setItem('posLayoutPosition', newPos);
  };


  // Derive categories from filtered products (or all products for the store)
  const categories = useMemo(() => {
    const uniqueCats = new Set(['all']);
    products.forEach(p => {
        if (p.category) {
            uniqueCats.add(typeof p.category === 'object' ? p.category.name : p.category);
        }
    });
    
    // Map to display structure with icons
    return Array.from(uniqueCats).map(cat => {
        let icon = GridViewIcon;
        const name = cat.toLowerCase();
        
        if (name === 'all') {
            return { id: 'all', name: 'All Items', icon: GridViewIcon };
        } else if (name.includes('apparel') || name.includes('cloth') || name.includes('shirt')) {
            icon = ShoppingBagIcon;
        } else if (name.includes('electr') || name.includes('comp') || name.includes('phone') || name.includes('device')) {
            icon = LocalShippingOutlinedIcon; // or generic device icon
        } else if (name.includes('snack') || name.includes('food') || name.includes('grocery')) {
            icon = StorefrontIcon;
        } else {
            icon = LocalOfferOutlinedIcon; // Default icon
        }

        return { 
            id: cat, // Use actual category name as ID for filtering
            name: cat.charAt(0).toUpperCase() + cat.slice(1), 
            icon: icon 
        };
    });
  }, [products]);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const productCat = typeof product.category === 'object' ? product.category.name : product.category;
      
      const matchesCategory = selectedCategory === 'all' || productCat === selectedCategory;
      
      return matchesSearch && matchesCategory;
  });

  const addToCart = (productOrBarcode) => {
    // Handle both object (click) and barcode string (scan)
    let product = productOrBarcode;
    if (typeof productOrBarcode === 'string') {
        product = products.find(p => p.barcode === productOrBarcode || p.sku === productOrBarcode);
        if (!product) {
            toast.error('Product not found');
            return; 
        }
    }

    // Check stock availability
    const existingItem = cart.find(item => item.id === product.id);
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const availableStock = product.stock || 0;

    if (currentQtyInCart >= availableStock) {
        toast.error(`Cannot add more. Only ${availableStock} units available in stock.`);
        return;
    }

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
    const product = products.find(p => (p.id || p._id) === id);
    const cartItem = cart.find(item => item.id === id);
    
    if (!product || !cartItem) return;

    const newQty = cartItem.quantity + delta;
    const availableStock = product.stock || 0;

    // Check if trying to increase beyond available stock
    if (delta > 0 && newQty > availableStock) {
        toast.error(`Cannot add more. Only ${availableStock} units available in stock.`);
        return;
    }

    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0)); 
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateItemPrice = (id, newPrice) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        // Store original price if not already stored
        const originalPrice = item.originalPrice || item.price;
        return {
          ...item,
          price: parseFloat(newPrice),
          originalPrice: originalPrice,
          isPriceOverridden: true
        };
      }
      return item;
    }));
  };

  const handleHoldBill = () => {
    if (cart.length === 0) return;
    
    const newHeldBill = {
        id: Date.now(),
        items: [...cart],
        customer: customer,
        discount: selectedDiscount,
        note: note,
        subtotal: subtotal,
        tax: tax,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    setHeldBills(prev => [newHeldBill, ...prev]);
    setCart([]);
    setCustomer(null);
    setSelectedDiscount(null);
    setNote('');
  };

  const handleResumeBill = (heldBill) => {
    setCart(heldBill.items);
    setCustomer(heldBill.customer);
    setSelectedDiscount(heldBill.discount || null);
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
    setSelectedDiscount(null);
    setNote('');
    handleMenuClose();
  };

  const handlePayment = () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    // Open checkout dialog directly — customer is optional (walk-in allowed)
    setIsCheckoutDialogOpen(true);
  };

  const handlePaymentComplete = async (payments, totalPaid, change) => {
    try {
      // Guard: if any payment is CASH and there is no open session, block checkout
      const hasCashPayment = payments.some(p =>
        (p.method === 'digital' ? 'DIGITAL' : p.method.toUpperCase()) === 'CASH'
      );
      if (hasCashPayment && !activeSession) {
        toast.warning('A cash session must be open to accept cash payments. Please open a session in Cash Management first.', {
          position: 'top-center',
          autoClose: 6000,
        });
        return;
      }

      // 1. Create the Order in the database
      const orderData = {
        customer: customer ? (customer._id || customer.id) : null,
        items: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
          originalPrice: item.originalPrice || item.price,
          isPriceOverridden: item.isPriceOverridden || false,
          discount: item.discount || 0
        })),
        total: total,
        payments: payments.map(p => ({
          method: p.method === 'digital' ? 'DIGITAL' : p.method.toUpperCase(),
          amount: p.amount
        })),
        discount: discountAmount,
        discountDetails: selectedDiscount ? {
          code: selectedDiscount.code || 'MANUAL',
          name: selectedDiscount.name || 'Manual Discount',
          type: selectedDiscount.type,
          value: selectedDiscount.value
        } : null,
        notes: note
      };

      const orderRes = await orderService.createOrder(orderData);

      // 2. Track discount usage if a discount was applied
      if (selectedDiscount && selectedDiscount._id && !selectedDiscount.isManual) {
        try {
          const token = localStorage.getItem('token');
          await fetch(`${config.ip}/discounts/${selectedDiscount._id}/usage`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount: discountAmount })
          });
        } catch (discountError) {
          console.error('Error tracking discount usage:', discountError);
          // Don't fail the order if discount tracking fails
        }
      }

      // 3. Update customer purchase history (skip for walk-in)
      if (customer) {
        const response = await customerService.updatePurchaseHistory(
          customer._id || customer.id,
          total
        );
        if (response.data) {
          setCustomer(response.data);
        }
      }

      // Generate payment breakdown for the message
      const paymentBreakdown = payments.map(p => `${p.method.toUpperCase()}: ${formatAmountWithComma(p.amount)}`).join('\n');
      const changeMsg = change > 0 ? `\n\nTotal Change: ${formatAmountWithComma(change)}` : '';

      // Store completed order for receipt printing
      const savedOrder = orderRes?.data?.data || orderRes?.data || {};
      setLastCompletedOrder({
        orderNumber: savedOrder.orderNumber || savedOrder._id,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        tax: 0,
        discount: discountAmount,
        total,
        payments: payments.map(p => ({
          method: p.method === 'digital' ? 'DIGITAL' : p.method.toUpperCase(),
          amount: p.amount,
        })),
        customer: customer || null,
        cashier: user,
        createdAt: new Date().toISOString(),
      });

      // Auto-print receipt if configured
      if (printConfig?.autoPrintAfterSale) {
        setTimeout(() => window.print(), 400);
      }

      // Show success message
      toast.success(`Payment of ${formatAmountWithComma(total)} processed successfully!`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });

      // Refetch products to update stock levels in UI
      let warehouseName = '';
      if (user?.store) {
          if (typeof user.store === 'object') {
              warehouseName = user.store.name;
          } else if (stores.length > 0) {
               const s = stores.find(st => st.id === user.store || st._id === user.store);
               if (s) warehouseName = s.name;
          }
      }
      
      dispatch(fetchProducts({ 
          page: 1, 
          limit: 1000,
          warehouseName: warehouseName,
          isActive: true
      }));

      // Clear cart and reset transaction
      setCart([]);
      setSelectedDiscount(null);
      setNote('');
      setIsCheckoutDialogOpen(false);
      // Keep customer selected for next transaction
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Pricelist Logic: applying special discounts based on pricelist
  const pricelistDiscountFactor = pricelist === 'wholesale' ? 0.05 : (pricelist === 'vip' ? 0.10 : 0);
  const pricelistDiscountAmount = subtotal * pricelistDiscountFactor;
  
  const calculateDiscount = () => {
    if (!selectedDiscount) return 0;
    
    if (selectedDiscount.type === 'PERCENTAGE') {
        let amount = (subtotal - pricelistDiscountAmount) * (selectedDiscount.value / 100);
        // Apply max discount if applicable
        if (selectedDiscount.maxDiscountAmount && amount > selectedDiscount.maxDiscountAmount) {
            amount = selectedDiscount.maxDiscountAmount;
        }
        return amount;
    } else {
        // Fixed amount
        return Math.min(selectedDiscount.value, subtotal - pricelistDiscountAmount);
    }
  };

  const discountAmount = calculateDiscount();
  const currentSubtotal = subtotal - pricelistDiscountAmount - discountAmount;
  const tax = currentSubtotal * 0.08;
  const total = currentSubtotal + tax;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: { xs: 'auto', md: '100vh' }, bgcolor: '#f4f7fa', overflow: 'hidden', m: -3 }}>

      {/* ── POS Header ── */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 },
        py: 1.25,
        bgcolor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
        flexShrink: 0,
        gap: 2
      }}>
        {/* Store identity */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ p: 0.75, borderRadius: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', boxShadow: theme => `0 4px 10px ${alpha(theme.palette.primary.main, 0.3)}` }}>
            <StorefrontIcon sx={{ fontSize: '1.25rem' }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.1 }}>
              {storeConfig?.name || (typeof user?.store === 'object' ? user?.store?.name : null) || 'POS Terminal'}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
              Retail Point of Sale
            </Typography>
          </Box>
        </Stack>

        {/* Cart badge (mobile) */}
        {cart.length > 0 && (
          <Chip
            icon={<ShoppingCartOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
            label={`${cart.length} item${cart.length > 1 ? 's' : ''}`}
            size="small"
            color="primary"
            sx={{ fontWeight: 700, display: { md: 'none' } }}
          />
        )}

        {/* Cashier + clock */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.lighter', color: 'primary.main', fontSize: '0.75rem', fontWeight: 800 }}>
              {(user?.name || user?.username || 'C').charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                {user?.name || user?.username || 'Cashier'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.62rem' }}>
                {user?.role ? user.role.replace(/_/g, ' ') : 'Cashier'}
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ textAlign: 'right', pl: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" fontWeight={900} color="primary.main" sx={{ lineHeight: 1.1, letterSpacing: '0.04em' }}>
              {currentTime}
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.62rem' }}>
              {currentDate}
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* ── Cash Session Warning Banner ── */}
      <Collapse in={showSessionWarning}>
        <Alert
          severity="warning"
          onClose={() => setSessionBannerDismissed(true)}
          action={
            <Button
              color="inherit"
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700, borderRadius: 1.5, whiteSpace: 'nowrap' }}
              onClick={() => navigate('/pos/cash-management')}
            >
              Open Cash Session
            </Button>
          }
          sx={{
            borderRadius: 0,
            px: 3,
            py: 0.75,
            '& .MuiAlert-message': { display: 'flex', alignItems: 'center', fontWeight: 600 }
          }}
        >
          No cash session open for today. Start your shift by opening a cash session before processing sales.
        </Alert>
      </Collapse>

      {/* ── Main two-column layout ── */}
      <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: {
              xs: 'column-reverse',
              md: layoutPosition === 'left' ? 'row-reverse' : 'row'
          },
          overflow: { xs: 'auto', md: 'hidden' },
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
            {categories.map(cat => (
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
            {filteredProducts.length === 0 ? (
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%',
                    py: 8 
                }}>
                    <Box sx={{ width: 300, mb: 2 }}>
                        <Lottie animationData={emptyProductsAnimation} loop={true} />
                    </Box>
                    <Typography variant="h6" color="text.secondary" fontWeight={700} gutterBottom>
                        No Products Available
                    </Typography>
                    <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ maxWidth: 400 }}>
                        {searchQuery || selectedCategory !== 'all' 
                            ? 'No products match your search or filter. Try adjusting your criteria.'
                            : 'No products found in your store. Please add products to get started.'}
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={1.5}>
                    {filteredProducts.map(product => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 3 }} key={product.id}>
                            <ProductCard product={product} onAdd={addToCart} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
      </Box>

      {/* Cart Column */}
      <Box 
        sx={{ 
          width: { xs: '100%', md: 340 }, 
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
                        </Stack>
                        
                        {/* Loyalty Stats */}
                        <Stack direction="row" spacing={2} sx={{ mt: 1, pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>Total Spent</Typography>
                                <Typography variant="caption" fontWeight={800} color="success.dark">{formatAmountWithComma(customer.totalSpent || 0)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem' }}>Last Purchase</Typography>
                                <Typography variant="caption" fontWeight={800} color="primary.main">{formatAmountWithComma(customer.lastPurchaseAmount || 0)}</Typography>
                            </Box>
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
                    <Box sx={{ width: 150, mb: 2 }}>
                        <Lottie animationData={emptyCartAnimation} loop={true} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        Your cart is empty
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5 }}>
                        Add items to get started
                    </Typography>
                </Box>
            ) : (
                cart.map(item => (
                    <Paper key={item.id} elevation={0} sx={{ p: 1, mb: 1.5, borderRadius: 2.5, bgcolor: '#f8fafc', border: '1px solid transparent', '&:hover': { borderColor: 'primary.lighter' } }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                                variant="rounded" 
                                src={item.image} 
                                sx={{ 
                                    width: 50, 
                                    height: 50, 
                                    borderRadius: 1.5,
                                    bgcolor: item.image ? 'transparent' : stringToColor(item.name || ''),
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    color: 'white'
                                }}
                            >
                                {item.name ? item.name.substring(0, 2).toUpperCase() : 'IT'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ fontSize: '0.8rem' }}>{item.name}</Typography>
                                <Typography variant="subtitle2" fontWeight={800} color="primary.main">
                                    {formatAmountWithComma(item.price)}
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

        {/* Quick Actions */}
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Button
            fullWidth
            size="small"
            variant={selectedDiscount ? 'contained' : 'outlined'}
            onClick={() => setIsDiscountDialogOpen(true)}
            startIcon={<LocalOfferOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.72rem',
              py: 0.8,
              ...(selectedDiscount && { color: 'white' })
            }}
          >
            {selectedDiscount ? 'Discount ✓' : 'Discount'}
          </Button>
          <Button
            fullWidth
            size="small"
            variant={note ? 'contained' : 'outlined'}
            onClick={() => setIsNoteDialogOpen(true)}
            startIcon={<NoteAltOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.72rem',
              py: 0.8,
              ...(note && { color: 'white' })
            }}
          >
            {note ? 'Note ✓' : 'Add Note'}
          </Button>
        </Stack>

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

        {/* Order Totals */}
        <Divider sx={{ mb: 1.5 }} />
        <Stack spacing={0.75} sx={{ mb: 1.5 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2" fontWeight={700}>{formatAmountWithComma(subtotal)}</Typography>
          </Stack>
          {pricelistDiscountAmount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="primary.main" fontWeight={600}>
                {pricelist === 'wholesale' ? 'Wholesale (5%)' : 'VIP (10%)'}
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary.main">-{formatAmountWithComma(pricelistDiscountAmount)}</Typography>
            </Stack>
          )}
          {discountAmount > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="error.main" fontWeight={600}>
                Discount {selectedDiscount?.type === 'PERCENTAGE' ? `(${selectedDiscount.value}%)` : ''}
              </Typography>
              <Typography variant="body2" fontWeight={700} color="error.main">-{formatAmountWithComma(discountAmount)}</Typography>
            </Stack>
          )}
          {tax > 0 && (
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">Tax</Typography>
              <Typography variant="body2" fontWeight={700}>{formatAmountWithComma(tax)}</Typography>
            </Stack>
          )}
          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1" fontWeight={900}>Total</Typography>
            <Typography variant="h5" fontWeight={900} color="primary.main" sx={{ letterSpacing: '-0.02em' }}>
              {formatAmountWithComma(total)}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
            <Tooltip title="Hold Bill (F8)">
                <Button 
                    variant="outlined" 
                    onClick={handleHoldBill}
                    disabled={cart.length === 0}
                    sx={{ 
                        borderRadius: 2, 
                        minWidth: 48,
                        px: 0,
                        border: '1px solid',
                        borderColor: 'divider',
                        color: 'text.secondary',
                        '&:hover': {
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                    }}
                >
                    <PauseCircleOutlineIcon />
                </Button>
            </Tooltip>
            <Button 
                fullWidth 
                variant="contained" 
                size="medium" 
                onClick={handlePayment}
                disabled={cart.length === 0}
                endIcon={<KeyboardArrowDownIcon sx={{ transform: 'rotate(-90deg)' }} />}
                sx={{ 
                    py: 1, 
                    borderRadius: 2, 
                    fontWeight: 700,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    flex: 1
                }}
            >
                Checkout &nbsp;→&nbsp; {formatAmountWithComma(total)}
            </Button>
        </Stack>

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
            discounts={discounts}
            currentDiscount={selectedDiscount}
            onApply={(v) => setSelectedDiscount(v)}
            subtotal={subtotal}
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

        <CheckoutDialog
            open={isCheckoutDialogOpen}
            onClose={() => setIsCheckoutDialogOpen(false)}
            cart={cart}
            customer={customer}
            discount={selectedDiscount ? (selectedDiscount.type === 'PERCENTAGE' ? selectedDiscount.value : 0) : 0}
            note={note}
            subtotal={subtotal}
            tax={tax}
            total={total}
            pricelistDiscountAmount={pricelistDiscountAmount}
            discountAmount={discountAmount}
            pricelist={pricelist}
            onPaymentComplete={handlePaymentComplete}
            onDiscount={() => setIsDiscountDialogOpen(true)}
            onNote={() => setIsNoteDialogOpen(true)}
            onHold={handleHoldBill}
            onMenuOpen={handleMenuOpen}
            onUpdateItemPrice={updateItemPrice}
            allowedPaymentModes={storeConfig?.allowedPaymentModes}
        />
      </Box>
      </Box>

      {/* Receipt template — hidden on screen, visible only when printing */}
      <ReceiptTemplate
        order={lastCompletedOrder}
        config={printConfig}
        store={storeConfig}
      />
    </Box>
  );
};

export default PosTerminal;
