import React from 'react';
import theme from '../../assets/themes/theme.js';

const ReadOnlyBench = ({ bench }) => {
  return (
    <div style={theme.customStyles.listPlayersForTeam.playerList}>
      <h3>Bench</h3>
      <ul>
        {bench.map((player, index) => (
          <li
            key={player._id || index}
            style={{
              ...theme.customStyles.listPlayersForTeam.playerItem,
              opacity: 1,
              cursor: 'default',
            }}
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReadOnlyBench;
