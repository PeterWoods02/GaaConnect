import React, { useState } from 'react';
import { Button, Grid, Typography, Paper, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer'; // Goal icon
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Point icon
import WarningIcon from '@mui/icons-material/Warning'; // Yellow card icon
import DangerousIcon from '@mui/icons-material/Dangerous'; // Red card icon
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'; // Substitution icon

const AdminControls = ({ onLogEvent, timer, teamAPlayers, teamBPlayers }) => {
  const [selectedPlayerA, setSelectedPlayerA] = useState('');
  const [selectedPlayerB, setSelectedPlayerB] = useState('');
  const [oppositionNumber, setOppositionNumber] = useState('');

  const handleLogEventForTeam = (team, eventType) => {
    const eventData = {
      team,
      time: timer,
      player: team === 'teamA' ? selectedPlayerA : team === 'teamB' ? selectedPlayerB : oppositionNumber || 'Unknown',
    };
    onLogEvent(eventType, eventData);
    setSelectedPlayerA('');
    setSelectedPlayerB('');
    setOppositionNumber('');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Controls
      </Typography>
      <Grid container spacing={3}>
        {/* Team A Controls */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Team A
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Player (Team A)</InputLabel>
            <Select value={selectedPlayerA} onChange={(e) => setSelectedPlayerA(e.target.value)}>
              {teamAPlayers.map((player) => (
                <MenuItem key={player} value={player}>
                  {player}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SportsSoccerIcon />}
                onClick={() => handleLogEventForTeam('teamA', 'goal')}
              >
                Goal
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmojiEventsIcon />}
                onClick={() => handleLogEventForTeam('teamA', 'point')}
              >
                Point
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="warning"
                startIcon={<WarningIcon />}
                onClick={() => handleLogEventForTeam('teamA', 'yellowCard')}
              >
                Yellow Card
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                startIcon={<DangerousIcon />}
                onClick={() => handleLogEventForTeam('teamA', 'redCard')}
              >
                Red Card
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SwapHorizIcon />}
                onClick={() => handleLogEventForTeam('teamA', 'substitution')}
              >
                Sub
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Team B Controls */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Team B
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Player (Team B)</InputLabel>
            <Select value={selectedPlayerB} onChange={(e) => setSelectedPlayerB(e.target.value)}>
              {teamBPlayers.map((player) => (
                <MenuItem key={player} value={player}>
                  {player}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SportsSoccerIcon />}
                onClick={() => handleLogEventForTeam('teamB', 'goal')}
              >
                Goal
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmojiEventsIcon />}
                onClick={() => handleLogEventForTeam('teamB', 'point')}
              >
                Point
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="warning"
                startIcon={<WarningIcon />}
                onClick={() => handleLogEventForTeam('teamB', 'yellowCard')}
              >
                Yellow Card
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                startIcon={<DangerousIcon />}
                onClick={() => handleLogEventForTeam('teamB', 'redCard')}
              >
                Red Card
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SwapHorizIcon />}
                onClick={() => handleLogEventForTeam('teamB', 'substitution')}
              >
                Sub
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdminControls;