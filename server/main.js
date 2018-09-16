console.clear();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const mongoose = require('mongoose');

app.use('/images', express.static( "../uploads" ));
app.use('/recipt', express.static( "../recipts" ));

const usersC = require('./my_modules/users.controller');
const cartsC = require('./my_modules/carts.controller');
const productC = require('./my_modules/products.controller');
const orderC = require('./my_modules/orders.controller');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
    res.header('Access-Control-Allow-Credentials', true); 
    if ('OPTIONS' == req.method) {
      res.status(200).end();
    }
    else {
      next();
    }
});

mongoose.connection.on('error', (e) => console.log('DB connect ERROR: ', e));
mongoose.connection.on('connected', () => {
    console.log('DB connected to: ', mongoose.connection.name);
    app.listen(PORT, () => console.log(`node listening to ${PORT}`))
})
mongoose.connect('mongodb://localhost:27017/shopProject',{useNewUrlParser: true});

app.use( (req,res,next)=> {
    if(req.originalUrl=='/favicon.ico') {
        next();
    }
    else {
        console.log('>',req.method,req.originalUrl);
        if(Object.entries(req.body).length) {
            console.log('Posted:');
            console.log(req.body);
            console.log("\n");
        }
        next();
    }
});

app.use('/users',usersC);
app.use('/carts',cartsC);
app.use('/products',productC);
app.use('/orders',orderC);

app.use('**', (req,res) => {
    console.log('Unknown Request');
    res.status('404').send('404 Unknown request');
})