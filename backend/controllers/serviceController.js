const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const getServices = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const services = await Service.find(filter).sort({ createdAt: 1 });
  res.json(services);
});
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }
  res.json(service);
});
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, icon } = req.body;

  if (!name || !description || price === undefined || !duration) {
    res.status(400);
    throw new Error('Name, description, price and duration are required');
  }

  const service = await Service.create({ name, description, price, duration, icon });
  res.status(201).json(service);
});
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const { name, description, price, duration, icon, isActive } = req.body;

  service.name = name ?? service.name;
  service.description = description ?? service.description;
  service.price = price ?? service.price;
  service.duration = duration ?? service.duration;
  service.icon = icon ?? service.icon;
  service.isActive = isActive ?? service.isActive;

  const updated = await service.save();
  res.json(updated);
});
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  await service.deleteOne();
  res.json({ message: 'Service deleted successfully' });
});
module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
