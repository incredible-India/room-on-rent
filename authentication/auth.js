//this page will  aurthorised  the used
require('dotenv').config()//read the data from .env file
const jwt  =require('jsonwebtoken');//json web token for authentication
const schemaFileOfusers = require('./../model/newUser');
const ownerInformationAndItsValidations =require('./../model/landlord');



  function  authUser(req,res,next) {
    
     try{

 
        const token =   req.cookies.jwt ; //cookies
       
        if(token === undefined)
        {
            req.isAurthised = null ;
            next();
            return; //agar ye return na likhe to next k baad bhi code excute hota
        }
      
        const varifyUser =  jwt.verify(token, process.env.SECRET_KEY); //varify the cookies
    
        const isAurthised = schemaFileOfusers.findOne({_id : varifyUser._id})//it will check the user that exist in our database or not
        
        req.isAurthised = isAurthised; //it will return null if user is not in database otherwise it return document

        next()
    }catch (error){
       
     
       return res.json({message : "auth file error",
    error :error});


    }
   




}


// function ownerAuthentications(req,res,next)
// {
//     try{

//         let OwnerInformation =ownerInformationAndItsValidations.fin

//     }catch(error)
//     {
//         return res.json({
//             message :"Owner Authentication Error in Auth File",
//             error :error
//         })
//     }


// }

module.exports = authUser ; 