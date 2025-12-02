"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { X, UploadCloud, FileSpreadsheet, CheckCircle } from "lucide-react"
import { useDispatch, useSelector } from 'react-redux'
import { importLeads } from "container/AdminContainer/slice"
import { toast } from 'react-toastify'

export default function ImportLeadsModal({ open, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const dispatch = useDispatch()
  const { importing } = useSelector((state) => state.admin)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a CSV or XLSX file')
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }
      setSelectedFile(file)
    }
  }

  useEffect(() => {
    if (!importing) {
      handleClose()
    }
  }, [importing])

  const handleUpload = () => {
    if (!selectedFile) return
    dispatch(importLeads(selectedFile))
  }

  const handleClose = () => {
    setSelectedFile(null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 700,
          color: "primary.main",
        }}
      >
        Import Leads
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          py: 4,
          px: { xs: 2, sm: 3 },
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            border: "2px dashed rgba(6,182,212,0.4)",
            borderRadius: 2,
            p: 4,
            bgcolor: "rgba(240,249,255,0.5)",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": {
              borderColor: "#06B6D4",
              bgcolor: "rgba(240,249,255,0.8)",
            },
          }}
          onClick={() => document.getElementById("fileInput").click()}
        >
          {selectedFile ? (
            <>
              <FileSpreadsheet size={40} color="#06B6D4" />
              <Typography mt={2} fontWeight={600}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to change file
              </Typography>
            </>
          ) : (
            <>
              <UploadCloud size={40} color="#06B6D4" />
              <Typography mt={2} fontWeight={600}>
                Click to Upload or Drag & Drop
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CSV or XLSX file (Max size: 5MB)
              </Typography>
            </>
          )}
          <input
            id="fileInput"
            type="file"
            accept=".csv,.xlsx"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "text.secondary",
            borderColor: "divider",
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || importing}
          startIcon={importing ? <CheckCircle size={16} /> : <UploadCloud size={16} />}
          sx={{
            px: 3,
            background: "linear-gradient(to right, #06b6d4, #2563eb)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(to right, #0891b2, #1d4ed8)",
            },
          }}
        >
          {importing ? "Importing..." : "Import Leads"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
