import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    product_id: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: Object,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: true
    },
    sold: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema);