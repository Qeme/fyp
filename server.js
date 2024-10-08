//only for process env not for production env
if(process.env.NODE_ENV !== 'production'){
    dotenv.config();
}

//extract the modules
import express from "express"
const app = express()
import bcrypt from "bcrypt"
import passport from "passport"
import flash from "express-flash"
import session from "express-session"
import methodOverride from "method-override"
import dotenv from 'dotenv';
import TournamentOrganizer from 'tournament-organizer';
const org = new TournamentOrganizer()
let tournament
let player

import initializePassport from './passport-config.js'
import {userinfo,tourinfo} from './config.js'

//pass the passport modules to other function at other file
initializePassport(
    passport,
    async email => await userinfo.findOne({ email: email }), // Asynchronously fetch user by email
    async id => await userinfo.findById(id) // Asynchronously fetch user by ID
)

//render engine
app.set('view engine', 'ejs');
app.use(express.static('public')) // it acts as middleware to present static file/javascript/images - client can directly access

//adding middleware to the Express application. 
//Middleware functions are functions that have access to the request object (req)
//plus the response object (res), and the next middleware function in the application's request-response cycle
app.use(express.json())
//allow the system to grab the data from form and pass it to req.body
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    //this will take the information from .env file
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//transfer the visitors to the main page
//when no argument inserted after /
// app.get('/', checkAuthenticated, (req,res)=>{
//     res.render('index.ejs', {name: req.user.name}) //take loged in user's name
// })


//need to use async funct because it takes time to grab the data from mongodb
app.get('/',checkAuthenticated,async (req, res) => {
    // console.log(await req.user)
    let user = await req.user
        
    res.render('index.ejs', { user: user });

});



//for /login argument 
app.get('/login', checkNotAuthenticated, (req,res)=>{
    res.render('login.ejs')
})

//POST /login why now we just use the passport module instead of req res
app.post('/login', checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
    //to do the failureFlash message, u need to use ejs at login.ejs
}))

//for /register argument
app.get('/register', checkNotAuthenticated, (req,res)=>{
    //define error type
    res.render('register.ejs', { error: req.query.error })
})

//POST /register
app.post('/register', checkNotAuthenticated, async (req,res)=>{
    try{

        // Check if the email already exists in the database
        const existingUser = await userinfo.findOne({ email: req.body.email });
        
        if(existingUser) {
            // If the email already exists, redirect the user to the registration page with an error message
            // if yes, send error = email-exists type
            return res.redirect('/register?error=email-exists');
        }
        
        //hash the password first
        const hashedPassword = await bcrypt.hash(req.body.password,10)

        //then we push the inserted data to database
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }

        //transfer all the data to the database
        const userdata = await userinfo.insertMany([data])

        //after all settle, redirect user to login page
        res.redirect('/login')
    }catch{
        //if have any error, let's redirect user to register again
        res.redirect('/register')
    }
})

