const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // PLAN USER
    plan: {
      type: String,
      enum: ["free", "premium", "admin"],
      default: "free",
    },

    // LIMIT API PER HARI
    limit: {
      type: Number,
      default: 100, // free user default
    },

    // STATUS AKUN
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt otomatis
  }
);

module.exports = mongoose.model("User", UserSchema);
