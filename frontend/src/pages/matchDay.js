import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { logEvent, getMatchById, updateMatch } from '../api/matchApi.js';
import { sendAdminAction } from '../services/socketClient.js';
import { Typography, Box, Grid, Paper, Container, CircularProgress } from '@mui/material';
import Scoreboard from '../components/matchDayComponents/scoreboard/index.js';
import LiveTimer from '../components/matchDayComponents/liveTimer/index.js';
import AdminControls from '../components/matchDayComponents/adminScoring/index.js';
import PlayerSelectorDialog from '../components/matchDayComponents/playerSelectorDialog/index.js';
import EventLog from '../components/matchDayComponents/eventLog';
import { getEventsForMatch } from '../api/matchApi';
import { listenToMatchUpdates } from '../services/socketClient';
import { getUserById } from '../api/usersApi.js';
import { useAuth } from '../context/authContext.js';

const MatchPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [matchData, setMatchData] = useState(null);
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [events, setEvents] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gamePhase, setGamePhase] = useState(0); // 0: Pre, 1: 1st Half, 2: Half Time, 3: 2nd Half, 4: Full Time
  const [scoreRefreshKey, setScoreRefreshKey] = useState(0);
  const [players, setPlayers] = useState([]);
  const timerRef = useRef(null);

  const [showPlayerSelector, setShowPlayerSelector] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);

  const [positions, setPositions] = useState({});
  const [bench, setBench] = useState([]);
  
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
  
        const teamPositionIds = Object.values(match.teamPositions || {}).filter(Boolean);

        const playerDetails = await Promise.all(
          teamPositionIds.map(async (playerId) => {
            try {
              return await getUserById(playerId, token); 
            } catch (error) {
              console.error(`Error fetching player with ID ${playerId}:`, error);
              return null;
            }
          })
        );

        const fetchedPlayers = playerDetails.filter(Boolean);
        setPlayers(fetchedPlayers);

        // setup positions and bench from teamPositions
        const pitchAssignments = match.teamPositions || {};
        setPositions(pitchAssignments);
        

        const assignedIds = Object.values(pitchAssignments).map(p => p?._id);
        const benchPlayers = fetchedPlayers.filter(p => !assignedIds.includes(p._id));
        setBench(benchPlayers);

        const fetchedEvents = await getEventsForMatch(id);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('error fetching match details:', error);
      }
    };
  
    const fetchAndSetEvents = async () => {
      try {
        const updatedEvents = await getEventsForMatch(id);
        setEvents(updatedEvents);
      } catch (err) {
        console.error('Error refreshing events:', err);
      }
    };
  
    fetchMatchDetails();
  
    const unsubscribe = listenToMatchUpdates(id, (action) => {
      if (action === 'eventUpdate' || action.type === 'eventUpdate') {
        fetchAndSetEvents();
        getMatchById(id).then(setMatchData);
        setScoreRefreshKey(prev => prev + 1); 
      }
    });
    
  
    return () => unsubscribe();
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
  const MAX_GAME_TIME = 90 * 60; // 90 minutes and stop timer

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev >= MAX_GAME_TIME) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            sendAdminAction({ id, type: 'timerStop' }); 
            return prev;
          }
          return prev + 1;
        });
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
      const updated = await updateMatch(id, payload, token);
      setMatchData(updated);
      sendAdminAction({ id, type: 'statusUpdate', status: statusUpdate });
    } catch (error) {
      console.error('Failed to update match status:', error);
    }
  };

  // helper functions to fix snake case
  const fixEventType = (eventType) => {
    const map = {
      yellowCard: 'yellow_card',
      redCard: 'red_card'
    };
    return map[eventType] || eventType; 
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
        type: fixEventType(eventType),
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

  const playerMap = players.reduce((acc, player) => {
    acc[player._id] = player;
    return acc;
  }, {});

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
            refreshTrigger={scoreRefreshKey}
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
              positions={positions}               
              setPositions={setPositions}
              bench={bench}
              setBench={setBench}
              token={token}
              players={players}
            />


            <PlayerSelectorDialog
              open={showPlayerSelector}
              players={players}
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
            <EventLog events={events} matchId={id} onUpdate={setEvents} 
            token={token}
            positions={positions}
            setPositions={setPositions}
            bench={bench}
            setBench={setBench}
            playerMap={playerMap}
            setMatchData={setMatchData}/>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MatchPage;