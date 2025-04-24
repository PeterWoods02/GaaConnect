import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardContent, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { getMatches } from "../api/matchApi"; 
import { useAuth } from "../context/authContext";

const SelectMatch = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!token || !user?.id) return;
  
      try {
        const data = await getMatches(token);
        const upcomingMatches = data.filter(
          (match) =>
            match.status === "upcoming" &&
            match.team?.manager?.includes(user.id)
        );
        setMatches(upcomingMatches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token, user]);
  

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
        Select a Match to Manage
      </Typography>

      {matches.length === 0 ? (
      <Typography align="center" sx={{ mt: 4 }} color="textSecondary">
        No matches available for your team at the moment.
      </Typography>
    ) : (
      <Grid container spacing={2}>
        {matches.map((match) => (
          <Grid item xs={12} key={match._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{match.matchTitle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {new Date(match.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {match.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Opposition: {match.score?.opposition}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Admission Fee: €{match.admissionFee}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => navigate(`/createTeam/${match._id}`)}
                >
                  Manage Match
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Container>
  );
};

export default SelectMatch;
