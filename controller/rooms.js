//this is the rooms available for the user site
require('dotenv').config(); //for the reading data from dotenv file
const express = require('express'); //express js
const router = express.Router();//setting the router info
const bodyParser = require('body-parser');//parsing data from url
const bcryptjs = require('bcryptjs');//for encrypting the password
const { check, validationResult } = require('express-validator');//it will check the form validation on server
const path = require('path');//for the path
const fs = require('fs');//file system module ,helps to store the data
const checkAuth = require('./../authentication/auth'); //this is the auth code for the user
const multer = require('multer');//for the uploading the image 
const {base64decode ,base64encode} = require('nodejs-base64');//this will encode and decode the informations used in url
const { JsonWebTokenError } = require('jsonwebtoken');


// useing middlewaras 
router.use(express.static(path.join(__dirname, './../')));

router.use(bodyParser.json());//for parsing data in json formate
router.use(bodyParser.urlencoded({ extended: false }));



//setting the pug file

express().set('view engine', 'pug'); //setting the pug template engine
express().set('views', path.join(__dirname, '../views/pug/'));//it will look all file in views folder


//now the code for images


var storage = multer.diskStorage({

    destination: 'OwnersInformation/OwnerImage'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var uploads = multer({ storage: storage })


// for the ownerssignature...

var signature = multer.diskStorage({ //this will save the owner signature
    destination: 'OwnersInformation/OwnerSignature'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var signatures = multer({ storage: signature });//for the signature



//for the owner docs
var Document = multer.diskStorage({ //this will save the single room image
    destination: 'OwnersInformation/OwnerDocs'

 
    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var docs = multer({ storage: Document });//for the single room  documents

//for the multi rooms images

var rooms = multer.diskStorage({ //this will save the multi room image
    destination: 'OwnersInformation/RoomGallary'


    , filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var Gallaryrooms = multer({ storage: rooms }); //for the multi room  images





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
router.post('/imageuplods/:mainuserid', uploads.single('owner') ,

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
                return res.status(200
                    ).render('imageuplods',{ //we will send the one more form for the image uplods only
                    allinfo : isauthenticateUser
                    ,FormTitle: "Owner`s Image"
                    ,jsonData : base64encode(JSON.stringify(req.body))// this is the information of the user in string and encoded form
                    ,crypted : base64encode(req.params.mainuserid) //this is the id of user in data base,
                    ,ownerPic :true  //owner pics option will show
                    ,ownersign : false //owner sign from option will show

                     ,roomdocs :false //owner document from option will show
                    ,roomgall :false //owner room gallary from option will show
                    

                })
            }else
            {
                return res.json({
                    message :"error 404 page not found please try again"
                })
            }
         



        } else { 
            return res.status(200).redirect('/therooms/login'); //if user is not aurthorosed we will send login form
        }

    })



//1st form i.e owners image uploads routing code  this action url inside the owner image uploads form only
//it will contain only the userdata and produce userimage and show sign uplods

router.post('/showpreview/:userid/:userData/',uploads.single('owner'),signatures.single('sign'),checkAuth ,async (req,res) =>{
 
//:userid conatains id from url in of database 
//:userData contains the user data in the primary form
    
    let isauthenticateUser = await req.isAurthised;//this will check the authority of user...
    let idThrghURL = base64decode(req.params.userid);//this is the user id from the url
    //first check the basic sequrity that is user varified or not 
if(isauthenticateUser)
{
    if(isauthenticateUser.id == idThrghURL)//this is second level security for the user ...
    {
        
        return res.status(200
            ).render('imageuplods',{ //we will send the one more form for the image uplods only
            allinfo : isauthenticateUser
            ,FormTitle: "Owner`s Signature"
            ,jsonData : req.params.userData// this is the information of the user in string and encoded form
            ,crypted : req.params.userid //this is the id of user in data base,
            ,ownerImg: base64encode(JSON.stringify(req.file))//this is the user image produce in sign in form during filling this 
            ,ownerPic :false  //owner pics option will show
            ,ownersign : true //owner sign from option will show

             ,roomdocs :false //owner document from option will show
            ,roomgall :false //owner room gallary from option will show
            })
            

    }
    else
    {
        return res.json({
            message:"Owner image upload Error Occured . Please try latar.."
        })
    }

}else
{
    return res.status(200).redirect('/therooms/login') ; //this will redirect the user for login page if not aurthorised
}




})



//now the second form action i.e sign upload it will take user data and imf owner and sign produce

//it will contains only the userdata , owner image and produce signature and show docs uplods


router.post('/showpreview/:userid/:userData/:userimg',signatures.single('sign'),docs.single('docs'),checkAuth ,async (req,res) =>{
 
    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg containe the owner pic in encode form
        
        let isauthenticateUser = await req.isAurthised;//this will check the authority of user...
        let idThrghURL = base64decode(req.params.userid);//this is the user id from the url
        //first check the basic sequrity that is user varified or not 
    if(isauthenticateUser)
    {
        if(isauthenticateUser.id == idThrghURL)//this is second level security for the user ...
        {
           
            return res.status(200
                ).render('imageuplods',{ //we will send the one more form for the image uplods only
                allinfo : isauthenticateUser
                ,FormTitle: "Documents"
                ,jsonData : req.params.userData// this is the information of the user in string and encoded form
                ,crypted : req.params.userid //this is the id of user in data base,
                ,ownerImg: req.params.userimg//this is the user image 
                ,ownerSign :base64encode(JSON.stringify(req.file)) //this is the signature of owner produced in this routing
                ,ownerPic :false  //owner pics option will show
                ,ownersign : false //owner sign from option will show
    
                 ,roomdocs :true //owner document from option will show
                ,roomgall :false //owner room gallary from option will show
                })
                
    
        }
        else
        {
            return res.json({
                message:"sign upload Error Occured . Please try latar.."
            })
        }
    
    }else
    {
        return res.status(200).redirect('/therooms/login') ; //this will redirect the user for login page if not aurthorised
    }
    
    
    
    
    })
    

    //now the 3rd form routing i.e docs form action 
    //it will contains only the userdata ,ownerimg,ownersign and produce docs and show gallary rooms uplods


router.post('/showpreview/:userid/:userData/:userimg/:usersign',docs.single('docs'),Gallaryrooms.array('roomgal' , 5),checkAuth ,async (req,res) =>{
 
    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg contains the owner pic in encode form
    //:usersign contains the owner signature
        
        let isauthenticateUser = await req.isAurthised;//this will check the authority of user...
        let idThrghURL = base64decode(req.params.userid);//this is the user id from the url
        //first check the basic sequrity that is user varified or not 
    if(isauthenticateUser)
    {
        if(isauthenticateUser.id == idThrghURL)//this is second level security for the user ...
        {
            console.log(req.params.usersign);
            
            return res.status(200
                ).render('imageuplods',{ //we will send the one more form for the image uplods only
                allinfo : isauthenticateUser
                ,FormTitle: "Room`s Images"
                ,jsonData : req.params.userData// this is the information of the user in string and encoded form
                ,crypted : req.params.userid //this is the id of user in data base,
                ,ownerImg: req.params.userimg//this is the user img
                ,ownerSign :req.params.usersign //this is the signature of owner 
                ,ownerdocs : base64encode(JSON.stringify(req.file))//this is the doc produced in this routing
                ,ownerPic :false  //owner pics option will show
                ,ownersign : false //owner sign from option will show
    
                 ,roomdocs :false //owner document from option will show
                ,roomgall :true//owner room gallary from option will show
                })
                
    
        }
        else
        {
            return res.json({
                message:"docs upload Error Occured . Please try latar.."
            })
        }
    
    }else
    {
        return res.status(200).redirect('/therooms/login') ; //this will redirect the user for login page if not aurthorised
    }
    
    
    
    
    })
    

    //now for the 4th form action routing page i.e room gallary image uploads forn action
    //it will contains only the userdata ,ownerimg,ownersign ,docs and produce room gallray and show preview form


router.post('/showpreview/:userid/:userData/:userimg/:usersign/:userdocs',Gallaryrooms.array('roomgal' , 5), checkAuth ,async (req,res) =>{
 
    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg contains the owner pic in encode form
    //:usersign contains the owner signature
    //:userdocs contains documents of the room
    //but in this routing page we will show the user preview
        let isauthenticateUser = await req.isAurthised;//this will check the authority of user...
        let idThrghURL = base64decode(req.params.userid);//this is the user id from the url
        console.log(JSON.parse(base64decode(req.params.userimg)));
        //first check the basic sequrity that is user varified or not 
    if(isauthenticateUser)
    {
        if(isauthenticateUser.id == idThrghURL)//this is second level security for the user ...
           
        
            { 

                return res.status(200).render('previewform',{
                    title : "Preview: The Rooms",
                    allinfo : isauthenticateUser,
                    data:JSON.parse(base64decode(req.params.userData)),
                    ownerimage:JSON.parse(base64decode(req.params.userimg))
                })
            // return res.json(
            //     {
            //     message:base64decode(req.params.userid)
            //     ,data:JSON.parse(base64decode(req.params.userimg)),
            //     img:JSON.parse(base64decode(req.params.userData)),
            //     sign:JSON.parse(base64decode(req.params.userdocs)),
            //     docs:JSON.parse(base64decode(req.params.usersign)),
            //     gaal: req.files
            //     })
            
            
    
                
    
        }
        else
        {
            return res.json({
                message:"Rooms image upload Error Occured . Please try latar.."
            })
        }
    
    }else
    {
        return res.status(200).redirect('/therooms/login') ; //this will redirect the user for login page if not aurthorised
    }
    
    
    
    
    })

module.exports = router;