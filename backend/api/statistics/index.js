import express from 'express';
import Statistics from './statisticsModel.js';

const router = express.Router();

// Get all statistics for a particular player or match
router.get('/', async (req, res) => {
    try {
        const statistics = await Statistics.find().populate('player');
        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific statistics document by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid statistics ID' });
    }

    try {
        const statistics = await Statistics.findById(id).populate({ path: 'player', model: 'User' });


        if (!statistics) {
            return res.status(404).json({ message: 'Statistics not found' });
        }

        res.status(200).json(statistics);

    } catch (error) {
        console.error('Error fetching statistics by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get statistics by Player ID
router.get('/player/:playerId', async (req, res) => {
    const { playerId } = req.params;

    if (!playerId || !playerId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid player ID' });
    }

    try {
        const statistics = await Statistics.findById(id).populate({ path: 'player', model: 'User' });


        if (!statistics) {
            return res.status(404).json({ message: 'Statistics for player not found' });
        }

        res.status(200).json(statistics);

    } catch (error) {
        console.error('Error fetching statistics by Player ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




export default router;
