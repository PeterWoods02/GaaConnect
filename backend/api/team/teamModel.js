import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true  // should team names be unique or identify with age_goup or combine for name
    },
    age_group: {
      type: String,
      required: true  // Age group (e.g., U-12, U-15, etc.)
    },
    division: {
      type: String,
      required: true  // Division (e.g., Division 1, Division 2, etc.)
    },
    year: {
      type: Number,
      required: true  // The year they will compete in
    },
    players: [{  
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // Reference to Player model
      required: false 
    }],
    defaultLineup: {
      type: Map,
      of: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    },
    manager: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  // ref management model
      required: false  // team must have one from management change later
    }]
  });
  
  
  export default mongoose.model('Team', teamSchema);

 