import React from 'react';
import { Typography } from '@mui/material';

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const LiveTimer = ({ timer }) => {
  return (
    <div>
      <Typography variant="h5">Live Timer:</Typography>
      <Typography>{formatTime(timer)}</Typography>
    </div>
  );
};

export default LiveTimer;