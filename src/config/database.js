const mongoose = require('mongoose');

let isConnected = false;

module.exports = async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false
    });

    isConnected = db.connections[0].readyState;
    console.log('MongoDB Connected');

  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};
