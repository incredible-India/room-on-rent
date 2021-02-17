//this is the user who wants to keep their home for rent
const mongoose = require('mongoose');//mongodb database
const users  = require('./newUser');



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
 })

 


 module.exports =mongoose.model('rooms',newHome);