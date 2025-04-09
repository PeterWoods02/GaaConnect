import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyInviteToken, registerManager } from '../api/inviteApi';

const ManagerSignupPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('checking'); // 'checking', 'valid', 'invalid', 'expired'
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    verifyInviteToken(token)
      .then(data => {
        setEmail(data.email);
        setStatus('valid');
      })
      .catch((err) => {
        if (err.message?.toLowerCase().includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('invalid');
        }
      });
  }, [token]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await registerManager({ ...formData, token });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  if (status === 'checking') return <Typography>Checking invite link...</Typography>;
  if (status === 'invalid') return <Typography color="error">Invalid invite link.</Typography>;
  if (status === 'expired') return <Typography color="error">This invite has expired.</Typography>;

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Manager Registration</Typography>
      <Typography variant="subtitle1" gutterBottom>{email}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          margin="normal"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>Register</Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ManagerSignupPage;
