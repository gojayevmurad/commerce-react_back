import express from "express";
import Basket from "../models/basketModel.js";
import { authenticateToken } from "../utils/jwt.js";

const router = express.Router();

// localhost:5000/basket (POST)

router.post('/set-item', authenticateToken, async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.data.user;

        const basketExist = await Basket.findOne({ userId: userId })


        if (basketExist) {
            const index = basketExist.items.findIndex(item => item.product == productId)

            if (index != -1) {
                basketExist.items[index].count += 1
            } else {
                basketExist.items.push({
                    product: productId,
                    count: 1
                })
            }
            await basketExist.save()
            return res.status(200).json({ data: basketExist.items })
        }


        const basket = await Basket.create({
            userId: userId,
            items: [{
                product: productId,
                count: 1
            }]
        })

        return res.json({ data: basket.items })

    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
})

router.post('/remove-item', authenticateToken, async (req, res) => {
    try {

        const userId = req.data.user;
        const productId = req.body.productId;
        const count = req.body.count;

        const basket = await Basket.findOne({ userId: userId })

        const itemIndex = basket.items.findIndex(item => item.product == productId);
        if (count == 0) {
            basket.items.splice(itemIndex, 1)
        } else {
            basket.items[itemIndex].count = count;
        }
        basket.save();

        return res.status(200).json({ data: basket.items })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})

router.get('/get-items', authenticateToken, async (req, res) => {
    try {
        const userId = req.data.user;

        const basket = await Basket.findOne({ userId: userId })

        if (basket) return res.status(200).json({ data: basket.items })

        return res.status(200).json({ data: [] })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
})





export default router;