const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  reactScore: {
    type: Number,
    required: true,
  },
  webdScore: {
    type: Number,
    required: true,
  },
  dsaScore: {
    type: Number,
    required: true,
  },
  placementStatus: {
    type: String,
    enum: ['Placed', 'Unplaced'], // Enum to restrict the value to either 'Placed' or 'Unplaced'
    required: true,
  },
  interviews: [
    {
      interview: { type: mongoose.Schema.Types.ObjectId, ref: 'Interview' },
      result: { type: String, enum: ['Pass', 'Failed', 'On-Hold'], default: 'On-Hold' },
      companyName: String, // Add the companyName field
      date: Date, // Add the date field
    }
  ]
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
