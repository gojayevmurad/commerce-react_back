import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";
import { authenticateToken, refreshToken } from "../utils/jwt.js";

const router = express.Router();

// localhost:5000/auth/user/register (POST)

router.post("/user/register", async (req, res) => {
  try {

    const { name, password, surname, email } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Bu istifadəçi sistemdə mövcuddur" });
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user

    await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Hesabınız yaradıldı" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// localhost:5000/auth/user/login (POST)

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "İstifadəçi mövcud deyil" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Şifrə yanlışdır" });
    }

    const accessToken = jwt.sign({ user: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ user: user._id }, process.env.REFRESH_KEY, { expiresIn: '30d' });

    return res
      .status(200)
      .json({ data: { accessToken: accessToken, refreshToken: refreshToken }, message: "İstifadəçi girişi uğurla tamamlandı" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// localhost:5000/auth/user/refresh-token (POST)
router.post('/user/refresh-token', refreshToken, async (req, res) => {
  try {
    const userId = req.data.user;

    const accessToken = jwt.sign({ user: userId }, process.env.SECRET_KEY, { expiresIn: '1d' });

    return res.status(200).json({ data: { accessToken: accessToken } })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})


// localhost:5000/auth/user/change-password (PUT)

router.put('/user/change-password', authenticateToken, async (req, res) => {
  try {

    const userId = req.data.user;
    const { password, newPassword } = req.body;

    const user = await User.findById(userId, 'password');

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Şifrə yanlışdır" });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHashedPassword;

    await user.save();

    return res.status(200).json({ message: "Şifrə uğurla dəyişdirildi" })

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
})

export default router;
