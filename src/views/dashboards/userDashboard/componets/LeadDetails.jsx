import React from "react";
import { Card, Box, Typography, Chip, Button, Avatar } from "@mui/material";
import { Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";

export default function LeadDetails() {
  const lead = {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
    state: "Maharashtra",
    company: "Tech Solutions Pvt Ltd",
    designation: "Operations Manager",
    joinDate: "2024-01-15",
    status: "Interested",
    budget: "₹50,000 - ₹1,00,000",
    notes: "Interested in premium plan. Budget approved. Decision maker.",
  };

  return (
    <Card
      sx={{
        p: 2.5,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: 3,
      }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ width: 48, height: 48, backgroundColor: "#e0f2fe", color: "#0284c7" }}>RK</Avatar>
        <Box flexGrow={1}>
          <Typography fontSize={14} fontWeight={700}>
            {lead.name}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {lead.designation}
          </Typography>
        </Box>
        <Chip
          label={lead.status}
          size="small"
          sx={{
            backgroundColor: "#dcfce7",
            color: "#16a34a",
            fontWeight: 600,
            fontSize: 11,
          }}
        />
      </Box>

      <Box sx={{ fontSize: 12, color: "text.secondary" }}>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Mail size={14} color="#6b7280" /> {lead.email}
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Phone size={14} color="#6b7280" /> {lead.phone}
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <MapPin size={14} color="#6b7280" /> {lead.city}, {lead.state}
        </Box>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Calendar size={14} color="#6b7280" /> Added {lead.joinDate}
        </Box>
      </Box>

      <Box borderTop="1px solid #e5e7eb" mt={2} pt={2}>
        <Typography fontSize={12} fontWeight={600}>
          Budget
        </Typography>
        <Typography fontSize={13} fontWeight={700} color="#0284c7" mb={1}>
          {lead.budget}
        </Typography>
        <Typography fontSize={12} fontWeight={600}>
          Notes
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          {lead.notes}
        </Typography>
      </Box>

      <Button
        fullWidth
        startIcon={<FileText size={14} />}
        sx={{
          mt: 2,
          fontSize: 12,
          height: 32,
          backgroundColor: "#0284c7",
          color: "white",
          textTransform: "none",
          "&:hover": { backgroundColor: "#0369a1" },
        }}
      >
        Add Note
      </Button>
    </Card>
  );
}
