//Schema for the new user..
require('dotenv').config();//reading the file to the database
const mongoose = require('mongoose');//for the mongodb database
const bcryptjs =require('bcryptjs');//bcrypte password before saving the data
const jwt = require('jsonwebtoken');//jwt genrate and varify the token


const schema = mongoose.Schema;//making new shemas for the new user

let newUser = new schema({

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: Number,
        required: true
    },
    img: {
        data: Buffer,
        ContentType: String
    },
 

    password:{
        type:String,
        required:true
    },
    cnfpassword:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    }
    ,
    city:{
        type:String,
        required:true
    }
    ,
    zip:{
        type:Number,
        required:true
    }
    ,
    tokenSchema : [{tokendbs:{
        type:String,
        required:true
    }}]
    



})


newUser.methods.generateTheToken = function()
{
   const tokenGenrate = jwt.sign({_id : this._id}, process.env.SECRET_KEY);//this will generate a token

   //now save in database this token 

   this.tokenSchema = this.tokenSchema.concat( {tokendbs : tokenGenrate} );

   return tokenGenrate;

//    this.save();


}


 newUser.pre('save', function(next){
    console.log(this);

 if(this.isModified('password'))
 {
     this.password =  bcryptjs.hashSync(this.password,10);
    //  this.cnfpassword =bcryptjs.hashSync(this.cnfpassword);
 }
 next();

})


mongoose.model('users', newUser);

module.exports = mongoose.model('users'); 