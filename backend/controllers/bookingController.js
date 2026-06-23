const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Worker = require('../models/Worker');
const ACTIVE_STATUSES = ['Pending', 'Approved'];
const createBooking = asyncHandler(async (req, res) => {
  const { serviceId, vehicleType, vehicleModel, date, timeSlot, notes } = req.body;
  if (!serviceId || !vehicleType || !date || !timeSlot) {
    res.status(400);
    throw new Error('Service, vehicle type, date and time slot are required');
  }
  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(404);
    throw new Error('Selected service is not available');
  }
  let assignedWorkerId = null;
  let isWorkerNotified = false;
  const matchingWorker = await Worker.findOne({
    expertise: { $regex: service.name, $options: 'i' }, // Case-insensitive matching
    availability: 'Available'
  });
  if (matchingWorker) {
    assignedWorkerId = matchingWorker._id;
    isWorkerNotified = true;
  }
  const booking = await Booking.create({
    user: req.user._id,
    service: service._id,
    serviceNameSnapshot: service.name,
    priceSnapshot: service.price,
    vehicleType,
    vehicleModel,
    date,
    timeSlot,
    notes,
    worker: assignedWorkerId,  
    workerNotified: isWorkerNotified 
  });

  res.status(201).json(booking);
});
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('worker', 'name expertise phone status')
    .sort({ createdAt: -1 });
  res.json(bookings);
});
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this booking');
  }
  if (!ACTIVE_STATUSES.includes(booking.status)) {
    res.status(400);
    throw new Error(`A booking that is ${booking.status} cannot be cancelled`);
  }

  booking.status = 'Cancelled';
  const updated = await booking.save();
  res.json(updated);
});
const rescheduleBooking = asyncHandler(async (req, res) => {
  const { date, timeSlot } = req.body;

  if (!date || !timeSlot) {
    res.status(400);
    throw new Error('New date and time slot are required');
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to modify this booking');
  }
  if (!ACTIVE_STATUSES.includes(booking.status)) {
    res.status(400);
    throw new Error(`A booking that is ${booking.status} cannot be rescheduled`);
  }

  booking.date = date;
  booking.timeSlot = timeSlot;
  booking.status = 'Pending';
  const updated = await booking.save();
  res.json(updated);
});
const getAllBookings = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const bookings = await Booking.find(filter)
    .populate('user', 'name email phone')
    .populate('worker', 'name expertise')
    .sort({ createdAt: -1 });

  res.json(bookings);
});
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, workerId } = req.body;
  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (status) {
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    booking.status = status;
  }

  if (workerId) {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      res.status(404);
      throw new Error('Worker not found');
    }
    booking.worker = worker._id;
    booking.workerNotified = true;
  }

  const updated = await booking.save();
  const populated = await updated.populate([
    { path: 'user', select: 'name email phone' },
    { path: 'worker', select: 'name expertise phone status' },
  ]);

  res.json(populated);
});

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  rescheduleBooking,
  getAllBookings,
  updateBookingStatus,
};