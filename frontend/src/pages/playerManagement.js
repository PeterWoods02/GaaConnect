import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, TextField, Slider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { addPlayerToTeam, removePlayerFromTeam, getTeamById } from "../api/teamsApi";
import { getPlayers } from "../api/usersApi";
import { useParams } from "react-router-dom";
import PlayerList from "../components/playerManagement/playerList/index.js";

const PlayerManagementPage = () => {
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const { teamId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [ageRange, setAgeRange] = useState([15, 40]);

  

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");
        const allPlayers = await getPlayers(token);
        const teamData = await getTeamById(teamId);
  
        if (!teamData || !teamData.players) {
          console.error("Error: Invalid team data received", teamData);
          return;
        }
  
        const teamPlayerIds = teamData.players.map((player) => player._id);
        setAvailablePlayers(allPlayers.filter((player) => !teamPlayerIds.includes(player._id)));
        setTeamPlayers(teamData.players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
  
    fetchPlayers();
  }, [teamId]);
  

  const handleAddPlayer = async (player) => {
    try {
      const token = localStorage.getItem("token");
      await addPlayerToTeam(teamId, player._id, token);
  
      // Re-fetch updated data
      const allPlayers = await getPlayers(token);
      const teamData = await getTeamById(teamId);
      const teamPlayerIds = teamData.players.map((p) => p._id);
  
      setAvailablePlayers(allPlayers.filter((p) => !teamPlayerIds.includes(p._id)));
      setTeamPlayers(teamData.players);
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };
  

  const handleRemovePlayer = async (player) => {
    try {
      const token = localStorage.getItem("token");
      await removePlayerFromTeam(teamId, player._id, token);
  
      // Re-fetch updated data
      const allPlayers = await getPlayers(token);
      const teamData = await getTeamById(teamId);
      const teamPlayerIds = teamData.players.map((p) => p._id);
  
      setAvailablePlayers(allPlayers.filter((p) => !teamPlayerIds.includes(p._id)));
      setTeamPlayers(teamData.players);
    } catch (error) {
      console.error("Error removing player:", error);
    }
  };

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };
  

  const filteredAvailablePlayers = availablePlayers
  .filter((player) =>
    (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )
  .filter((player) =>
    position ? player.position === position : true
  )
  .filter((player) => {
    const age = calculateAge(player.date_of_birth);
    return age >= ageRange[0] && age <= ageRange[1];
  })
  .sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'position') return a.position.localeCompare(b.position);
    if (sortBy === 'dob') return new Date(a.date_of_birth) - new Date(b.date_of_birth);
    return 0;
  });


  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Player Management
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Search Players"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Position</InputLabel>
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                label="Position"
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Forward">Forward</MenuItem>
                <MenuItem value="Midfield">Midfield</MenuItem>
                <MenuItem value="Defender">Defender</MenuItem>
                <MenuItem value="Goalkeeper">Goalkeeper</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="position">Position</MenuItem>
                <MenuItem value="dob">Date of Birth</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2">Age Range</Typography>
            <Slider
              value={ageRange}
              onChange={(_, newValue) => setAgeRange(newValue)}
              valueLabelDisplay="auto"
              min={10}
              max={50}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={5}>
          <PlayerList
            title="Available Players"
            players={filteredAvailablePlayers}
            onPlayerAction={handleAddPlayer}
            actionType="add"
          />
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
