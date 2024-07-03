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

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/products', wrapAsync(async (req, res, next) => {
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category: category })
        res.render('products/index', { products, category, capitalizeFirstLetter })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category })
    }


}))

app.get('/products/new', wrapAsync((req, res) => {
    res.render('products/new', { categories })
}))

app.post('/products', wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save()
    res.redirect(`./products/${newProduct.id}`)
}))

app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
        throw new appError('Product not found', 404) // errors for async function --> "return next()"" instead of "throw" return to stop the execution of async code. 
    }
    res.render('products/show', { foundProduct }) // WILL run if not returned before
}))



app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
        throw new appError('Product not found', 404)
    }
    res.render('products/edit', { foundProduct, categories })
}))

app.put('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true })
    res.redirect(`/products/${foundProduct._id}`)
}))

app.delete('/products/:id/', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundProduct = await Product.findByIdAndDelete(id)
    res.redirect(`/products/`)
}))

const handleValidationError = err => {
    // console.dir(err)
    return new appError(err.message, 400)
}

app.use((err,req,res,next) => {
    console.log(err.name)
    if(err.name === 'ValidationError') err = handleValidationError(err)
    next(err)
})  

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!' } = err;
    res.status(status).send(message)
})

app.listen(3000, () => {
    console.log('3000 port')
})