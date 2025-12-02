import React from "react"
import { Card, Box, Typography } from "@mui/material"
import { Phone, Clock, CheckCircle, TrendingUp } from "lucide-react"

export default function DailyCallSummary() {
  const stats = [
    {
      label: "Total Calls",
      value: "156",
      icon: <Phone size={18} color="#fff" />,
      gradient: "linear-gradient(135deg, #34D399, #059669)",
    },
    {
      label: "Avg Duration",
      value: "4m 32s",
      icon: <Clock size={18} color="#fff" />,
      gradient: "linear-gradient(135deg, #22D3EE, #2563EB)",
    },
    {
      label: "Conversion Rate",
      value: "12%",
      icon: <CheckCircle size={18} color="#fff" />,
      gradient: "linear-gradient(135deg, #FB923C, #DC2626)",
    },
  ]

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: 2,
        backgroundImage:
          "linear-gradient(145deg, rgba(241,245,249,0.9), rgba(255,255,255,0.9))",
        transition: "0.3s",
        "&:hover": { borderColor: "#10B981" },
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={1}>
          Daily Call Summary
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2, pt: 0 }}>
        {stats.map((item, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.02), rgba(0,0,0,0.01))`,
              transition: "0.3s",
              "&:hover": { borderColor: "#999" },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: item.gradient,
                boxShadow: 2,
              }}
            >
              {item.icon}
            </Box>

            <Box flex={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {item.value}
              </Typography>
            </Box>

            <TrendingUp size={16} color="#10B981" />
          </Box>
        ))}
      </Box>
    </Card>
  )
}
