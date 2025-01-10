import React from 'react';
import { useDrag } from 'react-dnd';
import theme from '../../assets/themes/theme.js';

const PlayerCard = ({ player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'PLAYER',  
    item: player,  
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),  // track if being dragged
    }),
  }));

  return (
    <li
      ref={drag} 
      style={{
        ...theme.customStyles.listPlayersForTeam.playerItem,
        opacity: isDragging ? 0.5 : 1,  // transparent while dragging
        cursor: 'move',  // Indicate it's draggable
      }}
    >
      {player.name}
    </li>
  );
};

const ListPlayersForTeam = ({ players }) => {
  return (
    <div style={theme.customStyles.listPlayersForTeam.playerList}>
      <h3>Available Players</h3>
      <ul>
        {players.map((player, index) => (
          <PlayerCard key={index} player={player} /> 
        ))}
      </ul>
    </div>
  );
};

export default ListPlayersForTeam;
