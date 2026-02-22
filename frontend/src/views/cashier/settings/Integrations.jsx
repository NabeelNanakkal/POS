import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Button, Chip,
  Divider, CircularProgress, Alert, Stack, Avatar
} from '@mui/material';
import { IconPlugConnected, IconPlugConnectedX, IconExternalLink, IconBook, IconSettings2 } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import MainCard from 'components/cards/MainCard';
import zohoService from 'services/zoho.service';

import zohoBooksLogo from 'assets/images/zoho-books-logo.png';

// ── Zoho Books brand colour ───────────────────────────────────────────────────
const ZOHO_BLUE = '#1A73E8';

const ZohoLogo = () => (
  <Box
    component="img"
    src={zohoBooksLogo}
    alt="Zoho Books"
    sx={{ width: 52, height: 52, borderRadius: 2, objectFit: 'cover' }}
  />
);

// ── Links ────────────────────────────────────────────────────────────────────

const ZOHO_LINKS = {
  console: 'https://api-console.zoho.com/',
  docs:    'https://www.zoho.com/books/api/v3/introduction/#overview',
};

// ── Integration Card ─────────────────────────────────────────────────────────

const IntegrationCard = ({ logo, title, description, status, onConnect, onDisconnect, loading, connectedInfo, docsUrl, consoleUrl }) => (
  <Card variant="outlined" sx={{ borderRadius: 3, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }}>
    <CardContent sx={{ p: 3 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>

        {/* Left — logo + info */}
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ bgcolor: 'transparent', width: 52, height: 52, borderRadius: 2, p: 0 }}>
            {logo}
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
              <Typography variant="h5" fontWeight={700}>{title}</Typography>
              {status === 'connected' && (
                <Chip label="Connected" size="small" color="success" sx={{ fontWeight: 600, fontSize: 11 }} />
              )}
              {status === 'disconnected' && (
                <Chip label="Not connected" size="small" color="default" sx={{ fontWeight: 600, fontSize: 11 }} />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
              {description}
            </Typography>
            {status === 'connected' && connectedInfo?.organizationName && (
              <Typography variant="caption" color="success.main" fontWeight={600} mt={0.5} display="block">
                Organisation: {connectedInfo.organizationName}
              </Typography>
            )}
            {status === 'connected' && connectedInfo?.connectedAt && (
              <Typography variant="caption" color="text.disabled" display="block">
                Connected {new Date(connectedInfo.connectedAt).toLocaleDateString()}
              </Typography>
            )}

            {/* Quick links */}
            <Stack direction="row" spacing={1.5} mt={1}>
              {docsUrl && (
                <Button
                  component="a"
                  href={docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  startIcon={<IconBook size={13} />}
                  sx={{ fontSize: 11, fontWeight: 600, p: 0, minWidth: 0, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                  disableRipple
                >
                  API Docs
                </Button>
              )}
              {consoleUrl && (
                <Button
                  component="a"
                  href={consoleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  startIcon={<IconSettings2 size={13} />}
                  sx={{ fontSize: 11, fontWeight: 600, p: 0, minWidth: 0, color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'transparent' } }}
                  disableRipple
                >
                  API Console
                </Button>
              )}
            </Stack>
          </Box>
        </Stack>

        {/* Right — action button */}
        <Box flexShrink={0}>
          {loading ? (
            <CircularProgress size={24} />
          ) : status === 'connected' ? (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<IconPlugConnectedX size={16} />}
              onClick={onDisconnect}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Disconnect
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              startIcon={<IconPlugConnected size={16} />}
              onClick={onConnect}
              sx={{ borderRadius: 2, fontWeight: 600, bgcolor: '#1A73E8', '&:hover': { bgcolor: '#1558b0' } }}
            >
              Connect
            </Button>
          )}
        </Box>

      </Stack>
    </CardContent>
  </Card>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const Integrations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [zohoStatus, setZohoStatus] = useState(null);   // null = loading
  const [actionLoading, setActionLoading] = useState(false);

  // Handle redirect-back from Zoho OAuth
  useEffect(() => {
    const zohoResult = searchParams.get('zoho');
    if (zohoResult === 'success') {
      toast.success('Zoho Books connected successfully!');
      setSearchParams({}, { replace: true });
    } else if (zohoResult === 'error') {
      const reason = searchParams.get('reason') || 'unknown';
      toast.error(`Zoho connection failed: ${reason.replace(/_/g, ' ')}`);
      setSearchParams({}, { replace: true });
    }
  }, []);

  // Fetch current Zoho connection status
  useEffect(() => {
    fetchZohoStatus();
  }, []);

  const fetchZohoStatus = async () => {
    try {
      const res = await zohoService.getStatus();
      setZohoStatus(res.data);
    } catch {
      setZohoStatus({ connected: false });
    }
  };

  const handleZohoConnect = async () => {
    setActionLoading(true);
    try {
      const res = await zohoService.getAuthUrl();
      // Redirect browser to Zoho OAuth consent screen
      window.location.href = res.data.url;
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not generate Zoho auth URL');
      setActionLoading(false);
    }
  };

  const handleZohoDisconnect = async () => {
    setActionLoading(true);
    try {
      await zohoService.disconnect();
      toast.success('Zoho Books disconnected');
      setZohoStatus({ connected: false });
    } catch (err) {
      toast.error(err?.message || 'Disconnect failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <MainCard
      title="Integrations"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button
            component="a"
            size="small"
            startIcon={<IconBook size={14} />}
            href={ZOHO_LINKS.docs}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 600, fontSize: 12 }}
          >
            API Docs
          </Button>
          <Button
            component="a"
            size="small"
            variant="outlined"
            startIcon={<IconSettings2 size={14} />}
            endIcon={<IconExternalLink size={12} />}
            href={ZOHO_LINKS.console}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ fontWeight: 600, fontSize: 12 }}
          >
            API Console
          </Button>
        </Stack>
      }
    >
      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        Connect third-party services to sync your POS data automatically. Each integration uses secure OAuth — your credentials are never stored.
      </Alert>

      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={1} fontSize={11}>
        Accounting
      </Typography>

      <IntegrationCard
        logo={<ZohoLogo />}
        title="Zoho Books"
        description="Sync orders, invoices, and payments with Zoho Books automatically. Eliminates manual data entry and keeps your books up to date in real time."
        status={zohoStatus === null ? 'loading' : zohoStatus.connected ? 'connected' : 'disconnected'}
        connectedInfo={zohoStatus}
        loading={actionLoading || zohoStatus === null}
        onConnect={handleZohoConnect}
        onDisconnect={handleZohoDisconnect}
        docsUrl={ZOHO_LINKS.docs}
        consoleUrl={ZOHO_LINKS.console}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="subtitle1" fontWeight={700} color="text.secondary" mb={2} textTransform="uppercase" letterSpacing={1} fontSize={11}>
        Coming Soon
      </Typography>

      <Stack spacing={2}>
        {[
          { title: 'QuickBooks', description: 'Sync with QuickBooks Online for accounting and tax reporting.' },
          { title: 'Xero', description: 'Connect Xero to auto-reconcile transactions and generate reports.' },
        ].map((item) => (
          <Card key={item.title} variant="outlined" sx={{ borderRadius: 3, opacity: 0.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight={700} mb={0.5}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </Box>
                <Chip label="Coming soon" size="small" color="default" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </MainCard>
  );
};

export default Integrations;
