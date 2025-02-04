import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const TeamForm = ({ onSubmit }) => {
  const [teamData, setTeamData] = useState({
    name: '',
    ageGroup: '',
    division: '',
    year: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTeamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    onSubmit(teamData); // Send data to `handleCreateTeam`
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Team Name"
            name="name"
            fullWidth
            value={teamData.name}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Age Group"
            name="ageGroup"
            fullWidth
            value={teamData.ageGroup}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Division"
            name="division"
            fullWidth
            value={teamData.division}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Year"
            name="year"
            type="number"
            fullWidth
            value={teamData.year}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Create Team
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default TeamForm;
