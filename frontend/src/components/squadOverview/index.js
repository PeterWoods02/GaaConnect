import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box } from '@mui/material';
import { getTeamById } from '../../api/teamsApi';
import { getAllStatistics } from '../../api/statsApi';

const SquadOverview = () => {
  const [teamStats, setTeamStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;

  //Added useMemo to prevent recreating of array
  const userTeams = useMemo(() => user?.team || [], [token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getAllStatistics(token);

        const teamDetails = await Promise.all(userTeams.map((teamId) => getTeamById(teamId, token)));

        const results = teamDetails.map((team) => {
          const teamStats = stats.filter(stat =>
            team.players.includes(stat.player._id)
          );

          const topScorerObj = teamStats
            .map(stat => ({
              playerName: stat.player.name,
              score: (stat.goals || 0) * 3 + (stat.points || 0),
              formatted: `${stat.goals}-${stat.points}`,
            }))
            .sort((a, b) => b.score - a.score)[0];

          return {
            teamName: team.name,
            players: team.players.length,
            topScorer: topScorerObj
              ? `${topScorerObj.playerName} (${topScorerObj.formatted})`
              : 'N/A',
          };
        });

        setTeamStats(results);
      } catch (err) {
        console.error('Error loading squad overview:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userTeams.length && token) {
      fetchData();
    }
  }, [userTeams, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {teamStats.map((stat, index) => (
        <Card sx={{ p: 2, mb: 2 }} key={index}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold">
              {stat.teamName} Squad Overview
            </Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={4}>
                <Typography variant="h5">{stat.players}</Typography>
                <Typography variant="body2">Players</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">{stat.topScorer}</Typography>
                <Typography variant="body2">Top Scorer</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default SquadOverview;
