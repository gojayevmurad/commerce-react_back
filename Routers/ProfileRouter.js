import express from 'express';
import User from '../models/userModel.js';
import { authenticateToken } from '../utils/jwt.js';

const router = express.Router();


router.get('/', authenticateToken, async (req, res) => {
    try {

        const userId = req.data.user;

        const userData = await User.findById(userId, 'name surname');

        return res.status(200).json({ data: userData });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})


export default router;