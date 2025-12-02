import React, { useState } from "react";
import { Card, Box, Typography, Avatar, IconButton } from "@mui/material";
import { Plus } from "lucide-react";
import AddTelecallerModal from './AddTelecallerModal';

const members = [
  { id: 1, name: "RK", color: "#3B82F6" },
  { id: 2, name: "SM", color: "#8B5CF6" },
  { id: 3, name: "AJ", color: "#EF4444" },
  { id: 4, name: "PD", color: "#FACC15" },
];

export default function TeamMembers() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Card sx={{ p: 3, border: "none" }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>Team Members</Typography>
      <Box display="flex" gap={2}>
        <IconButton
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: "#111827",
            color: "white",
            "&:hover": { bgcolor: "#1F2937" },
          }}
          onClick={handleOpen}
        >
          <Plus size={22} />
        </IconButton>

        <AddTelecallerModal open={open} onClose={handleClose} />

        {members.map((m) => (
          <Avatar
            key={m.id}
            sx={{
              width: 48,
              height: 48,
              bgcolor: m.color,
              fontWeight: "600",
              fontSize: 14,
              cursor: "pointer",
              "&:hover": { opacity: 0.85 },
            }}
          >
            {m.name}
          </Avatar>
        ))}
      </Box>
    </Card>
  );
}
