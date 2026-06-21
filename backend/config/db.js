const mongoose = require('mongoose');

/**
 * Connects to MongoDB using a direct local connection string.
 */
const connectDB = async () => {
  try {
    // Wapis local path set kar diya
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/vehicle-service');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;