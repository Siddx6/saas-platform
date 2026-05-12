const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    email:       { type: String, required: true, unique: true, lowercase: true },
    password:    { type: String },
    role:        { type: String, enum: ['owner', 'admin', 'member'], default: 'member' },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
    isVerified:  { type: Boolean, default: false },
    provider:    { type: String, default: 'local' },
    resetToken:        { type: String },
    resetTokenExpiry:  { type: Date },
    verifyToken:       { type: String },
    notifications: {
      weeklyReport: { type: Boolean, default: true },
      teamActivity:  { type: Boolean, default: true },
      billing:       { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);