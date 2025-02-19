import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PlayerManagementButton = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/playerManagement');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleNavigate}>
      Go to Player Management
    </Button>
  );
};

export default PlayerManagementButton;
