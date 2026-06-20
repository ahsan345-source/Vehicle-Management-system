const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    // Snapshot of service details at the time of booking, so the record
    // stays meaningful even if the service is later edited or removed.
    serviceNameSnapshot: { type: String, required: true },
    priceSnapshot: { type: Number, required: true },

    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      default: null, // assigned by the admin, not chosen at booking time
    },

    vehicleType: {
      type: String,
      enum: ['Car', 'SUV', 'Bike', 'Truck', 'Van'],
      required: [true, 'Vehicle type is required'],
    },
    vehicleModel: {
      type: String,
      trim: true,
      default: '',
    },

    date: {
      type: String, // stored as YYYY-MM-DD for simplicity
      required: [true, 'Preferred date is required'],
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM - 11:00 AM"
      required: [true, 'Preferred time slot is required'],
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'],
      default: 'Pending',
    },

    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
      immutable: true, // this project only supports COD / pay-on-service
    },

    notes: {
      type: String,
      trim: true,
      default: '',
    },

    // Notification flag/details routed to the worker's schedule view.
    // Workers don't log in; the admin's "Worker Schedule" screen reads this.
    workerNotified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
