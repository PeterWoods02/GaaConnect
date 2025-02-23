import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Typography } from "@mui/material";
import { getPlayers } from "../api/playersApi";

const PlayersPage = () => {
  const [players, setPlayers] = useState([]);
  const [sortBy, setSortBy] = useState("total_score");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  // Sorting function
  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  // Calculate total score dynamically
  const getTotalScore = (player) => {
    const goals = player.statistics?.goals || 0;
    const points = player.statistics?.points || 0;
    return (goals * 3) + points;
  };

  // Sort players dynamically
  const sortedPlayers = [...players].sort((a, b) => {
    const aValue = sortBy === "total_score" ? getTotalScore(a) : (a.statistics?.[sortBy] || 0);
    const bValue = sortBy === "total_score" ? getTotalScore(b) : (b.statistics?.[sortBy] || 0);
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6" textAlign="center" gutterBottom>
        Player Statistics
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            {["goals", "points", "minutes_played", "ratings", "cards", "total_score"].map((col) => (
              <TableCell key={col} align="right">
                <TableSortLabel
                  active={sortBy === col}
                  direction={sortBy === col ? sortOrder : "asc"}
                  onClick={() => handleSort(col)}
                >
                  {col === "total_score" ? "TOTAL SCORE" : col.replace("_", " ").toUpperCase()}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedPlayers.map((player) => (
            <TableRow key={player._id}>
              <TableCell>{player.name}</TableCell>
              {["goals", "points", "minutes_played", "ratings", "cards"].map((col) => (
                <TableCell key={col} align="right">
                  {player.statistics ? player.statistics[col] || 0 : 0}
                </TableCell>
              ))}
              <TableCell align="right"><strong>{getTotalScore(player)}</strong></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayersPage;
