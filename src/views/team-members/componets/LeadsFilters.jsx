"use client";

import React from "react";
import {
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Paper,
} from "@mui/material";
import { Search, X } from "lucide-react";

export default function LeadsFilters({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  onReset,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 4,
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <Grid container spacing={2}>
        {/* Search */}
        <Grid item xs={12} md={6} lg={3}>
          <Box sx={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }}
            />
            <TextField
              fullWidth
              placeholder="Search by name, phone, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  pl: 4,
                  "& fieldset": {
                    borderColor: "rgba(0,0,0,0.12)",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Box>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) =>
                onFiltersChange({ ...filters, status: e.target.value })
              }
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="contacted">Contacted</MenuItem>
              <MenuItem value="interested">Interested</MenuItem>
              <MenuItem value="not-interested">Not Interested</MenuItem>
              <MenuItem value="follow-up">Follow-up</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Priority Filter */}
        <Grid item xs={12} md={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              value={filters.priority}
              onChange={(e) =>
                onFiltersChange({ ...filters, priority: e.target.value })
              }
            >
              <MenuItem value="all">All Priority</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Reset Button */}
        <Grid item xs={12} md={6} lg={3}>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={onReset}
            startIcon={<X size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "background.paper",
              borderColor: "rgba(0,0,0,0.12)",
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
