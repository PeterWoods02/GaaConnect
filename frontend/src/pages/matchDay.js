import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById, updateMatch } from '../api/matchApi.js';
import { sendAdminAction } from '../services/socketClient.js';
import { Button, Typography, Card, CardContent, CircularProgress, Grid, Paper, Container } from '@mui/material';
import Scoreboard from '../components/matchDayComponents/scoreboard/index.js';
import LiveTimer from '../components/matchDayComponents/liveTimer/index.js';
import EventLog from '../components/matchDayComponents/eventLog/index.js';
import AdminControls from '../components/matchDayComponents/adminScoring/index.js';

const MatchPage = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // Mock player data (replace with actual data from your API)
  const teamAPlayers = ['Player 1', 'Player 2', 'Player 3'];
  const teamBPlayers = ['Player 4', 'Player 5', 'Player 6'];

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const data = await getMatchById(id);
        setMatchData(data);
        if (data.status === 'live') {
          startTimer();
        }
      } catch (error) {
        console.error('Failed to fetch match details:', error);
      }
    };
    fetchMatchDetails();
  }, [id]);

  const startTimer = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 60000);
      setIntervalId(id);
    }
  };

  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  const handleStartMatch = async () => {
    try {
      const updatedMatch = await updateMatch(id, { status: 'live', currentTime: 0 });
      setMatchData(updatedMatch);
      startTimer();
      sendAdminAction({ type: 'start', id });
    } catch (error) {
      console.error('Failed to start match:', error);
    }
  };

  const handleLogEvent = async (eventType, eventData) => {
    try {
      const updatedMatch = await updateMatch(id, {
        events: [...matchData.events, { type: eventType, ...eventData }],
      });
      setMatchData(updatedMatch);
      sendAdminAction({ type: eventType, ...eventData, id });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  if (!matchData) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        {matchData.matchTitle}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {matchData.date} | {matchData.location}
      </Typography>

      <Grid container spacing={3}>
        {/* Scoreboard and Timer */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Scoreboard teamA={matchData.score.teamA} teamB={matchData.score.teamB} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <LiveTimer timer={timer} />
          </Paper>
        </Grid>

        {/* Admin Controls */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Admin Controls
            </Typography>
            {matchData.status === 'upcoming' && (
              <Button variant="contained" color="primary" onClick={handleStartMatch}>
                Start Match
              </Button>
            )}
            <AdminControls
              onLogEvent={handleLogEvent}
              timer={timer}
              teamAPlayers={teamAPlayers}
              teamBPlayers={teamBPlayers}
            />
          </Paper>
        </Grid>

        {/* Event Log */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Match Events
            </Typography>
            <EventLog events={matchData.events} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchPage;