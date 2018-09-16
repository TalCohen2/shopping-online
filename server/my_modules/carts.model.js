const Carts = require('./carts.schema');

module.exports = {
    create: (id) => {
        let newCart = new Carts({'uid' : id});
        return newCart.save();
    },
    get: (id) => {
        return Carts.findOne({'uid' : id}).populate('products.product');
    },
    add: (uid,obj) => {
        return Carts.update({"uid" : uid}, { 
            $push: {
                "products" : {
                    product: obj.product,
                    amount: obj.amount
                }
            }
        })
    },
    delete: (uid,pid) => {
        return Carts.update({"uid" : uid} , {
            $pull: {
                "products" : {
                    _id: pid
                }
            }
        })
    },
    updatePrice: (uid,totalPrice) => {
        return Carts.update({"uid" : uid},{'totalPrice' : totalPrice});
    },
    remove: (uid) => {
        return Carts.deleteOne({'uid':uid});
    },
    deleteAll: (uid) => {
        return Carts.update({"uid" : uid} , {
            $pull: {
                "products" : {}
            }
        })
    }
}

