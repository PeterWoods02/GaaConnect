import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById, updateMatch, getTeamForMatch } from '../api/matchApi.js';
import { sendAdminAction } from '../services/socketClient.js';
import { Button, Typography, Card, CardContent, CircularProgress, Grid, Paper, Container } from '@mui/material';
import Scoreboard from '../components/matchDayComponents/scoreboard/index.js';
import LiveTimer from '../components/matchDayComponents/liveTimer/index.js';
import EventLog from '../components/matchDayComponents/eventLog/index.js';
import AdminControls from '../components/matchDayComponents/adminScoring/index.js';
import PlayerSelectorDialog from '../components/matchDayComponents/playerSelectorDialog/index.js';
import { getPlayerById } from '../api/playersApi.js';


const MatchPage = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [teamAPlayers, setTeamAPlayers] = useState([]);


  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const match = await getMatchById(id);
        setMatchData(match);  // ← This is missing
  
        let players = match.players;
        if (!Array.isArray(players)) {
          players = Object.values(players || {});
        }
  
        const playerDetails = await Promise.all(
          players.map(async (playerId) => {
            try {
              return await getPlayerById(playerId);
            } catch (error) {
              console.error(`Error fetching player with ID ${playerId}:`, error);
              return null;
            }
          })
        );
  
        const validPlayers = playerDetails.filter((player) => player !== null);
        setTeamAPlayers(validPlayers);  
  
      } catch (error) {
        console.error('Error fetching match details:', error);
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

  const handleAdminLogEvent = (team, eventType) => {
    if (team === 'teamA' && (eventType === 'goal' || eventType === 'point')) {
      // Save pending event and show player selector
      setPendingEvent({ team, eventType });
      setShowPlayerSelector(true);
    } else {
      // Directly log events for teamB or other non-player-specific events
      handleLogEvent(eventType, { team, player: null });
    }
  };
  
  

  const handlePlayerSelected = (player) => {
    setShowPlayerSelector(false);
    if (pendingEvent) {
      handleLogEvent(pendingEvent.eventType, { team: pendingEvent.team, player });
      setPendingEvent(null);  // Clear pending event
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
              onLogEvent={handleAdminLogEvent}
              timer={timer}
              matchId={id}
            />

            <PlayerSelectorDialog
              open={showPlayerSelector}
              players={teamAPlayers}
              onSelect={handlePlayerSelected}
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