import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { getTeams } from "../api/teamsApi"; 

const SelectTeam = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getTeams(); 
        setTeams(data); // Store teams
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Select a Team to Manage
      </Typography>
      <Grid container spacing={2}>
        {teams.map((team) => (
          <Grid item xs={12} key={team._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{team.name}</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/manageteams/${team._id}`)} // Use actual ID from DB
                >
                  Manage Team
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SelectTeam;
