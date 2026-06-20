const express = require('express');
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(protect, adminOnly, createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, adminOnly, updateService)
  .delete(protect, adminOnly, deleteService);

module.exports = router;
