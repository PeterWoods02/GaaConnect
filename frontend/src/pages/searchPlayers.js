import React, { useState, useEffect } from 'react';
import {TextField,List,ListItem,ListItemText,Modal,Box,Typography,Paper,Avatar,ListItemAvatar,} from '@mui/material';
import { getPlayers } from '../api/usersApi';

const SearchPlayers = ({ userRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      const token = localStorage.getItem('token');
      try {
        const data = await getPlayers(token);
        setPlayers(data);
      } catch (err) {
        console.error('Error loading players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const filtered = players.filter((player) =>
      (player.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [searchTerm, players]);

  const handleOpenPlayer = (player) => {
    setSelectedPlayer(player);
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom style={{ color: '#1976d2' }}>
        Search Players
      </Typography>

      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      {loading ? (
        <Typography align="center" style={{ padding: '20px' }}>
          Loading players...
        </Typography>
      ) : (
        <Paper elevation={2}>
          {filteredPlayers.length === 0 ? (
            <Typography align="center" style={{ padding: '20px' }}>
              No players found.
            </Typography>
          ) : (
            <List>
                {filteredPlayers.map((player) => (
                    <ListItem
                    key={player._id}
                    component="button"
                    onClick={() => handleOpenPlayer(player)}
                    >
                    <ListItemAvatar>
                        <Avatar src={player.profilePicture} alt={player.name} />
                    </ListItemAvatar>
                    <ListItemText primary={player.name} secondary={player.position} />
                    </ListItem>
                ))}
            </List>
          )}
        </Paper>
      )}

      <Modal open={!!selectedPlayer} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {selectedPlayer && (
            <>
              <Typography variant="h6">{selectedPlayer.name}</Typography>
              <Typography>Email: {selectedPlayer.email}</Typography>
              <Typography>Position: {selectedPlayer.position}</Typography>
              <Typography>
                Date of Birth: {new Date(selectedPlayer.date_of_birth).toLocaleDateString()}
            </Typography>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default SearchPlayers;


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  };