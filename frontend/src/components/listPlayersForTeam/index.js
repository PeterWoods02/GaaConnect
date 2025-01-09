import React from 'react';
import theme  from '../../assets/themes/theme.js';

const ListPlayersForTeam = ({ players }) => {


  return (
    <div style={theme.customStyles.listPlayersForTeam.playerList}>
      <h3>Available Players</h3>
      <ul>
        {players.map((player, index) => (
          <li
            key={index}
            style={theme.customStyles.listPlayersForTeam.playerItem}
            draggable
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPlayersForTeam;
