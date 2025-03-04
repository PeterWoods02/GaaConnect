import express from 'express';
import Player from './playerModel.js'; 

const router = express.Router();

// Get all players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        //.populate('statistics', 'goals points minutes_played ratings cards'); 

        res.status(200).json(players);
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get player by ID
router.get('/:id', async (req, res) => {
  try {
      const player = await Player.findById(req.params.id);
      
      if (!player) {
          return res.status(404).json({ message: 'Player not found' });
      }

      res.status(200).json(player);
  } catch (error) {
      console.error('Error fetching player by ID:', error);
      res.status(500).json({ message: 'Server error' });
  }
});


// add player
router.post('/', async (req, res) => {
    try {
      const { name, email, password, position, date_of_birth, statistics } = req.body;
      
      // Check if player already exists check email not name
      const existingPlayer = await Player.findOne({ email });
      if (existingPlayer) {
        return res.status(400).json({ message: 'Player with this email already exists.' });
      }
  
      const newPlayer = new Player({
        name,
        email,
        password, // hash before saving
        position,
        date_of_birth,
        statistics,
      });
  
      const savedPlayer = await newPlayer.save();
      res.status(201).json(savedPlayer);
    } catch (error) {
      console.error('Error adding player:', error);
      res.status(500).json({ message: 'Failed to add player' });
    }
  });
  
  // update player
  router.put('/:id', async (req, res) => {
    try {
      const { name, email, position, date_of_birth, statistics } = req.body;
      const updatedPlayer = await Player.findByIdAndUpdate(
        req.params.id, 
        { name, email, position, date_of_birth, statistics },
        { new: true } // Return the updated document
      );
  
      if (!updatedPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      }
  
      res.status(200).json(updatedPlayer);
    } catch (error) {
      console.error('Error updating player:', error);
      res.status(500).json({ message: 'Failed to update player' });
    }
  });
  
  // remove player
  router.delete('/:id', async (req, res) => {
    try {
      const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
      
      if (!deletedPlayer) {
        return res.status(404).json({ message: 'Player not found' });
      }
  
      res.status(200).json({ message: 'Player deleted successfully' });
    } catch (error) {
      console.error('Error deleting player:', error);
      res.status(500).json({ message: 'Failed to delete player' });
    }
  });

export default router;
