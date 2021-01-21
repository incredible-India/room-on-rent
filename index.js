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
const isAurthrised = require('./authentication/auth');//it will check the user authentication
const cookieParser = require('cookie-parser'); //cookies

const app = express();


//setting templates engine i.e pug

app.set('view engine','pug');
app.set('views',path.join(__dirname,"./views/"))

//useing middlewares

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './src/')));//for  the statics file (image ,videos etc..) in src file all the things are kept
app.use('/therooms', UserRoute); //for the routing code of users
app.use(cookieParser()); //using middleware for the cookies 

//port

const port = process.env.PORT || 80;


//routing code...

//for home page
app.get('/',isAurthrised, async (req, res) => {

    try{

        
        res.setHeader('Content-Type', "text/html"); //type of response
        // return res.render('index')
            res.status(200).sendFile(path.join(__dirname, 'src/html', 'index.html'));//this is the home page for not aurthorised user

    }catch {

        return res.json({message : "Some error occured in main url"})
    }




})

app.get('/contactUs', (req, res) => {

    res.setHeader('Content-Type', "text/html"); //type of response

    res.status(404).sendFile(path.join(__dirname, 'src/error/', "work.html"))

})

//listenig the port

app.listen(port, () => {

    console.log(chalk.bgMagentaBright.cyanBright(process.env.SERVER_MESSAGE, port));
})