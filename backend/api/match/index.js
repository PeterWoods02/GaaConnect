import express from 'express';
import Match from './matchModel.js';

const router = express.Router();

// Get all matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find().populate('statistics');
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a match or fixture
router.post('/', async (req, res) => {
    try {
        const { date, location, opposition, score, results, statistics, players, status } = req.body;

        // If no status is provided, default to 'upcoming' for a fixture
        const matchData = {
            date,
            location,
            opposition,
            score,
            results,
            statistics,
            players,
            status: status || 'upcoming',
        };

        const newMatch = new Match(matchData);
        await newMatch.save();

        res.status(201).json(newMatch);
    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a match
router.put('/:id', async (req, res) => {
    try {
        const { date, location, opposition, score, results, statistics, players, status } = req.body;

        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id,
            { date, location, opposition, score, results, statistics, players, status },
            { new: true } 
        );

        if (!updatedMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.status(200).json(updatedMatch);
    } catch (error) {
        console.error('Error updating match:', error);
        res.status(500).json({ message: 'Failed to update match' });
    }
});

// Delete a match
router.delete('/:id', async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndDelete(req.params.id);

        if (!deletedMatch) {
            return res.status(404).json({ message: 'Match not found' });
        }

        res.status(200).json({ message: 'Match deleted successfully' });
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ message: 'Failed to delete match' });
    }
});

export default router;
