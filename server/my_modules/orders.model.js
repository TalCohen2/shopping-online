const Orders = require('./orders.schema');

module.exports = {
    add: (obj) => {
        let order = new Orders({
            uid: obj.uid ,
            orderNumber: obj.orderNumber ,
            totalPrice: obj.cart.totalPrice ,
            city: obj.city ,
            street: obj.street ,
            deliveryDate: obj.deliveryDate ,
            creditCard: obj.creditCard 
        });
        return order.save();
    },
    get: (orderNumber) => {
        return Orders.findOne({orderNumber:orderNumber},'orderNumber');
    },
    byUId: (id) => {
        return Orders.find({uid:id});
    },
    all:() => {
        return Orders.find({});
    },
    byDate: (date) => {
        return Orders.find({deliveryDate: date});
    }
}