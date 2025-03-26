import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { getMatchById } from '../../../api/matchApi';


const Scoreboard = ({ matchId, teamA, teamB, refreshTrigger }) => {
  const [score, setScore] = useState({
    teamGoals: 0,
    teamPoints: 0,
    oppositionGoals: 0,
    oppositionPoints: 0,
  });

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return;

      try {
        const data = await getMatchById(matchId);
        if (data && data.score) {
          setScore(data.score);
        }
      } catch (error) {
        console.error('Error fetching match data:', error);
      }
    };

    fetchMatchData();
    const intervalId = setInterval(fetchMatchData, 30000);
    return () => clearInterval(intervalId);
  }, [matchId, refreshTrigger]);

  // Prefer props over local state if present
  const displayScore = {
    teamGoals: teamA?.goals ?? score.teamGoals,
    teamPoints: teamA?.points ?? score.teamPoints,
    oppositionGoals: teamB?.goals ?? score.oppositionGoals,
    oppositionPoints: teamB?.points ?? score.oppositionPoints
  };

  return (
    <div>
      <Typography variant="h5">Scoreboard:</Typography>
      <Typography>
        Home Team: {displayScore.teamGoals} - {displayScore.teamPoints} | 
        Away Team: {displayScore.oppositionGoals} - {displayScore.oppositionPoints}
      </Typography>
    </div>
  );
};

export default Scoreboard;

