const mongoose = require('mongoose');

const Subcategory = mongoose.Schema({
    subcategory_name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    }
});

module.exports = mongoose.model('Subcategory', Subcategory);