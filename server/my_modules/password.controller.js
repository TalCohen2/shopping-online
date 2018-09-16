const bcrypt = require("bcrypt");

const saltRound = 10;

module.exports = {
    hash: (plainTextPwd) => {
        return bcrypt.hash(plainTextPwd,saltRound);
    },
    verify: (plainTextPwd,hash) => {
        return bcrypt.compare(plainTextPwd,hash);
    }
}