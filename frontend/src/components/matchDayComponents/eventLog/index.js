import React from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';
import { deleteEvent, getMatchById, getEventsForMatch } from '../../../api/matchApi';

const EventLog = ({ events, matchId, onUpdate }) => {
  if (!events || events.length === 0) {
    return <Typography>No events logged yet.</Typography>;
  }

  const handleUndo = async (eventId) => {
    try {
      await deleteEvent(matchId, eventId);
      const updatedEvents = await getEventsForMatch(matchId);
      onUpdate(updatedEvents);
    } catch (error) {
      console.error('Error undoing event:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Match Events:</Typography>
      {events.map((event) => (
        <Stack direction="row" alignItems="center" justifyContent="space-between" key={event._id}>
          <Typography>{formatEvent(event)}</Typography>
          <Button
            size="small"
            color="error"
            variant="outlined"
            onClick={() => handleUndo(event._id)}
          >
            Undo
          </Button>
        </Stack>
      ))}
    </Box>
  );
};

const formatSeconds = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatEvent = (event) => {
  const type = capitalize(event.type || 'Unknown');
  const team = typeof event.team === 'string'
    ? event.team
    : event.team?.name || 'Unknown Team';
  const player = event.player?.name || 'No Player';
  const minute = typeof event.minute === 'number'
    ? formatSeconds(event.minute)
    : 'Unknown Time';

  return `${type} - ${team} - ${player} at ${minute}`;
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default EventLog;
