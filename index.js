const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/farmStand')
    .then(() => {
        console.log('db connected!')
    })
    .catch((err) => {
        console.log(err)
    });

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy'] // add categories here

app.get('/products', async (req, res) => {
    const products = await Product.find({})
    res.render('products/index', { products })

})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save()
    res.redirect(`./products/${newProduct.id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    res.render('products/show', { foundProduct })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    res.render('products/edit', { foundProduct, categories })
})

app.put('/products/:id', async(req,res) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})
    res.redirect(`/products/${foundProduct._id}`)
})

app.delete('/products/:id/', async(req,res) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndDelete(id)
    res.redirect(`/products/`)
} )

app.listen(3000, () => {
    console.log('3000 port')
})