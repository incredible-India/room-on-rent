//this page will  aurthorised  the used
require('dotenv').config()//read the data from .env file
const jwt  =require('jsonwebtoken');//json web token for authentication
const schemaFileOfusers = require('./../model/newUser');
require('cookie-parser');


  function  authUser(req,res,next) {
    
    // try{

 
        const token =   req.cookies.jwt ; //cookies

        const varifyUser =   jwt.varifyUser(token, process.env.SECRET_KEY); //varifu the cookies
    
        const isAurthised = schemaFileOfusers.findOne({_id : varifyUser._id})//it will check the user that exist in our database or not
        
        req.isAurthised = isAurthised; //it will return null if user is not in database otherwise it return document

        next()
    // }catch {
        
    //     return res.json({message: "Aurthorisation error in auth file"});

    // }
   




}

module.exports = authUser ; 