import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { addPlayerToTeam, removePlayerFromTeam, getTeamById } from "../api/teamsApi";
import { getPlayers } from "../api/playersApi";
import { useParams } from "react-router-dom";
import PlayerList from "../components/playerManagement/playerList/index.js";

const PlayerManagementPage = () => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const { teamId } = useParams();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const allPlayers = await getPlayers();
        const teamData = await getTeamById(teamId);

        if (!teamData || !teamData.players) {
          console.error("Error: Invalid team data received", teamData);
          return;
        }

        const teamPlayerIds = teamData.players.map((player) => player._id);
        setTeamPlayers(teamData.players);
        setAvailablePlayers(allPlayers.filter((player) => !teamPlayerIds.includes(player._id)));
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, [teamId]);

  const handleAddPlayer = async (player) => {
    try {
      await addPlayerToTeam(teamId, player._id);
      setTeamPlayers([...teamPlayers, player]);
      setAvailablePlayers(availablePlayers.filter((p) => p._id !== player._id));
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleRemovePlayer = async (player) => {
    try {
      await removePlayerFromTeam(teamId, player._id);
      setAvailablePlayers([...availablePlayers, player]);
      setTeamPlayers(teamPlayers.filter((p) => p._id !== player._id));
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Player Management
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={5}>
            <PlayerList title="Available Players" players={availablePlayers} onPlayerAction={handleAddPlayer} actionType="add" />
          </Grid>

          <Grid item xs={5}>
            <PlayerList title="Players in Team" players={teamPlayers} onPlayerAction={handleRemovePlayer} actionType="remove" />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlayerManagementPage;
