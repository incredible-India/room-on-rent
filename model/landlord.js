//this is the user who wants to keep their home for rent
require('dotenv').config();//for the reading data from the dotenv file
const mongoose = require('mongoose');//mongodb database
const users  = require('./newUser');
const jwt =require('jsonwebtoken');



let schema = mongoose.Schema;


 let newHome  = new schema({

        fname : {
            type:String,
            required:true
        },
        lname : {
            type:String,
            required:true
        },
        email : {
            type:String,
            required:true,
           
        },
        mobile: {
            type:Number,
            required:true
        },
        altermobile : {
            type:String,
            required:true
        },
       state : {
            type:String,
            required:true
        },
       city : {
            type:String,
            required:true
        },
        throughid : {
            type:String,
            required:true
        },
       zip: {
            type:String,
            required:true
        },

        address : {
            type:String,
            required:true
        },
       fathername: {
            type:String,
            required:true
        },
        landimg : 
           {
                data:Buffer,
                ContentType : String
            }
,
        documentImg :{
            data:Buffer,
            ContentType : String
        },
        landsignature :{

            data:Buffer,
            ContentType : String
        }
,

        homeimg: [
            // {home : {
            //     data:Buffer,
            //     ContentType : String
            // }
            // }
        ]

        ,
        restriction :{
            type:String,
            required:true
        }
        ,roomfor:{
            type:String,
            required:true
        }
        ,roomtype :{
            type:String,
            required:true
        }
,
        roomrent:{
            type:Number,
            required:true
        }
        
        ,gender :{
            type:String,
            required:true
        }
        ,dob :{
            type :Date,
            required:true
        }

        ,village :{
            type:String,
            required:true
        }
        ,washroom:{
            type:String,
            required:true
        },
        kitchen:{
            type:String,
            required:true
        }
        ,persontype :{
            type:String,
            required:true
        }
        ,roomfacility:{
            type:String,
            required:true
        },
        anyotherinforoom :{
            type:String,
            required:true
        },
        electricbill :{
            type:String,
            required:true
        },
        downpayment:{
            type :String,
            required:true
        },
        returndwnpayment:{
            type:String,
            required:true
        },
        anyotherinforent :{
            type:String
            ,required:true
        }

        ,dateofrgisteration :{
            type:Date,
            required:true,
            default: Date.now()
        },
        roomname :{
            type:String
            
        }
        ,tokenSchema : [{tokendbs:{
            type:String,
            required:true
        }}]
 })

 

 //we are not usein this token latar when we will make the owner sign option then 

newHome.methods.genratetokenforowner =function (){
    //we are genetrating the token in the schema
    const tokenGenratefortheowner = jwt.sign({_id :this._id},process.env.SECRET_KEY) ;//this will generate the token 

    this.tokenSchema = this.tokenSchema.concat( {tokendbs : tokenGenratefortheowner} );


    this.save();
    
    return tokenGenratefortheowner;

}


 module.exports =mongoose.model('rooms',newHome);