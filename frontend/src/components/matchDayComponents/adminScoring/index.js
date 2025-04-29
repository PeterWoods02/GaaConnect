import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Paper, CircularProgress, MenuItem, Select, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { getTeamForMatch, logEvent, getMatchById, updateTeamPositionsLive } from '../../../api/matchApi';
import { getUserById } from '../../../api/usersApi';
import { sendAdminAction } from '../../../services/socketClient';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminControls = ({ matchId, matchData, setMatchData, gamePhase, elapsedTime, onPhaseChange, positions, setPositions, bench, setBench, token }) => {
  const [openPlayerSelect, setOpenPlayerSelect] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [team, setTeam] = useState('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [selectedPlayerOnId, setSelectedPlayerOnId] = useState('');
  const [selectedPlayerOffPosition, setSelectedPlayerOffPosition] = useState('');  
  const [playerMap, setPlayerMap] = useState({});

  useEffect(() => {
    if (matchData && matchData._id) {
      initialisePlayers(matchData);
    }
  }, [matchData]);

  useEffect(() => {
    if (gamePhase !== 1 && gamePhase !== 3) return;
    if (!matchData?.startTime) return;
  
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - matchData.startTime) / 1000);
  
      sendAdminAction({
        id: matchId,
        type: 'timerUpdate',
        elapsedTime: elapsed
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [gamePhase, matchData?.startTime, matchId]);
  
  

  const initialisePlayers = async (data) => {
    const positionPlayerIds = Object.values(data.teamPositions || {}).filter(Boolean);
    const benchPlayerIds = data.bench || [];
    const allPlayerIds = [...positionPlayerIds, ...benchPlayerIds];
  
    const fullPlayers = await fetchPlayersByIds(allPlayerIds);
    const map = {};
    fullPlayers.forEach(p => { map[p._id] = p; });
    setPlayerMap(map);
  
    const benchPlayers = fullPlayers.filter(p => benchPlayerIds.includes(p._id));
    setBench(benchPlayers);
    setPositions(data.teamPositions);
  };

  const fetchPlayersByIds = async (ids) => {
    const players = await Promise.all(ids.map(async (id) => {
      try {
        return await getUserById(id, token);
      } catch (err) {
        console.error('Failed to fetch player with id:', id);
        return null;
      }
    }));
    return players.filter(Boolean);
  };
  
  // Handle the game phase buttons
  const handleGamePhaseClick = () => {
    let newStatus = 'upcoming';
    switch (gamePhase) {
      case 0:
        onPhaseChange(1);
        newStatus = 'live';
        break;
      case 1: 
        onPhaseChange(2);
        newStatus = 'halfTime';
        break;
      case 2: 
        onPhaseChange(3);
        newStatus = 'live';
        break;
      case 3: 
        onPhaseChange(4);
        newStatus = 'fullTime';
        break;
      default:
        break;
    }
    sendAdminAction({
      id: matchId,
      type: 'statusUpdate',
      status: newStatus,
      elapsedTime: matchData?.startTime ? Math.floor((Date.now() - matchData.startTime) / 1000) : 0
    });
    
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
      toast.error('Match not in progress!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setTeam(teamType);

  const needsPlayerSelection = teamType === 'home' && ['goal','point', 'yellowCard', 'redCard', 'substitution'].includes(eventType);

  if (needsPlayerSelection) {
    fetchPlayers(eventType); 
    setSelectedEvent(eventType); 
    setOpenPlayerSelect(true);
  } else {
    handleLogEvent(fixEventType(eventType), null, teamType);
  }
};

  const fetchPlayers = (eventType) => {
    setLoadingPlayers(true);
  
    if (eventType === 'substitution') {
      setPlayers(bench);
      setLoadingPlayers(false);
      return;
    }
  
    const playerIds = Object.values(positions).filter(Boolean);
    const fullPlayers = playerIds.map(id => playerMap[id]).filter(Boolean);
    setPlayers(fullPlayers);
    setLoadingPlayers(false);
  };
  
  
  
  const handleLogEvent = async (eventType, player, teamType, subOffPlayerId = null) => {
    // home team has teamId
    const teamId = teamType === 'home'
      ? (typeof matchData.team === 'object' ? matchData.team._id : matchData.team)
      : null; // Team B no teamId
    
    const eventPayload = {
      type: eventType,    
      teamId: teamId,     
      playerId: player?._id || null,
      playerOffId: subOffPlayerId || null,
      minute: elapsedTime
    };
  
    try {
      console.log('LOGGING EVENT PAYLOAD:', eventPayload);
      await logEvent(matchId, eventPayload, token);
  
      const updatedMatch = await getMatchById(matchId);
      setMatchData(updatedMatch);
      await initialisePlayers(updatedMatch);
  
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

  const handleConfirmPlayer = async () => {
    if (selectedEvent === 'substitution') {
      const subOnPlayer = bench.find(p => p._id === selectedPlayerOnId);
      const subOffPlayerId = positions[selectedPlayerOffPosition];
  
      if (subOnPlayer && subOffPlayerId) {
        const updatedPositions = {
          ...positions,
          [selectedPlayerOffPosition]: subOnPlayer._id,
        };
  
        const updatedBench = [
          ...bench.filter(p => p._id !== subOnPlayer._id),
          playerMap[subOffPlayerId] || { _id: subOffPlayerId, name: 'Unknown' }
        ];
  
        setPositions(updatedPositions);
        setBench(updatedBench);
  
        // 🔥 Save to backend immediately
        try {
          await updateTeamPositionsLive(matchId, updatedPositions, updatedBench.map(p => p._id), token);
        } catch (error) {
          console.error('Failed to update team positions on server:', error);
        }
  
        handleLogEvent('substitution', subOnPlayer, team, subOffPlayerId);
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

      <Dialog open={openPlayerSelect} onClose={handleCancelPlayerSelection} fullWidth maxWidth="sm">
        <DialogTitle>Select Player</DialogTitle>
        <DialogContent>
          {loadingPlayers ? (
            <CircularProgress />
          ) : selectedEvent === 'substitution' ? (
            <>
            <Box mb={2}>
              <Typography>Select Player Coming Off (on pitch):</Typography>
              <Select
                fullWidth
                value={selectedPlayerOffPosition || ''}
                onChange={(e) => setSelectedPlayerOffPosition(e.target.value)}
              >
                {Object.entries(positions).map(([position, playerId]) => (
                  playerId && (
                    <MenuItem key={playerId} value={position}>
                      {playerMap[playerId]?.name || playerId} ({position})
                    </MenuItem>
                  )
                ))}
              </Select>
            </Box>

            <Box mb={2}>
              <Typography>Select Player Coming On (from bench):</Typography>
              <Select
                fullWidth
                value={selectedPlayerOnId || ''}
                onChange={(e) => setSelectedPlayerOnId(e.target.value)}
              >
                {bench.map(player => (
                  <MenuItem key={player._id} value={player._id}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
          ) : (
            <Select
              fullWidth
              value={selectedPlayerId || ''}
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
          <Button 
            onClick={handleConfirmPlayer} 
            disabled={selectedEvent === 'substitution' 
              ? !(selectedPlayerOnId && selectedPlayerOffPosition) 
              : !selectedPlayerId
            } 
            color="primary"
          >
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
