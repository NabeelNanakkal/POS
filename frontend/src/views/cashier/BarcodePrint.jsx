import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainCard from 'components/cards/MainCard';
import BarcodeLabel from 'components/print/BarcodeLabel';
import printerService from 'services/printer.service';
import { fetchProducts } from 'container/product/slice';
import { fetchCategories } from 'container/category/slice';
import { formatAmountWithComma } from 'utils/formatAmount';
import PrintIcon from '@mui/icons-material/Print';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// ── BarcodePrint Page ──────────────────────────────────────────────────────────
const BarcodePrint = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { storeCode } = useParams();

  const { products, loading: productsLoading } = useSelector((s) => s.product);
  const { categories } = useSelector((s) => s.category);

  const [printConfig, setPrintConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]); // [{ product, quantity }]
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);
  const [barcodeType, setBarcodeType] = useState('CODE128');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [tab, setTab] = useState(0);

  // Load config, products, categories
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 500, isActive: true }));
    dispatch(fetchCategories());
    loadConfig();
  }, [dispatch]); // eslint-disable-line

  // Handle pre-selection from navigation state (e.g. from ProductManagement)
  useEffect(() => {
    if (location.state?.preSelectedProducts) {
      setSelectedItems(location.state.preSelectedProducts);
      setTab(1); // Jump to preview
    }
  }, [location.state]);

  const loadConfig = async () => {
    setConfigLoading(true);
    try {
      const res = await printerService.getConfig();
      const cfg = res.data?.data || {};
      setPrintConfig(cfg);
      setBarcodeType(cfg.defaultBarcodeType || 'CODE128');
    } catch {
      // Config not critical — defaults will be used
    } finally {
      setConfigLoading(false);
    }
  };

  const currentTemplate = printConfig?.stickerTemplates?.[selectedTemplateIdx] || {
    name: 'Default', width: 50, height: 25,
    showProductName: true, showBarcode: true, showPrice: true,
    showSku: false, showExpiry: false, fontSize: 10, barcodeHeight: 40,
  };

  // Full flat list of labels to render (product repeated × quantity)
  const labelsToRender = selectedItems.flatMap(({ product, quantity }) =>
    Array(Math.max(1, quantity)).fill(product)
  );

  // Filtered products
  const filteredProducts = (products || []).filter((p) => {
    const catId = typeof p.category === 'object' ? p.category?._id : p.category;
    const catMatch = filterCategory === 'all' || catId === filterCategory;
    const q = searchQuery.toLowerCase();
    const nameMatch = !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.barcode || '').toLowerCase().includes(q);
    return catMatch && nameMatch;
  });

  // Helpers
  const isSelected = (productId) => selectedItems.some((s) => s.product._id === productId);

  const toggleProduct = (product) => {
    setSelectedItems((prev) => {
      if (prev.some((s) => s.product._id === product._id)) {
        return prev.filter((s) => s.product._id !== product._id);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, qty) => {
    const n = Math.max(1, Math.min(999, parseInt(qty) || 1));
    setSelectedItems((prev) =>
      prev.map((s) => s.product._id === productId ? { ...s, quantity: n } : s)
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredProducts.map((p) => ({ product: p, quantity: 1 })));
  };

  const clearAll = () => setSelectedItems([]);

  const removeItem = (productId) => {
    setSelectedItems((prev) => prev.filter((s) => s.product._id !== productId));
  };

  // Generate missing barcodes for all products
  const handleGenerateAllBarcodes = async () => {
    setGeneratingAll(true);
    try {
      const res = await printerService.generateAllBarcodes();
      const { generated, total } = res.data?.data || {};
      toast.success(`Generated ${generated} of ${total} missing barcodes`);
      dispatch(fetchProducts({ page: 1, limit: 500, isActive: true }));
    } catch {
      toast.error('Failed to generate barcodes');
    } finally {
      setGeneratingAll(false);
    }
  };

  // Trigger browser print
  const handlePrint = () => {
    if (labelsToRender.length === 0) {
      toast.warn('Select at least one product to print labels');
      return;
    }
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 200);
  };

  // Map category id → name
  const categoryName = (cat) => {
    if (!cat) return '—';
    if (typeof cat === 'object') return cat.name || '—';
    const found = (categories || []).find((c) => c._id === cat);
    return found?.name || '—';
  };

  const missingBarcodeCount = (products || []).filter((p) => !p.barcode).length;

  return (
    <>
      {/* ── Hidden print container (rendered in browser print view) ── */}
      <Box
        id="barcode-print-root"
        className="print-container"
        sx={{
          display: 'none',
          '@media print': {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '3mm',
            p: '4mm',
            alignContent: 'flex-start',
          },
        }}
      >
        {labelsToRender.map((product, idx) => (
          <BarcodeLabel
            key={`print-${product._id}-${idx}`}
            product={{
              name: product.name,
              barcode: product.barcode,
              sku: product.sku,
              price: formatAmountWithComma(product.retailPrice || product.price || 0),
            }}
            template={currentTemplate}
            barcodeType={barcodeType}
          />
        ))}
      </Box>

      {/* ── Screen UI ── */}
      <MainCard
        title="Barcode & Label Printing"
        secondary={
          <Stack direction="row" spacing={1.5} alignItems="center">
            {missingBarcodeCount > 0 && (
              <Tooltip title={`${missingBarcodeCount} products have no barcode — click to auto-generate`}>
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  startIcon={generatingAll ? <CircularProgress size={14} color="inherit" /> : <AutoFixHighIcon fontSize="small" />}
                  onClick={handleGenerateAllBarcodes}
                  disabled={generatingAll}
                  sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                  Generate {missingBarcodeCount} Missing
                </Button>
              </Tooltip>
            )}
            <Button
              variant="contained"
              size="small"
              startIcon={isPrinting ? <CircularProgress size={14} color="inherit" /> : <PrintIcon fontSize="small" />}
              onClick={handlePrint}
              disabled={isPrinting || labelsToRender.length === 0}
              sx={{ borderRadius: 2, fontWeight: 700 }}
            >
              Print
              {labelsToRender.length > 0 && ` (${labelsToRender.length} label${labelsToRender.length > 1 ? 's' : ''})`}
            </Button>
          </Stack>
        }
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          <Tab label="Select Products" />
          <Tab label={`Preview (${labelsToRender.length})`} />
          <Tab label="Print Settings" />
        </Tabs>

        {/* ── Tab 0: Select Products ── */}
        {tab === 0 && (
          <Grid container spacing={3}>
            {/* Left: filter + table */}
            <Grid item xs={12} md={8}>
              <Stack direction="row" spacing={1.5} mb={2} flexWrap="wrap" gap={1}>
                <TextField
                  size="small"
                  placeholder="Search name, SKU or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ flex: 1, minWidth: 180 }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    {(categories || []).map((c) => (
                      <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<SelectAllIcon fontSize="small" />}
                  onClick={selectAll}
                  sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  Select All
                </Button>
                {selectedItems.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    startIcon={<DeselectIcon fontSize="small" />}
                    onClick={clearAll}
                    sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}
                  >
                    Clear
                  </Button>
                )}
              </Stack>

              {productsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    maxHeight: 460,
                    overflowY: 'auto',
                  }}
                >
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox" sx={{ bgcolor: 'grey.50' }} />
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Product</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Barcode</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50', width: 80 }}>Qty</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredProducts.map((product) => {
                        const selected = isSelected(product._id);
                        const selItem = selectedItems.find((s) => s.product._id === product._id);
                        return (
                          <TableRow
                            key={product._id}
                            hover
                            selected={selected}
                            onClick={() => toggleProduct(product)}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selected}
                                onChange={() => toggleProduct(product)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 180 }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {product.sku} · {categoryName(product.category)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {product.barcode ? (
                                <Chip
                                  label={product.barcode}
                                  size="small"
                                  sx={{ fontFamily: 'monospace', fontSize: '0.65rem' }}
                                />
                              ) : (
                                <Chip label="No barcode" size="small" color="warning" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight={600}>
                                {formatAmountWithComma(product.retailPrice || product.price || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              {selected && (
                                <TextField
                                  type="number"
                                  size="small"
                                  value={selItem?.quantity || 1}
                                  onChange={(e) => updateQuantity(product._id, e.target.value)}
                                  inputProps={{ min: 1, max: 999 }}
                                  sx={{ width: 70 }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Paper>
              )}

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Showing {filteredProducts.length} of {(products || []).length} products
              </Typography>
            </Grid>

            {/* Right: Selection summary */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'sticky', top: 16 }}
              >
                <Typography variant="subtitle1" fontWeight={800} mb={2}>
                  Print Queue
                </Typography>
                {selectedItems.length === 0 ? (
                  <Box sx={{ py: 4, textAlign: 'center' }}>
                    <QrCode2Icon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Select products from the table to add to print queue
                    </Typography>
                  </Box>
                ) : (
                  <>
                    <Stack spacing={1} sx={{ maxHeight: 360, overflowY: 'auto' }}>
                      {selectedItems.map(({ product, quantity }) => (
                        <Stack
                          key={product._id}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ py: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{product.sku}</Typography>
                          </Box>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Chip label={`×${quantity}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
                            <IconButton size="small" onClick={() => removeItem(product._id)}>
                              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        mt: 2, pt: 2, borderTop: '2px solid', borderColor: 'primary.main',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {selectedItems.length} product{selectedItems.length > 1 ? 's' : ''}
                      </Typography>
                      <Typography variant="h6" fontWeight={900} color="primary.main">
                        {labelsToRender.length} labels
                      </Typography>
                    </Box>
                  </>
                )}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* ── Tab 1: Preview ── */}
        {tab === 1 && (
          <Box>
            {labelsToRender.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Select products in the &quot;Select Products&quot; tab to preview labels here.
              </Alert>
            ) : (
              <>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Showing {Math.min(50, labelsToRender.length)} of {labelsToRender.length} labels
                    {labelsToRender.length > 50 && ' (all will print)'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<PrintIcon fontSize="small" />}
                    onClick={handlePrint}
                    disabled={isPrinting}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Print All {labelsToRender.length} Labels
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[100], 0.5),
                    minHeight: 200,
                  }}
                >
                  {labelsToRender.slice(0, 50).map((product, idx) => (
                    <BarcodeLabel
                      key={`preview-${product._id}-${idx}`}
                      product={{
                        name: product.name,
                        barcode: product.barcode,
                        sku: product.sku,
                        price: formatAmountWithComma(product.retailPrice || product.price || 0),
                      }}
                      template={currentTemplate}
                      barcodeType={barcodeType}
                    />
                  ))}
                  {labelsToRender.length > 50 && (
                    <Box
                      sx={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        border: '1px dashed', borderColor: 'primary.light',
                        borderRadius: 2, p: 2, minWidth: 100,
                      }}
                    >
                      <Typography variant="caption" color="primary.main" fontWeight={700} textAlign="center">
                        +{labelsToRender.length - 50} more
                      </Typography>
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* ── Tab 2: Print Settings ── */}
        {tab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Barcode Format</Typography>
              <FormControl fullWidth size="small">
                <Select value={barcodeType} onChange={(e) => setBarcodeType(e.target.value)}>
                  <MenuItem value="CODE128">CODE128 — any text (recommended)</MenuItem>
                  <MenuItem value="EAN13">EAN-13 — 13 numeric digits (retail)</MenuItem>
                  <MenuItem value="UPCA">UPC-A — 12 numeric digits (US retail)</MenuItem>
                </Select>
              </FormControl>
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2, py: 0.5 }}>
                Products with non-numeric barcodes cannot use EAN-13 or UPC-A formats.
                CODE128 works with all barcodes.
              </Alert>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Label Template</Typography>
              {configLoading ? (
                <CircularProgress size={24} />
              ) : (
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedTemplateIdx}
                    onChange={(e) => setSelectedTemplateIdx(e.target.value)}
                  >
                    {(printConfig?.stickerTemplates || []).map((t, i) => (
                      <MenuItem key={i} value={i}>
                        {t.name} — {t.width}×{t.height}mm
                      </MenuItem>
                    ))}
                    {(!printConfig?.stickerTemplates?.length) && (
                      <MenuItem value={0}>Default (50×25mm)</MenuItem>
                    )}
                  </Select>
                </FormControl>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>Label Preview</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <BarcodeLabel
                  product={{ name: 'Sample Product', barcode: '12345678901', sku: 'SKU-001', price: 'BD 9.990' }}
                  template={currentTemplate}
                  barcodeType={barcodeType}
                />
                <Box sx={{ maxWidth: 260 }}>
                  <Typography variant="body2" fontWeight={700}>{currentTemplate.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {currentTemplate.width}mm × {currentTemplate.height}mm
                  </Typography>
                  <Stack spacing={0.5} mt={1}>
                    {[
                      { key: 'showProductName', label: 'Product name' },
                      { key: 'showBarcode', label: 'Barcode' },
                      { key: 'showPrice', label: 'Price' },
                      { key: 'showSku', label: 'SKU' },
                    ].map(({ key, label }) => (
                      <Stack key={key} direction="row" alignItems="center" spacing={0.5}>
                        <Box
                          sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: currentTemplate[key] ? 'success.main' : 'text.disabled',
                          }}
                        />
                        <Typography variant="caption" color={currentTemplate[key] ? 'text.primary' : 'text.disabled'}>
                          {label}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    size="small"
                    sx={{ mt: 1, p: 0, fontWeight: 700, fontSize: '0.75rem' }}
                    onClick={() => navigate(`/pos/${storeCode}/settings/printing`)}
                  >
                    Edit Templates →
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </MainCard>
    </>
  );
};

export default BarcodePrint;
