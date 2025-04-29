import { React, useEffect, useState } from "react";
import { Button, Grid, Container, Typography, CircularProgress, Box, Paper } from "@mui/material";
import DashboardHeader from '../components/dashboardHeader';
import FixturesList from '../components/fixturesList';
import SquadOverview from '../components/squadOverview';
import NotificationsPanel from '../components/notificationsPanel';
import { useAuth } from '../context/authContext';
import { getMatches } from '../api/matchApi';

const Home = () => {

  const { user, token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const all = await getMatches(token);
        const sorted = all.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMatches(sorted);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetch();
  }, [token]);

  const liveMatches = matches.filter(m => m.status === 'live');
  const recentResults = matches.filter(m => m.status === 'fullTime').slice(0, 3);

  return (
    <>
      <DashboardHeader />
      <Container maxWidth="lg" sx={{ my: 4 }}>
      {user?.name ? (
        <Typography variant="h6" gutterBottom>
          Welcome back, {user.name.split(' ')[0]}!
        </Typography>
      ) : (
        <Typography variant="h6" gutterBottom>
          Welcome!
        </Typography>
      )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <>
            {liveMatches.length > 0 && (
              <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
                  Live Now
                </Typography>
                {liveMatches.map(match => (
                  <Typography key={match._id}>
                    {match.team?.name ?? 'Team A'} vs {match.opposition} — <strong style={{ color: 'red' }}>Live</strong>
                  </Typography>
                ))}
              </Paper>
            )}

            {recentResults.length > 0 && (
              <Paper elevation={3} sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Results
                </Typography>
                {recentResults.map(match => {
                  const home = `${match.score?.teamGoals ?? 0}-${match.score?.teamPoints ?? 0}`;
                  const away = `${match.score?.oppositionGoals ?? 0}-${match.score?.oppositionPoints ?? 0}`;
                  return (
                    <Typography key={match._id}>
                      {match.team?.name ?? 'Team A'} {home} vs {away} {match.opposition}
                    </Typography>
                  );
                })}
              </Paper>
            )}
          </>
        )}

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <FixturesList />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {user?.role !== 'fan' && (
              <>
                <SquadOverview />
                <NotificationsPanel sx={{ mt: 4 }} />
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
