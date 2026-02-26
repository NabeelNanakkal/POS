import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Stack, Table, TableHead, TableBody, TableRow,
  TableCell, Button, CircularProgress, Tooltip,
} from '@mui/material';
import { toast } from 'react-toastify';
import {
  IconShield, IconDeviceFloppy, IconRefresh, IconAlertTriangle,
  IconInfoCircle, IconLock,
} from '@tabler/icons-react';
import rolePermissionService from 'services/rolePermission.service';
import {
  MODULES, ACTIONS, CONFIGURABLE_ROLES, DEFAULT_PERMISSIONS, MODULE_ACTIONS,
} from 'utils/defaultPermissions';

// ─── Role config ──────────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  MANAGER: {
    label: 'Manager', short: 'MGR',
    color: '#e8573e', rgb: '232,87,62',
    description: 'Store operations & team lead',
  },
  CASHIER: {
    label: 'Cashier', short: 'CSH',
    color: '#06a046', rgb: '6,160,70',
    description: 'Point of sale & customer service',
  },
  INVENTORY_MANAGER: {
    label: 'Inventory', short: 'INV',
    color: '#d97706', rgb: '217,119,6',
    description: 'Stock tracking & product catalog',
  },
  ACCOUNTANT: {
    label: 'Accountant', short: 'ACC',
    color: '#1976d2', rgb: '25,118,210',
    description: 'Financial reports & analytics',
  },
};

const ACTION_CONFIG = {
  view:   { label: 'View' },
  create: { label: 'Create' },
  edit:   { label: 'Edit' },
  delete: { label: 'Delete' },
  print:  { label: 'Print' },
  export: { label: 'Export' },
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:      '#f8fafc',
  surface: '#ffffff',
  card:    '#fdf2f0',
  border:  '#e3e8ef',
  border2: '#eef2f6',
  text:    '#121926',
  muted:   '#697586',
  dim:     '#9aa4b2',
};

// ─── Data helpers (unchanged logic) ──────────────────────────────────────────
const arrayToMatrix = (arr = []) => {
  const matrix = {};
  MODULES.forEach(({ key }) => {
    matrix[key] = {};
    ACTIONS.forEach(a => { matrix[key][a] = false; });
  });
  arr.forEach(entry => {
    if (!matrix[entry.module]) return;
    ACTIONS.forEach(a => { matrix[entry.module][a] = Boolean(entry[`can_${a}`]); });
  });
  return matrix;
};

const matrixToArray = (matrix) =>
  MODULES.map(({ key }) => ({
    module:     key,
    can_view:   Boolean(matrix[key]?.view),
    can_create: Boolean(matrix[key]?.create),
    can_edit:   Boolean(matrix[key]?.edit),
    can_delete: Boolean(matrix[key]?.delete),
    can_print:  Boolean(matrix[key]?.print),
    can_export: Boolean(matrix[key]?.export),
  }));

const buildDefaultMatrix = (role) => {
  const matrix = {};
  MODULES.forEach(({ key }) => {
    matrix[key] = {};
    const d = DEFAULT_PERMISSIONS[role]?.[key] || {};
    ACTIONS.forEach(a => { matrix[key][a] = Boolean(d[`can_${a}`]); });
  });
  return matrix;
};

