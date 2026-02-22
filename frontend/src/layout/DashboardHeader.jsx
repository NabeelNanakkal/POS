import React from 'react'
import { Paper, Stack, Box, Typography, Button, useTheme, useMediaQuery } from '@mui/material'
import { LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { userLogOut } from 'container/auth/slice'

export default function DashboardHeader() {
  const dispatch = useDispatch()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Try to read user from localStorage, fallback to empty object
  let user = {}
  try {
    user = JSON.parse(localStorage.getItem('user')) || {}
  } catch (e) {
    user = {}
  }
  const name = user?.name || user?.firstName || user?.email || 'User'
  const role = user?.role || user?.tenantRole || 'Dashboard'

  const handleLogout = () => {
    dispatch(userLogOut())
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
        color: 'white',
      }}
    >
      <Stack
        direction={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {`Welcome, ${name}`}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {role}
          </Typography>
        </Box>

        <Box>
          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<LogOut />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              borderRadius: 2,
              bgcolor: 'white',
              color: theme.palette.primary.main,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Stack>
    </Paper>
  )
}
