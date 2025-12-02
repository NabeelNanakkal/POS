"use client"

import React, { useState } from "react"
import { AppBar, Toolbar, Box, Typography, Button, Chip, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material"
import { Phone, Pause, LogOut, Settings } from "lucide-react"
import { useDispatch } from 'react-redux'
import { userLogOut } from 'container/LoginContainer/slice'

export default function TelecallerHeader() {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        background: "linear-gradient(90deg, #0f172a, #1e293b)",
        borderBottom: "1px solid rgba(34,211,238,0.2)",
        boxShadow: "none",
        zIndex: 1000,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "64px",
        }}
      >
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Phone size={20} color="white" />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "white" }}>CallPro</Typography>
            <Typography sx={{ fontSize: 11, color: "#22d3ee" }}>Telecaller Dashboard</Typography>
          </Box>
        </Box>

        {/* Center Section */}
        <Box display="flex" alignItems="center" gap={4}>
          <Box textAlign="center">
            <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Status</Typography>
            <Chip
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80" }} />
                  Active
                </Box>
              }
              sx={{
                fontSize: 11,
                mt: 0.5,
                backgroundColor: "rgba(34,197,94,0.1)",
                color: "#4ade80",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            />
          </Box>
          <Box textAlign="center">
            <Typography sx={{ fontSize: 11, color: "#9ca3af" }}>Session Time</Typography>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "white" }}>2h 34m</Typography>
          </Box>
        </Box>

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <Button
            startIcon={<Pause size={14} />}
            sx={{
              border: "1px solid rgba(234,179,8,0.3)",
              color: "#facc15",
              fontSize: 12,
              textTransform: "none",
              "&:hover": { background: "rgba(234,179,8,0.1)" },
            }}
          >
            Pause
          </Button>
          <Button
            sx={{
              border: "1px solid #475569",
              color: "#d1d5db",
              minWidth: 36,
              "&:hover": { background: "#334155" },
            }}
          >
            <Settings size={16} />
          </Button>
          {/* End Session / Logout dropdown */}
          <TelecallerLogout />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

function TelecallerLogout() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(userLogOut());
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{ border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', width: 36, height: 36 }}
      >
        <LogOut size={16} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          End Session
        </MenuItem>
      </Menu>
    </>
  );
}
