import React from 'react';
import { Typography } from '@mui/material';

const EventLog = ({ events }) => {
  return (
    <div>
      <Typography variant="h5">Match Events:</Typography>
      {events.map((event, index) => (
        <Typography key={index}>
          {event.type} - {event.team} at {event.time}
        </Typography>
      ))}
    </div>
  );
};

export default EventLog;