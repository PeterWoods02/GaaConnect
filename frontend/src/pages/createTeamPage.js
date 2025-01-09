import React, { useEffect, useState } from 'react';
import { getPlayers } from '../api/playersApi.js'; 
import ListPlayersForTeam from '../components/listPlayersForTeam/index.js';
import Pitch from '../components/pitch/index.js'; 

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
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      <ListPlayersForTeam players={players} />
      <Pitch /> 
    </div>
  );
};

export default CreateTeam;
