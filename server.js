const express = require('express');

const db = require('./config/db')
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const post = require('./routes/api/post');
const auth = require('./routes/api/auth');

//Instantiating Express app
const app = express();

//intiating middleware to get the body.
app.use(express.json());

// Connecting to Database
db();

app.use('/api/users',users);
app.use('/api/post',post);
app.use('/api/auth',auth);
app.use('/api/profile',profile);

app.get('/' , (req,res)=>{
    res.send('api working')    
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
    
})
