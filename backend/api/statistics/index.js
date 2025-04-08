import express from 'express';
import Statistics from './statisticsModel.js';
import { authenticateToken } from '../../middleware/auth.js';
import { checkRole } from '../../middleware/checkRole.js';

const router = express.Router();

// Get all statistics (admin/coach/manager only)
router.get('/', authenticateToken, checkRole('admin', 'coach', 'manager'), async (req, res) => {
    try {
        const statistics = await Statistics.find().populate('player');
        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a specific statistics document by ID (self or admin/coach)
router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid statistics ID' });
    }

    try {
        const statistics = await Statistics.findById(id).populate({ path: 'player', model: 'User' });

        if (!statistics) {
            return res.status(404).json({ message: 'Statistics not found' });
        }

        const isOwner = statistics.player._id.toString() === req.user._id.toString();
        const isPrivileged = ['admin', 'coach', 'manager'].includes(req.user.role);

        if (!isOwner && !isPrivileged) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error fetching statistics by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get statistics by Player ID (self or admin/coach)
router.get('/player/:playerId', authenticateToken, async (req, res) => {
    const { playerId } = req.params;

    if (!playerId || !playerId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid player ID' });
    }

    try {
        const statistics = await Statistics.findOne({ player: playerId }).populate({ path: 'player', model: 'User' });

        if (!statistics) {
            return res.status(404).json({ message: 'Statistics for player not found' });
        }

        const isOwner = playerId === req.user._id.toString();
        const isPrivileged = ['admin', 'coach', 'manager'].includes(req.user.role);

        if (!isOwner && !isPrivileged) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json(statistics);
    } catch (error) {
        console.error('Error fetching statistics by Player ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
