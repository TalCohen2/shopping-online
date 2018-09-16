const mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'first name is required']
    },
    username: {
        type: String,
        required: [true,'username is requierd']
    },
    id: {
        type: Number,
        required: [true,'ID is required']
    },
    hash: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: [true,'username is requierd']
    },
    street: {
        type: String,
        required: [true,'username is requierd']
    },
    role: {
        type: Number,
        min: 1,
        max: 2
    }
})

module.exports = mongoose.model("Users",UsersSchema);