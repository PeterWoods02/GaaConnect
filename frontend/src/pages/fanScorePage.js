import React, { useEffect, useState } from 'react';
import { getMatches } from '../api/matchApi';
import { useNavigate } from 'react-router-dom';
import {Container,Paper,Typography,Grid,Button,Box,} from '@mui/material';

const FanHomePage = () => {
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  const formatScore = (match) => {
    const { teamGoals = 0, teamPoints = 0, oppositionGoals = 0, oppositionPoints = 0 } = match.score || {};
    const homeScore = `${teamGoals}-${teamPoints}`;
    const awayScore = `${oppositionGoals}-${oppositionPoints}`;
    return `${homeScore} | ${awayScore}`;
  };
  

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        GAA Match Centre
      </Typography>

      <Grid container spacing={2}>
        {matches.map((match) => (
          <Grid item xs={12} key={match._id}>
            <Paper elevation={3} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
              <Typography variant="h6">
                {match.team?.name ?? 'Unknown Team'} vs {match.opposition ?? 'Unknown Opponent'}
                </Typography>

                <Typography variant="body2">{match.date}</Typography>
                <Typography variant="body2">Status: {match.status}</Typography>
              </Box>

              <Box textAlign="right">
                <Typography variant="h6">{formatScore(match)}</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/fanPage/match/${match._id}`)}
                >
                  View Match
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FanHomePage;
