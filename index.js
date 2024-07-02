const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const appError = require('./appError')

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

app.get('/products', async (req, res, next) => {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    try {
        const { category } = req.query;
        if (category) {
            const products = await Product.find({ category: category })
            res.render('products/index', { products, category, capitalizeFirstLetter })
        } else {
            const products = await Product.find({})
            res.render('products/index', { products, category })
        }
    } catch (error) {
        next(e)
    }

})

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res, next) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save()
        res.redirect(`./products/${newProduct.id}`)
    } catch (error) {
        next(error)
    }

})

app.get('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundProduct = await Product.findById(id)
        if (!foundProduct) {
            throw new appError('Product not found', 404) // errors for async function --> "return next()"" instead of "throw" return to stop the execution of async code. 
        }
        res.render('products/show', { foundProduct }) // WILL run if not returned before
    } catch (e) {
        next(e)
    }

})

app.get('/products/:id/edit', async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundProduct = await Product.findById(id)
        if (!foundProduct) {
            throw new appError('Product not found', 404)
        }
        res.render('products/edit', { foundProduct, categories })
    } catch (e) {
        next(e)
    }

})

app.put('/products/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
        res.redirect(`/products/${foundProduct._id}`)
    } catch (e) {
        next(e)
    }

})

app.delete('/products/:id/', async (req, res) => {
    try {
        const { id } = req.params;
        const foundProduct = await Product.findByIdAndDelete(id)
        res.redirect(`/products/`)
    } catch (e) {
        next(e)
    }

})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!' } = err;
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('3000 port')
})