import React, { useState, useEffect } from "react";
import {Card,CardContent,Typography,Autocomplete,List,ListItem,ListItemText,Button,TextField,} from "@mui/material";
import { addPlayerToTeam, removePlayerFromTeam } from "../api/teamsApi";
import { getPlayers } from "../api/playersApi";
import { useParams } from "react-router-dom";

const PlayerManagementPage = () => {
  const [players, setPlayers] = useState([]); 
  const [allPlayers, setAllPlayers] = useState([]); 
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { teamId } = useParams();

  // Fetch all players from the database
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setAllPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  // Add selected player to the team
  const handleAddPlayer = async () => {
    if (selectedPlayer) {
      // Ensure player isn't already added to the team
      if (!players.some((player) => player._id === selectedPlayer._id)) {
        try {
          // Pass teamId and selectedPlayer to the API call
          await addPlayerToTeam(teamId, selectedPlayer._id); 
          setPlayers([...players, selectedPlayer]); // update UI with new player
        } catch (error) {
          console.error("Error adding player:", error);
        }
      }
      setSelectedPlayer(null); // Reset after adding player
    }
  };
  

  // Remove player from the team
  const handleRemovePlayer = async (playerId) => {
    try {
      // Pass teamId and playerId to remove the player
      await removePlayerFromTeam(teamId, playerId);
      setPlayers(players.filter((player) => player._id !== playerId)); 
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

        {/* Autocomplete Dropdown */}
        <Autocomplete
          options={allPlayers}
          getOptionLabel={(option) => `${option.name} (Email: ${option.email})`} // Display both name and email
          onChange={(event, newValue) => setSelectedPlayer(newValue)}
          isOptionEqualToValue={(option, value) => option._id === value._id} // Ensure uniqueness
          renderInput={(params) => (
            <TextField {...params} label="Search Player" variant="outlined" />
          )}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPlayer}
          disabled={!selectedPlayer}
        >
          Add Player
        </Button>

        {/* Players List */}
        <List sx={{ mt: 2 }}>
          {players.map((player) => (
            <ListItem
              key={player._id} 
              secondaryAction={
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleRemovePlayer(player._id)}
                >
                  Remove
                </Button>
              }
            >
              {/* Display Name and Email for each player */}
              <ListItemText
                primary={`${player.name} (Email: ${player.email})`}
                secondary={player.position}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default PlayerManagementPage;
