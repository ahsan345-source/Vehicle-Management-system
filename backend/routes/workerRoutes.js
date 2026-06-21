const express = require('express');
const {
  getWorkers,
  getWorkerById,
  createWorker,
  updateWorker,
  deleteWorker,
} = require('../controllers/workerController');

// ⚙️ WORKER PORTAL CONTROLLER FUNCTIONS (Yahan se load honge)
const {
  workerLogin,
  getWorkerProfile,
  getWorkerSchedule,
  updateWorkerAvailability,
  updateTaskStatus
} = require('../controllers/workerController'); 

const { protect, adminOnly } = require('../middleware/auth');
// Agar aapke paas worker ke liye alag protect middleware hai toh use bhi import kar sakte hain
// Abhi ke liye hum standard protect use kar rahe hain ya jo aapke backend portal file mein validated ho.

const router = express.Router();

// =========================================================
// 🛠️ WORKER PORTAL SPECIFIC ENDPOINTS (ADDITIONS)
// =========================================================
router.post('/login', workerLogin);                     // POST /api/worker/login
router.get('/me', protect, getWorkerProfile);           // GET /api/worker/me
router.get('/schedule', protect, getWorkerSchedule);     // GET /api/worker/schedule
router.put('/availability', protect, updateWorkerAvailability); // PUT /api/worker/availability
router.put('/tasks/:id/status', protect, updateTaskStatus);     // PUT /api/worker/tasks/:id/status

// =========================================================
// 💼 ADMIN PANEL & GENERAL ENDPOINTS
// =========================================================
router.route('/')
  .get(getWorkers)
  .post(protect, adminOnly, createWorker);

router.get('/:id/schedule', protect, adminOnly, getWorkerSchedule);

router.route('/:id')
  .get(getWorkerById)
  .put(protect, adminOnly, updateWorker)
  .delete(protect, adminOnly, deleteWorker);

module.exports = router;