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
    teamPositions: {
        type: Map,
        of: String,  // can store player names or player IDs
        default: {}
      },
    playerContributions: {  //store stats for individuals for set match
        type: Map,
        of: {
            goals: { type: Number, default: 0 },
            assists: { type: Number, default: 0 },
            points: { type: Number, default: 0 },
            yellowCards: { type: Number, default: 0 },
            redCards: { type: Number, default: 0 },
        },
        default: {}
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'halfTime', 'fullTime'],
        default: 'upcoming'
      },
    
      startTime: {
        type: Number, // stored as Date.now() (using milliseconds)
        default: null
      },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
});

export default mongoose.model('Match', matchSchema);
