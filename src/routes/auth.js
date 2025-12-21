const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/**
 * REGISTER USER
 * POST /auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1. VALIDASI INPUT
    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Username, email, dan password wajib diisi",
      });
    }

    // 2. CEK USER SUDAH ADA
    const userExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      return res.status(409).json({
        status: false,
        message: "Username atau email sudah terdaftar",
      });
    }

    // 3. HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. SIMPAN USER
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 5. RESPONSE
    res.status(201).json({
      status: true,
      message: "Registrasi berhasil",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        plan: newUser.plan,
      },
    });
  } catch (err) {
    console.error("[REGISTER ERROR]", err);
    res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
});

module.exports = router;