// Route for updating user roles as competitor
app.post('/update-roles', checkAuthenticated,async (req, res) => {
    try {

        //get the details of the registered user
        const user = await req.user

        console.log(user)
        console.log(req.body.roles)

        if (!user) {
            res.status(404).json({ message: 'User not found' })
        }

        //get the JSON data and put it to specific attributes
        user.roles.push(req.body.roles)
        user.tournaments.push(req.body.tournaments)

        //save the push value to the mongodb
        user.save()

        res.redirect('/')
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/matches',checkAuthenticated,async (req,res)=>{

// get the secret data from .env
const API_KEY = process.env.API_KEY;
const STEAM_ID = process.env.STEAM_ID;
const GAME_ID = process.env.DOTA_ID;

try{

    // using STEAM API by link
    const url = `http://api.steampowered.com/IDOTA2Match_${GAME_ID}/GetMatchHistory/V001/?key=${API_KEY}&account_id=${STEAM_ID}`;

    //fetch the received data to the variable response
    const response = await fetch(url);
    const data = await response.json();

    // pass in the result data to matches variable before being passed to gameinfo.ejs
    res.render('gameinfo.ejs',{matches: data.result.matches})

    }catch(error){
        console.error(error)
}

})

// now put it into routes to make it cleaner
import tourgenerateRouter from './routes/tournament-generation.js';
import tourinfoRouter from './routes/tournament.js';
import playerinfoRouter from './routes/player.js';
import refereeinfoRouter from './routes/referee.js';
import matchinfoRouter from './routes/match.js';
import participateRouter from './routes/participation.js';

app.use('/createTour',checkAuthenticated,tourgenerateRouter)
app.use('/tournamentinfo',checkAuthenticated,tourinfoRouter)
app.use('/registerplayer',checkAuthenticated,playerinfoRouter)
app.use('/registerreferee',checkAuthenticated,refereeinfoRouter)
app.use('/match',checkAuthenticated,matchinfoRouter)
app.use('/joinTour',checkAuthenticated,participateRouter)

//this logout gave error because req.logout is asynchronous
//where u will get "req#logout requires a callback function"
// app.delete('/logout',(req,res)=>{
//     req.logOut()
//     res.redirect('/login')
// })
//use below instead
app.delete('/logout', (req, res, next) => {

    req.logOut((err) => {
      if (err) {
        return next(err);
      }

      res.redirect('/login');

    });
  });

async function updateTourDB(id, tournament){

    let updateDetail = {
        'setting.players' : tournament.players,
        'setting.matches' : tournament.matches,
        'setting.status' : tournament.status,
        'setting.stageOne' : tournament.stageOne,
        'setting.stageTwo' : tournament.stageTwo,
        'setting.round' : tournament.round,
        'setting.colored' : tournament.colored,
        'setting.sorting' : tournament.sorting,
        'setting.scoring' : tournament.scoring,
        'meta.organizer' : tournament.meta.organizer,
        'meta.game' : tournament.meta.game,
        'meta.platform' : tournament.meta.platform,
        'meta.venue' : tournament.meta.venue,
        'meta.register' : tournament.meta.register,
        'meta.running' : tournament.meta.running,
        'meta.checkin' : tournament.meta.checkin,
        'meta.notification' : tournament.meta.notification,
        'meta.ticket' : tournament.meta.ticket,
        'meta.representative' : tournament.meta.representative,
        'meta.referee' : tournament.meta.referee

        // id
        // name
};
    return await tourinfo.findOneAndUpdate({ id : id }, { $set: updateDetail }, { new: true });
}

function findTourFetch(tournamentinfo){

    let tourney ={
        id: tournamentinfo.id,
        name: tournamentinfo.name,
        stageOne: tournamentinfo.setting.stageOne,
        stageTwo: tournamentinfo.setting.stageTwo,
        round: tournamentinfo.setting.round,
        colored: tournamentinfo.setting.colored,
        sorting: tournamentinfo.setting.sorting,
        scoring: tournamentinfo.setting.scoring,
        players: tournamentinfo.setting.players,
        matches: tournamentinfo.setting.matches,
        meta: tournamentinfo.meta,
        status: tournamentinfo.setting.status
    }
    
    return org.reloadTournament(tourney);

}

function removeTourFetch(){
    //do nested loop -> do remove the tournament inside the array of org.tournaments by using org.removeTournament()

    while(org.tournaments.length!=0){
        org.tournaments.forEach(tournament => {
            console.log("Deleting..."+tournament.id)
            org.removeTournament(tournament.id)
        })
    }

}

//create a function to check Authentication user as middleware
//this function will be executed first inside '/' so if the 
//user is not loged in, redirect user to login
//this can avoid user from entering the page without permission
function checkAuthenticated(req,res,next){
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

//this function is to avoid from the loged in user from auto log out 
//when the user type http://.../login 
function checkNotAuthenticated(req,res,next){
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}

function generateRandomId(length) {
    const characters = '0123456789!@#$%^&*()_+';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export { org, updateTourDB, generateRandomId, findTourFetch, removeTourFetch };

//telling our app to start listening for visitors on a the port 3000
app.listen(3001)