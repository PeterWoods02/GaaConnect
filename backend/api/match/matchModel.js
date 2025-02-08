import mongoose from 'mongoose';


const matchSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true, //  dd-mm-yyyy
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
        teamGoals: { type: Number, required: true },
        teamPoints: { type: Number, required: true },
        oppositionGoals: { type: Number, required: true },
        oppositionPoints: { type: Number, required: true },
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
    createdAt: {
        type: Date,
        default: Date.now, // associate to date created at top
    }
});

export default mongoose.model('Match', matchSchema);

//need to associate the players too and only display statistics if player is 
// queried and not just the individual match