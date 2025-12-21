const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // sesuaikan path kalau beda

const router = express.Router();

/**
 * =========================
 * GET /auth/register
 * Untuk browser / dokumentasi
 * =========================
 */
router.get("/register", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Register endpoint",
    method: "POST",
    endpoint: "/auth/register",
    required_body: {
      username: "string",
      email: "string",
      password: "string"
    },
    example: {
      username: "testuser",
      email: "test@mail.com",
      password: "123456"
    }
  });
});

/**
 * =========================
 * POST /auth/register
 * Proses register user
 * =========================
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "Username, email, dan password wajib diisi"
      });
    }

    // Cek user sudah ada
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "Username atau email sudah digunakan"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      plan: "free"
    });

    await newUser.save();

    res.status(201).json({
      status: true,
      message: "Registrasi berhasil",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        plan: newUser.plan
      }
    });

  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    res.status(500).json({
      status: false,
      message: "Terjadi kesalahan server"
    });
  }
});

module.exports = router;
