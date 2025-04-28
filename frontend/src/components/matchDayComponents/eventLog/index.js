import React from 'react';
import { Typography, Box, Button, Stack, Divider, Grid, Paper } from '@mui/material';
import { deleteEvent, getEventsForMatch, getMatchById, updateTeamPositionsLive } from '../../../api/matchApi';
import { useAuth } from '../../../context/authContext.js';

const EventLog = ({ homeTeamId, homeTeamName, events, matchId, onUpdate, token, positions, setPositions, bench, setBench, playerMap, setMatchData }) => {
  const { user } = useAuth();

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

  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEvent = (event) => {
    const type = capitalize(event.type || 'Unknown');
    let teamDisplay;
    if (typeof event.team === 'object') {
      teamDisplay = event.team?.name || 'Unknown Team';
    } else if (event.team === homeTeamId) {
      teamDisplay = homeTeamName;
    } else {
      teamDisplay = event.team || 'Unknown Team';
    }
    const player = (typeof event.player === 'object' ? event.player?.name : event.player) || 'No Player';
    const minute = typeof event.minute === 'number' ? formatSeconds(event.minute) : 'Unknown Time';

    return { type, teamDisplay, player, minute };
  };

  const sortedEvents = [...events].sort((a, b) => {
    const minuteA = typeof a.minute === 'number' ? a.minute : 0;
    const minuteB = typeof b.minute === 'number' ? b.minute : 0;
    return minuteB - minuteA;
  });
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Match Events:</Typography>
      <Stack spacing={2}>
        {sortedEvents.map((event, index) => {
          const { type, teamDisplay, player, minute } = formatEvent(event);

          return (
            <Paper key={event._id} elevation={2} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={8}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {minute}
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {type}
                  </Typography>
                  <Typography variant="body2">
                    {teamDisplay} - {player}
                  </Typography>
                </Grid>
                {(user?.role === 'admin' || user?.role === 'manager') && (
                  <Grid item>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleUndo(event._id)}
                    >
                      Undo
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default EventLog;
