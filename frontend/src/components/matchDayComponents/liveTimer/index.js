import React from 'react';
import { Typography } from '@mui/material';

const LiveTimer = ({ elapsedTime, gamePhase }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = () => {
    switch (gamePhase) {
      case 0: return 'Pre-Game';
      case 1: return 'First Half';
      case 2: return 'Half Time';
      case 3: return 'Second Half';
      case 4: return 'Full Time';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      <Typography variant="h4" align="center">
        {formatTime(elapsedTime)}
      </Typography>
      <Typography variant="subtitle1" align="center">
        {getPhaseLabel()}
      </Typography>
    </div>
  );
};

export default LiveTimer;
