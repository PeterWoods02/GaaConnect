import React, { useState } from 'react';
import { Button, Grid, Typography, Paper, CircularProgress, MenuItem, Select, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

import { getTeamForMatch, logEvent, getMatchById } from '../../../api/matchApi';
import { getUserById } from '../../../api/usersApi';
import { sendAdminAction } from '../../../services/socketClient';

const AdminControls = ({ matchId, matchData, setMatchData, gamePhase, elapsedTime, onPhaseChange, positions, setPositions, bench, setBench, token }) => {
  const [openPlayerSelect, setOpenPlayerSelect] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [team, setTeam] = useState('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedPlayerOnId, setSelectedPlayerOnId] = useState('');
  const [selectedPlayerOffPosition, setSelectedPlayerOffPosition] = useState('');  

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
    setLoadingPlayers(true);

    if (selectedEvent === 'substitution') {
      setPlayers(bench);
      setLoadingPlayers(false);
      return;
    }
  
    const playerIds = Object.values(positions).filter(Boolean);
    const playerDetails = await Promise.all(
      playerIds.map(async id => {
        try {
          return await getUserById(id, token);
        } catch (err) {
          console.error("Failed to fetch player:", id);
          return null;
        }
      })
    );
  
    const fullPlayers = playerDetails.filter(Boolean);
    setPlayers(fullPlayers);
    setLoadingPlayers(false);
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
      
      await logEvent(matchId, eventPayload, token);

      
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

  const fixEventType = (eventType) => {
    const map = {
      yellowCard: 'yellow_card',
      redCard: 'red_card',
    };
    return map[eventType] || eventType;
  };

  const handleConfirmPlayer = () => {
    if (selectedEvent === 'substitution') {
      const subOnPlayer = bench.find(p => p._id === selectedPlayerOnId);
      const subOffPlayer = positions[selectedPlayerOffPosition];
  
      if (subOnPlayer && subOffPlayer) {
        setPositions(prev => ({
          ...prev,
          [selectedPlayerOffPosition]: subOnPlayer,
        }));
  
        setBench(prev => {
          const withoutSubOn = prev.filter(p => p._id !== subOnPlayer._id);
          return [...withoutSubOn, subOffPlayer];
        });
  
        handleLogEvent('substitution', subOnPlayer, team);
      }
    } else {
      const selectedPlayer = players.find(p => p._id === selectedPlayerId);
  
      if (selectedPlayer) {
        handleLogEvent(fixEventType(selectedEvent), selectedPlayer, team);
      } else {
        console.error('No player found for selected ID:', selectedPlayerId);
      }
    }
  
    setOpenPlayerSelect(false);
    setSelectedPlayerId('');
    setSelectedPlayerOnId('');
    setSelectedPlayerOffPosition('');
  };

  const handleCancelPlayerSelection = () => {
    setOpenPlayerSelect(false);
    setSelectedPlayerId('');
  };

  const playerMap = players.reduce((acc, player) => {
    acc[player._id] = player.name;
    return acc;
  }, {});
  
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
          ) : selectedEvent === 'substitution' ? (
            <>
              <Typography>Select Player Coming Off (on pitch):</Typography>
            
              <Select
                fullWidth
                value={selectedPlayerOffPosition}
                onChange={(e) => setSelectedPlayerOffPosition(e.target.value)}
              >
                {Object.entries(positions).map(([position, playerId]) => (
                  playerId && (
                    <MenuItem key={playerId} value={position}>
                      {playerMap[playerId] || playerId} ({position})
                    </MenuItem>
                  )
                ))}
              </Select>
              <Typography sx={{ mt: 2 }}>Select Player Coming On (from bench):</Typography>
              <Select
                fullWidth
                value={selectedPlayerOnId}
                onChange={(e) => setSelectedPlayerOnId(e.target.value)}
              >
                {bench.map(player => (
                  <MenuItem key={player._id} value={player._id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </>
          ) : (
            <Select
              fullWidth
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
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
