const express = require('express');
const cors = require('cors');
require('dotenv').config();
const morgan = require('morgan');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const workerRoutes = require('./routes/workerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


connectDB();

const app = express();

// --- Core middleware ---
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*' }));
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
// --- Health check ---
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reviews', reviewRoutes);  // singular — worker's own portal
app.use('/api/workers', workerRoutes); 
app.use('/api/worker', workerRoutes);          // Admin waale operations ke liye
// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);
// Is tarah ka code hoga use mita kar:
// app.use(cors({ origin: process.env.CLIENT_URL }));

// Yeh simple line likh den (is se har origin allow ho jayegi):
app.use(cors());
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));