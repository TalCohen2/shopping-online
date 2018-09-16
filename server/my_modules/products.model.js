const Products = require('./products.schema');
const Categories = require('./categories.schema');

module.exports = {
    byName: (string) => {
        return Products.find({ name: {$regex: string, $options: "$i"}}).populate('category');
    },
    create: (productObj) => {
        let product = new Products(productObj);
        return product.save();
    },
    byPId: (id) => {
        return Products.findOne({_id: id}).populate('category', {'_id': 0,'__v':0});
    },
    byCategory: (id) => {
        return Products.find({category: id})
            .populate('category');
    },
    update: (id,productObj) => {
        let product = new Products(productObj);
        product._id = id;
        return Products.updateOne({_id:id},product);
    },
    delete: (id) => {
        return Products.deleteOne({'_id': id});
    },
    getPrice: (id) => {
        return Products.findOne({_id: id},'price');
    },
    all:() => {
        return Products.find({}).populate('category','name');  
    },
    getCategories:() => {
        return Categories.find({},'name');
    },
    getByC:(cid) => {
        return Products.find({category:cid});
    }
}