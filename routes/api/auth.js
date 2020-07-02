const express = require('express');
const router = express.Router();

// GET /api/auth
router.get('/' , (req,res)=>{
    res.send('auth API working')
});


module.exports= router;