import mongoose from "mongoose";


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    price: {
        type: Number,
        required: true,
    },
    offer: {
        type: Number,
        required: true,
    },
    image: {
        type: Array,
        required: true,
    },
    features: {
        type: Array,
        required: true,
    },
    stock_count: {
        type: Number,
        required: true,
    },
    order_count: {
        type: Number,
        default: 0,
    },
});

export default mongoose.model("Product", productSchema);
