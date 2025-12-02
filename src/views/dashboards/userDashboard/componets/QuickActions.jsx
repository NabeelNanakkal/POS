"use client"

import React from "react"
import { Card, Box, Typography, Button } from "@mui/material"
import { MessageSquare, Calendar, FileText, Share2 } from "lucide-react"

export default function QuickActions() {
  const actions = [
    { icon: MessageSquare, label: "Send SMS" },
    { icon: Calendar, label: "Schedule" },
    { icon: FileText, label: "Add Note" },
    { icon: Share2, label: "Share Lead" },
  ]

  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475569", mb: 1.5 }}>
        Quick Actions
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1.5}>
        {actions.map((action, idx) => {
          const Icon = action.icon
          return (
            <Button
              key={idx}
              startIcon={<Icon size={16} />}
              sx={{
                textTransform: "none",
                fontSize: 13,
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                backgroundColor: "#f8fafc",
                justifyContent: "flex-start",
                height: 38,
                "&:hover": {
                  backgroundColor: "#e2e8f0",
                },
              }}
            >
              {action.label}
            </Button>
          )
        })}
      </Box>
    </Card>
  )
}
