import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlayer } from '../api/playersApi.js'; 
import PlayerForm from '../components/playerForm'; 
import SnackbarAlert from '../components/snackbarAlert/index.js'; 

const AddPlayer = () => {
  const navigate = useNavigate(); 
  const [openSnackbar, setOpenSnackbar] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

  // Function to handle player creation
  const handleCreatePlayer = async (playerData) => {
    try {
      console.log('Sending player data:', playerData);
      await createPlayer(playerData); 
      setSnackbarMessage('Player created successfully!'); 
      setSnackbarSeverity('success'); 
      setOpenSnackbar(true); 
      setTimeout(() => navigate(`/`), 500); 
    } catch (error) {
      setSnackbarMessage('Error creating player!'); 
      setSnackbarSeverity('error'); 
      setOpenSnackbar(true); 
    }
  };

  return (
    <div>
      <h2>Create New Player</h2>
      <PlayerForm onSubmit={handleCreatePlayer} />
      <SnackbarAlert
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setOpenSnackbar(false)} 
      />
    </div>
  );
};

export default AddPlayer;
