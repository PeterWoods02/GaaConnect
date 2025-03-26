import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',  
        required: true,
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player', 
        required: false, 
    },
    team: {
        type: String, 
        required: true,
    },
    type: {
        type: String,
        enum: ['goal', 'point', 'yellow_card', 'red_card', 'substitution', 'halftime', 'fulltime'],
        required: true,
    },
    minute: {
        type: Number, // Minute in the match when the event happened
        required: true,
    },
    details: {
        type: String, // Additional details 
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model('Event', eventSchema);
