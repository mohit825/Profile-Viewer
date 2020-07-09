const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config  = require('config')
const User = require('../../models/Users');
const { body, validationResult } = require('express-validator');

// GET /api/users
//Register
router.post('/', [
    body('name', "Name is Required").not().isEmpty(),
    body('email', "Please include valid Email").isEmail(),
    body('password', "Please enter password with more than 6 chars").isLength({ min: 6 })
],

    async (req, res) => {
        const ValidationErrors = validationResult(req);

        if (!ValidationErrors.isEmpty()) {
            res.status(400).json({
                Errors: ValidationErrors.array()
            })
        }
        try {

            // this code block will run when all the validations are complete.
            const { name, email, password } = req.body;

            let user = await User.findOne({ email: email });

            if (user) {
                return res.status(400).json({
                    errors: [{
                        msg: "User already present"
                    }]
                })
            }

            //creating avatar for Users
            let avatar = gravatar.url(email, {
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
            //hashing the password
            let salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();


            // returning JWT
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

    });


module.exports = router;