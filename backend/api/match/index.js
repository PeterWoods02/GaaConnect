import express from 'express';
import Match from '../models/matchModel.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find()
            .populate('statistics'); 
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;