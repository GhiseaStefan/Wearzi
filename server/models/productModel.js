const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 1
    },
    size: {
        type: [String],
        required: true
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    nrImages: {
        type: Number,
        required: true
    },
    product_type_id: {
        type: mongoose.Types.ObjectId,
        ref: 'ProductType'
    }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product, ProductSchema };