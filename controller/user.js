const express = require('express');
const router = express.Router();//routing for urls
const path =require('path');

// useing middlewaras 
router.use(express.static(path.join(__dirname + './../')));




// routing code for the users 
router.get('/newusers', (req,res)=>{// for the newUsers
 
    res.setHeader('Content-Type',"text/html");
    
    res.status(200).sendFile(path.join(__dirname,"./../src/html/",'newUser.html'));  //registration form



})

//for the login page

router.get('/login',(req,res)=>{

    res.setHeader('Content-Type',"text/html");

    res.status(200).sendFile(path.join(__dirname,"./../src/html/",'login.html'));  //registration form
})



module.exports =router; //will be import in index.js (main file)
