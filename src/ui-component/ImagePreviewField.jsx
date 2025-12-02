import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Dialog, DialogContent, Typography, useTheme, IconButton, Grid, Tooltip, darken } from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import fallbackImage from 'assets/images/broken_image.png';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Visibility } from '@mui/icons-material';

const ImagePreviewField = ({ imageSrc, label, fieldName, fileName, uploadedAt, sx = {}, isDrawer, onDelete, letDelete }) => {
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isThumbnailLoading, setIsThumbnailLoading] = useState(false);
  const [isFullImageLoading, setIsFullImageLoading] = useState(false);
  const [localFileUrl, setLocalFileUrl] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' | 'pdf'

  const theme = useTheme();

  const previewUrl = localFileUrl || imageSrc;
  const isPDF = fileType === 'pdf';

  useEffect(() => {
    if (imageSrc) {
      setLocalFileUrl(imageSrc);

      const lowerFileName = fileName?.toLowerCase() || '';
      const lowerUrl = imageSrc?.toLowerCase() || '';
      if (lowerFileName.endsWith('.pdf') || lowerUrl.endsWith('.pdf')) {
        setFileType('pdf');
      } else {
        setFileType('image');
      }
    }
  }, [imageSrc, fileName]);

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setIsFullImageLoading(true);
    setOpenImage(true);
  };

  const handleCloseImage = (event) => {
    if (event) event.stopPropagation();
    setIsFullImageLoading(false);
    setSelectedImage(null);
    setOpenImage(false);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(fieldName);
  };

  return (
    <>
      <Grid container disableGutters alignItems="center" sx={{ gap: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            borderRadius: 1,
            pr: 1,
            py: 0.5,
            minWidth: 0
          }}
        >
          <Grid item sx={{ flex: 1 }}>
            {previewUrl && (
              <>
                {!isDrawer ? (
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      borderRadius: 7,
                      py: 0.7,
                      px: 2,
                      cursor: 'pointer',
                      color: theme.palette.background.paper
                    }}
                    onClick={() => {
                      handleImageClick(previewUrl);
                    }}
                  >
                    Preview
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      position: 'relative',
                      width: 45,
                      height: 37,
                      overflow: 'hidden',
                      borderRadius: 1.5,
                      border: `1px solid ${theme.palette.divider}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.background.paper,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleImageClick(previewUrl)}
                  >
                    {isThumbnailLoading && <CircularProgress size={20} sx={{ position: 'absolute', zIndex: 1 }} />}
                    {isPDF ? (
                      <DescriptionOutlinedIcon fontSize="small" color="action" />
                    ) : (
                      <img
                        src={previewUrl}
                        alt={`${label} thumbnail`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                        onLoad={() => setIsThumbnailLoading(false)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = fallbackImage;
                          toast.warn('Failed to load thumbnail');
                          setIsThumbnailLoading(false);
                        }}
                      />
                    )}
                  </Box>
                )}
              </>
            )}
          </Grid>

          {/* Delete Button - ONLY if letDelete is true */}
          {letDelete &&
            (!isDrawer ? (
              <Grid item>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 1,
                    px: 0.5,
                    py: 0.5,
                    minWidth: 0
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      cursor: 'pointer',
                      color: darken(theme.palette.background.lightTheme, 0.5),
                      borderBottom: '1px dashed grey'
                    }}
                    onClick={() => handleDelete()}
                  >
                    Delete
                  </Typography>
                </Box>
              </Grid>
            ) : (
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            ))}
        </Box>
      </Grid>

      {/* Dialog Preview */}
      <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md" fullWidth>
        <IconButton
          onClick={(e) => handleCloseImage(e)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.grey[500],
            zIndex: 3
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          sx={{
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            minHeight: '80vh'
          }}
        >
          {isFullImageLoading && <CircularProgress size={40} sx={{ position: 'absolute', zIndex: 2 }} />}
          {selectedImage &&
            (isPDF ? (
              <iframe
                src={selectedImage}
                title={`${label} PDF`}
                style={{ width: '100%', height: '80vh', border: 'none', backgroundColor: 'transparent' }}
                onLoad={() => setIsFullImageLoading(false)}
              />
            ) : (
              <img
                src={selectedImage}
                alt={`${label} full size`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
                onLoad={() => setIsFullImageLoading(false)}
                onError={() => {
                  toast.warn('Failed to load full-size image');
                  handleCloseImage();
                }}
              />
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImagePreviewField;
