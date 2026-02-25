import { Box, Typography, Stack, Divider } from '@mui/material';

/**
 * ReceiptTemplate — hidden on screen, shown only during print.
 *
 * Uses className="print-container" which the global @media print CSS
 * makes visible while hiding everything else.
 *
 * Props:
 *   order   — full order object { orderNumber, items[], subtotal, tax, discount,
 *              total, payments[], customer, createdAt, cashier? }
 *   config  — printConfig { receiptHeader, receiptFooter, showLogoOnReceipt,
 *              showTaxOnReceipt, showCashierOnReceipt }
 *   store   — { name, address?, phone?, currency? }
 */
const ReceiptTemplate = ({ order, config, store }) => {
  if (!order) return null;

  const currencySymbol = store?.currency?.symbol || store?.currency || 'BD';
  const fmt = (v) => `${currencySymbol} ${Number(v || 0).toFixed(3)}`;

  return (
    <Box
      id="pos-receipt-print"
      className="print-container"
      sx={{
        display: 'none',
        '@media print': {
          display: 'block',
          width: '80mm',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: '11px',
          color: '#000',
          bgcolor: '#fff',
          p: '4mm',
          boxSizing: 'border-box',
        },
      }}
    >
      {/* ── Store Header ── */}
      {config?.showLogoOnReceipt !== false && (
        <Typography
          align="center"
          sx={{ fontWeight: 800, fontSize: '14px', mb: '1mm', '@media print': { display: 'block' } }}
        >
          {store?.name || 'POS Store'}
        </Typography>
      )}
      {store?.address && (
        <Typography align="center" sx={{ fontSize: '10px', lineHeight: 1.3 }}>
          {store.address}
        </Typography>
      )}
      {store?.phone && (
        <Typography align="center" sx={{ fontSize: '10px' }}>
          Tel: {store.phone}
        </Typography>
      )}
      {config?.receiptHeader && (
        <Typography align="center" sx={{ fontSize: '10px', mt: '1mm', fontStyle: 'italic' }}>
          {config.receiptHeader}
        </Typography>
      )}

      <Box sx={{ borderTop: '1px dashed #000', my: '2mm' }} />

      {/* ── Order Meta ── */}
      <Stack direction="row" justifyContent="space-between" sx={{ fontSize: '10px' }}>
        <Typography sx={{ fontSize: '10px' }}>Order: {order.orderNumber}</Typography>
        <Typography sx={{ fontSize: '10px' }}>
          {new Date(order.createdAt).toLocaleDateString('en-GB')}
        </Typography>
      </Stack>
      <Typography sx={{ fontSize: '10px' }}>
        Time: {new Date(order.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </Typography>
      {config?.showCashierOnReceipt && (order.cashier?.name || order.cashier?.username) && (
        <Typography sx={{ fontSize: '10px' }}>
          Cashier: {order.cashier?.name || order.cashier?.username}
        </Typography>
      )}
      {order.customer?.name && (
        <Typography sx={{ fontSize: '10px' }}>
          Customer: {order.customer.name}
        </Typography>
      )}

      <Box sx={{ borderTop: '1px dashed #000', my: '2mm' }} />

      {/* ── Items ── */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: '1mm' }}>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, flex: 2 }}>Item</Typography>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, textAlign: 'center', width: '30px' }}>Qty</Typography>
        <Typography sx={{ fontSize: '10px', fontWeight: 700, textAlign: 'right', width: '60px' }}>Total</Typography>
      </Stack>

      <Box sx={{ borderTop: '1px dotted #999', mb: '1mm' }} />

      {(order.items || []).map((item, idx) => (
        <Box key={idx} sx={{ mb: '1mm' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography sx={{ fontSize: '10px', flex: 2, lineHeight: 1.2 }} noWrap>
              {item.name}
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'center', width: '30px' }}>
              x{item.quantity}
            </Typography>
            <Typography sx={{ fontSize: '10px', textAlign: 'right', width: '60px' }}>
              {fmt(item.subtotal || item.price * item.quantity)}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '9px', color: '#555', lineHeight: 1 }}>
            @ {fmt(item.price)} each
          </Typography>
        </Box>
      ))}

      <Box sx={{ borderTop: '1px dashed #000', my: '2mm' }} />

      {/* ── Totals ── */}
      <Stack direction="row" justifyContent="space-between" sx={{ mb: '0.5mm' }}>
        <Typography sx={{ fontSize: '10px' }}>Subtotal</Typography>
        <Typography sx={{ fontSize: '10px' }}>{fmt(order.subtotal)}</Typography>
      </Stack>

      {order.discount > 0 && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: '0.5mm' }}>
          <Typography sx={{ fontSize: '10px' }}>Discount</Typography>
          <Typography sx={{ fontSize: '10px' }}>- {fmt(order.discount)}</Typography>
        </Stack>
      )}

      {config?.showTaxOnReceipt !== false && order.tax > 0 && (
        <Stack direction="row" justifyContent="space-between" sx={{ mb: '0.5mm' }}>
          <Typography sx={{ fontSize: '10px' }}>Tax</Typography>
          <Typography sx={{ fontSize: '10px' }}>{fmt(order.tax)}</Typography>
        </Stack>
      )}

      <Box sx={{ borderTop: '1px solid #000', my: '1mm' }} />

      <Stack direction="row" justifyContent="space-between" sx={{ mb: '1mm' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 900 }}>TOTAL</Typography>
        <Typography sx={{ fontSize: '13px', fontWeight: 900 }}>{fmt(order.total)}</Typography>
      </Stack>

      {/* ── Payments ── */}
      {(order.payments || []).map((p, i) => (
        <Stack key={i} direction="row" justifyContent="space-between" sx={{ mb: '0.5mm' }}>
          <Typography sx={{ fontSize: '10px', textTransform: 'capitalize' }}>
            Paid ({p.method?.toLowerCase() || 'cash'})
          </Typography>
          <Typography sx={{ fontSize: '10px' }}>{fmt(p.amount)}</Typography>
        </Stack>
      ))}

      <Box sx={{ borderTop: '1px dashed #000', my: '2mm' }} />

      {/* ── Footer ── */}
      <Typography align="center" sx={{ fontSize: '10px', fontStyle: 'italic' }}>
        {config?.receiptFooter || 'Thank you for your purchase!'}
      </Typography>

      {order.orderNumber && (
        <Typography align="center" sx={{ fontSize: '9px', color: '#555', mt: '1mm' }}>
          Ref: {order.orderNumber}
        </Typography>
      )}
    </Box>
  );
};

export default ReceiptTemplate;
