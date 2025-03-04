import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Paper, CircularProgress, MenuItem, Select, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import DangerousIcon from '@mui/icons-material/Dangerous';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { getTeamForMatch } from '../../../api/matchApi';
import { getPlayerById } from '../../../api/playersApi';

const AdminControls = ({ onLogEvent, timer, matchId }) => {
  const [openPlayerSelect, setOpenPlayerSelect] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [players, setPlayers] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [team, setTeam] = useState('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoadingPlayers(true);
        const homeTeam = await getTeamForMatch(matchId);

        if (!homeTeam || typeof homeTeam !== 'object') {
          console.error('Invalid team data:', homeTeam);
          setPlayers([]);
          return;
        }

        const playerIds = Object.values(homeTeam);
        const uniquePlayerIds = [...new Set(playerIds)];

        const playerDetails = await Promise.all(
          uniquePlayerIds.map(async (playerId) => {
            try {
              return await getPlayerById(playerId);
            } catch (error) {
              console.error(`Error fetching player with ID ${playerId}:`, error);
              return null;
            }
          })
        );

        setPlayers(playerDetails.filter(Boolean));
      } catch (error) {
        console.error('Error fetching players:', error);
        setPlayers([]);
      } finally {
        setLoadingPlayers(false);
      }
    };

    fetchPlayers();
  }, [matchId]);

  const handleEvent = (eventType, teamType) => {
    setTeam(teamType);
    setSelectedEvent(eventType);
  
    if (eventType === 'goal' || eventType === 'yellowCard' || eventType === 'redCard') {
      
      setOpenPlayerSelect(true);
    } else {
     
      handleLogEvent(eventType, null);
    }
  };
  
  const handleLogEvent = (eventType, player = null) => {
    const eventData = {
      time: timer,
      player, 
      team,
    };
  
    onLogEvent(eventType, eventData);
    setOpenPlayerSelect(false);
    setSelectedPlayerId('');
  };
  
  // Handle the selection of a player
  const handleConfirmPlayer = () => {
    const selectedPlayer = players.find(p => p._id === selectedPlayerId);
    handleLogEvent(selectedEvent, selectedPlayer); 
  };
  

  const handleCancelPlayerSelection = () => {
    setOpenPlayerSelect(false);
    setSelectedPlayerId('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Admin Controls</Typography>

      <Grid container spacing={3}>
        {/* Home Team Controls */}
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

        {/* Away Team Controls */}
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

      {/* Player Selector Dialog */}
      <Dialog open={openPlayerSelect} onClose={handleCancelPlayerSelection}>
        <DialogTitle>Select Player</DialogTitle>
        <DialogContent>
          {loadingPlayers ? (
            <CircularProgress />
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
          <Button
            onClick={handleConfirmPlayer}
            disabled={!selectedPlayerId}
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
    case 'goal': case 'point': return 'primary';
    case 'yellowCard': return 'warning';
    case 'redCard': return 'error';
    default: return 'secondary';
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
