const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, 'Name is required'], trim: true },
    branch: { type: String, required: [true, 'Branch is required'], trim: true },
    batch: { type: String, required: [true, 'Graduation year is required'], trim: true },
    company: { type: String, required: [true, 'Company is required'], trim: true },
    role: { type: String, required: [true, 'Role is required'], trim: true },
    interviewDate: { type: Date, required: [true, 'Interview date is required'] },
    mode: {
      type: String,
      enum: ['On-campus', 'Off-campus'],
      default: 'On-campus'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    outcome: {
      type: String,
      enum: ['Selected', 'Not selected', 'Result awaited'],
      default: 'Result awaited'
    },
    rounds: { type: String, required: [true, 'Please describe the rounds'], trim: true },
    questions: { type: String, required: [true, 'Please list the questions asked'], trim: true },
    tips: { type: String, trim: true, default: '' },
    overall: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);
