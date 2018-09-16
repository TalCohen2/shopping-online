const express = require('express');
const router = express.Router();
const checkAuth = require('./jwt_middleware');
const cartsModel = require('./carts.model');
const ordersModel = require('./orders.model');
const Handlebars = require('handlebars');
const pdf = require('html-pdf');

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

module.exports = router;

router.post('/date',checkAuth, checkDate);
router.post('/',checkAuth , addOrder);
router.get('/',getOrders);

async function addOrder(req, res) {
    try {
        let ddValidate = await dateValidate(req.body.date);
        if(ddValidate.length>=3) {
            throw "invalid date";
        }
        let cart = await cartsModel.get(req.userData.id);
        let obj = {
            uid: req.userData.id,
            orderNumber: Date.now(),
            cart: cart,
            city: req.body.city,
            street: req.body.street,
            deliveryDate: req.body.date,
            purchaseDate: new Date().toLocaleDateString(),
            creditCard: req.body.creditCard.slice(req.body.creditCard.length-4)
        }
        if(!obj.city || !obj.street || !obj.deliveryDate || !obj.creditCard || obj.city.trim() =='' || obj.street.trim() =='' || obj.deliveryDate.trim() =='' || obj.creditCard.trim() =='') {
            throw 'Missing Details'
        }
        const source = `
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
        <div class='container-fluid'>
            <h4 class='text-center'>Recipt Number:{{orderNumber}}</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th scope="col">name</th>
                    <th scope="col">price</th>
                    <th scope="col">amount</th>
                    <th scope="col">total price for product</th>
                    </tr>
                </thead>
                <tbody>
                    {{#cart}}{{#products}}<tr>
                    <td class='text-center'>{{product.name}}</td>
                    <td class='text-center'>{{product.price}}$</td>
                    <td class='text-center'>{{amount}}</td>
                    <td class='text-center'>{{math product.price "*" amount}}$</td>
                    </tr>{{/products}}{{/cart}}
                    <tr>
                    <td colspan="4" class='text-center'>Total Price: {{cart.totalPrice}}$</td>
                    </tr>
                </tbody>
            </table>
            <div class='text-center'>
                <h4>Order Details:</h4>
                <p>Address:</p>
                <p><span>City: {{city}} </span><span>Street: {{street}} </span><p>
                <p>Purchase Date: {{purchaseDate}}</p>
                <p>Delivery Date: {{deliveryDate}}</p>
                <p>Last 4 Credit Cart Digits: {{creditCard}}</p>
            </div>
        </div>`;
        let template = Handlebars.compile(source);
        let result = template(obj);
        let options = { format: 'Letter' , border: '10px'};
        pdf.create(result, options).toFile(`../recipts/${obj.orderNumber}.pdf`,async function(err, result) {
            if (err) {
                res.status(403).end();
            }
            else {
                await ordersModel.add(obj);
                await cartsModel.remove(obj.uid);
                res.json(obj.orderNumber);
            }
        });

    } catch (e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function getOrders(req,res) {
    try {
        let orders = await ordersModel.all();
        res.json(orders.length);
    }
    catch(e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}

async function checkDate(req,res) {
    try {
        let date = req.body.date;
        let result = await dateValidate(date);
        res.json(result.length);

    }
    catch(e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}

async function dateValidate(date) {
    return await ordersModel.byDate(date);
}