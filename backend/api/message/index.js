import express from 'express';
import Message from './messageModel.js';
import { authenticateToken } from '../../middleware/auth.js';

const router = express.Router();

// get all messages for logged in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('error fetching messages:', err);
    res.status(500).json({ message: 'failed to fetch messages' });
  }
});

// get all messages between current user and another user
router.get('/conversation/:otherUserId', authenticateToken, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender recipient', 'name email');

    res.status(200).json(messages);
  } catch (err) {
    console.error('error fetching conversation:', err);
    res.status(500).json({ message: 'failed to fetch conversation' });
  }
});


// send a message
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { recipient, body } = req.body;

    if (!recipient || !body) {
      return res.status(400).json({ message: 'recipient and body are required' });
    }

    const message = new Message({
      sender: req.user.id,
      recipient,
      body,
    });

    const saved = await message.save();

    // emit to recipient if connected
    const io = req.app.get('io');
    io.to(saved.recipient.toString()).emit('newMessage', saved);

    res.status(201).json(saved);
  } catch (err) {
    console.error('error sending message:', err);
    res.status(500).json({ message: 'failed to send message' });
  }
});

// get a single message
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('sender recipient', 'name email');
    if (!message) return res.status(404).json({ message: 'message not found' });

    const userId = req.user.id.toString();
    if (
      message.recipient._id.toString() !== userId &&
      message.sender._id.toString() !== userId
    ) {
      return res.status(403).json({ message: 'forbidden' });
    }

    res.json(message);
  } catch (err) {
    console.error('error fetching message:', err);
    res.status(500).json({ message: 'failed to retrieve message' });
  }
});

export default router;
