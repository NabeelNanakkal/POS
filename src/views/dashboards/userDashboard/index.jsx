"use client";

import React from "react";
import { Box, Grid } from "@mui/material";
import DashboardHeader from "layout/DashboardHeader";
import DailyTargets from "./componets/DailyTargets";
import CallQueue from "./componets/CallQueue";
import QuickActions from "./componets/QuickActions";
import LeadDetails from "./componets/LeadDetails";
import PerformanceMetrics from "./componets/PerformanceMetrics";
import CallHistory from "./componets/CallHistory";
import Achievements from "./componets/Achievements";

export default function TelecallerDashboard() {
;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        width: "100%",
        overflowX: "hidden",
  
      }}
    >
  {/* Header */}
  <DashboardHeader />

      {/* Main Section */}
      <Box
        component="main"
        sx={{
          flex: 1,
          width: "100%",
          p: 0
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            m: 0,
            p: 0
          }}
        >
          {/* -------- Column 1 -------- */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <DailyTargets />
            <CallQueue />
          </Grid>

          {/* -------- Column 2 -------- */}
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <LeadDetails />
            <PerformanceMetrics />
            <QuickActions />
          </Grid>

          {/* -------- Column 3 -------- */}
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 3 },
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            <CallHistory />
            <Achievements />
          </Grid>
        </Grid>
      </Box>

      {/* Floating Quick Actions for Mobile */}
      {/* {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            left: 16,
            zIndex: 1200,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid",
            borderColor: "divider"
          }}
        >
          <QuickActions />
        </Box>
      )} */}
    </Box>
  );
}
