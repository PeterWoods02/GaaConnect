import React, { useState } from 'react';
import {Box,Typography,TextField,Button,Card,CardContent,Divider} from '@mui/material';
import { sendSupportMessage } from '../api/inviteApi';

const ContactAdmin = () => {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    date: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      await sendSupportMessage(form);
      setStatus('Message sent to admin!');
      setForm({ name: '', contact: '', date: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus(`${err.message || 'Failed to send message.'}`);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      p={2}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Contact Admin
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <form onSubmit={handleSubmit}>
            <TextField
              label="Your Name"
              name="name"
              fullWidth
              required
              margin="normal"
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              label="Contact Info (Email or Phone)"
              name="contact"
              fullWidth
              required
              margin="normal"
              value={form.contact}
              onChange={handleChange}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={handleChange}
            />
            <TextField
              label="Your Message"
              name="message"
              multiline
              rows={5}
              fullWidth
              required
              margin="normal"
              value={form.message}
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Send
            </Button>
          </form>

          {status && (
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              {status}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactAdmin;