import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const squadStats = {
  players: 25,
  injured: 2,
  topScorer: 'John Murphy  3-18',
};

const SquadOverview = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Squad Overview
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Typography variant="h5">{squadStats.players}</Typography>
            <Typography variant="body2">Players</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">{squadStats.injured}</Typography>
            <Typography variant="body2">Injured</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">{squadStats.topScorer}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SquadOverview;
