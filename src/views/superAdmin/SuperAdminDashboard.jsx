import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import axios from 'axios';
import config from 'config';
import { tokenManager } from 'utils/tokenManager';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStoreAdmins: 0,
    activeStoreAdmins: 0,
    totalStores: 0,
    activeStores: 0
  });
  const [storeAdmins, setStoreAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchStoreAdmins();
  }, []);

  const fetchStats = async () => {
    try {
      const token = tokenManager.getAccessToken();
      const response = await axios.get(`${config.ip}/super-admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchStoreAdmins = async () => {
    try {
      setLoading(true);
      const token = tokenManager.getAccessToken();
      const response = await axios.get(`${config.ip}/super-admin/store-admins?limit=10`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.data?.storeAdmins) {
        setStoreAdmins(response.data.data.storeAdmins);
      }
    } catch (error) {
      console.error('Failed to fetch store admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, color = 'primary' }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {title}
        </Typography>
        <Typography variant="h2" component="div" color={color}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={gridSpacing}>
        {/* Header */}
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Super Admin Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage store admins and view system-wide statistics
          </Typography>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Store Admins"
            value={stats.totalStoreAdmins}
            subtitle={`${stats.activeStoreAdmins} active`}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Store Admins"
            value={stats.activeStoreAdmins}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Stores"
            value={stats.totalStores}
            subtitle={`${stats.activeStores} active`}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Stores"
            value={stats.activeStores}
            color="warning.main"
          />
        </Grid>

        {/* Store Admins Table */}
        <Grid item xs={12}>
          <MainCard
            title="Store Admins"
            secondary={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  // TODO: Open create store admin dialog
                  console.log('Create store admin');
                }}
              >
                Create Store Admin
              </Button>
            }
          >
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Stores</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : storeAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No store admins found
                      </TableCell>
                    </TableRow>
                  ) : (
                    storeAdmins.map((admin) => (
                      <TableRow key={admin._id}>
                        <TableCell>{admin.username}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>{admin.storeCount || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={admin.isActive ? 'Active' : 'Inactive'}
                            color={admin.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => {
                              // TODO: View store admin details
                              console.log('View admin:', admin._id);
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              // TODO: Edit store admin
                              console.log('Edit admin:', admin._id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <MainCard title="Quick Actions">
            <Grid container spacing={2}>
              <Grid item>
                <Button variant="outlined" startIcon={<AddIcon />}>
                  Create Store Admin
                </Button>
              </Grid>
              <Grid item>
                <Button variant="outlined" startIcon={<VisibilityIcon />}>
                  View All Stores
                </Button>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
