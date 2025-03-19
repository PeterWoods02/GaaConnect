import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },
  goals: {
    type: Number,
    required: true,
    default: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  minutes_played: {
    type: Number,
    required: true,
    default: 0,
  },
  ratings: {
    type: Number,
    required: true,
    default: 0,
  },
  yellowCards: {
    type: Number,
    required: true,
    default: 0,
  },
  redCards: {
    type: Number,
    required: true,
    default: 0,
  },
});

export default mongoose.model('Statistics', statisticsSchema);
