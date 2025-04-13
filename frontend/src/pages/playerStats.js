import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableSortLabel, Typography } from "@mui/material";
import { getAllStatistics } from "../api/statsApi";
import { useNavigate } from "react-router-dom";

const PlayersStatsPage = () => {
  const [statistics, setStatistics] = useState([]);
  const [sortBy, setSortBy] = useState("total_score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem("token");
      try {
        const stats = await getAllStatistics(token);
        setStatistics(stats);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError(error.message);
      }
    };
    fetchStatistics();
  }, []);

  const handleSort = (column) => {
    const isAsc = sortBy === column && sortOrder === "asc";
    setSortBy(column);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const getTotalScore = (stat) => {
    const goals = stat.goals || 0;
    const points = stat.points || 0;
    return (goals * 3) + points;
  };

  const sortedStats = [...statistics].sort((a, b) => {
    const aValue = sortBy === "total_score" ? getTotalScore(a) : (a[sortBy] || 0);
    const bValue = sortBy === "total_score" ? getTotalScore(b) : (b[sortBy] || 0);
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  return (
    <TableContainer component={Paper} sx={{ mt: 3, p: 2 }}>
    <Typography variant="h6" textAlign="center" gutterBottom>
      Player Statistics
    </Typography>
  
    {error ? (
    <Typography align="center" color="error" sx={{ py: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {error}
      {error === "You are not assigned to any team yet." && (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/contact-admin")}>
          Contact Admin
        </Button>
      )}
  </Typography>
    ) : statistics.length === 0 ? (
      <Typography align="center" sx={{ py: 5 }}>
        No statistics available for your team.
      </Typography>
    ) : (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Name</strong></TableCell>
            {["goals", "points", "minutes_played", "ratings", "yellowCards", "redCards", "total_score"].map((col) => (
              <TableCell key={col} align="right">
                <TableSortLabel
                  active={sortBy === col}
                  direction={sortBy === col ? sortOrder : "asc"}
                  onClick={() => handleSort(col)}
                >
                  {col === "total_score" ? "TOTAL SCORE" : col.replace(/([A-Z])/g, " $1").toUpperCase()}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedStats.map((stat) => (
            <TableRow key={stat._id}>
              <TableCell>{stat.player?.name || "Unknown Player"}</TableCell>
              {["goals", "points", "minutes_played", "ratings", "yellowCards", "redCards"].map((col) => (
                <TableCell key={col} align="right">
                  {stat[col] || 0}
                </TableCell>
              ))}
              <TableCell align="right"><strong>{getTotalScore(stat)}</strong></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </TableContainer>
  );
};


export default PlayersStatsPage;
