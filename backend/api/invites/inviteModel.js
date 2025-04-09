import mongoose from 'mongoose';

const managerInviteSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false }
});

export default mongoose.model('ManagerInvite', managerInviteSchema);
