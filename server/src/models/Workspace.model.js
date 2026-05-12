const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    ownerId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    plan:      { type: String, enum: ['free', 'pro'], default: 'free' },
    memberIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    logo:      { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workspace', workspaceSchema);