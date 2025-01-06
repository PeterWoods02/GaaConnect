import express from 'express';
import Statistics from './statisticsModel.js';

const router = express.Router();

// Get all statistics for a particular player or match
router.get('/', async (req, res) => {
    try {
        const statistics = await Statistics.find();
        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;
