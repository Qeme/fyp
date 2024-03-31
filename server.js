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

    //do for loop to create back the tournaments that he had created before org.createTournament()
    const tourlist = await tourinfo.find({ 'meta.organizer': user.email });

    if(org.tournaments.length === 0){
        fillArray(tourlist)
    }
        
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
            //console.log('Tournament created successfully!',savedTournament);
            //create tournament based on the organizer identity
            tournament = org.createTournament(savedTournament.name,
                {
                stageOne:{
                    format: savedTournament.setting.stageOne.format
                },
                stageTwo:{
                    format: savedTournament.setting.stageTwo.format
                },
                round: savedTournament.setting.round,
                colored: savedTournament.setting.colored,
                sorting: savedTournament.setting.sorting,
                scoring:savedTournament.setting.scoring,
                meta: savedTournament.meta
                },
                savedTournament.id)

            //tournament = org.reloadTournament(newTournament)
            // addPlayer('Amani')
            // endingTour()
            //console.log(tournament)
            // let x = org.tournaments
            // for (let i = 0; i < x.length; i++) {
            //     console.log(x[i])
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
        const tour = await tourinfo.findById(id);
        res.render('editTourForm.ejs', { tournament : tour });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ending the tournament
app.get('/completeTour',checkAuthenticated,async (req,res)=>{
    try{
        const { id } = req.query;
        for(let x = 0; x< org.tournaments.length ; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                console.log(tournament.status)
                endingTour()
            }
        }
        await tourinfo.findByIdAndUpdate(id,{'setting.status':tournament.status},{new:true})
        console.log(tournament.id+tournament.status)
        res.render('status.ejs',{tournament: tournament})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
})

// Create a form to add new players into the tournament (send the tour id to the page)
// use player = tournament.createPlayer(name,id)
// save the new players into the database as well
app.get('/registerplayer',checkAuthenticated,async (req,res)=>{
    try{
        const { id } = req.query;
        const tour = await tourinfo.findById(id);
        res.render('registerplayer.ejs',{tournament: tour})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

app.post('/registerplayer',checkAuthenticated,async (req,res)=>{
    //take the id tournament to distinguish which tournament that should be updated
    try{
        const { id } = req.query

        //take the body of the players by email and name req.body by grabbing them by name HTML FORM
        const playerEmails = req.body['player-email[]'];
        const playerNames = req.body['player-name[]'];

        //we create an empty array
        const players = []

        // do looping push the players' information into array for each player
        for (let i = 0; i < playerEmails.length; i++) {
            const playerinfo = {
            email: playerEmails[i],
            name: playerNames[i]
            };
            players.push(playerinfo)
        }
        console.log("New player(s) inserted "+players.length)

        //we append or match the data with the attributes inside collection Tournament
        //we update in mongodb by using updateOne()
        //search by id tournament, update contents, options

        const result = await tourinfo.updateOne(
            { _id: id },
            { $set: { 'setting.players': players }}
        );
        console.log('Document updated successfully:', result);
          
        //find the tournament inside org.tournament by using id
        //append the player info inside the array of tournament

        for(let x = 0; x< org.tournaments.length ; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                for(let y = 0; y< players.length; y++)
                    addPlayer(players[y].name,players[y].email)
            }
        }

        // show the tournament info array
        let x = org.tournaments
            for (let i = 0; i < x.length; i++) {
                console.log(x[i])
            }

    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
});

// PUT endpoint to update tournament information
app.put('/tournamentinfo/:id', async (req, res) => {
    try {
        const { id } = req.params; 
        const updatedTournamentData = req.body; // Extract the updated tournament data from the request body

        // Perform the update operation using the tournament ID and updated data
        await tourinfo.findByIdAndUpdate(id, updatedTournamentData, { new: true });

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
        org.removeTournament(id)

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
      if(org.tournaments.length !== 0)
        clearArray()

      res.redirect('/login');
    });
  });

function addPlayer(name,id){
    let player;
    try {
        player = tournament.createPlayer(name,id);
    } catch (e) {
        console.error(e);
        return;
    }
}

function endingTour(){
    //now we can use the reloadTournament() to use it for any edit or ending the tournamet
    tournament.end()
}

function fillArray(tourlist){
    console.log(tourlist.length)
    if (tourlist.length > 0) {
        // Loop through each tournament and create it
        for (let tour of tourlist) {
            org.createTournament(tour.name,{
                stageOne:{
                    format: tour.setting.stageOne.format
                },
                stageTwo:{
                    format: tour.setting.stageTwo.format
                },
                round: tour.setting.round,
                colored: tour.setting.colored,
                sorting: tour.setting.sorting,
                scoring:tour.setting.scoring,
                meta: tour.meta
            },tour.id);

        }
    }

    org.tournaments.forEach(tournament => {
            // Access the ID of each tournament and log it to the console
            console.log(tournament.id);
        });
}

function clearArray(){
    //do nested loop -> do remove the tournament inside the array of org.tournaments by using org.removeTournament()

    while(org.tournaments.length!=0){
        org.tournaments.forEach(tournament => {
            console.log("Deleting..."+tournament.id)
            org.removeTournament(tournament.id)
        })
    }
    
    org.tournaments.forEach(tournament => {
        console.log(tournament.id)
    });
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

//telling our app to start listening for visitors on a the port 3000
app.listen(3001)