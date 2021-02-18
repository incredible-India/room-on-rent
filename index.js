/*Room on Rent is project which helps the people to finding the room (on rent),hotel,Pg,hostel acCording to thier choice */
/* HIMANSHU KUMAR B.E 2021 */

//Let`s Code//

// importing the modules 

require('dotenv').config(); //dot-env module 
const express = require('express'); //Nodejs web application framework
const morgan = require('morgan');//for  debugging 
const path = require('path');//specify the path
const chalk = require('chalk'); //beautify the console window
require('./database/dbsCon');//database connection code
const UserRoute = require('./controller/user');//routing code for the users
const CheckAurthorised = require('./authentication/auth');//it will check the user authentication
const cookieParser = require('cookie-parser'); //cookies
const bcryptjs =require('bcryptjs');//bcrypt the data
const rooms =require('./controller/rooms');//for rooms and the registration
const app = express();



//setting templates engine i.e pug

app.set('view engine','pug');
app.set('views',path.join(__dirname,"./views/"))

//useing middlewares

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './src/')));//for  the statics file (image ,videos etc..) in src file all the things are kept
app.use('/therooms', UserRoute); //for the routing code of users
app.use('/therooms/roomsregistration', rooms);//routing code for the room registration
app.use(cookieParser()); //using middleware for the cookies 

//port

const port = process.env.PORT || 80;


//routing code...

//for home page
app.get('/',CheckAurthorised.authUser, async (req, res) => {

    try{
        
        let userData = await req.isAurthised; //this contains either userinformation or null

                if(userData)  //if user is arthorised
                {

                    return res.status(200).render('index',{

                        userName : userData.fname
                        ,
                        dataforlogout : bcryptjs.hashSync('logout',10)
                        ,
                        ContentType :  userData.img.ContentType
                        ,
                        UimgData : userData.img.data,

                        userOptionlaData : bcryptjs.hashSync("data",10)
                        ,
                        id : userData._id
                    });

                }else //if user is not arthorised 
                {
                    res.setHeader('Content-Type', "text/html"); //type of response
                    // return res.render('index')
                      return   res.status(200).sendFile(path.join(__dirname, 'src/html', 'index.html'));//this is the home page for not aurthorised user
                }
        
       

    }catch {

        return res.json({message : "Some error occured in main url"})
    }




})

app.get('/contactUs', (req, res) => {

    res.setHeader('Content-Type', "text/html"); //type of response

    res.status(404).sendFile(path.join(__dirname, 'src/error/', "work.html"))

})

//for the services page

app.get('/therooms/services',(req,res)=>{


    res.setHeader('Content-Type', "text/html"); //type of response

    res.status(404).sendFile(path.join(__dirname, 'src/html/', "service.html"))


})

//listenig the port

app.listen(port, () => {

    console.log(chalk.bgMagentaBright.cyanBright(process.env.SERVER_MESSAGE, port));
})