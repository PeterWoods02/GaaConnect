import React from "react";
import { Button, Grid, Container, Typography } from "@mui/material";
import DashboardHeader from '../components/dashboardHeader';
import FixturesList from '../components/fixturesList';
import SquadOverview from '../components/squadOverview';
import NotificationsPanel from '../components/notificationsPanel';

const Home = () => {
  return (
    <>
      <DashboardHeader />
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            <FixturesList />
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <SquadOverview />
            <NotificationsPanel sx={{ mt: 4 }} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
