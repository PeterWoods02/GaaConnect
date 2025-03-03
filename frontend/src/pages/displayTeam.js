import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTeamForMatch } from '../api/matchApi.js';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';

const MatchDaySquad = () => {
  const { id } = useParams(); // Fetch the match ID from URL params
  const [teamPositions, setTeamPositions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Fetch team positions from the backend
  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const positions = await getTeamForMatch(id); 
        setTeamPositions(positions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching match day squad:", error);
        setLoading(false);
        setError("Failed to fetch team data");
      }
    };

    fetchSquad();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!teamPositions) return <p>Team positions not found</p>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Match Day Squad
      </Typography>
      <List>
        {/* Iterate over teamPositions using Object.entries */}
        {Object.entries(teamPositions).map(([position, playerId], index) => (
          <ListItem key={index}>
            <ListItemText
              primary={position}
              secondary={`Player ID: ${playerId}`} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MatchDaySquad;
