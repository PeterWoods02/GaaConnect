import React, { useEffect, useState } from 'react';
import { getPlayers } from '../api/usersApi.js';
import ListPlayersForTeam from '../components/listPlayersForTeam/index.js';
import Pitch from '../components/pitch/index.js'; 
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CreateTeam = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await getPlayers();
        setPlayers(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
        <ListPlayersForTeam players={players} />
        <Pitch /> 
      </div>
    </DndProvider>
  );
};

export default CreateTeam;
