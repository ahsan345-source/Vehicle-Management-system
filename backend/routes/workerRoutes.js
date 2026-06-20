const express = require('express');
const {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerSchedule,
} = require('../controllers/workerController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getWorkers)
  .post(protect, adminOnly, createWorker);

router.get('/:id/schedule', protect, adminOnly, getWorkerSchedule);

router.route('/:id')
  .get(getWorkerById)
  .put(protect, adminOnly, updateWorker)
  .delete(protect, adminOnly, deleteWorker);

module.exports = router;
