import { useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import JsBarcode from 'jsbarcode';

/**
 * BarcodeLabel — renders a single sticker/label.
 *
 * On screen: converted mm → px preview with a dashed border.
 * On print:  uses mm dimensions via @media print override; border hidden.
 *
 * Props:
 *   product   — { name, barcode, sku, price, expiry? }
 *   template  — { width, height, showProductName, showBarcode, showPrice,
 *                  showSku, showExpiry, fontSize, barcodeHeight }
 *   barcodeType — 'CODE128' | 'EAN13' | 'UPCA'
 */
const BarcodeLabel = ({ product, template, barcodeType = 'CODE128' }) => {
  const svgRef = useRef(null);

  const {
    width = 50,
    height = 25,
    showProductName = true,
    showBarcode = true,
    showPrice = true,
    showSku = false,
    showExpiry = false,
    fontSize = 10,
    barcodeHeight = 40,
  } = template || {};

  useEffect(() => {
    if (!svgRef.current || !product?.barcode || !showBarcode) return;
    try {
      JsBarcode(svgRef.current, String(product.barcode), {
        format: barcodeType,
        width: 1.4,
        height: barcodeHeight,
        displayValue: true,
        fontSize: Math.max(8, fontSize - 1),
        margin: 2,
        lineColor: '#000000',
        background: 'transparent',
        flat: true,
      });
    } catch {
      // Invalid barcode value for the chosen format — render nothing
    }
  }, [product?.barcode, barcodeType, barcodeHeight, fontSize, showBarcode]);

  // 1mm ≈ 3.78px at 96 dpi
  const mmToPx = (mm) => Math.round(mm * 3.78);

  return (
    <Box
      className="barcode-label"
      sx={{
        width: mmToPx(width),
        height: mmToPx(height),
        border: '1px dashed #bbb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        p: '2px',
        boxSizing: 'border-box',
        bgcolor: 'white',
        flexShrink: 0,
        '@media print': {
          width: `${width}mm`,
          height: `${height}mm`,
          border: 'none',
          breakInside: 'avoid',
          pageBreakInside: 'avoid',
        },
      }}
    >
      {showProductName && product?.name && (
        <Typography
          sx={{
            fontSize: `${fontSize}px`,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.1,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            px: '2px',
          }}
        >
          {product.name}
        </Typography>
      )}

      {showBarcode && product?.barcode && (
        <svg ref={svgRef} style={{ maxWidth: '100%', flexShrink: 0 }} />
      )}

      {showBarcode && !product?.barcode && (
        <Typography sx={{ fontSize: `${fontSize - 1}px`, color: '#999', fontStyle: 'italic' }}>
          No barcode
        </Typography>
      )}

      {showSku && product?.sku && (
        <Typography sx={{ fontSize: `${Math.max(7, fontSize - 2)}px`, color: '#555', lineHeight: 1 }}>
          {product.sku}
        </Typography>
      )}

      {showPrice && product?.price && (
        <Typography sx={{ fontSize: `${fontSize}px`, fontWeight: 800, lineHeight: 1.1 }}>
          {product.price}
        </Typography>
      )}

      {showExpiry && product?.expiry && (
        <Typography sx={{ fontSize: `${Math.max(7, fontSize - 2)}px`, lineHeight: 1 }}>
          EXP: {product.expiry}
        </Typography>
      )}
    </Box>
  );
};

export default BarcodeLabel;
