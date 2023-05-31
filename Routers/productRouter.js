import express from "express";
import Product from "../models/productModel.js";

const router = express.Router();

router.get('/single-product/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        return res.status(200).json({ data: product });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})

// localhost:5000/products (CREATE PRODUCT)
router.post('/', async (req, res) => {
    try {
        const { name, brand, price, rating, category, offer, image, features, stock_count } = req.body;

        const createdProduct = await Product.create({
            name,
            brand,
            price,
            rating,
            category,
            offer,
            image,
            features,
            stock_count
        });

        res.status(201).send(createdProduct);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// localhost:5000/products  (GET PRODUCTS WITH PARAMS)
router.get('/', async (req, res) => {
    try {
        const params = req.query;

        const limit = params.limit ? parseInt(params.limit) : 6;
        const page = params.page ? parseInt(params.page) : 1;
        const sort = params.sort ? params.sort : 'order_count';
        const rating = params.rating ? params.rating : 1.5;
        const category = params.category ? params.category : null;
        const price = params.price ? params.price : null;

        const findData = {
            category: category ? +category : { $exists: true },
            rating: rating ? { $gt: rating } : { $exists: true },
            price: price ? { $gte: price[0], $lte: price[1] } : { $exists: true },
        }

        const totalCount = await Product.countDocuments(findData);
        const products = await Product.find(findData).sort({ [sort]: 'desc' }).skip((page - 1) * limit).limit(limit)

        return res.status(200).json({ data: products, totalCount })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get('/gamer-world', async (req, res) => {
    try {
        const products = await Product.find({
            category: 2,
        }).limit(4)
        res.status(200).json({ data: products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/popular-sales', async (req, res) => {
    try {
        const products = await Product.find({}).limit(6).sort({ order_count: 'asc' })
        res.status(200).json({ data: products })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


export default router;

