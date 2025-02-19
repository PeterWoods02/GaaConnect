import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const TeamOverview = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Team Overview
        </Typography>
        <Typography variant="body1">Team Name: Portlaw Senior</Typography>
        <Typography variant="body1">Division: Senior League</Typography>
      </CardContent>
    </Card>
  );
};

export default TeamOverview;
