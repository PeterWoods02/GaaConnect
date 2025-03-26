import React, { useState } from 'react';
import { Button, Grid, Typography, Paper, CircularProgress, MenuItem, Select, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import { getTeamForMatch, logEvent, getMatchById } from '../../../api/matchApi';
import { getPlayerById } from '../../../api/playersApi';
import { sendAdminAction } from '../../../services/socketClient';

const AdminControls = ({ matchId, matchData, setMatchData, gamePhase, elapsedTime, onPhaseChange }) => {
  const [openPlayerSelect, setOpenPlayerSelect] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [team, setTeam] = useState('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  // Handle the game phase buttons
  const handleGamePhaseClick = () => {
    switch (gamePhase) {
      case 0: onPhaseChange(1); break;
      case 1: onPhaseChange(2); break; 
      case 2: onPhaseChange(3); break; 
      case 3: onPhaseChange(4); break; 
      default: break;
    }
  };

  const getGamePhaseButtonText = () => {
    switch (gamePhase) {
      case 0: return 'Start First Half';
      case 1: return 'Half Time';
      case 2: return 'Start Second Half';
      case 3: return 'Full Time';
      case 4: return 'Game Finished';
      default: return 'Start Match';
    }
  };

  const isButtonDisabled = () => gamePhase === 4;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEvent = (eventType, teamType) => {
    if (gamePhase !== 1 && gamePhase !== 3) {
      alert('Match not in progress!');
      return;
    }

    setTeam(teamType);
    setSelectedEvent(eventType);

    const needsPlayerSelection = teamType === 'home' && ['goal','point', 'yellowCard', 'redCard', 'substitution'].includes(eventType);

    if (needsPlayerSelection) {
      fetchPlayers(); // load players on demand
      setOpenPlayerSelect(true);
    } else {
      // Direct log for away team events (no player selection)
      handleLogEvent(eventType, null, teamType);
    }
  };

  const fetchPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const teamData = await getTeamForMatch(matchId);
      const playerIds = Object.values(teamData);
      const playerDetails = await Promise.all(
        playerIds.map(id => getPlayerById(id))
      );
      setPlayers(playerDetails.filter(Boolean));
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const handleLogEvent = async (eventType, player, teamType) => {
    const teamId = teamType === 'home'
  ? (typeof matchData.team === 'object' ? matchData.team._id : matchData.team)
  : null;


    const eventPayload = {
      type: eventType,
      teamId,
      playerId: player?._id || null,
      minute: elapsedTime
    };

    try {
      
      await logEvent(matchId, eventPayload);

      
      const updatedMatch = await getMatchById(matchId);
      setMatchData(updatedMatch);

      
      sendAdminAction({
        id: matchId,
        type: eventType,
        time: elapsedTime,
        team: teamType,
        player: player?._id || player || "NO_PLAYER_ID"
      });

      setOpenPlayerSelect(false);
      setSelectedPlayerId('');

    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const handleConfirmPlayer = () => {
    const selectedPlayer = players.find(p => p._id === selectedPlayerId);
    handleLogEvent(selectedEvent, selectedPlayer, team);
  };

  const handleCancelPlayerSelection = () => {
    setOpenPlayerSelect(false);
    setSelectedPlayerId('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Admin Controls</Typography>

      <Typography variant="h6" gutterBottom>Match Timer: {formatTime(elapsedTime)}</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleGamePhaseClick}
        disabled={isButtonDisabled()}
        sx={{ mb: 3 }}
      >
        {getGamePhaseButtonText()}
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Team A (Home)</Typography>
          <Grid container spacing={2}>
            {['goal', 'point', 'yellowCard', 'redCard', 'substitution'].map(event => (
              <Grid item key={event}>
                <Button
                  variant="contained"
                  color={getButtonColor(event)}
                  startIcon={getEventIcon(event)}
                  onClick={() => handleEvent(event, 'home')}
                >
                  {capitalize(event)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Team B (Away)</Typography>
          <Grid container spacing={2}>
            {['goal', 'point', 'yellowCard', 'redCard', 'substitution'].map(event => (
              <Grid item key={event}>
                <Button
                  variant="contained"
                  color={getButtonColor(event)}
                  startIcon={getEventIcon(event)}
                  onClick={() => handleEvent(event, 'away')}
                >
                  {capitalize(event)}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openPlayerSelect} onClose={handleCancelPlayerSelection}>
        <DialogTitle>Select Player</DialogTitle>
        <DialogContent>
          {loadingPlayers ? (
            <CircularProgress />
          ) : (
            <Select
              fullWidth
              value={selectedPlayerId}
              onChange={e => setSelectedPlayerId(e.target.value)}
            >
              {players.map(player => (
                <MenuItem key={player._id} value={player._id}>
                  {player.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelPlayerSelection}>Cancel</Button>
          <Button onClick={handleConfirmPlayer} disabled={!selectedPlayerId} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getButtonColor = (event) => {
  switch (event) {
    case 'goal':
    case 'point':
      return 'primary';
    case 'yellowCard':
      return 'warning';
    case 'redCard':
      return 'error';
    default:
      return 'secondary';
  }
};

const getEventIcon = (event) => {
  switch (event) {
    case 'goal': return <SportsSoccerIcon />;
    case 'point': return <EmojiEventsIcon />;
    case 'yellowCard': return <WarningIcon />;
    case 'redCard': return <DangerousIcon />;
    case 'substitution': return <SwapHorizIcon />;
    default: return null;
  }
};

export default AdminControls;
