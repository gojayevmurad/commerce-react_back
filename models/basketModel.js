import mongoose from "mongoose";


const basketSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            count: {
                type: Number,
                default: 1
            }
        }
    ]
})

export default mongoose.model('Basket', basketSchema)