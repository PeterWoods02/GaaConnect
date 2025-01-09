import React from 'react';

const ListPlayersForTeam = ({ players }) => {
  return (
    <div className="player-list">
      <h3>Available Players</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index} className="player-item" draggable>
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPlayersForTeam;
