import React, { useEffect, useState } from 'react';
import {Card,CardContent,Typography,List,ListItem,ListItemText,Divider,CircularProgress,Box,} from '@mui/material';
import { getMatches } from '../../api/matchApi';

const FixturesList = () => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const allMatches = await getMatches(token);
        const today = new Date();
        today.setHours(0, 0, 0, 0);  

        const upcomingFixtures = allMatches.filter((match) => {
          const matchDate = new Date(match.date);
          matchDate.setHours(0, 0, 0, 0); 
          return match.status === 'upcoming' && matchDate >= today;
        });

        setFixtures(upcomingFixtures);
      } catch (err) {
        setError('Failed to load fixtures');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFixtures();
    }
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Upcoming Fixtures
        </Typography>

        {error ? (
          <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>
        ) : fixtures.length === 0 ? (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No upcoming fixtures for your team.
          </Typography>
        ) : (
          <List>
            {fixtures.map((fixture, index) => (
              <React.Fragment key={fixture._id || index}>
                <ListItem>
                  <ListItemText
                    primary={`${fixture.team?.name || 'Your Team'} vs ${fixture.opposition}`}
                    secondary={`${new Date(fixture.date).toLocaleDateString()} - ${new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  />
                </ListItem>
                {index !== fixtures.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default FixturesList;
