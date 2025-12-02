import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { TrendingUp, PhoneInTalk, EmojiEvents } from "@mui/icons-material";

export default function PersonalStats() {
  const stats = [
    { label: "Total Calls", value: "156", icon: <PhoneInTalk color="primary" /> },
    { label: "Conversion Rate", value: "18%", icon: <TrendingUp color="success" /> },
    { label: "Rank", value: "#3", icon: <EmojiEvents color="warning" /> },
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Personal Stats
        </Typography>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
          {stats.map((s, i) => (
            <Box key={i} textAlign="center" flex={1}>
              {s.icon}
              <Typography variant="h5" fontWeight="bold">
                {s.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
