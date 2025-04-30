import React, { useEffect, useState } from "react";
import {Card,CardContent,Typography,List,ListItem,ListItemText,Divider,CircularProgress,Box,} from "@mui/material";
import { getMatches } from "../../../api/matchApi";

const RecentResults = ({ teamId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const matches = await getMatches(token);
        const fullTime = matches
          .filter(
            (m) => m.status === "fullTime" && m.team?._id === teamId
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3); // Get most recent 3

        const formatted = fullTime.map((match) => ({
          date: new Date(match.date).toLocaleDateString("en-IE", {
            day: "numeric",
            month: "short",
          }),
          teams: `${match.team.name} vs ${match.opposition}`,
          score: `${match.score?.teamGoals ?? 0}-${match.score?.teamPoints ?? 0} to ${match.score?.oppositionGoals ?? 0}-${match.score?.oppositionPoints ?? 0}`,
        }));

        setResults(formatted);
      } catch (err) {
        console.error("Failed to load recent results", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [teamId, token]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 2 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold">Recent Results</Typography>
        <List>
          {results.map((result, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={result.teams}
                  secondary={`${result.date} – Score: ${result.score}`}
                />
              </ListItem>
              {index !== results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentResults;
