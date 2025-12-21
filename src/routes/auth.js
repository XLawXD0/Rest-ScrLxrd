const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateApiKey = require('../utils/generateApiKey');

const router = express.Router();

/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Semua field wajib diisi'
      });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        status: false,
        message: 'Email sudah terdaftar'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      apiKey: generateApiKey()
    });

    res.json({
      status: true,
      message: 'Registrasi berhasil',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        plan: user.plan
      }
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Registrasi gagal',
      error: err.message
    });
  }
});

/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: 'Email dan password wajib diisi'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User tidak ditemukan'
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        status: false,
        message: 'Password salah'
      });
    }

    res.json({
      status: true,
      message: 'Login berhasil',
      data: {
        username: user.username,
        email: user.email,
        plan: user.plan,
        apiKey: user.apiKey
      }
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Login gagal',
      error: err.message
    });
  }
});

module.exports = router;
