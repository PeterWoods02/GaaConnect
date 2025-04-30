import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { getMatches } from "../../../api/matchApi";
import { getAllStatistics } from "../../../api/statsApi";

const TeamStats = ({ teamId }) => {
  const [stats, setStats] = useState({ winRate: null, topScorer: null });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const matches = await getMatches(token);
        const statsData = await getAllStatistics(token);

        const teamMatches = matches.filter(
          (m) => m.status === "fullTime" && m.team?._id === teamId
        );

        const wins = teamMatches.filter((m) => {
          const teamScore = (m.score?.teamGoals ?? 0) * 3 + (m.score?.teamPoints ?? 0);
          const oppScore = (m.score?.oppositionGoals ?? 0) * 3 + (m.score?.oppositionPoints ?? 0);
          return teamScore > oppScore;
        }).length;

        const winRate = teamMatches.length ? Math.round((wins / teamMatches.length) * 100) : 0;

        const teamPlayerIds = teamMatches
          .flatMap((match) => match.team?.players || []);

        const relevantStats = statsData.filter((stat) =>
          teamPlayerIds.includes(stat.player._id)
        );

        const playerScores = {};

        for (let stat of relevantStats) {
          const id = stat.player._id;
          const name = stat.player.name;
          const score = (stat.goals || 0) * 3 + (stat.points || 0);
          if (!playerScores[id]) {
            playerScores[id] = { name, goals: 0, points: 0, score: 0 };
          }
          playerScores[id].goals += stat.goals || 0;
          playerScores[id].points += stat.points || 0;
          playerScores[id].score += score;
        }

        const top = Object.values(playerScores).sort((a, b) => b.score - a.score)[0];
        const topScorer = top ? `${top.name} (${top.goals}-${top.points})` : 'N/A';

        setStats({ winRate, topScorer });
      } catch (err) {
        console.error("Failed to fetch team stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
        <Typography variant="h6" fontWeight="bold">Team Stats</Typography>
        <Typography variant="body1">Win Percentage: {stats.winRate}%</Typography>
        <Typography variant="body1">Top Scorer: {stats.topScorer}</Typography>
      </CardContent>
    </Card>
  );
};

export default TeamStats;
