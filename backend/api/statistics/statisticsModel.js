import mongoose from 'mongoose';

const statisticsSchema = new mongoose.Schema({
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
    cards: {
        type: Number,
        required: true,
        default: 0,
    }
});

export default mongoose.model('Statistics', statisticsSchema);

/*

player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player', 
    required: true,
},
match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',  
    required: true,
},

*/