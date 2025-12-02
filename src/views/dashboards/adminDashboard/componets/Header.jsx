import React, { useState } from "react"
import { AppBar, Toolbar, Box, Typography, IconButton, Menu, MenuItem, ListItemIcon } from "@mui/material"
import { Phone, Search, Bell, LogOut, Settings, RotateCcw } from "lucide-react"
import { useDispatch } from 'react-redux'
import { userLogOut } from 'container/LoginContainer/slice'

export default function Header() {
  return (
    // <AppBar
    //   position="sticky"
    //   elevation={0}
    //   sx={{
    //     top: 0,
    //     px: 3,
    //     py: 1,
    //     bgcolor: "rgba(15,23,42,0.9)",
    //     backgroundImage: "linear-gradient(90deg, #0f172a, #1e293b, #0f172a)",
    //     borderBottom: "1px solid rgba(51,65,85,0.5)",
    //     backdropFilter: "blur(12px)",
    //   }}
    // >
    //   <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: "48px" }}>
    //     {/* Left Section */}
    //     <Box display="flex" alignItems="center" gap={1.5}>
    //       <Box
    //         sx={{
    //           width: 40,
    //           height: 40,
    //           borderRadius: 2,
    //           backgroundImage: "linear-gradient(135deg, #06B6D4, #2563EB)",
    //           display: "flex",
    //           alignItems: "center",
    //           justifyContent: "center",
    //         }}
    //       >
    //         <Typography variant="subtitle1" sx={{ color: "#fff", fontWeight: 700 }}>
    //           CRM
    //         </Typography>
    //       </Box>
    //       <Typography
    //         variant="h6"
    //         sx={{
    //           fontWeight: 700,
    //           background: "linear-gradient(90deg, #06B6D4, #3B82F6)",
    //           WebkitBackgroundClip: "text",
    //           color: "transparent",
    //         }}
    //       >
    //         LeadFlow
    //       </Typography>
    //     </Box>

    //     {/* Right Section */}
    //     <Box display="flex" alignItems="center" gap={0.5}>
    //       <Button
    //         variant="outlined"
    //         size="small"
    //         sx={{
    //           textTransform: "none",
    //           fontSize: "0.75rem",
    //           color: "#E2E8F0",
    //           borderColor: "rgba(71,85,105,0.7)",
    //           backgroundColor: "rgba(30,41,59,0.6)",
    //           "&:hover": {
    //             bgcolor: "rgba(51,65,85,0.8)",
    //             borderColor: "#475569",
    //             color: "#fff",
    //           },
    //         }}
    //       >
    //         Select Team
    //       </Button>

    //       {[Search, Bell, RotateCcw, Settings].map((Icon, i) => (
    //         <IconButton
    //           key={i}
    //           sx={{
    //             color: "#CBD5E1",
    //             "&:hover": { color: "#fff", bgcolor: "rgba(71,85,105,0.3)" },
    //             width: 36,
    //             height: 36,
    //           }}
    //         >
    //           <Icon size={16} />
    //         </IconButton>
    //       ))}
    //     </Box>
    //   </Toolbar>
    // </AppBar>
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
          
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "white" }}>Welocome</Typography>
            <Typography sx={{ fontSize: 11, color: "#22d3ee" }}>Admin Dashboard</Typography>
          </Box>
        </Box>

     

        {/* Right Section */}
        <Box display="flex" alignItems="center" gap={0.5}>

          {[Search, Bell, RotateCcw, Settings].map((Icon, i) => (
            <IconButton
              key={i}
              sx={{
                color: "#CBD5E1",
                "&:hover": { color: "#fff", bgcolor: "rgba(71,85,105,0.3)" },
                width: 36,
                height: 36,
              }}
            >
              <Icon size={16} />
            </IconButton>
          ))}

          {/* Logout dropdown */}
          <HeaderLogout />
        </Box>
      </Toolbar>
    </AppBar>
  )
}

function HeaderLogout() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // call existing logout action which the saga listens to
    dispatch(userLogOut());
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-controls={open ? 'header-logout-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleOpen}
        sx={{ color: "#CBD5E1", width: 36, height: 36 }}
      >
        <LogOut size={16} />
      </IconButton>
      <Menu
        id="header-logout-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
      >
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogOut size={16} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}


