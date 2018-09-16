const mongoose = require('mongoose');

var CartsSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        amount: {
            type: Number
        }
    }]
})

module.exports = mongoose.model("Carts",CartsSchema);