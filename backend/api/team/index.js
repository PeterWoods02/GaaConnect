import express from 'express';
import Team from './teamModel.js';  

const router = express.Router();

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find().populate('managementTeam');  // populate with managers associated
    res.status(200).json(teams);  // return teams
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('managementTeam');
    
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
router.post('/', async (req, res) => {
  try {
    const { name, age_group, division, year, managementTeam } = req.body;

    // validation
    if (!name || !age_group || !division || !year || !managementTeam || managementTeam.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // check for same team name
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
      managementTeam,
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
router.put('/:id', async (req, res) => {
  try {
    const { name, age_group, division, year, managementTeam } = req.body;

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
    team.managementTeam = managementTeam || team.managementTeam;

    // Save the updated team
    await team.save();

    // Return the updated team
    res.status(200).json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// delete team
router.delete('/:id', async (req, res) => {
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

export default router;
