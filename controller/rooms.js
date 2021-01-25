//this is the rooms available for the user site
const express =require('express'); //express js
const router = express.Router();//setting the router info
const bodyParser = require('body-parser');//parsing data from url
const bcryptjs = require('bcryptjs');//for encrypting the password
const { check, validationResult } = require('express-validator');//it will check the form validation on server
const path =require('path');//for the path
const fs =require('fs');//file system module ,helps to store the data
const checkAuth = require('./../authentication/auth'); //this is the auth code for the user


// useing middlewaras 
router.use(express.static(path.join(__dirname, './../')));

router.use(bodyParser.json());//for parsing data in json formate
router.use(bodyParser.urlencoded({ extended: false }));



//setting the pug file
express().set('view engine', 'pug')
express().set('views', path.join(__dirname, '../views/pug/'))


//for the room registration form

router.get('/applicationform/:userid',checkAuth,async (req,res)=>{

    let isAuthenticate = await req.isAurthised;//this will return user info or null
if(isAuthenticate._id == req.params.userid)
{
    if(isAuthenticate)//if user is aurthoried 
    {
   
         return res.status(200).render('roomregisteration',{
             allinfo : isAuthenticate //all the userinfo
         });//this is the registration form
 
 
    }else
    {
     return res.status(200).redirect('/therooms/login');//if user is not aurthorised we will send the login form
    }
}else
{
    return res.json({
        message :"Error page not found please try again"
    })
}
 

})


//after felling the form we have to show the preview to the user

router.post('/:userid/showPreview',checkAuth,async (req,res)=>{

    let isauthenticateUser =await req.isAurthised;

    if(isauthenticateUser) //first we will check the user authentication 
    {
        return res.send(req.body)

    }else
    {
        return res.redirect('/therooms/login'); //if user is not aurthorosed we will send login form
    }

})


module.exports  = router;