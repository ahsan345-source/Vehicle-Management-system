const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const Service = require('../models/Service');

const ACTIVE_REVENUE_STATUSES = ['Pending', 'Approved'];
const getSummary = asyncHandler(async (req, res) => {
  const bookings = await Booking.find();

  const totalBookings = bookings.length;

  const statusBreakdown = bookings.reduce((acc, b) => {
    acc[b.status] = (acc[b.status] || 0) + 1;
    return acc;
  }, {});
  const revenueGenerated = bookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + b.priceSnapshot, 0);
  const projectedRevenue = bookings
    .filter((b) => ACTIVE_REVENUE_STATUSES.includes(b.status))
    .reduce((sum, b) => sum + b.priceSnapshot, 0);

  const revenueByService = bookings
    .filter((b) => b.status === 'Completed')
    .reduce((acc, b) => {
      acc[b.serviceNameSnapshot] = (acc[b.serviceNameSnapshot] || 0) + b.priceSnapshot;
      return acc;
    }, {});

  const totalWorkers = await Worker.countDocuments();
  const totalServices = await Service.countDocuments({ isActive: true });

  res.json({
    totalBookings,
    statusBreakdown,
    revenueGenerated,
    projectedRevenue,
    revenueByService,
    totalWorkers,
    totalServices,
  });
});
module.exports = { getSummary };
