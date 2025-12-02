"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LeadsFilters from "./componets/LeadsFilters";
import LeadsTable from "./componets/LeadsTable";
import LeadDetailModal from "./componets/LeadDetailModal";
import { STATIC_LEADS_DATA } from "./componets/staticLeadsData";

export default function AdminLeads() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [leads, setLeads] = useState(STATIC_LEADS_DATA);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    dateRange: "all",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "assignedDate",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter + Search Logic
  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filters.status === "all" || lead.status === filters.status;
      const matchesPriority =
        filters.priority === "all" || lead.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Sorting
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue)
        return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue)
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [leads, searchTerm, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleViewDetails = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleUpdateLead = (updatedLead) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    setSelectedLead(updatedLead);
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
        }}
      >
        {/* Header (Paper style like Team Members) */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
            color: 'white',
          }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            alignItems={isMobile ? 'flex-start' : 'center'}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700}>
                Assigned Leads
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage and track your assigned leads efficiently
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Stats Cards */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Leads"
              value={leads.length}
              color="#1976d2"
              bg="rgba(25, 118, 210, 0.05)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Contacted"
              value={leads.filter((l) => l.status === "contacted").length}
              color="#2e7d32"
              bg="rgba(46, 125, 50, 0.05)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Interested"
              value={leads.filter((l) => l.status === "interested").length}
              color="#6a1b9a"
              bg="rgba(106, 27, 154, 0.05)"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Follow-up"
              value={leads.filter((l) => l.status === "follow-up").length}
              color="#ef6c00"
              bg="rgba(239, 108, 0, 0.05)"
            />
          </Grid>
        </Grid>

        {/* Filters */}
        <LeadsFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={setFilters}
          onReset={() => {
            setSearchTerm("");
            setFilters({ status: "all", priority: "all", dateRange: "all" });
            setCurrentPage(1);
          }}
        />

        {/* Table */}
        <Box sx={{ mt: 3 }}>
          <LeadsTable
            leads={paginatedLeads}
            onViewDetails={handleViewDetails}
            onSort={handleSort}
            sortConfig={sortConfig}
            totalLeads={filteredLeads.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </Box>
      </Box>

      {/* Modal */}
      {isModalOpen && selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUpdateLead}
        />
      )}
    </Box>
  );
}

// ✅ Stat Card Component
function StatCard({ label, value, color, bg }) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: bg,
        color: color,
        boxShadow: "none",
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ opacity: 0.7 }}
        >
          {label}
        </Typography>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{ mt: 1 }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
