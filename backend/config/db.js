const mongoose = require('mongoose');

/**
 * Connects to MongoDB using a direct local connection string.
 * The app exits the process if the connection fails, since the
 * API is useless without a database.
 */
const connectDB = async () => {
  try {
    // process.env.MONGO_URI ko hata kar direct local path daal diya hai
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/vehicle-service');
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;