"use client";

import React from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Typography,
  Chip,
  IconButton,
  Stack,
  useMediaQuery,
  Card,
  CardContent,
  Pagination,
} from "@mui/material";
import { ChevronUp, ChevronDown, Phone, Mail, Eye } from "lucide-react";
import { useTheme } from "@mui/material/styles";

export default function LeadsTable({
  leads,
  onViewDetails,
  onSort,
  sortConfig,
  totalLeads,
  currentPage,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalLeads / itemsPerPage);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <Box sx={{ width: 16, height: 16 }} />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const getStatusColor = (status) => {
    const map = {
      new: { bg: "#e3f2fd", color: "#1565c0" },
      contacted: { bg: "#e8f5e9", color: "#2e7d32" },
      interested: { bg: "#f3e5f5", color: "#6a1b9a" },
      "not-interested": { bg: "#ffebee", color: "#c62828" },
      "follow-up": { bg: "#fff3e0", color: "#ef6c00" },
    };
    return map[status] || { bg: "#f8fafc", color: "#334155" };
  };

  const getPriorityColor = (priority) => {
    const map = {
      high: { bg: "#ffebee", color: "#c62828" },
      medium: { bg: "#fffde7", color: "#f9a825" },
      low: { bg: "#e8f5e9", color: "#2e7d32" },
    };
    return map[priority] || { bg: "#f8fafc", color: "#334155" };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
        p: 0,
      }}
    >
      {/* Desktop Table */}
      {!isMobile ? (
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: "grey.50" }}>
              <TableRow>
                {[
                  "Name",
                  "Phone",
                  "Company",
                  "Status",
                  "Priority",
                  "Last Contact",
                  "Value",
                  "Actions",
                ].map((col, idx) => (
                  <TableCell
                    key={col}
                    sx={{
                      fontWeight: 600,
                      color: "grey.800",
                      whiteSpace: "nowrap",
                      textAlign: idx === 7 ? "center" : "left",
                    }}
                  >
                    {col !== "Value" && col !== "Actions" ? (
                      <Button
                        onClick={() => onSort(col.toLowerCase().replace(" ", ""))}
                        endIcon={<SortIcon columnKey={col.toLowerCase()} />}
                        sx={{
                          textTransform: "none",
                          color: "inherit",
                          fontWeight: 600,
                          "&:hover": { color: "text.primary" },
                        }}
                      >
                        {col}
                      </Button>
                    ) : (
                      col
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {leads.map((lead, index) => (
                <TableRow
                  key={lead.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? "white" : "grey.50",
                    "&:hover": { bgcolor: "grey.100" },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell>
                    <Typography fontWeight={600}>{lead.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.source}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Stack spacing={0.5}>
                      <Button
                        startIcon={<Phone size={16} />}
                        href={`tel:${lead.phone}`}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          justifyContent: "flex-start",
                        }}
                      >
                        {lead.phone}
                      </Button>
                      <Button
                        startIcon={<Mail size={16} />}
                        href={`mailto:${lead.email}`}
                        sx={{
                          textTransform: "none",
                          color: "primary.main",
                          justifyContent: "flex-start",
                        }}
                      >
                        {lead.email}
                      </Button>
                    </Stack>
                  </TableCell>

                  <TableCell>{lead.company}</TableCell>

                  <TableCell>
                    <Chip
                      label={
                        lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1).replace("-", " ")
                      }
                      sx={{
                        bgcolor: getStatusColor(lead.status).bg,
                        color: getStatusColor(lead.status).color,
                        fontWeight: 600,
                      }}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={
                        lead.priority.charAt(0).toUpperCase() +
                        lead.priority.slice(1)
                      }
                      sx={{
                        bgcolor: getPriorityColor(lead.priority).bg,
                        color: getPriorityColor(lead.priority).color,
                        fontWeight: 600,
                      }}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(lead.lastContact).toLocaleDateString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>${lead.leadValue}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Eye size={16} />}
                      onClick={() => onViewDetails(lead)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        borderColor: "primary.light",
                        "&:hover": {
                          bgcolor: "primary.50",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Mobile View
        <Box p={2}>
          {leads.map((lead) => (
            <Card
              key={lead.id}
              variant="outlined"
              sx={{
                mb: 2,
                borderColor: "grey.200",
                "&:hover": { boxShadow: 2 },
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography fontWeight={600}>{lead.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {lead.company}
                    </Typography>
                  </Box>
                  <Chip
                    label={lead.status}
                    size="small"
                    sx={{
                      bgcolor: getStatusColor(lead.status).bg,
                      color: getStatusColor(lead.status).color,
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Stack spacing={0.5} mb={1}>
                  <Button
                    startIcon={<Phone size={16} />}
                    href={`tel:${lead.phone}`}
                    sx={{ color: "primary.main", textTransform: "none" }}
                  >
                    {lead.phone}
                  </Button>
                  <Button
                    startIcon={<Mail size={16} />}
                    href={`mailto:${lead.email}`}
                    sx={{ color: "primary.main", textTransform: "none" }}
                  >
                    {lead.email}
                  </Button>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Priority:{" "}
                  <Chip
                    label={lead.priority}
                    size="small"
                    sx={{
                      bgcolor: getPriorityColor(lead.priority).bg,
                      color: getPriorityColor(lead.priority).color,
                      fontWeight: 600,
                    }}
                  />
                </Typography>

                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Value: ${lead.leadValue}
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: "primary.light",
                    "&:hover": {
                      bgcolor: "primary.50",
                      borderColor: "primary.main",
                    },
                  }}
                  onClick={() => onViewDetails(lead)}
                  startIcon={<Eye size={16} />}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Pagination */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
          px: 3,
          py: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing{" "}
          {leads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
          {Math.min(currentPage * itemsPerPage, totalLeads)} of {totalLeads} leads
        </Typography>

        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
          size="small"
        />
      </Box>
    </Paper>
  );
}
