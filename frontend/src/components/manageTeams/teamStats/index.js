import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const TeamStats = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Team Stats
        </Typography>
        <Typography variant="body1">Win Percentage: 75%</Typography>
        <Typography variant="body1">Top Scorer: John Doe (3-15)</Typography>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
