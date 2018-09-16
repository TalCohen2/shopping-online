const Users = require('./users.schema');

module.exports = {
    byUserName: (username) => {
        return Users.findOne({username: username});
    },
    create: (userObj) => {
        let user = new Users(userObj);
        return user.save();
    },
    byUId: (id) => {
        return Users.findOne({id:id});
    },
    getLevel: (id) => {
        return Users.findOne({_id:id},'role');
    }
}