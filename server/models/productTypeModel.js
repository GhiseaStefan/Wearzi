const mongoose = require('mongoose');

const ProductType = mongoose.Schema({
    product_type_name: {
        type: String,
        required: true
    },
    subcategory_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Subcategory'
    }
});

module.exports = mongoose.model('ProductType', ProductType);