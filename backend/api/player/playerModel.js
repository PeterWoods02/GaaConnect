import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Player's name
    },
    email: {
        type: String,
        required: true,
        unique: false, // Ensure email is unique
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],//will add better validation and responce on front end
    },
    password: {
        type: String,
        required: true, // Password for authentication & will add password auth
    },
    position: {
        type: String,
        required: true, // Position of the player (e.g., Forward, Midfield, etc.)
    },
    date_of_birth: {
        type: Date,
        required: true, // Player's date of birth dd/mm/yyyy
        match: [/^\d{2}-\d{2}-\d{4}$/, 'Please provide a valid date of birth in dd-mm-yyyy format'],
    },
    statistics: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Statistics',  
        required: false,  // optional in case we don't have stats initially
    }
});


/*
 Example of player_teams relationship
    const playerTeamsSchema = new mongoose.Schema({
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true,
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true,
        }
    });
    Export Player model
*/

export default mongoose.model('Player', playerSchema);
