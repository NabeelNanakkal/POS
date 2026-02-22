import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton, LinearProgress, Tooltip } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

const ACCEPTED_FILE_TYPES = ['.png', '.jpg', '.pdf'];

const FileUpload = ({ maxSize = '2 MB', onFileSelect, fullWidth = false, isSubmit }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBoxClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProgress(0);

      // fake upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (onFileSelect) onFileSelect(file);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
      isSubmit(file);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    setProgress(0);
    fileInputRef.current.value = null;
    isSubmit(null);
  };

  const dragHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        setProgress(100);
        if (onFileSelect) onFileSelect(file);
        isSubmit(file);
      }
    }
  };

  const uploadBoxStyles = {
    border: '2px dashed #b0bec5',
    borderRadius: 2,
    padding: 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    position: 'relative',
    cursor: 'pointer',
    backgroundColor: isDragging ? '#e0f7fa' : '#f5f5f5',
    height: 120,
    width: fullWidth ? '100%' : 'auto' // ✅ new
  };

  const fileItemStyles = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e0e0e0',
    borderRadius: 1,
    padding: 1,
    mt: 2,
    position: 'relative'
  };

  const fileDisplayName = selectedFile?.name || '';
  const fileSizeDisplay = selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '';

  return (
    <Box>
      {/* Upload Box */}
      <Box
        onClick={handleBoxClick}
        {...dragHandlers}
        sx={uploadBoxStyles}
        role="button"
        tabIndex={0}
        aria-label="Upload file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBoxClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          accept={ACCEPTED_FILE_TYPES.join(',')}
          onChange={handleFileChange}
          aria-label="File input"
        />

        <CloudUploadIcon sx={{ fontSize: 30, color: '#cbcbcb' }} />
        <Typography variant="body1" fontWeight={500} sx={{ fontSize: '13px' }}>
          Drag your files or browse
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: {
              xs: '0.6rem', // mobile
              sm: '0.7rem' // small screen
            }
          }}
          mt={1}
        >
          You can upload PNG/JPG/PDF format
        </Typography>

        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            top: 8,
            right: 12,
            color: '#607d8b',
            fontSize: '0.8rem'
          }}
        >
          {maxSize}
        </Typography>
      </Box>

      {/* Selected File Display */}
      {selectedFile && (
        <Box sx={fileItemStyles}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mr: 2,
              flexShrink: 0
            }}
          >
            <PictureAsPdfOutlinedIcon
              sx={{
                fontSize: {
                  xs: 16, // very small on mobile
                  sm: 18, // small screen
                  md: 20, // medium screen
                  lg: 22 // large screen
                },
                color: 'red'
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1, position: 'relative', pr: 3 }}>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: '#121212',
                mb: progress < 100 ? 1 : 0,
                fontSize: {
                  xs: '0.55rem', // mobile
                  sm: '0.85rem' // small screen
                },
                maxWidth: '70%' // ✅ so it doesn't overflow parent
              }}
              title={fileDisplayName}
            >
              {fileDisplayName}
            </Typography>

            {progress < 100 && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  width: '100%',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#1875e0'
                  }
                }}
              />
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: progress < 100 ? 8 : 9,
              right: 40,
              color: '#607d8b',
              fontSize: '0.75rem'
            }}
          >
            {fileSizeDisplay}
          </Typography>

          {progress === 100 && (
            <Tooltip title="Delete file" arrow>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  resetFile();
                }}
                sx={{ position: 'absolute', right: 4, zIndex: 10 }}
                size="small"
                aria-label="Delete selected file"
              >
                <DeleteOutlinedIcon sx={{ fontSize: 18, color: 'grey.600' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
