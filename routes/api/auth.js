const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const User = require('../../models/Users')
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


module.exports= router;