import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Select, MenuItem } from '@mui/material';

const PlayerSelectorDialog = ({ open, onClose, players, onPlayerSelect, loading }) => {
  const [selectedPlayer, setSelectedPlayer] = React.useState('');

  const handleConfirm = () => {
    if (selectedPlayer) {
      onPlayerSelect(selectedPlayer);
      onClose();  // Close dialog after selecting a player
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Player</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : (
          <Select 
            fullWidth 
            value={selectedPlayer?._id || ''} 
            onChange={(e) => {
              const selected = players.find(p => p._id === e.target.value);
              setSelectedPlayer(selected); 
            }}
          >
            {players.map((player) => (
              <MenuItem key={player._id} value={player._id}>
                {player.name}
              </MenuItem>
            ))}
          </Select>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerSelectorDialog;