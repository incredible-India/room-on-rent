/*this routing page is only for the users */
//importing the modules which should be used in this code
const express = require('express');
const router = express.Router();//routing for urls
const path = require('path');//for specify the path
const multer = require('multer');//for saving the image
const bodyParser = require('body-parser');//parsing data from url
const { check, validationResult } = require('express-validator');//it will check the form validation on server
const newUserdbs = require('./../model/newUser');//this is the schema of users
const fs = require('fs');//for file system module it help to save the image in our database
const cookieParser = require('cookie-parser');//saving the cookies
const bcryptjs = require('bcryptjs');//for hashing the password and comparing the password




// useing middlewaras 
router.use(express.static(path.join(__dirname , './../')));

router.use(bodyParser.json());//for parsing data in json formate
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());


//setting the pug file
express().set('view engine', 'pug')
express().set('views', path.join(__dirname,'../views/pug/'))



//let`s save the user image...

var storage = multer.diskStorage({
    destination: 'UserImage'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var uploads = multer({ storage: storage })

//it will save images in our storage


let uploadImage = multer({ storage: storage });//this will save image




// routing code for the users 
router.get('/newusers', (req, res) => {// for the newUsers

    res.setHeader('Content-Type', "text/html");

    res.status(200).sendFile(path.join(__dirname, "./../src/html/", 'newUser.html'));  //registration form



})

//for the login page

router.get('/login', (req, res) => {

    res.setHeader('Content-Type', "text/html");

    res.status(200).sendFile(path.join(__dirname, "./../src/html/", 'login.html'));  //registration form
})



//new User registration form will varify here 

router.post('/varify/data/users', uploads.single('uimg'), [

    check('fname').not().isEmpty().trim(),
    check('lname').not().isEmpty().trim(),
    check('email').isEmail().normalizeEmail().trim(),
    check('mobile').not().isEmpty().trim(),
    check('password').not().isEmpty().trim(),
    check('cnfpassword').not().isEmpty().trim(),
    check('city').not().isEmpty().trim(),
    check('zip').not().isEmpty().trim(),

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {  //if any error found for validating user data

        return res.json({
            status: false,

            message: "validation error in registration",

            error: errors.array()
        })

    }


    //after varifying the data we will save the data in our database

    // first we will check the email provided by user is exist or not


  let checkValidationEmail = await newUserdbs.findOne({email : req.body.email});

  if(checkValidationEmail)
  {
      return res.json({message : "email alredy used"})
  }else
  {

    if (req.body.password === req.body.cnfpassword)//if password and confirm password are same then only we can save in database 
    {
        let SaveUserinfo = new newUserdbs({

            fname: req.body.fname,
            lname: req.body.lname,
            password: req.body.password,
            cnfpassword: req.body.cnfpassword,
            email: req.body.email,
            mobile: req.body.mobile,
            city: req.body.city,
            zip: req.body.zip,
            gender: req.body.gender,
            img: {
                data: fs.readFileSync(path.join(__dirname, '../userImage/', req.file.filename))
                , ContentType: "image/jpg"
            }

        })

         const token = SaveUserinfo.generateTheToken();  //it will generate the token when user will registration itself

         res.cookie('jwt',token); // generated token we will save in cookie and varify this latar when user will login

         return res.redirect('/');//yeha pug wala karna hai
      
    } else {

        return res.send("password not matched with confirm password.")
    }

  }

    


})


//during login varify the tokens ,data and what to show after that


router.post('/user/login',[

check('username').not().isEmpty().trim(),
check('password').not().isEmpty().trim()


], async (req,res)=>{

    let validaterror =validationResult(req); //checking the validation error

    if(!validaterror.isEmpty()) //for any form validation error
    {
        return res.json({
            message:"form validation error in login",
            error :validaterror.array()
        })
    }


     let loginInfo = await newUserdbs.findOne({email :req.body.username}) //it will retun null if email does not matched

     if(loginInfo)
     {

       let passwordMatched = bcryptjs.compareSync(req.body.password,loginInfo.password);//comparing the password

       if(passwordMatched)
       {

        const tokenlogin = loginInfo.generateTheToken();

        res.cookie("jwt",tokenlogin);

        return res.redirect('/');//pugFile

       }else
       {
           return res.json({
               message : " inccorect email or password "
           })
       }


     }else
     {
         return res.json({
             message: "email or password is incorrect"
         })
     }



})


//now routing for log

module.exports = router; //will be import in index.js (main file)
