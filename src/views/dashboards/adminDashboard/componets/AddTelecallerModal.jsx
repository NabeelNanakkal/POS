import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createTelecaller } from 'container/AdminContainer/slice';
import { getUser } from 'utils/getUser';

const roles = ['PlatformAdmin', 'TenantAdmin', 'Telecaller'];

export default function AddTelecallerModal({ open, onClose }) {
  const dispatch = useDispatch();
  const creating = useSelector((state) => state.admin?.creating);

  const currentUser = getUser();

  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Telecaller',
    // tenantId: currentUser?.tenantId || '',
    email: '',
    phone: ''
  });

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    // basic validation
    if (!form.name || !form.username || !form.password || !form.role ) return;

    // API expects role and other fields in body
    dispatch(createTelecaller({ body: form }));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Telecaller</DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
          <TextField label="Name" value={form.name} onChange={handleChange('name')} fullWidth required />
          <TextField label="Username" value={form.username} onChange={handleChange('username')} fullWidth required />
          <TextField label="Password" value={form.password} onChange={handleChange('password')} fullWidth required type="password" />
          <TextField select label="Role" value={form.role} onChange={handleChange('role')} fullWidth>
            {roles.map((r) => (
              <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </TextField>
          {/* <TextField label="Tenant ID" value={form.tenantId} onChange={handleChange('tenantId')} fullWidth required /> */}
          <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth />
          <TextField label="Phone" value={form.phone} onChange={handleChange('phone')} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={creating}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={creating}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
