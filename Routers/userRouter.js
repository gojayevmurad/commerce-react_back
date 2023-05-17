import express from "express";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";

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

    const createdUser = await User.create({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Hesabınız yaradıldı" });
  } catch (err) {
    console.log(err);
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

    return res
      .status(200)
      .json({ data: user, message: "İstifadəçi girişi uğurla tamamlandı" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
