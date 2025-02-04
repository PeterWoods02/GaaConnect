import React from 'react';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/lab';

const SnackbarAlert = ({ openSnackbar, setOpenSnackbar, snackbarMessage, snackbarSeverity }) => {
  return (
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
      <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
