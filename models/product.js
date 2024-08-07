const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name cannot be blank!']
    },
    price:{
        type: Number,
        required: [true, 'price cannot be blank!'],
        min: 0
    },
    category: {
        type: String,
        lowercase:true,
        enum: ['fruit', 'vegetable', 'dairy']
    }
}) 

const Product = mongoose.model('Product', productSchema);

module.exports = Product;