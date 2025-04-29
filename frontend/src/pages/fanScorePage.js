import React, { useEffect, useState } from 'react';
import { getMatches } from '../api/matchApi';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Button, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../context/authContext.js'; 

const FanHomePage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth(); 

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getMatches(token); 
        const sortedMatches = [...data].sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1;
          if (a.status !== 'live' && b.status === 'live') return 1;
          return new Date(a.date) - new Date(b.date);
        });
        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [token]);

  const formatScore = (match) => {
    const { teamGoals = 0, teamPoints = 0, oppositionGoals = 0, oppositionPoints = 0 } = match.score || {};
    const homeScore = `${teamGoals}-${teamPoints}`;
    const awayScore = `${oppositionGoals}-${oppositionPoints}`;
    return `${homeScore} | ${awayScore}`;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        GAA Match Centre
      </Typography>

      <Grid container spacing={2}>
        {matches.map((match) => (
          <Grid item xs={12} key={match._id}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: match.status === 'fullTime' ? '#f8f8f8' : 'inherit',
              }}
            >
              <Box>
                <Typography variant="h6">
                  {match.team?.name ?? 'Unknown Team'} vs {match.opposition ?? 'Unknown Opponent'}
                </Typography>

                <Typography variant="body2">{match.date}</Typography>
                <Typography variant="body2">Status: {capitalize(match.status)}</Typography>
              </Box>

              <Box textAlign="right">
                <Typography variant="h6">{formatScore(match)}</Typography>
                <Box display="flex" gap={1} justifyContent="flex-end" flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/fanPage/match/${match._id}`)}
                >
                  {match.status === 'fullTime' ? 'Match Ended' : 'View Match'}
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/match/team/${match._id}`)}
                >
                  View Squad
                </Button>
              </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default FanHomePage;
