import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Invalid email address'],
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  role: {
    type: String,
    enum: ['player', 'manager', 'coach', 'physio', 'admin', 'fan'],
    required: true,
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: false,
  },

  // Role-specific fields
  position: { type: String },             // Player
  date_of_birth: { type: Date },          // Player

  certifications: [String],               // Manager
  previous_teams: [String],               // Coach
  speciality: { type: String },           // Physio

  statistics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Statistics',
  }],

  profilePicture: {
    type: String, 
    default: '/assets/public/images/uploads/default.svg',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

// compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);
