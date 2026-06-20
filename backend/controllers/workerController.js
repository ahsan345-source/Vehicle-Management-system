const asyncHandler = require('express-async-handler');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');

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

  res.json({ worker, bookings });
});

module.exports = {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerSchedule,
};
