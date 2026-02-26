import { useState, useEffect } from 'react';
import {
  Box, Typography, Stack, Card, CardContent, Button,
  TextField, Switch, FormControlLabel, Alert,
  CircularProgress, Tooltip, InputAdornment, Chip,
} from '@mui/material';
import {
  IconBrandWhatsapp, IconClock, IconUser, IconDeviceMobile,
  IconCircleCheck, IconInfoCircle, IconBell, IconBellOff,
} from '@tabler/icons-react';
import { toast } from 'react-toastify';
import dailySummaryService from 'services/dailySummary.service';
import MainCard from 'components/cards/MainCard';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  primary:   '#e8573e',
  primaryBg: '#fdf2f0',
  success:   '#06a046',
  successBg: '#f0faf4',
  warning:   '#d97706',
  warningBg: '#fffbeb',
  info:      '#1976d2',
  infoBg:    '#f0f7ff',
  wa:        '#25d366',
  waBg:      '#e7f8ee',
  text:      '#121926',
  muted:     '#697586',
  dim:       '#9aa4b2',
  border:    '#e3e8ef',
  bg:        '#f8fafc',
  surface:   '#ffffff',
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
const FieldGroup = ({ icon: Icon, label, children, accent = C.primary }) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
      <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: `${accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color={accent} />
      </Box>
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: C.text }}>{label}</Typography>
    </Stack>
    {children}
  </Box>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const NotificationSettings = () => {
  const [form,    setForm]    = useState({
    ownerName:      '',
    whatsappNumber: '',
    isEnabled:      false,
    reportTime:     '22:00',
    timezone:       'Asia/Kolkata',
  });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);

  useEffect(() => {
    dailySummaryService.getSettings()
      .then((res) => {
        if (res.data) {
          setForm((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => toast.error('Failed to load notification settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    // Validate WhatsApp number format if provided
    if (form.whatsappNumber && !/^\+\d{10,15}$/.test(form.whatsappNumber.trim())) {
      toast.error('WhatsApp number must start with + and country code, e.g. +919876543210');
      return;
    }
    setSaving(true);
    try {
      await dailySummaryService.updateSettings({
        ownerName:      form.ownerName.trim(),
        whatsappNumber: form.whatsappNumber.trim(),
        isEnabled:      form.isEnabled,
        reportTime:     form.reportTime,
        timezone:       form.timezone,
      });
      toast.success('Settings saved');
      setSaved(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px', bgcolor: C.surface, fontSize: '0.9rem',
    },
  };

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: C.text }}>Notification Settings</Typography>
          <Box sx={{ px: 1.25, py: 0.3, borderRadius: '6px', bgcolor: C.waBg, color: C.wa, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${C.wa}30` }}>
            WhatsApp
          </Box>
        </Stack>
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} sx={{ color: C.primary }} />
        </Box>
      ) : (
        <Box sx={{ maxWidth: 760, mx: 'auto' }}>

          {/* ── Coming Soon Banner ─────────────────────────────────────────── */}
          <Alert
            icon={<IconInfoCircle size={18} />}
            severity="info"
            sx={{ borderRadius: '10px', mb: 3, fontSize: '0.82rem' }}
          >
            <strong>WhatsApp automation is coming soon.</strong> Save your owner contact details now so the system is ready to send automatic daily reports the moment integration is enabled.
          </Alert>

          <Grid2 container spacing={3}>

            {/* ── Left: Settings form ────────────────────────────────────────── */}
            <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
              {/* Header */}
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, borderBottom: `1px solid ${C.border}`, bgcolor: C.primaryBg, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.primary }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>Owner Contact</Typography>
              </Box>

              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack spacing={3}>
                  <FieldGroup icon={IconUser} label="Owner Name" accent={C.primary}>
                    <TextField
                      fullWidth size="small"
                      placeholder="e.g. Rahul Sharma"
                      value={form.ownerName}
                      onChange={(e) => handleChange('ownerName', e.target.value)}
                      sx={fieldSx}
                    />
                  </FieldGroup>

                  <FieldGroup icon={IconDeviceMobile} label="WhatsApp Number" accent={C.wa}>
                    <TextField
                      fullWidth size="small"
                      placeholder="+919876543210"
                      value={form.whatsappNumber}
                      onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                      helperText="Include country code with + prefix (e.g. +91 for India)"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconBrandWhatsapp size={16} color={C.wa} />
                          </InputAdornment>
                        ),
                      }}
                      sx={fieldSx}
                    />
                  </FieldGroup>
                </Stack>
              </CardContent>
            </Card>

            {/* ── Schedule settings ───────────────────────────────────────────── */}
            <Card elevation={0} sx={{ border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', mb: 3 }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: C.info }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>Schedule</Typography>
                <Chip label="Coming Soon" size="small" sx={{ ml: 'auto', height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: C.warningBg, color: '#92400e' }} />
              </Box>

              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack spacing={3}>
                  <FieldGroup icon={IconClock} label="Report Time" accent={C.info}>
                    <TextField
                      type="time" size="small"
                      value={form.reportTime}
                      onChange={(e) => handleChange('reportTime', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      helperText="Daily report will be sent automatically at this time (IST)"
                      sx={{ width: 160, ...fieldSx }}
                    />
                  </FieldGroup>

                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                      <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: `${C.wa}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {form.isEnabled ? <IconBell size={15} color={C.wa} /> : <IconBellOff size={15} color={C.dim} />}
                      </Box>
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: C.text }}>Enable Automatic Reports</Typography>
                    </Stack>

                    <Tooltip title="WhatsApp integration not yet available — this toggle is reserved for future use" placement="right">
                      <Box component="span" sx={{ display: 'inline-block' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={form.isEnabled}
                              onChange={(e) => handleChange('isEnabled', e.target.checked)}
                              disabled
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: C.wa },
                                '& .MuiSwitch-switchBase.Mui-checked': { color: C.wa },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ fontSize: '0.82rem', color: C.muted }}>
                              {form.isEnabled ? 'Reports enabled' : 'Reports disabled'}
                            </Typography>
                          }
                          sx={{ ml: 0 }}
                        />
                      </Box>
                    </Tooltip>

                    <Typography sx={{ fontSize: '0.72rem', color: C.dim, mt: 0.5 }}>
                      Will auto-send daily summary to owner at {form.reportTime} IST.
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* ── Save button ──────────────────────────────────────────────── */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={14} sx={{ color: 'white' }} /> : saved ? <IconCircleCheck size={16} /> : null}
                sx={{
                  borderRadius: '8px', textTransform: 'none', fontWeight: 700, px: 3,
                  bgcolor: C.primary, '&:hover': { bgcolor: '#d44b32' },
                }}
              >
                {saved ? 'Saved' : 'Save Settings'}
              </Button>
              {saved && (
                <Typography sx={{ fontSize: '0.78rem', color: C.success }}>
                  Settings saved successfully
                </Typography>
              )}
            </Stack>

          </Grid2>

        </Box>
      )}
    </MainCard>
  );
};

// ── Mini Grid helper (avoids MUI Grid import conflict) ────────────────────────
const Grid2 = ({ children, ...props }) => <Box {...props}>{children}</Box>;

export default NotificationSettings;
