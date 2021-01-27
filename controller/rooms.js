//this is the rooms available for the user site
const express = require('express'); //express js
const router = express.Router();//setting the router info
const bodyParser = require('body-parser');//parsing data from url
const bcryptjs = require('bcryptjs');//for encrypting the password
const { check, validationResult } = require('express-validator');//it will check the form validation on server
const path = require('path');//for the path
const fs = require('fs');//file system module ,helps to store the data
const checkAuth = require('./../authentication/auth'); //this is the auth code for the user
const multer = require('multer');//for the uploading the image 


// useing middlewaras 
router.use(express.static(path.join(__dirname, './../')));

router.use(bodyParser.json());//for parsing data in json formate
router.use(bodyParser.urlencoded({ extended: false }));



//setting the pug file

express().set('view engine', 'pug'); //setting the pug template engine
express().set('views', path.join(__dirname, '../views/pug/'));//it will look all file in views folder


//now the code for images


var storage = multer.diskStorage({

    destination: 'OwnersInformation'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var uploads = multer({ storage: storage })


//for the lanlord signature...

// var signature = multer.diskStorage({ //this will save the lanlord image
//     destination: 'signature'


//     , filename: (req, file, cb) => {
//         cb(null, Date.now() + "_user_" + file.originalname)
//     }
// })

// var signatures = multer({ storage: signature });//for the signature



// //for the room pic 
// var Document = multer.diskStorage({ //this will save the single room image
//     destination: 'Document'

 
//     , filename: (req, file, cb) => {
//         cb(null, Date.now() + "_user_" + file.originalname)
//     }
// })

// var Singleroom = multer({ storage: Document });//for the single room  images

// //for the multi rooms images

// var rooms = multer.diskStorage({ //this will save the multi room image
//     destination: 'rooms'


//     , filename: (req, file, cb) => {
//         cb(null, Date.now() + "_user_" + file.originalname)
//     }
// })

// var Gallaryrooms = multer({ storage: rooms });//for the multi room  images





//routing code start from here 

//for the room registration form

router.get('/applicationform/:userid', checkAuth, async (req, res) => {

    let isAuthenticate = await req.isAurthised;//this will return user info or null

    if (isAuthenticate) {
        if (isAuthenticate._id == req.params.userid)//if user is aurthoried 
        {

            return res.status(200).render('roomregisteration', {
                allinfo: isAuthenticate ,
                crypted : await bcryptjs.hashSync(req.params.userid)//all the userinfo
            });//this is the registration form


        } else {
            return res.status(200).redirect('/therooms/login');//if user is not aurthorised we will send the login form
        }
    } else {
        return res.json({
            message: "Error page not found please try again"
        })
    }


})


//after felling the form we have to show the preview to the user
//this router is for the basic deatils of user  we will send the the user image uplod options in this router if there is no error
router.post('/imageuplods/:mainuserid',

    [


        //checking the validation of the submitted form on server

        check('fname').not().isEmail().trim(),
        check('lname').not().isEmail().trim(),
        check('fathername').not().isEmail().trim(),
        check('dob').not().isEmpty(),
        check('mobile').not().isEmpty().trim(),
        check('altmobile').not().isEmpty().trim(),
        check('email').isEmail().normalizeEmail().trim(),
        check('city').not().isEmpty().trim(),
        check('zip').not().isEmpty().trim(),
        check('state').not().isEmpty().trim(),
        check('village').not().isEmpty().trim(),
        check('address').not().isEmpty().trim(),
        check('roomfacilty').not().isEmpty().trim(),
        check('roomrestri').not().isEmpty().trim(),
        check('roominfo').not().isEmpty().trim(),
        check('monthlyrent').not().isEmpty().trim(),
        check('downpayment').not().isEmpty().trim(),
        check('rentinfo').not().isEmpty(),



    ], checkAuth, async (req, res) => {

        let formValidationError = validationResult(req);

       
        if (!formValidationError.isEmpty()) // if there is any kind of form validation error
        {

            return res.json({
                message: "form validation error at show preview",
                error: formValidationError.array()
            })

        }

        let isauthenticateUser = await req.isAurthised;//this will check the authority of user...
      
       
        if (isauthenticateUser) //first we will check the user authentication  
        {


            if(req.params.mainuserid == isauthenticateUser._id) //this is second level varification so that if anyone change the url we won't process thenext image upload form
            {
                return res.render('imageuplods',{ //we will send the one more form for the image uplods only
                    allinfo : isauthenticateUser
                    ,crypted : req.params.mainuserid 
                })
            }else
            {
                return res.json({
                    message :"error 404 page not found please try again"
                })
            }
         



        } else { 
            return res.redirect('/therooms/login'); //if user is not aurthorosed we will send login form
        }

    })



    //above router was for the data details and now for the image uplods 

router.post('/showpreview/:userid',uploads.single('sign'), checkAuth ,async (req,res) =>{


    res.send("ok")

})
module.exports = router;