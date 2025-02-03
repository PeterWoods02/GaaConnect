import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge } from '@mui/material';
import { Notifications, AccountCircle } from '@mui/icons-material';

const DashboardHeader = () => {
  return (
    <AppBar position="sticky" color="transparent">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Club Dashboard
        </Typography>

        {/* Notifications Icon */}
        <IconButton color="inherit">
          <Badge badgeContent={3} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Profile Icon */}
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
