const express = require('express');
const router = express.Router();

// GET /api/post
router.get('/' , (req,res)=>{
    res.send('post API working')
});


module.exports= router;