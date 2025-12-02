import React, { useState } from "react"
import { Card, Box, Typography, Button, IconButton } from "@mui/material"
import { Phone, Mail, MapPin, User, ArrowRight, Plus } from "lucide-react"
import AddLeadModal from './AddLeadModal';

const leads = [
  {
    id: 1,
    name: "Acme Corp",
    source: "Website",
    status: "Qualified",
    icon: <Phone size={16} />,
    color: "#10B981",
  },
  {
    id: 2,
    name: "Tech Solutions",
    source: "Referral",
    status: "In Progress",
    icon: <Mail size={16} />,
    color: "#06B6D4",
  },
  {
    id: 3,
    name: "Global Industries",
    source: "LinkedIn",
    status: "Proposal",
    icon: <MapPin size={16} />,
    color: "#F97316",
  },
  {
    id: 4,
    name: "StartUp Inc",
    source: "Cold Call",
    status: "Contacted",
    icon: <User size={16} />,
    color: "#EC4899",
  },
  {
    id: 5,
    name: "Enterprise Ltd",
    source: "Website",
    status: "Qualified",
    icon: <Phone size={16} />,
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Digital Agency",
    source: "Referral",
    status: "In Progress",
    icon: <User size={16} />,
    color: "#8B5CF6",
  },
]

export default function LeadsList() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        backgroundImage:
          "linear-gradient(145deg, rgba(241,245,249,0.9), rgba(255,255,255,0.9))",
        boxShadow: 2,
        transition: "0.3s",
        "&:hover": { borderColor: "#06B6D4" },
      }}
    >
      <Box sx={{ p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Recent Leads
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last 6 leads added
          </Typography>
        </Box>
        <Box display="flex" gap={1} alignItems="center">
          <IconButton
            size="small"
            onClick={handleOpen}
            sx={{ width: 36, height: 36 }}
          >
            <Plus size={14} />
          </IconButton>

          <AddLeadModal open={open} onClose={handleClose} onAdd={() => {}} />

          <Button
            size="small"
            endIcon={<ArrowRight size={14} />}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#06B6D4",
            "&:hover": { color: "#0891B2", background: "transparent" },
          }}
        >
          View all
        </Button>
        </Box>
        </Box>

      <Box sx={{ p: 2, pt: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        {leads.map((lead) => (
          <Box
            key={lead.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              transition: "0.3s",
              "&:hover": { borderColor: "#999", transform: "scale(1.01)" },
              backgroundImage: `linear-gradient(90deg, ${lead.color}15, ${lead.color}05)`,
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} flex={1}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: lead.color,
                  bgcolor: `${lead.color}20`,
                }}
              >
                {lead.icon}
              </Box>
              <Box>
                <Typography variant="body2" fontWeight={600}>
                  {lead.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {lead.source}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                px: 1.5,
                py: 0.5,
                borderRadius: "9999px",
                bgcolor: "rgba(100,116,139,0.1)",
                color: "text.primary",
              }}
            >
              {lead.status}
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
