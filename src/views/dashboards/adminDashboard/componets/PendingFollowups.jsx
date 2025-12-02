import React from "react";
import { Card, Box, Typography, Button } from "@mui/material";
import { AlertCircle, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function PendingFollowups() {
  return (
    <Card
      sx={{
        p: 3,
        border: "1px solid rgba(239,68,68,0.3)",
        background: "linear-gradient(to bottom right, rgba(239,68,68,0.1), rgba(239,68,68,0.05))",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          borderColor: "rgba(239,68,68,0.6)",
          boxShadow: "0 0 10px rgba(239,68,68,0.2)",
        },
      }}
    >
      <Box display="flex" gap={2}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: "linear-gradient(to bottom right, #F87171, #DC2626)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
          }}
        >
          <AlertCircle size={18} color="white" />
        </Box>

        <Box flex={1}>
          <Typography fontWeight="bold" color="#7F1D1D" mb={0.5}>
            Pending Follow-ups
          </Typography>
          <Typography fontSize={12} color="#991B1B" mb={1.5}>
            You have 23 leads waiting for follow-up calls
          </Typography>

          <Box mb={2}>
            <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
              <Clock size={13} color="#991B1B" />
              <Typography fontSize={12} color="#991B1B">
                12 overdue (today)
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              <CheckCircle size={13} color="#991B1B" />
              <Typography fontSize={12} color="#991B1B">
                11 scheduled (tomorrow)
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            fullWidth
            sx={{
              background: "linear-gradient(to right, #EF4444, #DC2626)",
              color: "white",
              fontSize: 12,
              textTransform: "none",
              py: 0.8,
              "&:hover": {
                background: "linear-gradient(to right, #DC2626, #B91C1C)",
                boxShadow: "0 0 10px rgba(239,68,68,0.3)",
              },
            }}
            endIcon={<ArrowRight size={14} />}
          >
            View Follow-ups
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
