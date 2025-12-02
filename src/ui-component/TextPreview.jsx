import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  lighten,
  Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TextPreviewField = ({ label, textContent, tableHeading, tableColumns, tableRows, buttonText = 'Preview', textIcon, tableIcon }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  return (
    <>
      {/* Preview Button */}
      <Typography
        variant="caption"
        onClick={handleOpen}
        sx={{
          fontWeight: 500,
          borderRadius: 7, 
          py: 0.7,
          px: 2,
          cursor: 'pointer',
          color: theme.palette.background.paper,
          textTransform: 'none',
          display: 'inline-block', 
          '&:hover': {
            opacity: 0.9
          }
        }}
      >
        {buttonText}
      </Typography>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle sx={{ textAlign: 'center', pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8, color: theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            pt: 2,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 400, // fixed height for the dialog
            maxHeight: 400 // optional, keeps it consistent
          }}
        >
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 2,
              '& .MuiTabs-indicator': {
                backgroundColor: 'inherit',
                height: 3
              },
              '& .MuiTabs-list': {
                borderBottom: 'none',
                display: 'flex',
                p: 0,
                alignItems: 'center'
              },
              '& .MuiButtonBase-root': {
                borderBottom: 'none',
                display: 'flex',
                color: 'background.paper',
                alignItems: 'center'
              },
              '& .MuiTab-root': {
              },

              borderRadius: '30px',
              alignItems: 'center',
            }}
          >
            {textContent && (
              <Tab
                icon={textIcon ? React.cloneElement(textIcon, { sx: { fontSize: 18 } }) : null}
                iconPosition="start"
                label={textContent.heading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 36,
                  px: 2,
                  py: 0.5,
                  borderRadius: '24px',
                  gap: 1,
                  flex: 1 // ✅ full width share
                }}
              />
            )}

            {tableHeading && tableColumns && tableRows && (
              <Tab
                icon={tableIcon ? React.cloneElement(tableIcon, { sx: { fontSize: 18 } }) : null}
                iconPosition="start"
                label={tableHeading}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 36,
                  px: 2,
                  py: 0.5,
                  borderRadius: '24px',
                  gap: 1,
                  flex: 1 // ✅ full width share
                }}
              />
            )}
          </Tabs>

          {/* Tab Panels */}
          <Box
            sx={{
              flexGrow: 1, // fill remaining space
              overflow: 'auto', // scroll if content exceeds
              backgroundColor: '#f9f9f9',
              borderRadius: 2,
              p: 2
            }}
          >
            <Fade in={activeTab === 0} timeout={500} unmountOnExit>
              <Box>
                {textContent && (
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: '#333' }}>
                    {textContent.body}
                  </Typography>
                )}
              </Box>
            </Fade>

            <Fade in={activeTab === 1} timeout={500} unmountOnExit>
              <Box>
                {tableHeading && tableColumns && tableRows && (
                  <TableContainer
                    component={Paper}
                    sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'auto', boxShadow: 'none' }}
                  >
                    <Table stickyHeader>
                      <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                          {tableColumns.map((col, index) => (
                            <TableCell key={index} sx={{ fontWeight: 600 }}>
                              {col}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableRows.map((row, rIndex) => (
                          <TableRow key={rIndex} hover>
                            {tableColumns.map((col, cIndex) => (
                              <TableCell key={cIndex}>{row[col]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Fade>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TextPreviewField;
