"use client"

import React, { useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Button, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux'
import { createLead } from 'container/AdminContainer/slice'
import { getUser } from 'utils/getUser'

export default function AddLeadModal({ open, onClose, onAdd }) {
  const dispatch = useDispatch();

  const currentUser = getUser();

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    district: '',
    city: '',
    state: '',
    pincode: '',
    leadSource: 'Website',
    tenantId: currentUser?.tenantId || ''
  });

  const [creating, setCreating] = useState(false);

  const sources = ['Website', 'Facebook', 'Instagram', 'Referral', 'Walk-in', 'Campaign', 'Other'];

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.mobile) return;
    setCreating(true);
    dispatch(createLead({ body: form }));
    if (onAdd) onAdd();
    setCreating(false);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Lead</DialogTitle>
      <DialogContent>
        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
          <TextField label="Full Name" value={form.name} onChange={handleChange('name')} fullWidth required />
          <TextField label="Mobile" value={form.mobile} onChange={handleChange('mobile')} fullWidth required />
          <TextField label="Email" value={form.email} onChange={handleChange('email')} fullWidth />
          <TextField select label="Lead Source" value={form.leadSource} onChange={handleChange('leadSource')} fullWidth>
            {sources.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField label="District" value={form.district} onChange={handleChange('district')} fullWidth />
          <TextField label="City" value={form.city} onChange={handleChange('city')} fullWidth />
          <TextField label="State" value={form.state} onChange={handleChange('state')} fullWidth />
          <TextField label="Pincode" value={form.pincode} onChange={handleChange('pincode')} fullWidth />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={creating}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={creating}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
