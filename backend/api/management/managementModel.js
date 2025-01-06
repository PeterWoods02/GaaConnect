import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

// Subschema for subentities
const ManagerSchema = new Schema({
  certifications: [String],
});

const CoachSchema = new Schema({
  previous_teams: [String],
});

const PhysioSchema = new Schema({
  speciality: String,
});

// Main Management Schema
const ManagementSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function(value) {
        return /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      message: 'Password must contain at least one special character.',
    },
  },
  phone_number: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  yearsOfExperience: {
    type: Number,
    required: false,
  },
  subentities: {
    type: Map,
    of: Schema.Types.Mixed,
    required: false,
    validate: {
      validator: function(value) {
        const validTypes = ['Manager', 'Coach', 'Physio'];
        return Object.keys(value).every(key => validTypes.includes(key));
      },
      message: 'Subentities must be Manager, Coach, or Physio.',
    },
  },
});

// hash password
ManagementSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(this.password, saltRounds);
      this.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//compare passwords
ManagementSchema.methods.comparePassword = async function(passw) {
  return await bcrypt.compare(passw, this.password);
};

//static method to find a management entry by name
ManagementSchema.statics.findByName = function(name) {
  return this.findOne({ name: name });
};

export default mongoose.model('Management', ManagementSchema);
