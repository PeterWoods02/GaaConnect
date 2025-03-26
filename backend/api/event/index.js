import express from 'express';
import Match from '../match/matchModel.js';
import Team from '../team/teamModel.js';
import Player from '../player/playerModel.js';
import mongoose from 'mongoose';
import Event from '../event/eventModel.js'

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
    .select('type minute team player') 
    .populate('player', 'name')       
    .lean();   


    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching all events:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});


            
            

export default router;
