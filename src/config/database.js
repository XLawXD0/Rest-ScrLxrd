const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://deargodxd_db_user:DIVzneB6LzSRA12X@cluster0.f3o5o8x.mongodb.net/restapi?retryWrites=true&w=majority";

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
