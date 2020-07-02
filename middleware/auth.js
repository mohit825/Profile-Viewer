const jwt = require('jsonwebtoken');
const config = require('config');

const user = require('../models/Users');

const auth = (req,res,next) =>{
     //Get token from header.
     const token = req.header('x-auth-token');
     if(!token){
         return res.status(401).json({
             msg: "No token present"
         })
     }
 
     //verify token
     try {
         const decoded = jwt.verify(token, config.get('jwtKey'));
         // console.log(decoded, decoded.user ,'this is the decoded token');
         
         req.user = decoded.id;
         // console.log(req.user, 'this is the request user');
         
         next();
     } catch (error) {
         return res.status(401).json({
             msg: 'Invalid Token'
         })
     }
}

module.exports = auth;