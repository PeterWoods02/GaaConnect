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
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const isManager = user?.role === 'manager';
  const isAdmin = user?.role === 'admin';

  const handleCreateTeam = async (teamData) => {
    const token = localStorage.getItem('token');
    try {
  
      // If manager is logged in, assign themselves automatically
      const finalTeamData = isManager
        ? { ...teamData, managementTeam: [user.id] }
        : teamData;
  
      await createTeam(finalTeamData, token);
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
      <TeamForm onSubmit={handleCreateTeam} showManagerSelect={isAdmin} />
      <SnackbarAlert open={openSnackbar} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)} />
    </div>
  );
};

export default AddTeam;
