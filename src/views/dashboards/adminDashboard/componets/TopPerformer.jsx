import React from "react";
import { Card, Box, Typography, LinearProgress } from "@mui/material";
import { Award, Zap } from "lucide-react";

export default function TopPerformer() {
  return (
    <Card
      sx={{
        p: 3,
        background: "linear-gradient(to bottom right, #F8FAFC, #F1F5F9)",
        position: "relative",
        overflow: "hidden",
        "&:hover": { borderColor: "#06b6d4", boxShadow: "0 0 10px rgba(6,182,212,0.3)" },
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #FACC15, #F97316)",
          }}
        >
          <Award size={16} color="white" />
        </Box>
        <Typography fontWeight="bold">Top Performer</Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            background: "linear-gradient(to bottom right, #60A5FA, #2563EB)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
            boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
          }}
        >
          RK
        </Box>
        <Box>
          <Typography fontWeight="600" fontSize={14}>Rajesh Kumar</Typography>
          <Typography fontSize={12} color="text.secondary">Telecaller • Team Lead</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          background: "linear-gradient(to right, rgba(16,185,129,0.1), rgba(16,185,129,0.05))",
          borderRadius: 2,
          p: 2,
          border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12} color="text.secondary">Calls Today</Typography>
          <Typography fontWeight="bold">28</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography fontSize={12} color="text.secondary">Conversions</Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Zap size={14} color="#10B981" />
            <Typography fontWeight="bold" color="#10B981">5</Typography>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={65}
          sx={{
            height: 6,
            borderRadius: 3,
            mt: 1,
            backgroundColor: "#E2E8F0",
            "& .MuiLinearProgress-bar": {
              background: "linear-gradient(to right, #34D399, #059669)",
            },
          }}
        />
      </Box>
    </Card>
  );
}
