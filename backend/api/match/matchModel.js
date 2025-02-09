import mongoose from 'mongoose';
import Team from '../team/teamModel.js';


const matchSchema = new mongoose.Schema({
    matchTitle: {
        type: String,
        required: true, // Match title is required
    },
    date: {
        type: String,
        required: true, // dd-mm-yyyy
    },
    location: {
        type: String,
        required: true, // location where the match was played
    },
    results: {
        type: String,
        required: false, // Results of the match (win/lose/draw) maybe do w/l/d
    },
    score: {
        teamGoals: { type: Number, required: false, default: 0 },
        teamPoints: { type: Number, required: false, default: 0 },
        oppositionGoals: { type: Number, required: false, default: 0 },
        oppositionPoints: { type: Number, required: false, default: 0 },
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',  // Link to Team model
        required: false, // The team participating in the match
    },
    opposition: {
        type: String,
        required: true, // The opposition team/club
    },
    statistics: {
        type: mongoose.Schema.Types.ObjectId,  // ref to the Statistics model
        ref: 'Statistics',
        required: false,
    },
    admissionFee: {
        type: Number,
        required: false, 
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
    }],
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

export default mongoose.model('Match', matchSchema);
