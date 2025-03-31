import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import { loginUser } from '../api/authApi';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = await loginUser(formData);
      login(data.user, data.token); 
      navigate('/'); 
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 6 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth margin="normal" name="email" label="Email" value={formData.email} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
        <Box mt={2}>
          <Button type="submit" variant="contained" fullWidth>Login</Button>
        </Box>
        <Box mt={2} textAlign="center">
        <Typography variant="body2">
          Don't have an account?{' '}
          <Button variant="text" onClick={() => navigate('/register')}>Create an Account</Button>
        </Typography>
      </Box>

      </form>
    </Paper>
  );
};

export default LoginPage;
