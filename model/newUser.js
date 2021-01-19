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
    address: {
        type: String,
        required: true
    },

    password:{
        type:String,
        required:true
    },
    cnfpassword:{
        type:String,
        required:true
    }



})

mongoose.model('users', newUser);

module.exports = mongoose.model('users'); 