// ─── Custom square checkbox ───────────────────────────────────────────────────
const Sq = ({ checked, indeterminate, onChange, color, rgb, size = 17 }) => (
  <Box
    component="button"
    onClick={() => onChange?.(!checked)}
    sx={{
      width: size, height: size,
      border: `1.5px solid ${(checked || indeterminate) ? color : '#c9d1da'}`,
      borderRadius: '3px',
      bgcolor: checked ? color : indeterminate ? `rgba(${rgb},0.15)` : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      transition: 'border-color 0.13s, background-color 0.13s',
      flexShrink: 0, outline: 'none', p: 0,
      boxSizing: 'border-box',
      '&:hover': {
        borderColor: color,
        bgcolor: checked ? color : `rgba(${rgb},0.12)`,
      },
    }}
  >
    {checked && (
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {indeterminate && !checked && (
      <Box sx={{ width: 7, height: 1.5, borderRadius: '2px', bgcolor: color }} />
    )}
  </Box>
);

// ─── Permission Matrix ────────────────────────────────────────────────────────
const PermissionMatrix = ({ role, matrix, onChange }) => {
  const cfg = ROLE_CONFIG[role];
  const { color, rgb } = cfg;

  const isApplicable = (mk, action) => (MODULE_ACTIONS[mk] || ACTIONS).includes(action);

  const handleCell = (mk, action, val) =>
    onChange(prev => ({ ...prev, [mk]: { ...prev[mk], [action]: val } }));

  const handleRowToggle = (mk, checked) => {
    const applicable = MODULE_ACTIONS[mk] || ACTIONS;
    onChange(prev => ({
      ...prev,
      [mk]: { ...prev[mk], ...Object.fromEntries(applicable.map(a => [a, checked])) },
    }));
  };

  const handleColToggle = (action, checked) => {
    onChange(prev => {
      const next = { ...prev };
      MODULES.forEach(({ key }) => {
        if (isApplicable(key, action)) next[key] = { ...next[key], [action]: checked };
      });
      return next;
    });
  };

  const rowVals = (mk) =>
    (MODULE_ACTIONS[mk] || ACTIONS).map(a => Boolean(matrix[mk]?.[a]));
  const rowAll = (mk) => rowVals(mk).every(Boolean);
  const rowIndet = (mk) => { const v = rowVals(mk); return v.some(Boolean) && !v.every(Boolean); };

  const colMods = (action) => MODULES.filter(({ key }) => isApplicable(key, action));
  const colAll = (action) => colMods(action).every(({ key }) => Boolean(matrix[key]?.[action]));
  const colIndet = (action) => {
    const v = colMods(action).map(({ key }) => Boolean(matrix[key]?.[action]));
    return v.some(Boolean) && !v.every(Boolean);
  };

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 620, borderCollapse: 'collapse' }}>
        {/* Column header */}
        <TableHead>
          <TableRow>
            {/* Module name column */}
            <TableCell
              sx={{
                width: 190, minWidth: 190,
                py: 1.5, px: 2,
                fontFamily: 'inherit',
                fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: C.dim,
                borderBottom: `1px solid ${C.border}`,
                borderRight: `1px solid ${C.border}`,
                bgcolor: C.card,
              }}
            >
              MODULE
            </TableCell>

            {/* Action columns */}
            {ACTIONS.map(action => (
              <TableCell
                key={action}
                align="center"
                sx={{
                  py: 1.5, px: 1,
                  borderBottom: `1px solid ${C.border}`,
                  borderRight: `1px solid ${C.border2}`,
                  bgcolor: C.card,
                  '&:last-child': { borderRight: 'none' },
                }}
              >
                <Stack alignItems="center" spacing={0.75}>
                  {/* Select-all for column */}
                  <Sq
                    checked={colAll(action)}
                    indeterminate={colIndet(action)}
                    onChange={(v) => handleColToggle(action, v)}
                    color={color} rgb={rgb}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'inherit',
                      fontSize: '0.6rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: C.muted, lineHeight: 1,
                    }}
                  >
                    {ACTION_CONFIG[action].label}
                  </Typography>
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Rows */}
        <TableBody>
          {MODULES.map(({ key, label }, idx) => (
            <TableRow
              key={key}
              sx={{
                bgcolor: idx % 2 === 0 ? C.surface : C.bg,
                transition: 'background-color 0.1s',
                '&:hover': { bgcolor: `rgba(${rgb},0.04)` },
                '&:last-child td': { borderBottom: 'none' },
              }}
            >
              {/* Module name cell */}
              <TableCell
                sx={{
                  py: 1.1, px: 2,
                  borderBottom: `1px solid ${C.border2}`,
                  borderRight: `1px solid ${C.border}`,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Sq
                    checked={rowAll(key)}
                    indeterminate={rowIndet(key)}
                    onChange={(v) => handleRowToggle(key, v)}
                    color={color} rgb={rgb}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'monospace',
                      fontSize: '0.73rem', fontWeight: 500,
                      color: C.text, letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {label}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Action cells */}
              {ACTIONS.map(action => (
                <TableCell
                  key={action}
                  align="center"
                  sx={{
                    py: 1.1, px: 1,
                    borderBottom: `1px solid ${C.border2}`,
                    borderRight: `1px solid ${C.border2}`,
                    '&:last-child': { borderRight: 'none' },
                  }}
                >
                  {isApplicable(key, action) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Sq
                        checked={Boolean(matrix[key]?.[action])}
                        onChange={(v) => handleCell(key, action, v)}
                        color={color} rgb={rgb}
                      />
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.65rem', color: '#c9d1da',
                        userSelect: 'none', lineHeight: 1,
                      }}
                    >
                      ·
                    </Typography>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const RoleManagement = () => {
  const [activeTab, setActiveTab]   = useState(0);
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [matrix, setMatrix]         = useState({});
  const [dirty, setDirty]           = useState(false);

  const currentRole = CONFIGURABLE_ROLES[activeTab];
  const roleCfg     = ROLE_CONFIG[currentRole];

  const fetchPermissions = useCallback(async (role) => {
    setLoading(true);
    setDirty(false);
    try {
      const res = await rolePermissionService.getByRole(role);
      setMatrix(arrayToMatrix(res.data?.permissions || []));
    } catch {
      toast.error('Failed to load permissions');
      setMatrix(buildDefaultMatrix(role));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPermissions(currentRole); }, [currentRole, fetchPermissions]);

  const handleMatrixChange = (updater) => { setMatrix(updater); setDirty(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      await rolePermissionService.updateByRole(currentRole, matrixToArray(matrix));
      toast.success(`${roleCfg.label} permissions saved`);
      setDirty(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => { setMatrix(buildDefaultMatrix(currentRole)); setDirty(true); };

  return (
    <Box
      sx={{
        bgcolor: C.bg,
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${C.border}`,
        fontFamily: 'inherit',
        // Transition accent color for everything
        transition: 'box-shadow 0.3s',
        boxShadow: `0 1px 4px rgba(18,25,38,0.06), 0 4px 16px rgba(18,25,38,0.05)`,
      }}
    >
      {/* ── Top accent bar ──────────────────────────────────────────── */}
      <Box
        sx={{
          height: 3,
          background: `linear-gradient(90deg, ${roleCfg.color}, rgba(${roleCfg.rgb},0.3))`,
          transition: 'background 0.4s ease',
        }}
      />

      {/* ── Header ──────────────────────────────────────────────────── */}
      <Box sx={{ px: 3.5, pt: 3, pb: 2.5, borderBottom: `1px solid ${C.border}` }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Icon badge */}
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 2,
                background: `rgba(${roleCfg.rgb},0.12)`,
                border: `1px solid rgba(${roleCfg.rgb},0.25)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
                flexShrink: 0,
              }}
            >
              <IconShield size={20} color={roleCfg.color} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: 'inherit',
                  fontSize: '1.35rem', fontWeight: 800,
                  color: C.text, letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                Role Permissions
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: C.muted, mt: 0.25, fontFamily: 'inherit' }}>
                Configure access control per role — changes apply on next login
              </Typography>
            </Box>
          </Stack>

          {/* Action buttons */}
          <Stack direction="row" spacing={1} alignItems="center">
            {dirty && (
              <Stack direction="row" spacing={0.75} alignItems="center"
                sx={{ px: 1.5, py: 0.6, borderRadius: 1.5, bgcolor: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)' }}>
                <IconAlertTriangle size={13} color="#d97706" />
                <Typography sx={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>Unsaved</Typography>
              </Stack>
            )}

            <Tooltip title="Reset to defaults" placement="bottom">
              <Button
                onClick={handleReset}
                disabled={loading}
                startIcon={<IconRefresh size={14} />}
                sx={{
                  height: 34, px: 2,
                  fontFamily: 'inherit',
                  fontSize: '0.78rem', fontWeight: 600,
                  color: C.muted,
                  bgcolor: 'transparent',
                  border: `1px solid ${C.border}`,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#eef2f6', borderColor: '#c9d1da', color: C.text },
                }}
              >
                Defaults
              </Button>
            </Tooltip>

            <Button
              onClick={handleSave}
              disabled={saving || loading || !dirty}
              startIcon={saving ? <CircularProgress size={13} sx={{ color: '#fff' }} /> : <IconDeviceFloppy size={14} />}
              sx={{
                height: 34, px: 2.5,
                fontFamily: 'inherit',
                fontSize: '0.78rem', fontWeight: 700,
                color: dirty ? '#fff' : C.muted,
                background: dirty
                  ? `linear-gradient(135deg, ${roleCfg.color}, rgba(${roleCfg.rgb},0.75))`
                  : '#eef2f6',
                border: `1px solid ${dirty ? `rgba(${roleCfg.rgb},0.4)` : C.border}`,
                borderRadius: 1.5,
                textTransform: 'none',
                transition: 'all 0.25s',
                boxShadow: dirty ? `0 4px 14px rgba(${roleCfg.rgb},0.22)` : 'none',
                '&:hover': {
                  background: dirty
                    ? `linear-gradient(135deg, ${roleCfg.color}, rgba(${roleCfg.rgb},0.85))`
                    : '#e3e8ef',
                  boxShadow: dirty ? `0 6px 18px rgba(${roleCfg.rgb},0.3)` : 'none',
                },
                '&:disabled': { opacity: 0.45, color: C.muted },
              }}
            >
              Save Changes
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* ── Role selector ────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3.5, py: 2,
          borderBottom: `1px solid ${C.border}`,
          bgcolor: C.surface,
        }}
      >
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          {CONFIGURABLE_ROLES.map((role, idx) => {
            const r = ROLE_CONFIG[role];
            const active = idx === activeTab;
            return (
              <Box
                key={role}
                onClick={() => setActiveTab(idx)}
                sx={{
                  px: 2, py: 1.25,
                  borderRadius: 2,
                  border: `1px solid ${active ? `rgba(${r.rgb},0.35)` : C.border}`,
                  bgcolor: active ? `rgba(${r.rgb},0.08)` : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    bgcolor: active ? `rgba(${r.rgb},0.1)` : '#f8fafc',
                    borderColor: `rgba(${r.rgb},0.3)`,
                  },
                  // Left border accent
                  '&::before': {
                    content: '""',
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: 3,
                    bgcolor: active ? r.color : 'transparent',
                    borderRadius: '4px 0 0 4px',
                    transition: 'background-color 0.2s',
                  },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {/* Short code badge */}
                  <Box
                    sx={{
                      width: 32, height: 22,
                      borderRadius: 1,
                      bgcolor: `rgba(${r.rgb},${active ? 0.2 : 0.08})`,
                      border: `1px solid rgba(${r.rgb},${active ? 0.3 : 0.12})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.58rem', fontWeight: 500,
                        color: active ? r.color : C.muted,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {r.short}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: '0.82rem', fontWeight: active ? 700 : 500,
                        color: active ? r.color : C.muted,
                        lineHeight: 1.2,
                        transition: 'color 0.2s',
                      }}
                    >
                      {r.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'inherit',
                        fontSize: '0.65rem', color: C.dim,
                        lineHeight: 1, mt: 0.25, display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {r.description}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* ── Info notice ─────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3.5, py: 1.25,
          bgcolor: 'rgba(25,118,210,0.04)',
          borderBottom: `1px solid rgba(25,118,210,0.12)`,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconInfoCircle size={13} color="rgba(25,118,210,0.7)" />
          <Typography sx={{ fontSize: '0.72rem', color: 'rgba(25,118,210,0.75)', fontFamily: 'inherit' }}>
            <Box component="span" sx={{ fontWeight: 700 }}>Store Admin</Box> &amp;&nbsp;
            <Box component="span" sx={{ fontWeight: 700 }}>Super Admin</Box>&nbsp;
            always have full access. Changes apply after the user logs in again.
          </Typography>
        </Stack>
      </Box>

      {/* ── Matrix ───────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: C.surface }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress size={28} sx={{ color: roleCfg.color }} />
              <Typography sx={{ fontSize: '0.75rem', color: C.muted, fontFamily: 'inherit' }}>
                Loading permissions…
              </Typography>
            </Stack>
          </Box>
        ) : (
          <PermissionMatrix role={currentRole} matrix={matrix} onChange={handleMatrixChange} />
        )}
      </Box>

      {/* ── Footer legend ────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 3.5, py: 1.75,
          bgcolor: C.card,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.dim, fontFamily: 'inherit' }}>
            Legend
          </Typography>

          {/* Granted */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: roleCfg.color, transition: 'background-color 0.3s' }} />
            <Typography sx={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'inherit' }}>Granted</Typography>
          </Stack>

          {/* Denied */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 12, height: 12, borderRadius: '2px', border: '1.5px solid #c9d1da' }} />
            <Typography sx={{ fontSize: '0.7rem', color: C.muted, fontFamily: 'inherit' }}>Denied</Typography>
          </Stack>

          {/* N/A */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 12, height: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#c9d1da', lineHeight: 1 }}>·</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.7rem', color: C.dim, fontFamily: 'inherit' }}>Not applicable</Typography>
          </Stack>

          {/* Row checkbox = select all */}
          <Stack direction="row" spacing={0.75} alignItems="center">
            <IconLock size={11} color={C.dim} />
            <Typography sx={{ fontSize: '0.7rem', color: C.dim, fontFamily: 'inherit' }}>
              Row / column headers toggle all applicable cells
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default RoleManagement;
