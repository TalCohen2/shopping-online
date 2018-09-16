const mongoose = require('mongoose');

var ProductsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'product name is required']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    price: {
        type: Number,
        required: [true, 'price is required']
    },
    image: {
        type: String,
        required: [true,'image is required']
    }
})

module.exports = mongoose.model("Products",ProductsSchema);