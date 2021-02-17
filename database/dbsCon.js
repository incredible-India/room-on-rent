//conection of database code here..

require('dotenv').config() ;//for the .env file`s data
const mongoose = require('mongoose'); //mongoose connect the mongoDB database 

//connection to database 
mongoose.connect(process.env.DATABASE_URL,{

  useCreateIndex:true,
  useNewUrlParser:true,
  useUnifiedTopology:false,
  useUnifiedTopology:true
  ,useFindAndModify:false


})
.then(data =>{
    console.log("Database Connection Successfully");
})
.catch(error =>{ //for any error

    console.log("Database connection error..",error);
})