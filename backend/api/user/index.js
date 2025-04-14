import express from 'express';
import User from './userModel.js';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../../middleware/auth.js';
import { checkRole } from '../../middleware/checkRole.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = express.Router();

// GET all users (admin only)
router.get('/', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const roleFilter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(roleFilter).populate('statistics');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all players (authenticated)
router.get('/players', authenticateToken, async (req, res) => {
  try {
    const players = await User.find({ role: 'player' }).populate('statistics');
    res.status(200).json(players);
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({ message: 'Failed to fetch players' });
  }
});

// GET user by ID (self or admin)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('statistics');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const userId = req.user._id || req.user.id;

    if (
      req.user.role !== 'admin' &&
      userId.toString() !== req.params.id
    )
  {  
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (admin only)
router.post('/', authenticateToken, checkRole('admin', 'manager'), async (req, res) => {
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

// Update user (self or admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

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

// Delete user (admin only)
router.delete('/:id', authenticateToken, checkRole('admin'), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});


// Upload profile picture (self only)
router.patch('/:id/picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.params.id;
    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: filePath },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error('Error uploading profile picture:', err);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

export default router;
