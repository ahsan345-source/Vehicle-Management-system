const express = require('express');
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, adminOnly, getAllBookings) // admin: view all bookings
  .post(protect, createBooking);            // user: create a booking

router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/reschedule', protect, rescheduleBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
