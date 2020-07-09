const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');

const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

// GET /api/auth
router.get('/' , auth, async (req,res)=>{
    try {
         const user = await User.findById(req.user).select('-password');
         if(user === null){
             return res.status(402).json({
                 msg: "User not Found"
             })
         }

         return res.status(200).json(user)
    } catch (error) {
       return res.status(500).send('server error')
    }

});

router.post('/' , [
    body('email', "Please include valid Email").isEmail(),
    body('password', "Please enter password with more than 6 chars").exists()
],
async (req,res)=>{
    const ValidationErrors = validationResult(req);

        if (!ValidationErrors.isEmpty()) {
            res.status(422).json({
                Errors: ValidationErrors.array()
            })
        }
        try {
            const {email , password} = req.body;
            const user = await User.findOne({email:email});
            // console.log(user);
            
            // console.log(isPasswdCorrect);
            if(!user){
                return res.status(401).json({
                    msg: 'Invalid Credentials'
                })
            }

            //Checking if password is correct or not.
            const isPasswdCorrect = await bcrypt.compare(password, user.password);
            if(!isPasswdCorrect){
                return res.status(401).json({
                    msg: 'Invalid Credentials'
                })
            }
            //if everything is right we will send token again
            const payload = {
                id: user.id
            }
            const key = config.get('jwtKey');
            const jwtToken = jwt.sign(payload, key ,  { expiresIn: '10h' } , (err,token)=>{
                if(err) throw err;

                res.json({
                    token:token
                })
            })
            
        } catch (error) {
            console.log(error);
            
            res.status(500).send('server error')
        }
    
    
})

module.exports= router;