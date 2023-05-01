const mongoose = require('mongoose');
const { ProductSchema } = require('./productModel');

const OrderSchema = mongoose.Schema({
    order_number: {
        type: Number,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    },
    order_total: {
        type: Number,
        required: true
    },
    order_products: {
        type: [ProductSchema],
        required: true,
        default: []
    }
});

module.exports = { OrderSchema };