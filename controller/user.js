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
const checkAuth = require('./../authentication/auth');//authentication for the user
const ownerinfo = require('./../model/landlord');//owner Scema File
const {base64encode} =require('nodejs-base64');//this is for the bcrypting or encoding the importatnt data




// useing middlewaras 
router.use(express.static(path.join(__dirname, './../')));

router.use(bodyParser.json());//for parsing data in json formate
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());


//setting the pug file
express().set('view engine', 'pug')
express().set('views', path.join(__dirname, '../views/pug/'))



//let`s save the user image...

var storage = multer.diskStorage({
    destination: 'UserImage'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var uploads = multer({ storage: storage })

//it will save images in our storage


// let uploadImage = multer({ storage: storage });//this will save image




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


    let checkValidationEmail = await newUserdbs.findOne({ email: req.body.email });

    if (checkValidationEmail) {
        return res.json({ message: "email alredy used" })
    } else {

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

            res.cookie('jwt', token, { expires: new Date(Date.now() + (24 * 60 * 60 * 1000)) }); // generated token we will save in cookie and varify this latar when user will login
            //we set the expairy date for 24 hrs
            return res.redirect('/');//yeha pug wala karna hai

        } else {

            return res.send("password not matched with confirm password.")
        }

    }




})


//during login varify the tokens ,data and what to show after that


router.post('/user/login', [

    check('username').not().isEmpty().trim(),
    check('password').not().isEmpty().trim()


], async (req, res) => {

    let validaterror = validationResult(req); //checking the validation error

    if (!validaterror.isEmpty()) //for any form validation error
    {
        return res.json({
            message: "form validation error in login",
            error: validaterror.array()
        })
    }


    let loginInfo = await newUserdbs.findOne({ email: req.body.username }) //it will retun null if email does not matched

    if (loginInfo) {

        let passwordMatched = bcryptjs.compareSync(req.body.password, loginInfo.password);//comparing the password

        if (passwordMatched) {

            const tokenlogin = loginInfo.generateTheToken();

            res.cookie("jwt", tokenlogin, { expires: new Date(Date.now() + (24 * 60 * 60 * 1000)) });//we set the expairy date for 24 hrs

            return res.redirect('/');//pugFile

        } else {
            return res.json({
                message: " inccorect email or password "
            })
        }


    } else {
        return res.json({
            message: "email or password is incorrect"
        })
    }



})


//now routing for logout functions

router.get('/user/logout',checkAuth.authUser, async (req, res) => {

    let UserAuth = await req.isAurthised;  //it will return either document of user or null

    if (UserAuth) {

        // console.log(UserAuth);
        UserAuth.tokenSchema = []; //this logout from all devices and make token emapty in dbs
        res.clearCookie('jwt');  //clear the cookies
        UserAuth.save(); //save changes the data in dbs
        return res.redirect('/'); //redirect the home page

    } else {
        res.clearCookie('jwt');
        return res.redirect('/');

    }




})


// routing for the user profile 
router.get('/userProfile/:id',checkAuth.authUser ,async (req,res) =>{
 
    let UserAuth = await req.isAurthised;  //it will return either document of user or null

    try
    {
       var  givenSirvices = await  ownerinfo.findOne({throughid : UserAuth._id}) //first we will find and verify the user  that owner is exist or not
    }catch (error)
    {
        return res.status(200).redirect('/therooms/login')
    }
  
  
    
   
   
    if(givenSirvices == null)
    {
        UserAuth.service = false; //if user not exist it returns false
    }else
    {
        UserAuth.service = true; //if user exist it return document
    }

   await newUserdbs.findOneAndUpdate({_id : UserAuth._id},{service : UserAuth.service}) //And we will Update and save it 

    // newUserdbs.save() ;  
   
    if(UserAuth)
    {
         res.status(200).render('profile',{
             title : "Profile -The Rooms",
            
             allinfo : UserAuth
            ,
             UserId : base64encode(JSON.stringify(UserAuth._id)) //this is the database id of the room
         })
    }
    else
    {
        res.setHeader("Content-Type","text/html");//type of response
        return res.status(200).redirect('/therooms/login')
    }



     



})

//for the feedback

router.get('/user/feedback',checkAuth.authUser,async(req,res)=>{

    let UserAuth = await req.isAurthised;  //it will return either document of user or null
    res.setHeader("Content-Type","text/html");//type of response
    if(UserAuth)//if user is varified
    {
        return res.status(200).render('feedback',{
            allinfo : UserAuth
        });//feedback form
    }
// if user is not aurthorised we will send login page 

    return res.status(200).redirect('/therooms/login')


})


//for the home registration of user

router.get('/user/newregistration',checkAuth.authUser,async (req,res)=>{

  let isAurthorised = await req.isAurthised;  //again we will check that the user is aurthorised or not

  if(isAurthorised)
  {
      return res.redirect(`/therooms/roomsregistration/applicationform/${isAurthorised._id}/?${bcryptjs.hashSync("fill",10)}`)//later we will redirect it on the form of registration for home this router code is definr in room.js
  }else
  {
      return res.status(200).redirect('/therooms/login');//if user is not aurthorised we will send the login form
  }


})


//for the password varification code during registration of home

router.post('/varification/user',checkAuth.authUser,async (req,res)=>{


    let userauth = await req.isAurthised;

 

    if(userauth)
    {
        if(await bcryptjs.compareSync(req.body.password,userauth.password))//we will varify the password
        {
            res.status(200).redirect('/therooms/user/newregistration');//now for authentication above code 
        }else
        {
            return res.json({
                message : "incorrect password"
            })
        }
       

    }else
    {
        return res.status(200).redirect('/therooms/login');//if user is not aurthorised we will send the login form

    }


})

module.exports = router; //will be import in index.js (main file)
