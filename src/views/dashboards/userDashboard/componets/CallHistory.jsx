import React from "react";
import { Card, Box, Typography, Chip } from "@mui/material";
import { Phone, Clock } from "lucide-react";

export default function CallHistory() {
  const history = [
    { name: "Priya Singh", time: "2:45 PM", duration: "3m 22s", outcome: "Interested" },
    { name: "Amit Patel", time: "2:15 PM", duration: "1m 45s", outcome: "Not Interested" },
    { name: "Neha Sharma", time: "1:50 PM", duration: "5m 10s", outcome: "Converted" },
    { name: "Vikram Singh", time: "1:20 PM", duration: "2m 30s", outcome: "No Answer" },
  ];

  const getChipStyle = (outcome) => {
    if (outcome === "Converted")
      return { bg: "rgba(34,197,94,0.1)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.3)" };
    if (outcome === "Interested")
      return { bg: "rgba(59,130,246,0.1)", color: "#2563eb", border: "1px solid rgba(59,130,246,0.3)" };
    return { bg: "rgba(107,114,128,0.1)", color: "#6b7280", border: "1px solid rgba(107,114,128,0.3)" };
  };

  return (
    <Card
      sx={{
        p: 2.5,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        bgcolor: "white",
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            background: "linear-gradient(135deg, #3b82f6, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Phone size={16} color="white" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Call History
        </Typography>
      </Box>

      <Box display="flex" flexDirection="column" gap={1.5}>
        {history.map((call, i) => {
          const style = getChipStyle(call.outcome);
          return (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1.5,
                borderRadius: 2,
                border: "1px solid #E5E7EB",
                bgcolor: "#F9FAFB",
                "&:hover": { borderColor: "#CBD5E1", bgcolor: "white" },
                transition: "0.25s",
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {call.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.8}>
                  <Clock size={12} color="#9ca3af" />
                  <Typography variant="caption" color="text.secondary">
                    {call.time} • {call.duration}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={call.outcome}
                size="small"
                sx={{
                  bgcolor: style.bg,
                  color: style.color,
                  border: style.border,
                  fontSize: 11,
                  fontWeight: 500,
                }}
              />
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
