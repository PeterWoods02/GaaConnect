import React, { useEffect, useState } from 'react';
import { getTeamById, getDefaultLineup } from '../api/teamsApi.js';
import ListPlayersForTeam from '../components/listPlayersForTeam/index.js';
import Pitch from '../components/pitch/index.js'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';

const CreateTeam = () => {
  const [players, setPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const { matchId } = useParams(); // assuming route is /createTeam/:matchId
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const teamId = user?.team?.[0];

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
        const team = await getTeamById(teamId);
        const teamPlayers = (team.players || []).filter(p => p?.role === 'player' && p?._id);
        setPlayers(teamPlayers);
  
        
        const defaultLineup = await getDefaultLineup(teamId);
        if (defaultLineup && Object.keys(defaultLineup).length > 0) {
          setPositions(defaultLineup);
        }
  
        const assignedIds = Object.values(defaultLineup || {}).map(p => p?._id);
        const filtered = teamPlayers.filter(p => p && !assignedIds.includes(p._id));
        setAvailablePlayers(filtered);
  
      } catch (error) {
        console.error('Error loading team data:', error);
      }
    };
  
    if (teamId) fetchTeamData();
  }, [teamId]);

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
    />
  </div>
</div>
    </DndProvider>
  );
};

export default CreateTeam;
