const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'closed'],
      default: 'open'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Issue', issueSchema);
