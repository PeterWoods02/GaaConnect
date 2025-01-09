import React, { useEffect, useState } from 'react';
import { getPlayers } from '../api/playersApi.js'; 
import ListPlayersForTeam from '../components/listPlayersForTeam/index.js';

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
    <div className="create-team">
      <ListPlayersForTeam players={players} />
    </div>
  );
};

export default CreateTeam;
