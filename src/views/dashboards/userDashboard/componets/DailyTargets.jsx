import React from "react";
import { Card, LinearProgress, Box, Typography } from "@mui/material";
import { Target, TrendingUp, Phone, CheckCircle } from "lucide-react";

export default function DailyTargets() {
  const targets = [
    { label: "Calls Target", current: 45, target: 50, icon: Phone, color: "#3b82f6" },
    { label: "Conversions", current: 8, target: 10, icon: CheckCircle, color: "#22c55e" },
    { label: "Avg Duration", current: 4.2, target: 5, icon: TrendingUp, color: "#a855f7", unit: "min" },
  ];

  return (
    <Card
      sx={{
        p: 2.5,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        borderRadius: 3,
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: 2,
            backgroundColor: "#e0f2fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Target size={16} color="#0284c7" />
        </Box>
        <Typography variant="subtitle1" fontWeight={600}>
          Today's Targets
        </Typography>
      </Box>

      {targets.map((t, i) => {
        const Icon = t.icon;
        const percent = (t.current / t.target) * 100;
        return (
          <Box key={i} mb={2.5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: 1,
                    backgroundColor: `${t.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={12} color={t.color} />
                </Box>
                <Typography fontSize={12} color="text.secondary">
                  {t.label}
                </Typography>
              </Box>
              <Typography fontSize={12} fontWeight={600}>
                {t.current}
                {t.unit || ""} / {t.target}
                {t.unit || ""}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(percent, 100)}
              sx={{
                height: 6,
                borderRadius: 3,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: t.color,
                },
              }}
            />
          </Box>
        );
      })}
    </Card>
  );
}
