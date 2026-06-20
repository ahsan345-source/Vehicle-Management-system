const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    duration: {
      type: String, // e.g. "45 mins", "1-2 hours"
      required: [true, 'Estimated duration is required'],
    },
    icon: {
      type: String, // a short emoji/label used by the UI, e.g. "🛢️"
      default: '🔧',
    },
    isActive: {
      type: Boolean,
      default: true, // soft-delete flag so historical bookings keep their data
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
