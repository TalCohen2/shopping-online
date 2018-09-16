const jwt = require('jsonwebtoken');
const usersModel = require('./user.model');

module.exports = async (req,res,next) => {    
    
    try {        
        let token = null;
        if(!req.headers.authorization) {
            throw "Missing Authorization header";
        }
        else {
            let broken = req.headers.authorization.split(" "); 
            if(broken.length!=2 || broken[0]!='Bearer' || broken[1]=='') {
                throw "Invalid Authorization header";
            }
            else {
                token = req.headers.authorization.split(" ")[1]; 
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                let u = await usersModel.getLevel(decoded.id)
                req.userData = {
                    id: decoded.id,
                    name: decoded.name,
                    role: u.role                    
                }
                if(req.userData.role<1) {
                    throw "not logged in"
                }
                next(); 
            }
        }
    }
    catch(e) { 
        console.log('Error',e);
        return res.status(403).end();
    }        
}