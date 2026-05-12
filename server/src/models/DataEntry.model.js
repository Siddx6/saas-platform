const mongoose = require('mongoose');

const dataEntrySchema = new mongoose.Schema(
  {
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    date:        { type: Date, required: true },
    revenue:     { type: Number, required: true },
    orders:      { type: Number, default: 0 },
    product:     { type: String },
    category:    { type: String },
    uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DataEntry', dataEntrySchema);