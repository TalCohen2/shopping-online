const express = require('express');
const router = express.Router();
const productModel = require('./products.model');
const checkAuth = require('./jwt_middleware');
const multer = require('multer');
const fs = require('fs')

module.exports = router;

let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, '../uploads'); //image storage path
        
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(null, datetimestamp + file.originalname); // 
    }
});

let upload = multer({ //multer settings
    storage: storage
}).single('file');

router.post('/upload', checkAuth, upload, (req, res, next) => {
    if (req.userData.role != 2) {
        res.status(403).end();
    } else {
        try {
            let path = '';
            if (req.file) {
                upload(req, res, (err) => {
                    if (err) {
                        throw "Error occured"
                    }
                    path = req.file.path;
                    res.json(req.file);
                });
            }
        } catch (e) {
            console.log(e);
            res.status(404).end(e);
        }
    }
});

router.get('/',getAll);
router.get('/categories',checkAuth,getCategories);
router.get('/category/:id',checkAuth,getByCategory);
router.get('/:id',checkAuth,getProduct);
router.post('/search',checkAuth,productByName);
router.post('/',checkAuth,addProduct);
router.put('/:id',checkAuth,editProduct);
router.delete('/:id',checkAuth,deleteProduct);

async function getByCategory(req,res) {
    try {
        let products = await productModel.byCategory(req.params.id);
        res.json(products);
    }
    catch(e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function getCategories(req,res) {
    try {
        let result = await productModel.getCategories();
        res.json(result);
    }
    catch(e) {
        console.log(`error has been occured ${e}`);
        res.status(403).end();
    }
}

async function getAll(req,res) {
    try {
        let result = await productModel.all();
        res.json(result);
    }
    catch(e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}

async function deleteProduct(req,res) {
    if(req.userData.role < 2) {
        res.status(403).end();
    }
    else {
        try {
            let id = req.params.id;
            let deleted = await productModel.delete(id);
            if(deleted.n!=1) {
                throw 'invalid product id';
            }
            let result = true;
            res.json(result);
        }
        catch(e) {
            console.log(`error has been occured: ${e}`);
            res.status(403).end();
        }
    }

}

async function productByName(req,res) {
    if(!req.body.name) {
        res.status(403).end();
    }
    else {
        try {
            let string =req.body.name;
            let products = await productModel.byName(string);
            res.json(products);
        }
        catch(e) {
            console.log(`error has been occured: ${e}`);
            res.status(403).end();
        }
    }
}

async function getProduct(req,res) {
    try {
        let id = req.params.id;
        let result = await productModel.byPId(id);
        res.json(result);
    }
    catch(e) {
        console.log(`error has been occured: ${e}`);
        res.status(403).end();
    }
}

async function addProduct(req,res) {
    if(req.userData.role < 2) {
        res.status(403).end();
    }
    else {
        try {
            let obj = {
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                image: req.body.image
            }
            if(!obj.name || !obj.category || !obj.price || !obj.image) {
                throw 'missing details';
            }
            let result = await productModel.create(obj);
            res.json(result);
            
        }
        catch(e) {
            console.log(`Error has been occured ${e}`);
            res.status(403).end();
        }
    }
}

async function editProduct(req,res) {
    if(req.userData.role < 2) {
        res.status(403).end();
    }
    else {
        try {
            let id = req.params.id;
            let before = await productModel.byPId(id);
            let obj = {
                name: req.body.name != '' ? req.body.name : before.name,
                category: req.body.category != '' ? req.body.category : before.category ,
                price: req.body.price != '' ? req.body.price : before.price,
                image: req.body.image != null ? req.body.image : before.image
            }
            await productModel.update(id,obj);
            let result = true;
            if(req.body.image !== undefined){
                fs.unlink(`../uploads/${before.image}`, (err) => {
                    console.log(err);
                })
            }
            res.json(result);
        }
        catch(e) {
            console.log(`error has been occured: ${e}`);
            res.status(403).end();
        }
    }
}
