import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { Container, Grid, CircularProgress, Button } from "@mui/material";
import { getTeamById } from "../api/teamsApi.js";
import TeamOverview from "../components/manageTeams/teamOverview/index.js";
import FixturesList from "../components/fixturesList/index.js";
import RecentResults from "../components/manageTeams/recentResults/index.js";
import TeamStats from "../components/manageTeams/teamStats/index.js";
//import PlayerManagement from "../components/manageTeams/playerManagement/index.js";

const ManageTeams = () => {
  const { teamId } = useParams();
  const [teamData, setTeamData] = useState(null);
  const navigate = useNavigate(); 
  
  // Fetch team data when the teamId changes
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        console.log("Fetching team with ID:", teamId); 
        const data = await getTeamById(teamId);
        setTeamData(data);
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      }
    };
    fetchTeamData();
  }, [teamId]);

  if (!teamData) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  // Button click handler to navigate to the Player Management page
  const handlePlayerManagementClick = () => {
    navigate(`/playerManagement/${teamId}`); 
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <TeamOverview team={teamData} />
          <FixturesList teamId={teamId} sx={{ mt: 4 }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentResults teamId={teamId} />
          <TeamStats teamId={teamId} sx={{ mt: 4 }} />
          
          {/* Player Management Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlayerManagementClick}
            sx={{ mt: 4 }}
          >
            Manage Players
          </Button>
          
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManageTeams;
