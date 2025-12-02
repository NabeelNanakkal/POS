import React, { useState } from "react"
import { Card, Box, Typography, Button } from "@mui/material"
import { Upload, Plus, TrendingUp } from "lucide-react"
import { useDispatch } from "react-redux"
import ImportLeadsModal from "./ImportLeadsModal"
import AddLeadModal from "./AddLeadModal"

export default function LeadsOverview() {
  const [openImport, setOpenImport] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const dispatch = useDispatch()
  
  const handleImportComplete = () => {
    setOpenImport(false)
    // Refresh leads list
    // TODO: Add getLeads action and dispatch it here
  }

  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: 2,
        backgroundImage:
          "linear-gradient(145deg, rgba(241,245,249,0.9), rgba(255,255,255,0.9))",
        transition: "0.3s",
        "&:hover": { borderColor: "#06B6D4" },
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={500} mb={0.5}>
              Total Leads
            </Typography>
            <Box display="flex" alignItems="baseline" gap={1}>
              <Typography fontSize={28} fontWeight={700}>
                2,847
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                gap={0.5}
                color="#06B6D4"
                fontSize={12}
                fontWeight={600}
              >
                <TrendingUp size={14} /> +12.5%
              </Box>
            </Box>
          </Box>

          <Box display="flex" gap={1}>
            <Button
              sx={{
                fontSize: 12,
                textTransform: "none",
                background: "linear-gradient(to right, #06b6d4, #2563eb)",
                color: "#fff",
                px: 2.5,
                py: 1,
                "&:hover": {
                  background: "linear-gradient(to right, #0891b2, #1d4ed8)",
                  boxShadow: "0 0 8px rgba(6,182,212,0.4)",
                },
              }}
                onClick={() => setOpenImport(true)}

              startIcon={<Upload size={14} />}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              sx={{
                fontSize: 12,
                textTransform: "none",
                color: "#06B6D4",
                borderColor: "rgba(6,182,212,0.5)",
                px: 2.5,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(6,182,212,0.05)",
                  borderColor: "rgba(6,182,212,0.8)",
                },
              }}
              
              onClick={() => setOpenAdd(true)}
              startIcon={<Plus size={14} />}
            >
              Add Lead
            </Button>
          </Box>
        </Box>
      </Box>
      <ImportLeadsModal open={openImport} onClose={handleImportComplete} />
      <AddLeadModal open={openAdd} onClose={() => setOpenAdd(false)} onAdd={(data) => console.log(data)} />
    </Card>

  )
}
