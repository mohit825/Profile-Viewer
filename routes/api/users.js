const express = require('express');
const router = express.Router();
var gravatar = require('gravatar');
var bcrypt = require('bcryptjs');

const User = require('../../models/Users');
const { body, validationResult } = require('express-validator');

// GET /api/users
router.post('/' , [
    body('name' , "Name is Required").not().isEmpty(),
    body('email', "Please include valid Email").isEmail(),
    body('password' , "Please enter password with more than 6 chars").isLength({min:6})
],

async (req,res)=>{
    const ValidationErrors = validationResult(req);
    
   if(!ValidationErrors.isEmpty()){
       res.status(422).json({
        Errors: ValidationErrors.array()
       })
   }
  try {
        
    // this code block will run when all the validations are complete.
    const {name ,email , password} = req.body;

    let user = await User.findOne({email:email});

    if(user){
        return res.status(400).json({
            errors: [{
                msg: "User already present"
            }]
        })
    }

    //creating avatar for Users
    let avatar =  gravatar.url(email , {
        s: '200',
        r: 'pg',
        d: 'mm'
    });


     user = new User({
        name: name,
        email: email,
        password: password,
        avatar: avatar
    });
    //hashing te password
    let salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).send('User Registered')

    

    

  } catch (error) {
      res.status(500).send('server error')
  }
    
});


module.exports= router;