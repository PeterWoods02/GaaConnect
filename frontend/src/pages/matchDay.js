import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent, getMatchById, updateMatch } from '../api/matchApi.js';
import { sendAdminAction } from '../services/socketClient.js';
import { Typography, Box, Grid, Paper, Container, CircularProgress } from '@mui/material';
import Scoreboard from '../components/matchDayComponents/scoreboard/index.js';
import LiveTimer from '../components/matchDayComponents/liveTimer/index.js';
import AdminControls from '../components/matchDayComponents/adminScoring/index.js';
import PlayerSelectorDialog from '../components/matchDayComponents/playerSelectorDialog/index.js';
import { getPlayerById } from '../api/playersApi.js';
import EventLog from '../components/matchDayComponents/eventLog';
import { getEventsForMatch } from '../api/matchApi';

const MatchPage = () => {
  const { id } = useParams();

  const [matchData, setMatchData] = useState(null);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gamePhase, setGamePhase] = useState(0); // 0: Pre, 1: 1st Half, 2: Half Time, 3: 2nd Half, 4: Full Time

  const timerRef = useRef(null);

  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);

  // Fetch match and initialize timers based on backend startTime
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        const match = await getMatchById(id);
        setMatchData(match);

        if (match.startTime && match.status === 'live') {
          const now = Date.now();
          const timeDiffSeconds = Math.floor((now - match.startTime) / 1000);
          setElapsedTime(timeDiffSeconds);
          startTimer();
        }

        setGamePhase(statusToPhase(match.status));

        const players = match.players || {};
        const playerIds = Array.isArray(players)
          ? players
          : Object.values(players);

        const playerDetails = await Promise.all(
          playerIds.map(async (playerId) => {
            try {
              return await getPlayerById(playerId);
            } catch (error) {
              console.error(`Error fetching player with ID ${playerId}:`, error);
              return null;
            }
          })
        );

        setTeamAPlayers(playerDetails.filter(Boolean));

        const fetchedEvents = await getEventsForMatch(id);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    fetchMatchDetails();
  }, [id]);
  

  const statusToPhase = (status) => {
    switch (status) {
      case 'upcoming': return 0;
      case 'live': return gamePhase === 3 ? 3 : 1; // Simplified for now
      case 'halfTime': return 2;
      case 'fullTime': return 4;
      default: return 0;
    }
  };

  // timer Management
  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
      sendAdminAction({ id, type: 'timerStart' });
    }
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    sendAdminAction({ id, type: 'timerPause' });
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    sendAdminAction({ id, type: 'timerStop' });
  };

  //  Game Phase Changes 
  const handlePhaseChange = async (nextPhase) => {
    setGamePhase(nextPhase);

    let statusUpdate = '';
    let startTime = null;

    switch (nextPhase) {
      case 0:
        statusUpdate = 'upcoming';
        stopTimer();
        break;

      case 1:
        statusUpdate = 'live';
        startTime = Date.now();
        setElapsedTime(0);
        startTimer();
        break;

      case 2:
        statusUpdate = 'halfTime';
        pauseTimer();
        break;

      case 3:
        statusUpdate = 'live';
        startTime = Date.now();
        setElapsedTime(30 * 60); // second half starts at 30 mins (1800 seconds)
        startTimer();
        break;

      case 4:
        statusUpdate = 'fullTime';
        stopTimer();
        break;

      default:
        break;
    }

    const payload = { status: statusUpdate };
    if (startTime) payload.startTime = startTime;

    try {
      const updated = await updateMatch(id, payload);
      setMatchData(updated);
      sendAdminAction({ id, type: 'statusUpdate', status: statusUpdate });
    } catch (error) {
      console.error('Failed to update match status:', error);
    }
  };

  // Handle Admin Event Log 
  const handleAdminLogEvent = (team, eventType) => {
    if (team === 'teamA' && ['goal', 'point'].includes(eventType)) {
      setPendingEvent({ team, eventType });
      setShowPlayerSelector(true);
    } else {
      handleLogEvent(eventType, { team, player: null });
    }
  };

  const handleLogEvent = async (eventType, eventData) => {
    try {
      // Send event to backend
      await logEvent(id, {
        type: eventType,
        teamId: eventData.team === 'teamA' ? matchData.team : null,
        playerId: eventData.player?._id || eventData.player || null,
        minute: elapsedTime,
      });

      // Refresh match + events
      const [updatedMatch, updatedEvents] = await Promise.all([
        getMatchById(id),
        getEventsForMatch(id),
      ]);
      setMatchData(updatedMatch);
      setEvents(updatedEvents);

      sendAdminAction({
        id,
        type: eventType,
        time: elapsedTime,
        team: eventData.team,
        player: eventData.player?._id || eventData.player || 'NO_PLAYER_ID',
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const handlePlayerSelected = (player) => {
    setShowPlayerSelector(false);

    if (pendingEvent) {
      handleLogEvent(pendingEvent.eventType, {
        team: pendingEvent.team,
        player: player,
      });

      setPendingEvent(null);
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
        {/* Scoreboard */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Scoreboard
              matchId={id}
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

        {/* Admin Controls */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <AdminControls
              matchId={id}
              matchData={matchData}
              setMatchData={setMatchData}
              onLogEvent={handleAdminLogEvent}
              gamePhase={gamePhase}
              elapsedTime={elapsedTime}
              onPhaseChange={handlePhaseChange}
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
            <EventLog events={events} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchPage;