const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    workspaceId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    weekStart:      { type: Date, required: true },
    summary:        { type: String },
    highlights:     [{ type: String }],
    warnings:       [{ type: String }],
    recommendation: { type: String },
    fullText:       { type: String },
    growth:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);