const mongoose = require('mongoose');
const config = require('config');

const mongoString = config.get('mongoURI');

const mongoConnection = async ()=>{

    try {
        const connected = await mongoose.connect(mongoString,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Database connected!!!');
        
    } catch (error) {
        console.log(error.message, "Database not connected");
        
    }
        
}

module.exports = mongoConnection;

