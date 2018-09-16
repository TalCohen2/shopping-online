const mongoose = require('mongoose');

var OrdersSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    orderNumber: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    creditCard: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Orders",OrdersSchema);