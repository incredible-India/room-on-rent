//Schema for the new user..
const mongoose = require('mongoose');//for the mongodb database

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
    



})




mongoose.model('users', newUser);

module.exports = mongoose.model('users'); 