import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  alpha,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import { importFromExcel, generateSampleFile } from 'utils/excelUtils';

const BulkImportModal = ({ open, onClose, onImport, columns, sampleFileName, title }) => {
  const theme = useTheme();
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      try {
        const data = await importFromExcel(selectedFile);
        setPreviewData(data);
      } catch (err) {
        alert('Error reading file. Please ensure it is a valid Excel file.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadSample = () => {
    generateSampleFile(columns, sampleFileName);
  };

  const handleFinalize = () => {
    onImport(previewData);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setFile(null);
    setPreviewData([]);
  };

  const handleModalClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleModalClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <PlayCircleFilledWhiteIcon color="primary" />
          <Typography variant="h4" fontWeight={800}>{title || 'Bulk Import'}</Typography>
        </Stack>
        <IconButton onClick={handleModalClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: '#fcfcfc', py: 3 }}>
        <Stack spacing={3}>
          {/* Sample Download Section */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 3, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: '1px dashed',
              borderColor: alpha(theme.palette.primary.main, 0.2),
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>Need help with formatting?</Typography>
              <Typography variant="caption" color="text.secondary">Download our official template to ensure your data imports correctly.</Typography>
            </Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleDownloadSample}
              startIcon={<FileDownloadIcon />}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
            >
              Download Template
            </Button>
          </Box>

          {/* Upload Section */}
          {!file ? (
            <Box
              component="label"
              sx={{
                border: '2px dashed #eee',
                borderRadius: 4,
                p: 6,
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.3s',
                bgcolor: 'white',
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: theme.palette.primary.main }
              }}
            >
              <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileChange} />
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" fontWeight={700} gutterBottom>Click to upload or drag and drop</Typography>
              <Typography variant="body2" color="text.secondary">Support for Excel (.xlsx, .xls) files</Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ p: 1, bgcolor: 'success.light', borderRadius: 2, color: 'success.main' }}>
                    <CloudUploadIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{(file.size / 1024).toFixed(2)} KB • Ready to extract</Typography>
                  </Box>
                </Stack>
                <Button size="small" color="error" onClick={handleReset} sx={{ textTransform: 'none', fontWeight: 700 }}>Remove</Button>
              </Paper>

              {/* Data Preview */}
              {previewData.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Data Preview <Typography component="span" variant="caption" color="primary" fontWeight={800}>({previewData.length} records found)</Typography>
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', borderRadius: 3, maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          {Object.keys(previewData[0]).map((key) => (
                            <TableCell key={key} sx={{ bgcolor: 'grey.50', fontWeight: 700, color: 'text.secondary' }}>{key}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {previewData.map((row, idx) => (
                          <TableRow key={idx}>
                            {Object.values(row).map((val, i) => (
                              <TableCell key={i} sx={{ py: 1.5 }}>{val}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, px: 3 }}>
        <Button onClick={handleModalClose} color="inherit" sx={{ fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
        <Button 
          variant="contained" 
          disabled={!previewData.length}
          onClick={handleFinalize}
          sx={{ borderRadius: 2.5, px: 4, fontWeight: 800, textTransform: 'none' }}
        >
          Finalize Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkImportModal;
