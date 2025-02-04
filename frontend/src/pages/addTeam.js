import React, { useState } from 'react';
import { createTeam } from '../api/teamsApi.js';
import { useNavigate } from 'react-router-dom';
import TeamForm from '../components/teamForm/index.js';
import SnackbarAlert from '../components/snackbarAlert/index.js';

const AddTeam = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleCreateTeam = async (teamData) => {
    try {
      console.log('Sending team data:', teamData);
      await createTeam(teamData);
      setSnackbarMessage('Team created successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setTimeout(() => navigate(`/`), 500); //maybe navigate to page showing team options
    } catch (error) {
      setSnackbarMessage('Error creating team!');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <h2>Create New Team</h2>
      <TeamForm onSubmit={handleCreateTeam} />
      <SnackbarAlert open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)} />
    </div>
  );
};

export default AddTeam;
