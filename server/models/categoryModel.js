const mongoose = require('mongoose');

const Category = mongoose.Schema({
    category_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Category', Category);