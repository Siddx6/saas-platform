const mongoose = require('mongoose');

const inviteTokenSchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    email:       { type: String, required: true },
    role:        { type: String, enum: ['admin', 'member'], default: 'member' },
    token:       { type: String, required: true, unique: true },
    expiresAt:   { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InviteToken', inviteTokenSchema);