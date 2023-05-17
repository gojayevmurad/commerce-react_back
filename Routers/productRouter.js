import express from "express";
import Product from "../models/productModel.js";

// localhost:5000/products (GET)


const router = express.Router();

router.get('/', async (req, res) => {
    try {

        const limit = req.query._limit ? parseInt(req.query._limit) : 5; // ok
        const page = req.query._page ? parseInt(req.query._page) : 1; // ok
        const sort = req.query._sort ? req.query._sort : null; // ok
        const rating = req.query.rating ? req.query.rating : 1.5; // ok
        const category = req.query.category ? req.query.category : null; // ok
        const minPrice = req.query.min_price ? req.query.min_price : null;
        const maxPrice = req.query.max_price ? req.query.max_price : null;

        const totalCount = await Product.countDocuments({
            category: category ? category : { $exists: true },
            rating: { $gt: rating },
            price: { $gte: minPrice, $lte: maxPrice }
        });

        const products = await Product.find({
            category: category ? category : { $exists: true },
            rating: { $gt: rating },
            price: { $gte: minPrice, $lte: maxPrice }
        }).sort({ [sort]: 'asc' }).skip((page - 1) * limit).limit(limit);

        res.status(200).json({ products, totalCount });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/single_product', async (req, res) => {
    try {
        const id = req.query.id;
        const product = await Product.findById(id);
        return res.status(200).json(product);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})

// localhost:5000/products (POST)
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

export default router;

