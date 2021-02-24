//this is the rooms available for the user site
require('dotenv').config(); //for the reading data from dotenv file
const express = require('express'); //express js
const router = express.Router(); //setting the router info
const bodyParser = require('body-parser'); //parsing data from url
const bcryptjs = require('bcryptjs'); //for encrypting the password
const {
    check,
    validationResult
} = require('express-validator'); //it will check the form validation on server
const path = require('path'); //for the path
const fs = require('fs'); //file system module ,helps to store the data
const checkAuth = require('./../authentication/auth'); //this is the auth code for the user
const multer = require('multer'); //for the uploading the image 
const {
    base64decode,
    base64encode
} = require('nodejs-base64'); //this will encode and decode the informations used in url
// const { json } = require('body-parser');
const roomInfomration = require('./../model/landlord'); //this is the informations of owner 
const userinfomation = require('./../model/newUser'); //this is the database of users 
const jwt = require('jsonwebtoken'); //for saving the cookies web token we still did not use it latar for the user login we w

// const { JsonWebTokenError } = require('jsonwebtoken');


// useing middlewaras 
router.use(express.static(path.join(__dirname, './../')));

router.use(bodyParser.json()); //for parsing data in json formate
router.use(bodyParser.urlencoded({
    extended: false
}));



//setting the pug file

express().set('view engine', 'pug'); //setting the pug template engine
express().set('views', path.join(__dirname, '../views/pug/')); //it will look all file in views folder


//now the code for images


