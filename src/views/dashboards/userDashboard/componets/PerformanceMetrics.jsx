"use client"

import React from "react"
import { Card, Box, Typography } from "@mui/material"
import { TrendingUp, Clock, Zap } from "lucide-react"

export default function PerformanceMetrics() {
  const metrics = [
    { label: "Conversion Rate", value: "16%", change: "+2%", icon: TrendingUp },
    { label: "Avg Call Time", value: "4m 32s", change: "+45s", icon: Clock },
    { label: "Calls/Hour", value: "12", change: "+3", icon: Zap },
  ]

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        return (
          <Card
            key={idx}
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              borderRadius: 2,
              p: 2,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color="#0f172a" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, color: "#64748b" }}>{metric.label}</Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                    {metric.value}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>
                {metric.change}
              </Typography>
            </Box>
          </Card>
        )
      })}
    </Box>
  )
}
