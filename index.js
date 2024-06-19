const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');

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

app.get('/dog', (req,res) => {
    res.send('woof')
})

app.listen(3000, () => {
    console.log('3000 port')
})