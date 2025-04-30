import React, { useState, useEffect } from "react";
import { Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TableSortLabel, Typography,
  Select, MenuItem, FormControl, InputLabel } from "@mui/material";
  import { getAllStatistics, getStatisticsByTeamId } from "../api/statsApi";
import { getTeams } from "../api/teamsApi"; 
import { useNavigate } from "react-router-dom";

const PlayersStatsPage = () => {
  const [statistics, setStatistics] = useState([]);
  const [sortBy, setSortBy] = useState("total_score");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamsList = async () => {
      try {
        const data = await getTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeamsList();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      const token = localStorage.getItem("token");
      if (!token || !selectedTeamId) return;

      try {
        const stats = await getStatisticsByTeamId(selectedTeamId, token);
        setStatistics(stats);
        setError(null);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError(error.message);
      }
    };

    fetchStatistics();
  }, [selectedTeamId]);

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

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Team</InputLabel>
        <Select
          value={selectedTeamId}
          label="Select Team"
          onChange={(e) => setSelectedTeamId(e.target.value)}
        >
          {teams.map((team) => (
            <MenuItem key={team._id} value={team._id}>
              {team.name} ({team.age_group})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
          {selectedTeamId ? "No statistics available for this team." : "Please select a team to view statistics."}
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              {["goals", "points", "yellowCards", "redCards", "total_score"].map((col) => (
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
                {["goals", "points", "yellowCards", "redCards"].map((col) => (
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
