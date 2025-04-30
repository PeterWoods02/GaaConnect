import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box, MenuItem } from '@mui/material';
import { registerUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'fan',
  });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(formData);
      navigate('/login'); // after registration
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" name="name" label="Name" value={formData.name} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="email" label="Email" value={formData.email} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>Register</Button>
        </Box>
      </form>
    </Paper>
  );
};

export default RegisterPage;
