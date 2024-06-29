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

app.get('/products', async (req, res) => {
    // const { category = ''} = req.query;
    // const products = await Product.find({})
    // res.render('products/index', { products, category })
    
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const { category } = req.query;
    if (category) {
        const products = await Product.find({category: category})
        res.render('products/index', { products, category, capitalizeFirstLetter })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category })
    }
})

app.get('/products/new', (req, res) => {
    throw new appError('not allowed', 401)
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save()
    res.redirect(`./products/${newProduct.id}`)
})

app.get('/products/:id', async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
      return next(new appError('Product not found', 404)) // errors for async function --> "return next()"" instead of "throw" return to stop the execution of async code. 
    }
    res.render('products/show', { foundProduct }) // WILL run if not returned before
})

app.get('/products/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
        return next(new appError('Product not found', 404)) 
    }
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

app.use((err,req,res,next) => {
    const { status = 500, message = 'Something went wrong!'} = err;
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('3000 port')
})