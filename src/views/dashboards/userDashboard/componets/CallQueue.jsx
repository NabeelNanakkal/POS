import React from "react";
import { Card, Box, Typography, Button, Chip, Avatar, Grid } from "@mui/material";
import { Phone, MapPin, Clock } from "lucide-react";

export default function CallQueue() {
  const leads = [
    {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      city: "Mumbai",
      priority: "High",
      lastContact: "2 days ago",
      notes: "Interested in premium plan",
    },
    {
      name: "Priya Singh",
      phone: "+91 87654 32109",
      city: "Delhi",
      priority: "Medium",
      lastContact: "5 days ago",
      notes: "Follow-up required",
    },
    {
      name: "Amit Patel",
      phone: "+91 76543 21098",
      city: "Bangalore",
      priority: "High",
      lastContact: "Today",
      notes: "Callback requested",
    },
  ];

  const getPriorityColor = (priority) =>
    priority === "High"
      ? { color: "#ef4444", bg: "#fee2e2" }
      : { color: "#f59e0b", bg: "#fef3c7" };

  return (
    <Card
      sx={{
        p: 2.5,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: 3,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Call Queue
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {leads.map((lead, i) => {
          const { color, bg } = getPriorityColor(lead.priority);
          return (
            <Box
              key={i}
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                backgroundColor: "#fafafa",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      backgroundColor: "#e0f2fe",
                      color: "#0284c7",
                      fontWeight: "bold",
                    }}
                  >
                    {lead.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </Avatar>
                  <Box>
                    <Typography fontSize={13} fontWeight={600}>
                      {lead.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {lead.phone}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={lead.priority}
                  size="small"
                  sx={{
                    backgroundColor: bg,
                    color,
                    fontWeight: 600,
                    fontSize: 11,
                  }}
                />
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <MapPin size={14} color="#6b7280" />
                    <Typography variant="caption" color="text.secondary">
                      {lead.city}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Clock size={14} color="#6b7280" />
                    <Typography variant="caption" color="text.secondary">
                      {lead.lastContact}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                {lead.notes}
              </Typography>

              <Box display="flex" gap={1} mt={2}>
                <Button
                  fullWidth
                  size="small"
                  variant="contained"
                  startIcon={<Phone size={14} />}
                  sx={{
                    backgroundColor: "#0284c7",
                    textTransform: "none",
                    fontSize: 12,
                    "&:hover": { backgroundColor: "#0369a1" },
                  }}
                >
                  Call Now
                </Button>
                <Button
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: 12,
                    textTransform: "none",
                    borderColor: "#d1d5db",
                    "&:hover": { backgroundColor: "#f3f4f6" },
                  }}
                >
                  Skip
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
