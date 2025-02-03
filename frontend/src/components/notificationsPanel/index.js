import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const notifications = [
  { message: "Training scheduled for Feb 12 at 5:00 PM." },
  { message: "New fixture added: Portlaw vs Kilmac on Feb 10." },
];

const NotificationsPanel = () => {
  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Notifications
        </Typography>
        <List>
          {notifications.map((notification, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={notification.message} />
              </ListItem>
              {index !== notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
