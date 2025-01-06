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

export default router;
