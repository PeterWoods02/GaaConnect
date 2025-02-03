import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const fixtures = [
  { date: 'Feb 10', teams: 'Portlaw Senior vs Ballyduff', time: '7:30 PM' },
  { date: 'Feb 15', teams: 'Portlaw Junior vs Mount Sion', time: '6:00 PM' },
];

const FixturesList = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Upcoming Fixtures
        </Typography>
        <List>
          {fixtures.map((fixture, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={fixture.teams} secondary={`${fixture.date} - ${fixture.time}`} />
              </ListItem>
              {index !== fixtures.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default FixturesList;
