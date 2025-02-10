import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchById, updateMatch } from '../api/matchApi.js'; 
import { sendAdminAction } from '../services/socketClient.js'; 


const MatchPage = () => {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [timer, setTimer] = useState(0); 
  const [intervalId, setIntervalId] = useState(null); 

  // Fetch match details from API when component mounts
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

  // Start the match timer when match status is 'live'
  const startTimer = () => {
    if (!intervalId) {
      const id = setInterval(() => {
        setTimer(prevTime => prevTime + 1); // Increase timer every minute
      }, 60000); // Update every 60 seconds
      setIntervalId(id);
    }
  };

  // Stop the timer (e.g., when match ends)
  const stopTimer = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  // Handle start match action
  const handleStartMatch = async () => {
    try {
      const updatedMatch = await updateMatch(id, { status: 'live', currentTime: 0 });
      setMatchData(updatedMatch); 
      startTimer(); 
      sendAdminAction({ type: 'start', id }); // Emit WebSocket event
    } catch (error) {
      console.error('Failed to start match:', error);
    }
  };

  // Handle event logging (Goal, Card, Substitution)
  const handleLogEvent = (eventType, eventData) => {
    sendAdminAction({ type: eventType, ...eventData, id }); 
  };

  // Handle live score update (e.g., when a goal is scored)
  const handleUpdateScore = (team, points) => {
    const updatedScore = { ...matchData.score, [team]: points }; // Update score for the team
    updateMatch(id, { score: updatedScore });
    sendAdminAction({ type: 'score', team, points, id }); 
  };

  // Handle match events like goals, cards, substitutions
  const renderEvents = () => {
    return matchData?.events.map((event, index) => (
      <div key={index}>
        <p>{event.type} - {event.team} at {event.time}</p>
      </div>
    ));
  };

  if (!matchData) {
    return <div>Loading...</div>; // Loading state if match data is not yet fetched
  }

  return (
    <div>
      <h1>Match: {matchData.matchTitle}</h1>
      <p>{matchData.date}</p>
      <p>{matchData.location}</p>
      
      {/* Scoreboard */}
      <div>
        <h2>Scoreboard:</h2>
        <p>{matchData.score.teamA} - {matchData.score.teamB}</p>
      </div>
      
      {/* Timer */}
      <div>
        <h2>Live Timer:</h2>
        <p>{timer} minutes</p>
      </div>

      {/* Start Match Button */}
      {matchData.status === 'upcoming' && (
        <button onClick={handleStartMatch}>Start Match</button>
      )}

      {/* Event Buttons (for Admin) */}
      <div>
        <button onClick={() => handleLogEvent('goal', { team: 'teamA', time: timer })}>Log Goal for Team A</button>
        <button onClick={() => handleLogEvent('goal', { team: 'teamB', time: timer })}>Log Goal for Team B</button>
        <button onClick={() => handleLogEvent('card', { team: 'teamA', type: 'yellow', time: timer })}>Log Yellow Card for Team A</button>
        <button onClick={() => handleLogEvent('card', { team: 'teamB', type: 'red', time: timer })}>Log Red Card for Team B</button>
        <button onClick={() => handleLogEvent('substitution', { team: 'teamA', playerIn: 'Player X', playerOut: 'Player Y', time: timer })}>Log Substitution for Team A</button>
      </div>

      {/* Match Events (Goals, Cards, Substitutions) */}
      <div>
        <h3>Match Events:</h3>
        {renderEvents()}
      </div>
    </div>
  );
};

export default MatchPage;
