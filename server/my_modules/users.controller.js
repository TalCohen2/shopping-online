const express = require('express');
const router = express.Router();

const pwd = require('./password.controller');
const jwt = require('jsonwebtoken');
const userModel = require('./user.model');
const cartModel = require('./carts.model');

module.exports = router;

router.post('/login', Ulogin);
router.post('/', Uregister);
router.post('/checkid',checkId);
router.post('/checkname',checkUName);

async function checkId(req,res) {
    try {
        if(!req.body.id) {
            throw 'missing id';   
        }
        let id = await userModel.byUId(req.body.id);
        if(id) {
            throw 'id exist';
        }
        res.json(true);
    }
    catch(e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function checkUName(req,res) {
    try {
        if(!req.body.username) {
            throw 'missing id';   
        }
        let username = await userModel.byUserName(req.body.username);
        if(username) {
            throw 'username exist';
        }
        res.json(true);
    }
    catch(e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function Ulogin(req,res) {
    try {
        let result = {
            token: null
        }
        let foundUser = await userModel.byUserName(req.body.username);
        if(foundUser) {
            let verifyPwd = await pwd.verify(req.body.password,foundUser.hash);
            if(verifyPwd) {
                result.user = {
                    id: foundUser._id,
                    name: foundUser.name,
                    Uid: foundUser.id,
                    role: foundUser.role,
                    city: foundUser.role==1 ? foundUser.city : null,
                    street: foundUser.role==1 ? foundUser.street : null
                }
                result.token = jwt.sign(
                    result.user,
                    process.env.JWT_KEY, {
                        expiresIn: "12h"
                    }
                );
                let cart = await cartModel.get(result.user.id);
                if(cart) {
                    if(cart.products.length==0) {
                        await cartModel.remove(result.user.id);
                    }
                }
            }
        }
        res.json(result);
    }
    catch(e) {
        console.log(`Error has been occured ${e}`);
        res.status(403).end();
    }
}


async function Uregister(req,res) {
    try {
        let obj = {
            name: req.body.name ,
            username: req.body.username ,
            id: req.body.id ,
            city: req.body.city ,
            street: req.body.street ,
            role: 1
        }
        if(!obj.name || !obj.username || !obj.id || !obj.city || !obj.street || !req.body.password) {
            throw "missing details";
        }
        obj.hash = await pwd.hash(req.body.password);
        let newU = await userModel.create(obj);
        let result = {
            user: {
                id: newU._id,
                name: newU.name,
                Uid: newU.id,
                role: newU.role,
                city: newU.city,
                street: newU.street
            }
        }
        result.token = jwt.sign(
            result.user,
            process.env.JWT_KEY, {
                expiresIn: "12h"
            }
        );
        res.json(result);
    }
    catch(e) {
        console.log(`Error has been occured ${e}`);
        res.status(403).end();
    }
}