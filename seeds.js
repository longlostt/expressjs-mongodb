const mongoose = require('mongoose');
const Product = require('./models/product');
const { name } = require('ejs');

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log('db connected!')
    })
    .catch((err) => {
        console.log(err)
    });

// const p = new Product({
//     name: 'Granny Smith',
//     price: .79,
//     category: 'fruit'
// })

// p.save().then(d => {
//     console.log(d)
// }).catch(e => {
//     console.log('ERROR!' + e)
// })

const seedProducts = [
    {
        name: 'Organic Bananas',
        price: 2.5,
        category: 'Fruit'
    },
    {
        name: 'Baby Carrots',
        price: 1.5,
        category: 'Vegetable'
    },
    {
        name: 'Broccoli Fresh',
        price: 1.6,
        category: 'Vegetable'
    },
    {
        name: 'Whole Milk',
        price: 4.5,
        category: 'Dairy'
    },
    {
        name: 'Parmesan Cheese',
        price: 6.5,
        category: 'Dairy'
    }
];

Product.insertMany(seedProducts) // if anything does not pass validation, NOTHING will be inserted. 
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    })``