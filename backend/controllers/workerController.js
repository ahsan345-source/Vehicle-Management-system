const asyncHandler = require('express-async-handler');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
    expiresIn: '30d',
  });
};
const workerLogin = asyncHandler(async (req, res) => {
  // Safe destructuring with client payload fallbacks
  const email = req.body.email || req.body.form?.email;
  const password = req.body.password || req.body.form?.password;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please add email and password parameters');
  }

  const worker = await Worker.findOne({ email });

  if (!worker || !worker.password) {
    res.status(401);
    throw new Error('Worker profile not found or password field missing');
  }

  // Force-cast properties to explicit strings to completely avoid "string, undefined" exceptions
  const isMatch = await bcrypt.compare(String(password), String(worker.password));

  if (isMatch) {
    res.json({
      token: generateToken(worker._id),
      worker: {
        _id: worker._id,
        name: worker.name,
        email: worker.email,
        expertise: worker.expertise,
        availability: worker.availability || 'Available',
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid worker email or password');
  }
});

// @route    GET /api/worker/me
// @access   Private/Worker
const getWorkerProfile = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.user._id).select('-password');
  if (!worker) {
    res.status(404);
    throw new Error('Worker profile not found');
  }
  res.json(worker);
});

// @route    PUT /api/worker/availability
// @access   Private/Worker
const updateWorkerAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;
  
  if (!availability) {
    res.status(400);
    throw new Error('Availability value is required');
  }

  const worker = await Worker.findById(req.user._id);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  worker.availability = availability;
  const updatedWorker = await worker.save();

  res.json({
    _id: updatedWorker._id,
    name: updatedWorker.name,
    email: updatedWorker.email,
    expertise: updatedWorker.expertise,
    availability: updatedWorker.availability,
  });
});

// @route    PUT /api/worker/tasks/:id/status
// @access   Private/Worker
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['In-Progress', 'On-Hold', 'Completed'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid task status');
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Verification to protect tasks from cross-tenant modifications
  if (booking.worker.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

// =========================================================================
// 💼 EXISTING CONTROLLERS (UNTOUCHED & PRESERVED)
// =========================================================================

// @route   GET /api/workers
// @access  Public
// Lets customers browse worker profiles (name + specialty) before/while booking.
const getWorkers = asyncHandler(async (req, res) => {
  const workers = await Worker.find().sort({ createdAt: -1 });
  res.json(workers);
});

// @route   GET /api/workers/:id
// @access  Public
const getWorkerById = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }
  res.json(worker);
});

// @route   POST /api/workers
// @access  Private/Admin
const createWorker = asyncHandler(async (req, res) => {
  const { name, expertise, phone, experienceYears, status } = req.body;

  if (!name || !expertise || !phone) {
    res.status(400);
    throw new Error('Name, expertise and phone are required');
  }

  const worker = await Worker.create({ name, expertise, phone, experienceYears, status });
  res.status(201).json(worker);
});

// @route   PUT /api/workers/:id
// @access  Private/Admin
const updateWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  const { name, expertise, phone, experienceYears, status } = req.body;

  worker.name = name ?? worker.name;
  worker.expertise = expertise ?? worker.expertise;
  worker.phone = phone ?? worker.phone;
  worker.experienceYears = experienceYears ?? worker.experienceYears;
  worker.status = status ?? worker.status;

  const updated = await worker.save();
  res.json(updated);
});

// @route   DELETE /api/workers/:id
// @access  Private/Admin
const deleteWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  // Unassign this worker from any bookings rather than leaving dangling refs
  await Booking.updateMany({ worker: worker._id }, { $set: { worker: null, workerNotified: false } });
  await worker.deleteOne();

  res.json({ message: 'Worker removed successfully' });
});

// @route   GET /api/workers/:id/schedule
// @access  Private/Admin
// This is the "notification view" — since workers don't have a login
// portal, the admin opens this screen to see/relay each worker's
// upcoming assigned jobs.
const getWorkerSchedule = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.params.id);
  if (!worker) {
    res.status(404);
    throw new Error('Worker not found');
  }

  const bookings = await Booking.find({ worker: worker._id })
    .populate('user', 'name phone')
    .sort({ date: 1 });

  // Dual-view capability support
  if (!req.params.id && req.user) {
    res.json(bookings);
  } else {
    res.json({ worker, bookings });
  }
});

module.exports = {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerSchedule,
  workerLogin,
  getWorkerProfile,
  updateWorkerAvailability,
  updateTaskStatus
};