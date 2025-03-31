import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Paper, Box, Avatar } from '@mui/material';
import { uploadProfilePicture } from '../api/usersApi'; 

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profilePic, setProfilePic] = useState(user?.profilePicture);
  const API_BASE = 'http://localhost:8080';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    try {
      const updatedUser = await uploadProfilePicture(user._id, selectedFile);
      alert('Profile picture updated!');
      setProfilePic(updatedUser.profilePicture);
      updateUser(updatedUser); 
      setPreview(null);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  if (!user) {
    return (
      <Typography variant="h6" align="center" mt={6}>
        Loading user info...
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 6 }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Box display="flex" alignItems="center" gap={3} mt={2}>
      <Avatar
            src={preview || `${API_BASE}${user.profilePicture}`}
            alt="Profile"
            sx={{ width: 80, height: 80 }}
            />
        <Box>
          <Button variant="contained" component="label">
            Change Picture
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          {selectedFile && (
            <Button variant="outlined" onClick={handleUpload} sx={{ ml: 2 }}>
              Upload
            </Button>
          )}
        </Box>
      </Box>

      <Box mt={4}>
        <Typography><strong>Name:</strong> {user.name}</Typography>
        <Typography><strong>Email:</strong> {user.email}</Typography>
        <Typography><strong>Role:</strong> {user.role}</Typography>
        {user.team && (
          <Typography><strong>Team:</strong> {user.team.name}</Typography>
        )}
      </Box>

      <Box mt={4}>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfilePage;
