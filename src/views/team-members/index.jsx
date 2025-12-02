"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
  CircularProgress,
  Paper,
  useMediaQuery,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import {
  getTelecallers,
  createTelecaller,
  updateTelecaller,
  deleteTelecaller,
} from "container/AdminContainer/slice";
import { useTheme } from "@mui/material/styles";

const roles = ["PlatformAdmin", "TenantAdmin", "Telecaller"];

export default function TeamMembers() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { telecallers = [], loading, createdTelecaller } =
    useSelector((state) => state.admin || {});

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [current, setCurrent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "Telecaller",
    email: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(getTelecallers());
  }, [dispatch]);

  useEffect(() => {
    if (createdTelecaller) dispatch(getTelecallers());
  }, [createdTelecaller, dispatch]);

  const handleOpenCreate = () => {
    setForm({
      name: "",
      username: "",
      password: "",
      role: "Telecaller",
      email: "",
      phone: "",
    });
    setOpenCreate(true);
  };

  const handleOpenEdit = (member) => {
    setCurrent(member);
    setForm({ ...member, password: "" });
    setOpenEdit(true);
  };

  const handleOpenDelete = (member) => {
    setCurrent(member);
    setOpenDelete(true);
  };

  const handleCreate = () => {
    dispatch(createTelecaller({ body: form }));
    setOpenCreate(false);
  };

  const handleUpdate = async () => {
    if (!current) return;
    setSubmitting(true);
    dispatch(updateTelecaller({ id: current._id, body: form }));
    setOpenEdit(false);
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!current) return;
    setSubmitting(true);
    dispatch(deleteTelecaller({ id: current._id }));
    setOpenDelete(false);
    setSubmitting(false);
  };

  return (
    <Box
      sx={{
        // p: { xs: 2, md: 4 },
        background: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`,
          color: "white",
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent="space-between"
          spacing={2}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Team Members
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage telecallers and admin team members
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderRadius: 2,
              bgcolor: "white",
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Add Member
          </Button>
        </Stack>
      </Paper>

      {/* Table Section */}
      <Paper
        elevation={1}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Name", "Username", "Role", "Email", "Phone", "Actions"].map(
                  (col) => (
                    <TableCell
                      key={col}
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      {col}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {telecallers.map((t) => (
                <TableRow
                  key={t._id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.username}</TableCell>
                  <TableCell>{t.role}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenEdit(t)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDelete(t)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Create Dialog */}
      <Dialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={600}>Add New Member</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <FormGrid form={form} setForm={setForm} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight={600}>Edit Member</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <FormGrid form={form} setForm={setForm} isEdit />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenEdit(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle fontWeight={600}>Confirm Delete</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 1 }}>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{current?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenDelete(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={submitting}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function FormGrid({ form, setForm, isEdit = false }) {
  return (
    <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
      <TextField
        label="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        fullWidth
        required
      />
      <TextField
        label="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        fullWidth
        required={!isEdit}
        helperText={
          isEdit ? "Leave blank to keep existing password" : undefined
        }
      />
      <TextField
        select
        label="Role"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        fullWidth
      >
        {roles.map((r) => (
          <MenuItem key={r} value={r}>
            {r}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        fullWidth
      />
      <TextField
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        fullWidth
      />
    </Box>
  );
}
