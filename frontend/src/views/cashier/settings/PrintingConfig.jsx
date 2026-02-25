import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MainCard from 'components/cards/MainCard';
import BarcodeLabel from 'components/print/BarcodeLabel';
import printerService from 'services/printer.service';
import {
  IconPrinter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconDeviceFloppy,
  IconWifi,
  IconUsb,
  IconBluetooth,
} from '@tabler/icons-react';

// ── Connection icon helper ─────────────────────────────────────────────────────
const ConnectionIcon = ({ type }) => {
  if (type === 'NETWORK') return <IconWifi size={14} />;
  if (type === 'BLUETOOTH') return <IconBluetooth size={14} />;
  return <IconUsb size={14} />;
};

const TYPE_COLOR = { RECEIPT: 'primary', BARCODE: 'success', KITCHEN: 'warning' };

// ── Printer Form Dialog ────────────────────────────────────────────────────────
const PrinterFormDialog = ({ open, printer, onClose, onSaved }) => {
  const emptyForm = {
    name: '', type: 'RECEIPT', connectionType: 'USB',
    ipAddress: '', port: 9100, paperSize: '80mm',
    isDefault: false, isActive: true, notes: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(printer ? { ...emptyForm, ...printer } : emptyForm);
  }, [printer, open]); // eslint-disable-line

  const f = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Printer name is required'); return; }
    setSaving(true);
    try {
      if (printer?._id) {
        await printerService.updatePrinter(printer._id, form);
        toast.success('Printer updated');
      } else {
        await printerService.createPrinter(form);
        toast.success('Printer added');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save printer');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconPrinter size={22} />
        {printer ? 'Edit Printer' : 'Add Printer'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="Printer Name *"
            value={form.name}
            onChange={(e) => f('name', e.target.value)}
            fullWidth size="small"
            placeholder="e.g. Front Counter Receipt Printer"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Printer Type</InputLabel>
                <Select label="Printer Type" value={form.type} onChange={(e) => f('type', e.target.value)}>
                  <MenuItem value="RECEIPT">Receipt Printer</MenuItem>
                  <MenuItem value="BARCODE">Barcode / Label Printer</MenuItem>
                  <MenuItem value="KITCHEN">Kitchen Printer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Connection Type</InputLabel>
                <Select label="Connection Type" value={form.connectionType} onChange={(e) => f('connectionType', e.target.value)}>
                  <MenuItem value="USB">USB</MenuItem>
                  <MenuItem value="NETWORK">Network (IP)</MenuItem>
                  <MenuItem value="BLUETOOTH">Bluetooth</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {form.connectionType === 'NETWORK' && (
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <TextField
                  label="IP Address"
                  value={form.ipAddress}
                  onChange={(e) => f('ipAddress', e.target.value)}
                  fullWidth size="small"
                  placeholder="192.168.1.100"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Port"
                  type="number"
                  value={form.port}
                  onChange={(e) => f('port', parseInt(e.target.value) || 9100)}
                  fullWidth size="small"
                  inputProps={{ min: 1, max: 65535 }}
                />
              </Grid>
            </Grid>
          )}

          <FormControl fullWidth size="small">
            <InputLabel>Paper Size</InputLabel>
            <Select label="Paper Size" value={form.paperSize} onChange={(e) => f('paperSize', e.target.value)}>
              <MenuItem value="58mm">58mm Roll (narrow thermal)</MenuItem>
              <MenuItem value="80mm">80mm Roll (standard thermal)</MenuItem>
              <MenuItem value="A4">A4</MenuItem>
              <MenuItem value="CUSTOM">Custom</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes (optional)"
            value={form.notes}
            onChange={(e) => f('notes', e.target.value)}
            fullWidth size="small" multiline rows={2}
            placeholder="Location, driver notes, etc."
          />

          <Stack direction="row" spacing={4}>
            <FormControlLabel
              control={<Switch checked={form.isDefault} onChange={(e) => f('isDefault', e.target.checked)} color="primary" />}
              label="Set as default for this type"
            />
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={(e) => f('isActive', e.target.checked)} color="success" />}
              label="Active"
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontWeight: 700 }}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} /> : <IconDeviceFloppy size={16} />}
          sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
        >
          {printer ? 'Update Printer' : 'Add Printer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ── Sticker Template Editor ────────────────────────────────────────────────────
const StickerTemplateEditor = ({ templates, onChange }) => {
  const FIELDS = [
    { key: 'showProductName', label: 'Name' },
    { key: 'showBarcode', label: 'Barcode' },
    { key: 'showPrice', label: 'Price' },
    { key: 'showSku', label: 'SKU' },
    { key: 'showExpiry', label: 'Expiry' },
  ];

  return (
    <Stack spacing={2}>
      {(templates || []).map((tpl, idx) => (
        <Paper key={idx} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <TextField
                label="Template Name"
                value={tpl.name}
                size="small"
                fullWidth
                onChange={(e) => onChange(idx, 'name', e.target.value)}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="W (mm)"
                type="number"
                value={tpl.width}
                size="small"
                fullWidth
                onChange={(e) => onChange(idx, 'width', +e.target.value)}
                inputProps={{ min: 20, max: 200 }}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="H (mm)"
                type="number"
                value={tpl.height}
                size="small"
                fullWidth
                onChange={(e) => onChange(idx, 'height', +e.target.value)}
                inputProps={{ min: 10, max: 200 }}
              />
            </Grid>
            <Grid item xs={6} sm={1.5}>
              <TextField
                label="Font (px)"
                type="number"
                value={tpl.fontSize}
                size="small"
                fullWidth
                onChange={(e) => onChange(idx, 'fontSize', +e.target.value)}
                inputProps={{ min: 7, max: 18 }}
              />
            </Grid>
            <Grid item xs={12} sm={4.5}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                Show fields:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                {FIELDS.map(({ key, label }) => (
                  <Chip
                    key={key}
                    label={label}
                    size="small"
                    color={tpl[key] ? 'primary' : 'default'}
                    onClick={() => onChange(idx, key, !tpl[key])}
                    sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.7rem' }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Stack>
  );
};

// ── Main PrintingConfig Page ───────────────────────────────────────────────────
const PrintingConfig = () => {
  const theme = useTheme();
  const [printers, setPrinters] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [printerDialog, setPrinterDialog] = useState({ open: false, printer: null });
  const [previewTemplate, setPreviewTemplate] = useState(0);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        printerService.getPrinters(),
        printerService.getConfig(),
      ]);
      setPrinters(pRes.data?.data?.printers || []);
      setConfig(cRes.data?.data || {});
    } catch {
      toast.error('Failed to load printer configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePrinter = async (id) => {
    if (!window.confirm('Remove this printer?')) return;
    try {
      await printerService.deletePrinter(id);
      toast.success('Printer removed');
      loadAll();
    } catch {
      toast.error('Failed to remove printer');
    }
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      await printerService.updateConfig(config);
      toast.success('Print configuration saved');
    } catch {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = (key, value) => setConfig((prev) => ({ ...prev, [key]: value }));

  const updateTemplateField = (idx, key, value) => {
    setConfig((prev) => {
      const templates = [...(prev.stickerTemplates || [])];
      templates[idx] = { ...templates[idx], [key]: value };
      return { ...prev, stickerTemplates: templates };
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const currentPreviewTemplate = config?.stickerTemplates?.[previewTemplate];

  return (
    <MainCard
      title="Printing Configuration"
      secondary={
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconRefresh size={14} />}
            onClick={loadAll}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleSaveConfig}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : <IconDeviceFloppy size={16} />}
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Save Configuration
          </Button>
        </Stack>
      }
    >
      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        Configure printers for this store. Printing uses your browser&apos;s print dialog — make sure the correct printer is selected and paper size matches your physical printer.
      </Alert>

      {/* ── Section 1: Printers ── */}
      <Typography
        variant="caption"
        fontWeight={800}
        color="text.secondary"
        sx={{ letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}
      >
        Printers
      </Typography>

      <Stack spacing={2} mb={3}>
        {printers.map((printer) => (
          <Card key={printer._id} variant="outlined" sx={{ borderRadius: 3, transition: 'border-color 0.2s', '&:hover': { borderColor: 'primary.light' } }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      p: 1.5, borderRadius: 2.5,
                      bgcolor: alpha(theme.palette[TYPE_COLOR[printer.type] || 'primary'].main, 0.1),
                      color: `${TYPE_COLOR[printer.type] || 'primary'}.main`,
                      display: 'flex',
                    }}
                  >
                    <IconPrinter size={22} />
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
                      <Typography variant="h6" fontWeight={800} sx={{ fontSize: '0.95rem' }}>
                        {printer.name}
                      </Typography>
                      {printer.isDefault && (
                        <Chip label="Default" size="small" color="primary" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
                      )}
                      <Chip
                        label={printer.type}
                        size="small"
                        color={TYPE_COLOR[printer.type] || 'default'}
                        variant="outlined"
                        sx={{ fontWeight: 700, fontSize: '0.65rem', height: 18 }}
                      />
                      {!printer.isActive && (
                        <Chip label="Inactive" size="small" color="error" sx={{ fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
                      )}
                    </Stack>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.25 }}>
                      <ConnectionIcon type={printer.connectionType} />
                      <Typography variant="caption" color="text.secondary">
                        {printer.connectionType}
                        {printer.connectionType === 'NETWORK' && ` — ${printer.ipAddress}:${printer.port}`}
                        {' · '}{printer.paperSize}
                      </Typography>
                      {printer.notes && (
                        <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                          · {printer.notes}
                        </Typography>
                      )}
                    </Stack>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Edit printer">
                    <IconButton size="small" onClick={() => setPrinterDialog({ open: true, printer })}>
                      <IconEdit size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete printer">
                    <IconButton size="small" color="error" onClick={() => handleDeletePrinter(printer._id)}>
                      <IconTrash size={16} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {printers.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: 5, borderRadius: 3, textAlign: 'center',
              border: '2px dashed', borderColor: alpha(theme.palette.primary.main, 0.2),
            }}
          >
            <IconPrinter size={36} style={{ color: theme.palette.text.disabled, marginBottom: 8 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              No printers configured yet.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Add a receipt or barcode printer to enable printing.
            </Typography>
          </Paper>
        )}

        <Button
          variant="outlined"
          startIcon={<IconPlus size={16} />}
          onClick={() => setPrinterDialog({ open: true, printer: null })}
          sx={{ borderRadius: 2.5, fontWeight: 700, alignSelf: 'flex-start' }}
        >
          Add Printer
        </Button>
      </Stack>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 2: Print Behaviour ── */}
      <Typography
        variant="caption"
        fontWeight={800}
        color="text.secondary"
        sx={{ letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}
      >
        Print Behaviour
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Default Receipt Printer</InputLabel>
                <Select
                  label="Default Receipt Printer"
                  value={config?.defaultReceiptPrinter?._id || config?.defaultReceiptPrinter || ''}
                  onChange={(e) => updateConfig('defaultReceiptPrinter', e.target.value || null)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {printers.filter((p) => p.type === 'RECEIPT').map((p) => (
                    <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Default Barcode Printer</InputLabel>
                <Select
                  label="Default Barcode Printer"
                  value={config?.defaultBarcodePrinter?._id || config?.defaultBarcodePrinter || ''}
                  onChange={(e) => updateConfig('defaultBarcodePrinter', e.target.value || null)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {printers.filter((p) => p.type === 'BARCODE').map((p) => (
                    <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Default Barcode Type</InputLabel>
                <Select
                  label="Default Barcode Type"
                  value={config?.defaultBarcodeType || 'CODE128'}
                  onChange={(e) => updateConfig('defaultBarcodeType', e.target.value)}
                >
                  <MenuItem value="CODE128">CODE128 (recommended — any text)</MenuItem>
                  <MenuItem value="EAN13">EAN-13 (13 digits, retail)</MenuItem>
                  <MenuItem value="UPCA">UPC-A (12 digits, US retail)</MenuItem>
                  <MenuItem value="QR">QR Code</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={1.5}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!config?.autoPrintAfterSale}
                      onChange={(e) => updateConfig('autoPrintAfterSale', e.target.checked)}
                    />
                  }
                  label="Auto-print receipt after every sale"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!config?.printBarcodeOnCreate}
                      onChange={(e) => updateConfig('printBarcodeOnCreate', e.target.checked)}
                    />
                  }
                  label="Auto-print barcode label on product creation"
                />
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 3: Receipt Template ── */}
      <Typography
        variant="caption"
        fontWeight={800}
        color="text.secondary"
        sx={{ letterSpacing: 1.5, textTransform: 'uppercase', mb: 2, display: 'block' }}
      >
        Receipt Template
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Receipt Header"
                value={config?.receiptHeader || ''}
                onChange={(e) => updateConfig('receiptHeader', e.target.value)}
                fullWidth size="small"
                placeholder="e.g. Welcome to our store!"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Receipt Footer"
                value={config?.receiptFooter || ''}
                onChange={(e) => updateConfig('receiptFooter', e.target.value)}
                fullWidth size="small"
                placeholder="e.g. Thank you for your purchase!"
              />
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={4} flexWrap="wrap" gap={1}>
                {[
                  { key: 'showLogoOnReceipt', label: 'Show store name/logo' },
                  { key: 'showTaxOnReceipt', label: 'Show tax amount' },
                  { key: 'showCashierOnReceipt', label: 'Show cashier name' },
                ].map(({ key, label }) => (
                  <FormControlLabel
                    key={key}
                    control={
                      <Switch
                        size="small"
                        checked={config?.[key] !== false}
                        onChange={(e) => updateConfig(key, e.target.checked)}
                      />
                    }
                    label={label}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* ── Section 4: Sticker Templates ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          fontWeight={800}
          color="text.secondary"
          sx={{ letterSpacing: 1.5, textTransform: 'uppercase' }}
        >
          Sticker Label Templates
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Click field chips to toggle visibility on label
        </Typography>
      </Stack>

      <StickerTemplateEditor
        templates={config?.stickerTemplates || []}
        onChange={updateTemplateField}
      />

      {/* ── Label Preview ── */}
      {(config?.stickerTemplates?.length > 0) && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Typography variant="body2" fontWeight={700}>Live Preview:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={previewTemplate}
                onChange={(e) => setPreviewTemplate(e.target.value)}
                displayEmpty
              >
                {config.stickerTemplates.map((t, i) => (
                  <MenuItem key={i} value={i}>{t.name} ({t.width}×{t.height}mm)</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <BarcodeLabel
              product={{ name: 'Sample Product', barcode: '12345678901', sku: 'SKU-001', price: 'BD 9.990' }}
              template={currentPreviewTemplate}
              barcodeType={config?.defaultBarcodeType || 'CODE128'}
            />
            <Box sx={{ maxWidth: 280 }}>
              <Typography variant="caption" color="text.secondary">
                This is a live preview of how labels will look when printed. Actual print output uses mm dimensions set above.
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Printer Dialog */}
      <PrinterFormDialog
        open={printerDialog.open}
        printer={printerDialog.printer}
        onClose={() => setPrinterDialog({ open: false, printer: null })}
        onSaved={loadAll}
      />
    </MainCard>
  );
};

export default PrintingConfig;
