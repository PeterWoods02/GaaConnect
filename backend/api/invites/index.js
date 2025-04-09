import express from 'express';
import crypto from 'crypto';
import { sendManagerInvite } from '../utils/emailService.js';
import { authenticateToken } from '../../middleware/auth.js';
import { checkRole } from '../../middleware/checkRole.js';
import User from '../user/userModel.js';
import ManagerInvite from '../invites/inviteModel.js';

const router = express.Router();

router.post('/inviteManager', authenticateToken, checkRole('admin'), async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h from now

  try {
    await ManagerInvite.deleteOne({ email });
    // Save new invite
    const invite = new ManagerInvite({ email, token, expiresAt });
    await invite.save();
    // Send the email
    await sendManagerInvite(email, token);

    res.status(200).json({ message: 'Invite sent successfully' });
  } catch (err) {
    console.error('Error sending manager invite:', err);
    res.status(500).json({ message: 'Failed to send invite' });
  }
});

router.get('/verifyInvite', async (req, res) => {
    const { token } = req.query;
  
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    try {
      const invite = await ManagerInvite.findOne({ token });
      if (!invite) {
        return res.status(404).json({ message: 'Invite not found' });
      }
      if (invite.used) {
        return res.status(410).json({ message: 'This invite link has already been used.' });
      }
      if (invite.expiresAt < new Date()) {
        return res.status(410).json({ message: 'This invite link has expired.' });
      }
  
      res.status(200).json({ valid: true, email: invite.email });
    } catch (err) {
      console.error('Error verifying invite token:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.post('/registerManager', async (req, res) => {
    const { name, password, token } = req.body;
  
    if (!token || !name || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const invite = await ManagerInvite.findOne({ token });
      if (!invite) {
        return res.status(404).json({ message: 'Invalid or expired token' });
      }
      if (invite.used) {
        return res.status(410).json({ message: 'This invite has already been used.' });
      }
      if (invite.expiresAt < new Date()) {
        return res.status(410).json({ message: 'This invite has expired.' });
      }
      const existingUser = await User.findOne({ email: invite.email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }
  
      const newUser = new User({
        name,
        email: invite.email,
        password,
        role: 'manager'
      });
  
      await newUser.save();
  
      // Mark invite as used
      invite.used = true;
      await invite.save();
  
      res.status(201).json({ message: 'Manager account created successfully' });
    } catch (err) {
      console.error('Error registering manager:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

export default router;
