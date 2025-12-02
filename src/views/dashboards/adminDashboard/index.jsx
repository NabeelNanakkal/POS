import React from "react";
import { Box, Grid } from "@mui/material";
import DashboardHeader from "layout/DashboardHeader";
import LeadsOverview from "./componets/LeadsOverview";
import LeadsMetrics from "./componets/LeadsMetrics";
import ConversionFunnel from "./componets/ConversionFunnel";
import DailyCallSummary from "./componets/DailyCallSummary";
import TopPerformer from "./componets/TopPerformer";
import PendingFollowups from "./componets/PendingFollowups";
import LeadsList from "./componets/LeadsList";

export default function Dashboard() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
      }}
    >
  {/* Header */}
  <DashboardHeader />

      {/* Main Section (No Padding) */}
      <Box
        component="main"
        sx={{
          width: "100%",
          flex: 1,
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
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              flexGrow: 1,
            }}
          >
            <LeadsOverview />
            <LeadsMetrics />
            <ConversionFunnel />
          </Grid>

          {/* -------- Column 2 -------- */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              flexGrow: 1,
            }}
          >
            <DailyCallSummary />
            <TopPerformer />
          </Grid>

          {/* -------- Column 3 -------- */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              flexGrow: 1,
            }}
          >
            <LeadsList />
            <PendingFollowups />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
