import express from 'express';
import User from './userModel.js';

const router = express.Router();

// GET all users (filter optional)
router.get('/', async (req, res) => {
  try {
    const roleFilter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(roleFilter).populate('statistics');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('statistics');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Create new user 
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      position,
      date_of_birth,
      team,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const newUser = new User({
      name,
      email,
      password,
      role,
      position,
      date_of_birth,
      team,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

//Delete user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// GET all players
router.get('/players', async (req, res) => {
  try {
    const players = await User.find({ role: 'player' }).populate('statistics');
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: 'Failed to fetch players' });
  }
});


export default router;
