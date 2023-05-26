import User from "../models/userModel.js";
import express from 'express';
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        let userId = req.data.user;

        let user = await User.findOne({ _id: userId }, 'addresses');

        return res.status(200).json({ data: user.addresses });
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
})

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, city, address, postalCode, typeAddress } = req.body
        const userId = req.data.user;

        let user = await User.findOne({ _id: userId }, 'addresses')

        const isDefault = user.addresses[typeAddress].length > 0 ? false : true;

        user.addresses[typeAddress].push({
            name, address, city, postalCode, isDefault
        })

        await user.save()

        return res.status(200).json({ data: user.addresses })
    } catch (error) {
        return res.status(401).json({ error: error.message })
    }
})

router.delete('/:id/:type', authenticateToken, async (req, res) => {
    try {

        const userId = req.data.user;
        const addressId = req.params.id;
        const type = req.params.type;

        const user = await User.findOne({ _id: userId }, 'addresses');

        user.addresses[type].splice(user.addresses[type].findIndex(item => item._id == addressId), 1)

        await user.save();

        return res.status(200).json({ data: user.addresses, message: 'Ünvan uğurla silindi' })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})


export default router;