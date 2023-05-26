import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import { authenticateToken } from "../utils/jwt.js";
import express from 'express';

const router = express.Router()

// localhost:5000/favorites (GET)
router.get('/get-products', authenticateToken, async (req, res) => {

    try {
        const userId = req.data.user;
        const favorites = (await User.findOne({ _id: userId }, 'favorites')).favorites;

        const products = await Product.find({ _id: { $in: favorites } }, 'name image price offer');

        return res.status(200).json({ data: products });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.post('/add-product', authenticateToken, async (req, res) => {
    try {
        const productId = req.body.productId
        const userId = req.data.user;

        const user = await User.findOne({ _id: userId }, 'favorites');
        user.favorites.push(productId);

        await user.save();

        const products = await Product.find({ _id: { $in: user.favorites } })

        return res.status(200).json({ data: products });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

router.delete('/delete-product/:id', authenticateToken, async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.data.user;

        const user = await User.findOne({ _id: userId }, 'favorites');

        user.favorites.splice(user.favorites.findIndex(id => id == productId), 1)

        await user.save();

        const products = await Product.find({ _id: { $in: user.favorites } })

        return res.status(200).json({ data: products })

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

export default router;