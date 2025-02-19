import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import { getPlayers, deletePlayer } from "../../../api/playersApi.js"; 

const PlayerManagement = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Fetch players from the API
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers(); // fetch players from API
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    
    fetchPlayers();
  }, []);

  const handleRemovePlayer = async (id) => {
    try {
      await deletePlayer(id); // delete player by ID
      setPlayers(players.filter(player => player.id !== id)); // update state after deletion
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">
          Player Management
        </Typography>
        <List>
          {players.map((player) => (
            <ListItem key={player.id} secondaryAction={
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRemovePlayer(player.id)} // trigger removal
              >
                Remove
              </Button>
            }>
              <ListItemText primary={player.name} secondary={player.position} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PlayerManagement;