var storage = multer.diskStorage({

    destination: 'OwnersInformation/OwnerImage'


        ,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var uploads = multer({
    storage: storage
})


// for the ownerssignature...

var signature = multer.diskStorage({ //this will save the owner signature
    destination: 'OwnersInformation/OwnerSignature'


        ,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var signatures = multer({
    storage: signature
}); //for the signature



//for the owner docs
var Document = multer.diskStorage({ //this will save the single room image
    destination: 'OwnersInformation/OwnerDocs'


        ,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var docs = multer({
    storage: Document
}); //for the single room  documents

//for the multi rooms images

var rooms = multer.diskStorage({ //this will save the multi room image
    destination: 'OwnersInformation/RoomGallary'


        ,
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_user_" + file.originalname)
    }
})

var Gallaryrooms = multer({
    storage: rooms
}); //for the multi room  images





//routing code start from here 

//for the room registration form

router.get('/applicationform/:userid', checkAuth.authUser, async (req, res) => {

    let isAuthenticate = await req.isAurthised; //this will return user info or null

    if (isAuthenticate) {
        if (isAuthenticate._id == req.params.userid) //if user is aurthoried 
        {

            return res.status(200).render('roomregisteration', {
                allinfo: isAuthenticate,
                crypted: await bcryptjs.hashSync(req.params.userid) //all the userinfo
            }); //this is the registration form


        } else {
            return res.status(200).redirect('/therooms/login'); //if user is not aurthorised we will send the login form
        }
    } else {
        return res.json({
            message: "Error page not found please try again"
        })
    }


})


//after felling the form we have to show the preview to the user
//this router is for the basic deatils of user  we will send the the user image uplod options in this router if there is no error
router.post('/imageuplods/:mainuserid', uploads.single('owner'),

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



    ], checkAuth.authUser, async (req, res) => {

        let formValidationError = validationResult(req);


        if (!formValidationError.isEmpty()) // if there is any kind of form validation error
        {

            return res.json({
                message: "form validation error at show preview",
                error: formValidationError.array()
            })

        }

        let isauthenticateUser = await req.isAurthised; //this will check the authority of user...


        if (isauthenticateUser) //first we will check the user authentication  
        {


            if (req.params.mainuserid == isauthenticateUser._id) //this is second level varification so that if anyone change the url we won't process thenext image upload form
            {
                return res.status(200).render('imageuplods', { //we will send the one more form for the image uplods only
                    allinfo: isauthenticateUser,
                    FormTitle: "Owner`s Image",
                    jsonData: base64encode(JSON.stringify(req.body)) // this is the information of the user in string and encoded form
                        ,
                    crypted: base64encode(req.params.mainuserid) //this is the id of user in data base,
                        ,
                    ownerPic: true //owner pics option will show
                        ,
                    ownersign: false //owner sign from option will show

                        ,
                    roomdocs: false //owner document from option will show
                        ,
                    roomgall: false //owner room gallary from option will show


                })
            } else {
                return res.json({
                    message: "error 404 page not found please try again"
                })
            }




        } else {
            return res.status(200).redirect('/therooms/login'); //if user is not aurthorosed we will send login form
        }

    })



//1st form i.e owners image uploads routing code  this action url inside the owner image uploads form only
//it will contain only the userdata and produce userimage and show sign uplods

router.post('/showpreview/:userid/:userData/', uploads.single('owner'), signatures.single('sign'), checkAuth.authUser, async (req, res) => {

    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form

    let isauthenticateUser = await req.isAurthised; //this will check the authority of user...
    let idThrghURL = base64decode(req.params.userid); //this is the user id from the url
    //first check the basic sequrity that is user varified or not 
    if (isauthenticateUser) {
        if (isauthenticateUser.id == idThrghURL) //this is second level security for the user ...
        {

            return res.status(200).render('imageuplods', { //we will send the one more form for the image uplods only
                allinfo: isauthenticateUser,
                FormTitle: "Owner`s Signature",
                jsonData: req.params.userData // this is the information of the user in string and encoded form
                    ,
                crypted: req.params.userid //this is the id of user in data base,
                    ,
                ownerImg: base64encode(JSON.stringify(req.file)) //this is the user image produce in sign in form during filling this 
                    ,
                ownerPic: false //owner pics option will show
                    ,
                ownersign: true //owner sign from option will show

                    ,
                roomdocs: false //owner document from option will show
                    ,
                roomgall: false //owner room gallary from option will show
            })


        } else {
            return res.json({
                message: "Owner image upload Error Occured . Please try latar.."
            })
        }

    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }




})



//now the second form action i.e sign upload it will take user data and imf owner and sign produce

//it will contains only the userdata , owner image and produce signature and show docs uplods


router.post('/showpreview/:userid/:userData/:userimg', signatures.single('sign'), docs.single('docs'), checkAuth.authUser, async (req, res) => {

    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg containe the owner pic in encode form

    let isauthenticateUser = await req.isAurthised; //this will check the authority of user...
    let idThrghURL = base64decode(req.params.userid); //this is the user id from the url
    //first check the basic sequrity that is user varified or not 
    if (isauthenticateUser) {
        if (isauthenticateUser.id == idThrghURL) //this is second level security for the user ...
        {

            return res.status(200).render('imageuplods', { //we will send the one more form for the image uplods only
                allinfo: isauthenticateUser,
                FormTitle: "Documents",
                jsonData: req.params.userData // this is the information of the user in string and encoded form
                    ,
                crypted: req.params.userid //this is the id of user in data base,
                    ,
                ownerImg: req.params.userimg //this is the user image 
                    ,
                ownerSign: base64encode(JSON.stringify(req.file)) //this is the signature of owner produced in this routing
                    ,
                ownerPic: false //owner pics option will show
                    ,
                ownersign: false //owner sign from option will show

                    ,
                roomdocs: true //owner document from option will show
                    ,
                roomgall: false //owner room gallary from option will show
            })


        } else {
            return res.json({
                message: "sign upload Error Occured . Please try latar.."
            })
        }

    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }




})


//now the 3rd form routing i.e docs form action 
//it will contains only the userdata ,ownerimg,ownersign and produce docs and show gallary rooms uplods


router.post('/showpreview/:userid/:userData/:userimg/:usersign', docs.single('docs'), Gallaryrooms.array('roomgal', 5), checkAuth.authUser, async (req, res) => {

    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg contains the owner pic in encode form
    //:usersign contains the owner signature

    let isauthenticateUser = await req.isAurthised; //this will check the authority of user...
    let idThrghURL = base64decode(req.params.userid); //this is the user id from the url
    //first check the basic sequrity that is user varified or not 
    if (isauthenticateUser) {
        if (isauthenticateUser.id == idThrghURL) //this is second level security for the user ...
        {
            console.log(req.params.usersign);

            return res.status(200).render('imageuplods', { //we will send the one more form for the image uplods only
                allinfo: isauthenticateUser,
                FormTitle: "Room`s Images",
                jsonData: req.params.userData // this is the information of the user in string and encoded form
                    ,
                crypted: req.params.userid //this is the id of user in data base,
                    ,
                ownerImg: req.params.userimg //this is the user img
                    ,
                ownerSign: req.params.usersign //this is the signature of owner 
                    ,
                ownerdocs: base64encode(JSON.stringify(req.file)) //this is the doc produced in this routing
                    ,
                ownerPic: false //owner pics option will show
                    ,
                ownersign: false //owner sign from option will show

                    ,
                roomdocs: false //owner document from option will show
                    ,
                roomgall: true //owner room gallary from option will show
            })


        } else {
            return res.json({
                message: "docs upload Error Occured . Please try latar.."
            })
        }

    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }




})


//now for the 4th form action routing page i.e room gallary image uploads forn action
//it will contains only the userdata ,ownerimg,ownersign ,docs and produce room gallray and show preview form


router.post('/showpreview/:userid/:userData/:userimg/:usersign/:userdocs', Gallaryrooms.array('roomgal', 5), checkAuth.authUser, async (req, res) => {

    //:userid conatains id from url in of database 
    //:userData contains the user data in the primary form
    //:userimg contains the owner pic in encode form
    //:usersign contains the owner signature
    //:userdocs contains documents of the room
    //but in this routing page we will show the user preview
    let isauthenticateUser = await req.isAurthised; //this will check the authority of user...
    let idThrghURL = base64decode(req.params.userid); //this is the user id from the url

    //first check the basic sequrity that is user varified or not 
    if (isauthenticateUser) {
        if (isauthenticateUser.id == idThrghURL) //this is second level security for the user ...


        {

            return res.status(200).render('previewform', {
                title: "Preview: The Rooms",
                allinfo: isauthenticateUser, //bakend auth page return user data
                data: JSON.parse(base64decode(req.params.userData)), //contains the data of the user in form
                ownerimage: JSON.parse(base64decode(req.params.userimg)), //image of the owner
                signatureOwner: JSON.parse(base64decode(req.params.usersign)) //signature image
                    ,
                userid: req.params.userid //contains userid 
                    ,
                userdata: req.params.userData //containes user data rncode form 
                    ,
                userimg: req.params.userimg, //user image encode form
                usersign: req.params.usersign //usersign encoded form
                    ,
                userdocs: req.params.userdocs //user document information
                    ,
                roomgall: base64encode(JSON.stringify(req.files)) //rooms images




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





        } else {
            return res.json({
                message: "Rooms image upload Error Occured . Please try latar.."
            })
        }

    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }




})


//for the final submission nad saving it into the data base

router.post('/redirecting/:userid/:userdata/:userimg/:usersign/:userdocs/:roomgall', checkAuth.authUser, async (req, res) => {

    let isAuthenticate = await req.isAurthised; //this is data of authentication page
    let urlid = base64decode(req.params.userid); //this is the id of user through url
    let userdata = JSON.parse(base64decode(req.params.userdata)); //owner information
    let userimage = JSON.parse(base64decode(req.params.userimg)); //owner image
    let usersign = JSON.parse(base64decode(req.params.usersign)); //owner Sign
    let userdocs = JSON.parse(base64decode(req.params.userdocs)); //owner document
    let roomgall = JSON.parse(base64decode(req.params.roomgall)); //room gallary


    let ABlankArrayToSaveImg = []; //in this we will save above object that contains room images



    for (i = 0; i < roomgall.length; i++) {
        //    
        console.log(roomgall[i].size);

        ABlankArrayToSaveImg.push({
            size: roomgall[i].size,
            ContentType: "image/jpg",
            data: fs.readFileSync(path.join(__dirname, './../', roomgall[i].path))
        }) //save the object in array which contains room images





    }


    //for the primary sequrity
    if (isAuthenticate) {
        if (urlid == isAuthenticate._id) {
            //saveing the data in database 

            let newOwner = new roomInfomration({

                fname: userdata.fname,
                lname: userdata.lname,
                email: userdata.email,
                mobile: userdata.mobile,
                altermobile: userdata.altmobile,
                state: userdata.state,
                city: userdata.city,
                zip: userdata.zip,
                address: userdata.address,
                fathername: userdata.fathername,
                restriction: userdata.roomrestri,
                roomfor: userdata.roomfor,
                roomtype: userdata.roomtype,
                roomrent: userdata.monthlyrent,
                gender: userdata.gender,
                dob: userdata.dob,
                village: userdata.village,
                washroom: userdata.washrooms,
                kitchen: userdata.kitchen,
                persontype: userdata.persontype,
                roomfacility: userdata.roomfacilty,
                anyotherinforoom: userdata.roominfo,
                electricbill: userdata.electricbill,
                downpayment: userdata.downpayment,
                returndwnpayment: userdata.rtndwn,
                anyotherinforent: userdata.rentinfo,
                roomname: userdata.roomname,
                throughid: isAuthenticate._id,
                landimg: {
                    data: fs.readFileSync(path.join(__dirname, './../', userimage.path)),
                    ContentType: "image/jpg"
                }

                ,
                documentImg: {
                    data: fs.readFileSync(path.join(__dirname, './../', userdocs.path)),
                    ContentType: "image/jpg"
                },

                landsignature: {
                    data: fs.readFileSync(path.join(__dirname, './../', usersign.path)),
                    ContentType: "image/jpg"
                },
                //now we have to save the room images in data base

                homeimg: {

                    ABlankArrayToSaveImg

                }

            })

            //saving the data in background
            newOwner.save((err, data) => {

                if (err) {
                    return res.json({
                        message: "Failed to savein database",
                        error: err
                    })
                }

                //now we updated the data so that user can see his registred home 

                userinfomation.findOneAndUpdate({
                    _id: urlid
                }, {
                    service: true
                }, (error, dataupdates) => {

                    if (error) {
                        return res.json({
                            message: "Updating Services Failed Try Latar"
                        })
                    }

                    //now we will generate the token for the owner informations and its authenticate the user

                    const tokenForUser = newOwner.genratetokenforowner() // it will return a token latar we will use it and save it in cookies 




                    return res.status(200).redirect(`/therooms/roomsregistration/myroom/${base64encode(JSON.stringify(isAuthenticate._id))}/${tokenForUser}`) //this will show the preview of the saved his rooms

                })



            })

        } else {
            return res.json({
                message: "final submission error"
            })

        }


    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }


})



//now the routing for the rooms view of the owner after felling the form of room registration..

router.get('/myroom/:userid/:tokenowner', checkAuth.authUser, checkAuth.ownerAuthentications, async (req, res) => {

    let isauthenticateduser = await req.isAurthised;

    let urlId = JSON.parse(base64decode(req.params.userid)); //this is the id of user

    let isOwner = await req.ownerAuth; //this will return whole document of owner



    if (isauthenticateduser) {

        // const varifyOwner = jwt.verify(req.params.tokenowner,process.env.SECRET_KEY);//it will return the owner infomation which is to be saved, in this owner token will save give owner id unique not user id

        if (isauthenticateduser._id == urlId) //this is the second level Authenticatation
        {

            if (isauthenticateduser._id == isOwner.throughid) //this is the third level sequrity
            {
                return res.status(200).render('myhome', {

                    title: "My Home : The Rooms",

                    allinfo: isauthenticateduser, //userinformation

                    ownerinfo: isOwner //owner information,

                        ,
                    imgofRooms: isOwner.homeimg[0].ABlankArrayToSaveImg //images of the rooms
                })
            } else {
                return res.json({
                    message: " Try Latar Server is busy now..."
                })
            }

        } else {
            return res.json({
                message: "Failed To Show The Preview, Try Latar Your Info Has Been Saved.."
            })
        }

    } else {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised

    }



})

//router for to see the registred home from the profile page link....

router.post('/showMyrooms/:userid/allinfo', checkAuth.authUser, checkAuth.ownerAuthentications, async (req, res) => {

    let userAuthenticate = await req.isAurthised; //return user informations

    let IDTHRURL = JSON.parse(base64decode(req.params.userid))

    let ownerAuthenticate = await req.ownerAuth; //this will return whole document of owner

    
    //for the first and basic level sequirty 

    if(userAuthenticate) //this will check the user token and varify it from thew database
    {
        //now for second level sequrity

        if(userAuthenticate._id == IDTHRURL)
        {
         
            //third level sequrity

            if(ownerAuthenticate.throughid == IDTHRURL)  //after this we will show the preview of the room 
            {

                //this is the owner`rooms informations page 
                res.status(200).render('myhome', {

                    title: "My Home : The Rooms",

                    allinfo: userAuthenticate, //userinformation

                    ownerinfo: ownerAuthenticate //owner information,

                   ,
                    imgofRooms: ownerAuthenticate.homeimg[0].ABlankArrayToSaveImg //images of the rooms


                })


            
            
            }else
            {
                return res.json({
                    message :"Database through url did not matched.."
                })
            }

        }else
        {

            return res.json({
                message : "url id and database id did not matched..."
            })
        }

    }else
    {
        return res.status(200).redirect('/therooms/login'); //this will redirect the user for login page if not aurthorised
    }



})
module.exports = router;