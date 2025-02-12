import React from 'react';
import { Typography } from '@mui/material';

const Scoreboard = ({ teamA, teamB }) => {
  return (
    <div>
      <Typography variant="h5">Scoreboard:</Typography>
      <Typography>
        {teamA} - {teamB}
      </Typography>
    </div>
  );
};

export default Scoreboard;