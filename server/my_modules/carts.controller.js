const express = require('express');
const router = express.Router();
const checkAuth = require('./jwt_middleware');
const productModel = require('./products.model');
const cartsModel = require('./carts.model');

module.exports = router;

router.post('/', checkAuth, addCart);
router.put('/', checkAuth, addProduct);
router.delete('/:id', checkAuth, deleteProduct);
router.delete('/',checkAuth,deleteProducts);
router.get('/', checkAuth, checkCart);

async function addProduct(req, res) {
    try {
        let id = req.userData.id;
        let cart = await cartsModel.get(id);
        let totalPrice = 0;
        if (cart == null) {
            throw 'cart not exist'
        }
        let obj = {
            product: req.body.productId,
            amount: req.body.amount
        }
        if (!obj.product || !obj.amount) {
            throw 'missing details'
        }
        let product = await productModel.getPrice(obj.product);
        let exist = null;
        totalPrice = product.price * obj.amount + cart.totalPrice;
        for (let i of cart.products) {
            if (i.product._id == obj.product) {
                exist = i;
            }
        }
        if (!exist) {
            await cartsModel.add(id, obj);
        } else {
            await cartsModel.delete(id, exist._id);
            obj.amount = exist.amount + (obj.amount * 1);
            await cartsModel.add(id, obj);
        }
        await calcPrice(id, totalPrice);
        res.json(true);
    } catch (e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}


async function deleteProduct(req, res) {
    try {
        let id = req.userData.id;
        let cart = await cartsModel.get(id);
        if (cart == null) {
            throw 'cart not exist'
        }
        let productId = req.params.id;
        let product = await productModel.getPrice(productId);
        let exist = null;
        for (let i of cart.products) {
            if (i.product._id == productId) {
                exist = i;
            }
        }
        if (exist == null) {
            throw 'invalid product';
        }
        let totalPrice = cart.totalPrice - exist.amount * product.price
        await cartsModel.delete(id, exist._id);
        await calcPrice(id, totalPrice);
        res.json(true);
    } catch (e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}

async function deleteProducts(req,res) {
    try {
        let id = req.userData.id;
        let cart = await cartsModel.get(id);
        if (cart == null) {
            throw 'cart not exist'
        }
        await cartsModel.deleteAll(id);
        await calcPrice(id,0);
        res.json(true);
    }
    catch(e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function calcPrice(id, total) {
    try {
        await cartsModel.updatePrice(id, total);
    } catch (e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function addCart(req, res) {
    try {
        let id = req.userData.id;
        let newCart = await cartsModel.create(id);
        res.json(newCart._id);
    } catch (e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function checkCart(req, res) {
    try {
        let id = req.userData.id;
        let exist = await cartsModel.get(id);
        let price = 0;
        if (exist && req.userData.role != 2) {
            for (let p of exist.products) {
                price += p.product.price * p.amount;
            }
            if (price != exist.totalPrice) {
                await cartsModel.updatePrice(exist.uid, price);
            }
        }
        res.json(exist);
    } catch (e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}