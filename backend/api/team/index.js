import express from 'express';
import Team from './teamModel.js';  

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('managementTeam');  //populate with managers associated
    res.status(200).json(teams);  // return teams
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
