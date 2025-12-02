import React from "react";
import { Card, Box, Typography, Button, Divider } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { stage: "Leads", count: 2847 },
  { stage: "Contacted", count: 2100 },
  { stage: "Qualified", count: 1547 },
  { stage: "Proposal", count: 892 },
  { stage: "Converted", count: 342 },
];

export default function ConversionFunnel() {
  return (
    <Card
      sx={{
        p: 3,
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        borderRadius: 3,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Conversion Funnel
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sales pipeline visualization
          </Typography>
        </Box>
        <Button
          size="small"
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            color: "#2563EB",
            fontWeight: 600,
            "&:hover": { color: "#1E40AF", background: "transparent" },
          }}
        >
          Weekly ▼
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Chart */}
      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
              dataKey="stage"
              stroke="#6B7280"
              style={{ fontSize: "12px", fontWeight: 500 }}
            />
            <YAxis
              stroke="#6B7280"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#111827", fontWeight: 600 }}
              formatter={(value) => [`${value}`, "Count"]}
            />
            <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
}
