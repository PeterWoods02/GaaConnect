import React, { useEffect, useState } from 'react';
import { getTeamById, getDefaultLineup } from '../api/teamsApi.js';
import ListPlayersForTeam from '../components/listPlayersForTeam/index.js';
import Pitch from '../components/pitch/index.js'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useLocation } from 'react-router-dom';
import { getMatchById } from '../api/matchApi.js';

const CreateTeam = () => {
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const { matchId, teamId } = useParams();
  const location = useLocation();
  const isDefaultMode = location.pathname.includes('/default/');
  const [teamIdToUse, setTeamIdToUse] = useState(null);

  const [positions, setPositions] = useState({
    Goalkeeper: null,
    RightCornerBack: null,
    FullBack: null,
    LeftCornerBack: null,
    RightHalfBack: null,
    CentreHalfBack: null,
    LeftHalfBack: null,
    Midfielder1: null,
    Midfielder2: null,
    RightHalfForward: null,
    CentreHalfForward: null,
    LeftHalfForward: null,
    RightCornerForward: null,
    FullForward: null,
    LeftCornerForward: null,
  });

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        let localTeamId = teamId;
        let startingPositions = {};
        let startingBench = [];
    
        if (!teamId && matchId) {
          const match = await getMatchById(matchId);
          localTeamId = match?.team?._id || match?.team;
    
          if (!localTeamId) {
            console.error('No team ID available from match.');
            setPlayers([]);
            setAvailablePlayers([]);
            return;
          }
    
          // if not default mode pull from Match
          if (!isDefaultMode) {
            startingPositions = match.teamPositions || {};
            startingBench = match.bench || [];
          }
        }
    
        if (!localTeamId) {
          console.error('No team ID available.');
          setPlayers([]);
          setAvailablePlayers([]);
          return;
        }
    
        setTeamIdToUse(localTeamId);
    
        const team = await getTeamById(localTeamId);
        if (!team || !team.players || team.players.length === 0) {
          setPlayers([]);
          setAvailablePlayers([]);
          return;
        }
    
        const teamPlayers = (team.players || []).filter(p => p?.role === 'player' && p?._id);
        setPlayers(teamPlayers);
    
        // if default mode pull Team from defaultLineup
        if (isDefaultMode) {
          const { defaultLineup = {}, bench = [] } = await getDefaultLineup(localTeamId);
          startingPositions = defaultLineup;
          startingBench = bench;
        }
    
        if (Object.keys(startingPositions).length > 0) {
          const resolvedPositions = {};

            for (const [position, playerOrId] of Object.entries(startingPositions)) {
              if (playerOrId) {
                if (typeof playerOrId === 'object' && playerOrId._id) {
                  // Already a full player object
                  resolvedPositions[position] = playerOrId;
                } else {
                  // if its id resolve to object
                  const playerObj = teamPlayers.find(p => p._id === playerOrId);
                  if (playerObj) {
                    resolvedPositions[position] = playerObj;
                  }
                }
              }
            }

          setPositions(resolvedPositions);
          if (startingBench.length > 0) {
            const benchPlayers = teamPlayers.filter(p => startingBench.some(b => b._id === p._id || b === p._id));
            setAvailablePlayers(benchPlayers);
          } else {
            const assignedIds = Object.values(startingPositions).filter(Boolean);
            const filtered = teamPlayers.filter(p => p && !assignedIds.includes(p._id));
            setAvailablePlayers(filtered);
          }
        } else {
          setAvailablePlayers(teamPlayers);
        }
    
      } catch (error) {
        console.error('Error loading team data:', error);
        setAvailablePlayers([]);
      }
    };
    
    if (teamId || matchId) fetchTeamData();
  }, [teamId, matchId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: 'flex',
          gap: '30px',
          padding: '30px',
          backgroundColor: '#f4f4f4',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            flex: '1',
            maxWidth: '300px',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            height: 'calc(100vh - 60px)',
          }}
        >
          <ListPlayersForTeam players={availablePlayers} />
        </div>

        <div
          style={{
            flex: '2',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Pitch
            positions={positions}
            setPositions={setPositions}
            availablePlayers={availablePlayers}
            setAvailablePlayers={setAvailablePlayers}
            teamId={teamIdToUse}
          />
        </div>
      </div>
    </DndProvider>
  );
};

export default CreateTeam;
