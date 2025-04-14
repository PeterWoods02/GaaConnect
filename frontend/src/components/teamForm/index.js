import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';
import ManagerSelect from '../managersList'; 

const TeamForm = ({ onSubmit, showManagerSelect }) => {
  const [teamData, setTeamData] = useState({
    name: '',
    age_group: '',  // renamed here
    division: '',
    year: '',
    managementTeam: [],
    players: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTeamData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleManagerChange = (event) => {
    const { value } = event.target;
    setTeamData((prevData) => ({
      ...prevData,
      managementTeam: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(teamData);
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
            name="age_group"  // renamed here
            fullWidth
            value={teamData.age_group}  // renamed here
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

        {/* Manager Selection Dropdown */}
        {showManagerSelect && (
          <Grid item xs={12}>
            <ManagerSelect value={teamData.managementTeam} onChange={handleManagerChange} />
          </Grid>
        )}


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
