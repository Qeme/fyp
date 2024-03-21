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
app.get('/',async (req, res) => {
    // console.log(await req.user)
    res.render('index', { user: await req.user });
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

//get tournament info page
app.get('/createTour',checkAuthenticated,(req,res)=>{
    res.render('tourCreate.ejs')
})

app.post('/createTour',checkAuthenticated, async (req,res)=>{

    const {
        tname,
        game,
        platform,
        venue,
        format1,
        format2,
        regitime,
        closetime,
        starttour,
        endtour,
        checkIn,
        rules,
        regulation,
        competitor,
        viewer,
        round,
        colored,
        sorting,
        bestOf,
        bye,
        draw,
        loss,
        tiebreaks,
        win
    } = req.body;

    //get the info of the user details like email
    const user = await req.user

    const newTournament = new tourinfo({
        name: tname,
        setting:{
            stageOne: { 
                format: format1
            },
            stageTwo: {
                format: format2
            },
            round: round,
            colored: colored,
            sorting: sorting,
            scoring:{
                bestOf: bestOf,
                bye: bye,
                draw: draw,
                loss: loss,
                tiebreaks: tiebreaks,
                win: win
            }
        },
        meta: {
            organizer: user.email,
            game: game,
            platform: platform,
            venue: venue,
            register: {
                open: regitime,
                close: closetime
            },
            running: {
                start: starttour,
                end: endtour
            },
            checkin: checkIn,
            notification: {
                rules: rules,
                regulation: regulation
            },
            ticket: {
                competitor: competitor,
                viewer: viewer
            }
        }

        
    });

    newTournament.save()
        .then(savedTournament => {
            console.log('Tournament created successfully!',savedTournament);
            //create tournament based on the organizer identity
            // const settings = {
            //     meta: savedTournament.meta,
            //     stageOne: savedTournament.stageOne,
            //     stageTwo: savedTournament.stageTwo
            // }
            // tournament = org.createTournament(savedTournament.name,settings,savedTournament.id)
            // for (let i = 0; i < tournament.length; i++) {
            //     console.log(tournament[i])
            // }
            res.status(200).send('Tournament created successfully');
        })
        .catch(error => {
            console.error('Error creating tournament:', error);
            res.status(500).send('Error creating tournament');
        });
    
})

app.get('/tournamentinfo', checkAuthenticated, async (req, res) => {
    try {
        const user = await req.user;
        
        // .find({}) to find all the value in the array and pass it to tournaments
        // inside {} is the condition to be met
        const tournaments = await tourinfo.find({ 'meta.organizer' : user.email });
        
        res.render('tournamentinfo.ejs', { tournaments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//later when the user clicks on the update button for certain tournament, it will redirect user to update page
//the way it works is that the user clicks, the id is grabbed, then we find the tournament based on the id
app.get('/tournamentinfo/:id',checkAuthenticated,async (req,res)=>{
    try{
        // Used to access parameters defined within the route path, such as /tournamentinfo/:id.
        // The parameters are part of the route URL itself.
        // They are accessed using the key-value pairs in the req.params object.
        const { id } = req.params
        const tournament = await tourinfo.findById(id)
        res.render('fulltourifno.ejs',{tournament})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

app.get('/editTour', checkAuthenticated, async (req, res) => {
    try {
        // Used to access query parameters passed in the URL query string, such as /editTour?id=123.
        // The parameters are appended to the URL using a question mark (?) and are key-value pairs separated by an ampersand (&).
        // They are accessed using the key-value pairs in the req.query object.
        const { id } = req.query;
        const tournament = await tourinfo.findById(id);
        res.render('editTourForm.ejs', { tournament });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT endpoint to update tournament information
app.put('/tournamentinfo/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const updatedTournamentData = req.body; // Extract the updated tournament data from the request body

        // Perform the update operation using the tournament ID and updated data
        const updatedTournament = await tourinfo.findByIdAndUpdate(id, updatedTournamentData, { new: true });

        res.redirect('/tournamentinfo')
    } catch (error) {
        res.status(500).send('Error updating tournament');
    }
});

// PUT endpoint to update tournament information
app.delete('/tournamentinfo/:id', async (req, res) => {
    try {
        const { id } = req.params; 

        // Perform the delete operation using the tournament ID
        await tourinfo.findByIdAndDelete(id);

        res.redirect('/tournamentinfo')
    } catch (error) {
        res.status(500).send('Error deleting tournament');
    }
});

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

//telling our app to start listening for visitors on a the port 3000
app.listen(3001)