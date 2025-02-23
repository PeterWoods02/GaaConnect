import React from "react";
import { List, ListItem, ListItemText, Button, Typography } from "@mui/material";

const PlayerList = ({ title, players, onPlayerAction, actionType }) => {
  return (
    <>
      <Typography variant="subtitle1" fontWeight="bold" textAlign="center" gutterBottom>
        {title}
      </Typography>
      <List sx={{ border: "1px solid #ddd", borderRadius: 2, maxHeight: 300, overflowY: "auto" }}>
        {players.map((player) => (
          <ListItem key={player._id} secondaryAction={
            <Button
              variant="contained"
              color={actionType === "add" ? "primary" : "error"}
              onClick={() => onPlayerAction(player)}
            >
              {actionType === "add" ? "Add" : "Remove"}
            </Button>
          }>
            <ListItemText primary={player.name} secondary={player.email} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default PlayerList;
