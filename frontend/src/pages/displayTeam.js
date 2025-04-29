import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTeamForMatch } from '../api/matchApi.js';
import { getTeamById } from '../api/teamsApi.js';
import { CircularProgress, Alert, Typography } from '@mui/material';
import Pitch from "../components/pitch/index.js";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Bench from '../components/bench/index.js';
import { useNavigate } from "react-router-dom";

const MatchDaySquad = () => {
  const { id } = useParams(); // Match ID from URL
  const [teamPositions, setTeamPositions] = useState(null);
  const [bench, setBench] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSquad = async () => {
      try {
        const matchData = await getTeamForMatch(id);

        if (!matchData || !matchData.team) {
          throw new Error("No team linked to match");
        }

        const teamId = matchData.team;
        const teamData = await getTeamById(teamId);

        const playersById = {};
        teamData.players.forEach(player => {
          playersById[player._id] = player;
        });

        // fill pitch positions
        const filledPositions = {};
        for (const [position, playerId] of Object.entries(matchData.positions || {})) {
          filledPositions[position] = playersById[playerId] || null;
        }

        // fill bench
        const filledBench = (matchData.bench || []).map(pid => playersById[pid]).filter(Boolean);

        setTeamPositions(filledPositions);
        setBench(filledBench);
      } catch (error) {
        console.error("Error fetching match day squad:", error);
        setError("Failed to fetch team data");
      } finally {
        setLoading(false);
      }
    };

    fetchSquad();
  }, [id]);

  if (loading) return <div className="flex justify-center p-10"><CircularProgress /></div>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!teamPositions) return <p>Team positions not found</p>;

  return (
    <div className="p-4">
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: '#00587c',
            color: '#fff',
            padding: '8px 16px',
            fontSize: '14px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Match Day Squad
      </Typography>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '40px', marginTop: '24px' }}>
        <DndProvider backend={HTML5Backend}>
          <Pitch positions={teamPositions} readOnly={true} />
        </DndProvider>
    {bench.length > 0 && (
      <Bench bench={bench} />
    )}
    </div>
  </div>
);
};

export default MatchDaySquad;
