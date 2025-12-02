import React from "react";
import { Card, Box, Typography, Grid, Chip } from "@mui/material";
import { Trophy, Star, Flame, Crown } from "lucide-react";

export default function Achievements() {
  const achievements = [
    { icon: Trophy, label: "Top Performer", description: "50 calls today", unlocked: true, gradient: "linear-gradient(135deg, #facc15, #fb923c)" },
    { icon: Flame, label: "On Fire", description: "5 conversions", unlocked: true, gradient: "linear-gradient(135deg, #f87171, #fb7185)" },
    { icon: Star, label: "Rising Star", description: "20% conversion", unlocked: false, gradient: "linear-gradient(135deg, #60a5fa, #22d3ee)" },
    { icon: Crown, label: "Legend", description: "100 conversions", unlocked: false, gradient: "linear-gradient(135deg, #a855f7, #ec4899)" },
  ];

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
      <Box display="flex" alignItems="center" gap={1.2} mb={2}>
        <Trophy size={18} color="#facc15" />
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          Achievements
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {achievements.map((a, i) => {
          const Icon = a.icon;
          return (
            <Grid item xs={6} key={i}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: a.unlocked ? "1px solid #C7F9CC" : "1px solid #E5E7EB",
                  bgcolor: a.unlocked ? "#F0FDF4" : "#F9FAFB",
                  opacity: a.unlocked ? 1 : 0.7,
                  transition: "0.3s",
                }}
              >
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: 1.5,
                    background: a.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1,
                  }}
                >
                  <Icon size={16} color="white" />
                </Box>
                <Typography variant="body2" fontWeight={600} color="text.primary">
                  {a.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {a.description}
                </Typography>
                {a.unlocked && (
                  <Chip
                    label="Unlocked"
                    size="small"
                    sx={{
                      mt: 1,
                      bgcolor: "rgba(34,197,94,0.1)",
                      color: "#16a34a",
                      border: "1px solid rgba(34,197,94,0.3)",
                      fontSize: 10,
                      fontWeight: 500,
                    }}
                  />
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
}
