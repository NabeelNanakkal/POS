"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Divider,
} from "@mui/material";
import {
  X,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  Save,
  User,
  Building2,
} from "lucide-react";

export default function LeadDetailModal({ lead, onClose, onUpdate }) {
  const [formData, setFormData] = useState(lead);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(formData);
      setIsEditing(false);
      setIsSaving(false);
    }, 600);
  };

  const getStatusColor = (status) => {
    const map = {
      new: "#1976d2",
      contacted: "#2e7d32",
      interested: "#6a1b9a",
      "not-interested": "#d32f2f",
      "follow-up": "#ef6c00",
    };
    return map[status] || "#616161";
  };

  const getPriorityColor = (priority) => {
    const map = {
      high: "#d32f2f",
      medium: "#ed6c02",
      low: "#2e7d32",
    };
    return map[priority] || "#616161";
  };

  return (
    <Dialog
      open={!!lead}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          display: "flex",
          flexDirection: "column",
          height: isMobile ? "100vh" : "auto",
          overflow: "hidden",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          py: 1.5,
          px: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            fontWeight={600}
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {formData.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.85,
              fontSize: { xs: "0.8rem", sm: "0.9rem" },
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            {formData.company}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "white", ml: 1 }}
        >
          <X size={20} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          p: 3,
          overflowY: "auto",
          flex: 1,
          bgcolor: "background.default",
        }}
      >
        {/* SECTION: Contact Info */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
        >
          Contact Information
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {[
            {
              icon: <Phone size={18} color="#1976d2" />,
              label: "Phone",
              value: formData.phone,
              href: `tel:${formData.phone}`,
            },
            {
              icon: <Mail size={18} color="#1976d2" />,
              label: "Email",
              value: formData.email,
              href: `mailto:${formData.email}`,
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {item.icon}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {item.label}
                </Typography>
                <Typography
                  component="a"
                  href={item.href}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "primary.main",
                    textDecoration: "none",
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>

        {/* SECTION: Lead Status */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
        >
          Lead Details
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Grid container spacing={2}>
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: "block" }}
              >
                Status
              </Typography>
              {isEditing ? (
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="interested">Interested</MenuItem>
                  <MenuItem value="not-interested">Not Interested</MenuItem>
                  <MenuItem value="follow-up">Follow-up</MenuItem>
                </Select>
              ) : (
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: `${getStatusColor(formData.status)}15`,
                    color: getStatusColor(formData.status),
                    fontWeight: 600,
                    textAlign: "center",
                    border: `1px solid ${getStatusColor(formData.status)}30`,
                  }}
                >
                  {formData.status
                    .replace("-", " ")
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </Box>
              )}
            </Grid>

            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: "block" }}
              >
                Priority
              </Typography>
              {isEditing ? (
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              ) : (
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    bgcolor: `${getPriorityColor(formData.priority)}15`,
                    color: getPriorityColor(formData.priority),
                    fontWeight: 600,
                    textAlign: "center",
                    border: `1px solid ${getPriorityColor(
                      formData.priority
                    )}30`,
                  }}
                >
                  {formData.priority.charAt(0).toUpperCase() +
                    formData.priority.slice(1)}
                </Box>
              )}
            </Grid>

            {/* Dates */}
            {[
              {
                icon: <Calendar size={18} color="#1976d2" />,
                label: "Last Contact",
                value: new Date(formData.lastContact).toLocaleDateString(),
              },
              {
                icon: <Calendar size={18} color="#1976d2" />,
                label: "Next Follow-up",
                value: new Date(formData.nextFollowUp).toLocaleDateString(),
              },
              {
                icon: <DollarSign size={18} color="#1976d2" />,
                label: "Lead Value",
                value: `$${formData.leadValue}`,
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    p: 1.5,
                  }}
                >
                  {item.icon}
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      {item.label}
                    </Typography>
                    <Typography fontWeight={600} fontSize="0.9rem">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* SECTION: Notes */}
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, mb: 1, color: "text.secondary" }}
        >
          Notes & Comments
        </Typography>
        {isEditing ? (
          <TextField
            name="notes"
            multiline
            rows={4}
            fullWidth
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Add notes about this lead..."
            size="small"
          />
        ) : (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              mb: 3,
              bgcolor: "grey.50",
            }}
          >
            <Typography
              color="text.primary"
              sx={{
                whiteSpace: "pre-wrap",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {formData.notes || "No notes added yet."}
            </Typography>
          </Paper>
        )}

        {/* SECTION: Meta Info */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: "block" }}
              >
                Lead Source
              </Typography>
              <Typography fontWeight={600}>{formData.source}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mb: 0.5, display: "block" }}
              >
                Assigned Date
              </Typography>
              <Typography fontWeight={600}>
                {new Date(formData.assignedDate).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {!isEditing ? (
          <>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Edit Lead
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                setFormData(lead);
                setIsEditing(false);
              }}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={isSaving}
              onClick={handleSave}
              startIcon={<Save size={16} />}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
