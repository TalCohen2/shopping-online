const mongoose = require('mongoose');

var CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Category name is required']
    }
})

module.exports = mongoose.model("Categories",CategoriesSchema);