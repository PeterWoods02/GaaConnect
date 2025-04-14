import React, { useState } from 'react';
import { TextField, Button, Grid, Typography } from '@mui/material';

const PlayerForm = ({ onSubmit }) => {
  const [playerData, setPlayerData] = useState({
    name: '',
    email: '',
    password: '',
    position: '',
    date_of_birth: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPlayerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(playerData); 
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
    <Typography
      variant="h4"
      align="center"
      gutterBottom
      style={{ color: '#282c34' }} 
    >
      Create New Player
    </Typography>
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Player Name"
            name="name"
            fullWidth
            value={playerData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            fullWidth
            value={playerData.email}
            onChange={handleInputChange}
            required
            type="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Password"
            name="password"
            fullWidth
            value={playerData.password}
            onChange={handleInputChange}
            required
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Position"
            name="position"
            fullWidth
            value={playerData.position}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            fullWidth
            value={playerData.date_of_birth}
            onChange={handleInputChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Create Player
          </Button>
        </Grid>
      </Grid>
    </form>
    </div>
  );
};

export default PlayerForm;
