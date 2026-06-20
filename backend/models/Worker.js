const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Worker name is required'],
      trim: true,
    },
    expertise: {
      type: String, // e.g. "Brake Specialist", "AC Technician"
      required: [true, 'Area of expertise is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    experienceYears: {
      type: Number,
      default: 1,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'off-duty'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Worker', workerSchema);
