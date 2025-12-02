import React from "react"
import { Card, Box, Typography, IconButton } from "@mui/material"
import { MoreVertical, TrendingUp, Users, CheckCircle, XCircle } from "lucide-react"

const metrics = [
  {
    label: "Converted",
    amount: "342",
    percentage: 12,
    icon: <CheckCircle size={18} color="#10B981" />,
    color: "#10B981",
  },
  {
    label: "In Progress",
    amount: "1,205",
    percentage: 28,
    icon: <Users size={18} color="#06B6D4" />,
    color: "#06B6D4",
  },
  {
    label: "Dropped",
    amount: "1,300",
    percentage: 45,
    icon: <XCircle size={18} color="#EF4444" />,
    color: "#EF4444",
  },
]

export default function LeadsMetrics() {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 2,
        backgroundImage:
          "linear-gradient(145deg, rgba(241,245,249,0.9), rgba(255,255,255,0.9))",
        p: 2,
        transition: "0.3s",
        "&:hover": { borderColor: "#06B6D4" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Lead Status Overview
        </Typography>
        <IconButton size="small">
          <MoreVertical size={16} />
        </IconButton>
      </Box>

      <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr 1fr" }} gap={2}>
        {metrics.map((m, i) => (
          <Box
            key={i}
            sx={{
              p: 2,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundImage: `linear-gradient(to right, ${m.color}15, ${m.color}05)`,
              transition: "0.3s",
              "&:hover": { borderColor: m.color },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundImage: `linear-gradient(135deg, ${m.color}30, ${m.color}10)`,
                }}
              >
                {m.icon}
              </Box>
              <IconButton size="small">
                <MoreVertical size={14} />
              </IconButton>
            </Box>

            <Typography variant="caption" color="text.secondary" mb={0.5}>
              {m.label}
            </Typography>

            <Box display="flex" alignItems="end" justifyContent="space-between">
              <Typography fontSize={20} fontWeight={700}>
                {m.amount}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                color={m.color}
                fontSize={12}
                fontWeight={600}
                gap={0.5}
              >
                <TrendingUp size={12} /> {m.percentage}%
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  )
}
