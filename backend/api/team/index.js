import express from 'express';
import Team from './teamModel.js';  
import User from '../user/userModel.js';
import { authenticateToken } from '../../middleware/auth.js';
import { checkRole } from '../../middleware/checkRole.js';

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('players') // Added players
      .populate('manager'); // Populate with managers associated

    res.status(200).json(teams); 
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('players') 
      .populate('manager');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error('Error fetching team by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new team
router.post('/', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
  try {
    const { name, age_group, division, year, players, manager } = req.body;

    if (!name || !age_group || !division || !year || players === undefined || manager === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a team with the same name exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'A team with this name already exists' });
    }

    // Create and save the new team
    const newTeam = new Team({
      name,
      age_group,
      division,
      year,
      players: players || [],
      manager: manager || [],
    });

    await newTeam.save();

    // Return the newly created team
    res.status(201).json(newTeam);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a team
router.put('/:id', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
  try {
    const { name, age_group, division, year, players, manager } = req.body;

    // Find the team by ID
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update the team fields
    team.name = name || team.name;
    team.age_group = age_group || team.age_group;
    team.division = division || team.division;
    team.year = year || team.year;
    team.players = players || team.players; 
    team.manager = manager || team.manager;

    // Save the updated team
    await team.save();

    // Return the updated team
    res.status(200).json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete team
router.delete('/:id', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
  try {
    // Find the team by ID
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Delete the team
    await team.remove();

    // Return success message
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a player to a team
router.post('/:id/players', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
  const { id: teamId } = req.params;
  const { playerId } = req.body;  

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure team.players is an array
    if (!team.players) {
      team.players = []; 
    }

    // Check if the player exists
    const player = await User.findById(playerId);
    if (!player || player.role !== 'player') {
      return res.status(400).json({ message: 'Invalid player ID or role' });
    }

    // Check if the player is already in the team
    if (!team.players.includes(playerId)) {
      team.players.push(playerId);
      await team.save();
      return res.status(200).json({ message: 'Player added to team', team });
    } else {
      return res.status(400).json({ message: 'Player is already part of the team' });
    }

  } catch (error) {
    console.error('Error adding player to team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove a player from a team
router.delete('/:id/players/:playerId', authenticateToken, checkRole('manager', 'coach', 'admin'), async (req, res) => {
  const { id: teamId, playerId } = req.params;  
  
  try {
    // Find the team by ID
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove playerId from the team's players array
    team.players = team.players.filter(player => player.toString() !== playerId);
    await team.save();

    res.status(200).json({ message: 'Player removed from team', team });
  } catch (error) {
    console.error('Error removing player from team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:teamId/defaultLineup', async (req, res) => {
  const { teamId } = req.params;
  const { lineup, bench } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.defaultLineup = lineup; 
    team.bench = bench;
    await team.save();

    res.status(200).json({ message: 'Default lineup updated', team });
  } catch (err) {
    console.error('Failed to update default lineup:', err);
    res.status(500).json({ message: 'Failed to update default lineup' });
  }
});

// GET /api/team/:teamId/defaultLineup
router.get('/:teamId/defaultLineup', async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const populatedLineup = {};

    // Manual population for each player ID in the Map
    for (const [position, playerId] of team.defaultLineup.entries()) {
      const player = await User.findById(playerId).select('name _id role');
      if (player) {
        populatedLineup[position] = player;
      }
    }

    res.json(populatedLineup);
  } catch (err) {
    console.error('Error fetching default lineup:', err);
    res.status(500).json({ message: 'Error fetching default lineup' });
  }
});


export default router;
