import React from 'react';
import { Typography, Box, Button, Stack } from '@mui/material';
import { deleteEvent, getEventsForMatch, getMatchById, updateTeamPositionsLive } from '../../../api/matchApi';

const EventLog = ({ events, matchId, onUpdate, token, positions, setPositions, bench, setBench, playerMap, setMatchData }) => {
  if (!events || events.length === 0) {
    return <Typography>No events logged yet.</Typography>;
  }

  const handleUndo = async (eventId) => {
    try {
      const eventToUndo = events.find(ev => ev._id === eventId);
      if (!eventToUndo) return;

      await deleteEvent(matchId, eventId, token);

      if (eventToUndo.type === 'substitution') {
        await revertSubstitution(eventToUndo);
      }

      const updatedMatch = await getMatchById(matchId);
      setMatchData(updatedMatch);

      const updatedEvents = await getEventsForMatch(matchId);
      onUpdate(updatedEvents);

    } catch (error) {
      console.error('Error undoing event:', error);
    }
  };

  const revertSubstitution = async (eventToUndo) => {
    const subbedOnPlayerId = eventToUndo.player?._id || eventToUndo.player;
    const subbedOffPlayerId = eventToUndo.playerOff?._id || eventToUndo.playerOff;

    if (!subbedOnPlayerId || !subbedOffPlayerId) return;

    const newPositions = { ...positions };
    let positionToRevert = null;

    for (const [position, playerId] of Object.entries(newPositions)) {
      if (playerId?.toString() === subbedOnPlayerId.toString()) {
        positionToRevert = position;
        break;
      }
    }

    if (!positionToRevert) return;

    newPositions[positionToRevert] = subbedOffPlayerId;

    const updatedBench = [
      ...bench.filter(player => player._id !== subbedOffPlayerId),
      playerMap[subbedOnPlayerId] || { _id: subbedOnPlayerId, name: 'Unknown' }
    ];

    setPositions(newPositions);
    setBench(updatedBench);

    try {
      await updateTeamPositionsLive(matchId, newPositions, updatedBench.map(p => p._id), token);
    } catch (error) {
      console.error('Failed to sync substitution undo:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Match Events:</Typography>
      {events.map(event => (
        <Stack key={event._id} direction="row" alignItems="center" justifyContent="space-between">
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
