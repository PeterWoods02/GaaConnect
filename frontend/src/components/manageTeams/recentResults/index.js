import React from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const results = [
  { date: "Feb 5", teams: "Portlaw Senior vs Tramore", score: "2-10 to 1-12" },
  { date: "Feb 3", teams: "Portlaw Junior vs Dunhill", score: "1-8 to 2-5" },
];

const RecentResults = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Recent Results
        </Typography>
        <List>
          {results.map((result, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={result.teams} secondary={`${result.date} - Score: ${result.score}`} />
              </ListItem>
              {index !== results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentResults;
