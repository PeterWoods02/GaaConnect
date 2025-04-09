import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { sendManagerInvite } from '../api/inviteApi';

const InviteManagerPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      await sendManagerInvite(email);
      setStatus({ type: 'success', message: 'Invite sent successfully!' });
      setEmail('');
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Invite a Manager</Typography>

      {status.message && (
        <Typography color={status.type === 'success' ? 'success.main' : 'error'}>
          {status.message}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Manager Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>
            Send Invite
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default InviteManagerPage;
