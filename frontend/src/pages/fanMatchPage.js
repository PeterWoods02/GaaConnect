import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById } from '../api/matchApi.js';
import { listenToMatchUpdates } from '../services/socketClient.js';
import { Typography, Grid, Paper, Container, CircularProgress, Button } from '@mui/material';
import LiveTimer from '../components/matchDayComponents/liveTimer/index.js';
import Scoreboard from '../components/matchDayComponents/scoreboard/index.js';
import EventLog from '../components/matchDayComponents/eventLog/index.js';

const FanMatchPage = () => {
  const { matchId } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gamePhase, setGamePhase] = useState(0);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const match = await getMatchById(matchId);
        setMatchData(match);
        setEvents(match.events || []);
        setGamePhase(statusToPhase(match.status));
        setElapsedTime(getElapsedTime(match));
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchInitialData();

    const unsubscribe = listenToMatchUpdates(matchId, (action) => {
      switch (action.type) {
        case 'timerUpdate':
          setElapsedTime(action.elapsedTime);
          break;
        case 'statusUpdate':
          setGamePhase(statusToPhase(action.status));
          break;
        case 'goal':
        case 'point':
        case 'yellowCard':
        case 'redCard':
        case 'substitution':
          setEvents((prev) => [...prev, action]);
          break;
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, [matchId]);

  const statusToPhase = (status) => {
    switch (status) {
      case 'upcoming': return 0;
      case 'live': return 1; // or 3
      case 'halfTime': return 2;
      case 'fullTime': return 4;
      default: return 0;
    }
  };

  const getElapsedTime = (match) => {
    if (!match.startTime || match.status !== 'live') return 0;
    const now = Date.now();
    return Math.floor((now - match.startTime) / 1000);
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
      <Button
        onClick={() => navigate('/fanScorePage')}
        sx={{
          mt: 2,
          mb: 2,
          backgroundColor: '#00587c',
          color: '#fff',
          padding: '10px 20px',
          fontSize: '16px',
          borderRadius: '6px',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#004466',
          },
        }}
      >
        ← Back to Matches
      </Button>


      <Typography variant="h3" align="center" gutterBottom>
        {matchData.matchTitle}
      </Typography>
      <Typography variant="subtitle1" align="center" gutterBottom>
        {matchData.date} | {matchData.location}
      </Typography>

      <Grid container spacing={3}>
        {/* Scoreboard */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Scoreboard
              matchId={matchId}
              teamA={{
                goals: matchData.score.teamGoals,
                points: matchData.score.teamPoints
              }}
              teamB={{
                goals: matchData.score.oppositionGoals,
                points: matchData.score.oppositionPoints
              }}
            />
          </Paper>
        </Grid>

        {/* Timer */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <LiveTimer elapsedTime={elapsedTime} gamePhase={gamePhase} />
          </Paper>
        </Grid>

        {/* Event Log */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <EventLog events={events} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FanMatchPage;