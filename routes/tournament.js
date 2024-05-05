import express from "express"
const router = express.Router()
import { tourinfo } from '../config.js'
import { updateTourDB, findTourFetch, removeTourFetch } from "../server.js";
let tournament
let tournamentinfo

router.get('/', async (req, res) => {
    try {
        const user = await req.user;
        
        // .find({}) to find all the value in the array and pass it to tournaments
        // inside {} is the condition to be met
        let tournaments = await tourinfo.find({ 'meta.organizer' : user.email });
        
        res.render('tournamentinfo.ejs', { tournaments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/editTour', async (req, res) => {
    try {
        // Used to access query parameters passed in the URL query string, such as /editTour?id=123.
        // The parameters are appended to the URL using a question mark (?) and are key-value pairs separated by an ampersand (&).
        // They are accessed using the key-value pairs in the req.query object.

        // .findOne() will find only one tournament and pass it as one object instead of array of tournament
        const { id } = req.query;
        tournamentinfo = await tourinfo.findOne({ id : id });
        res.render('editTourForm.ejs', { tournament : tournamentinfo });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ending the tournament
router.get('/completeTour',async (req,res)=>{
    try{
        const { id } = req.query;

        // reload the tournament fetch by the tournamentinfo DB
        tournamentinfo = await tourinfo.findOne({ id : id });
        tournament = findTourFetch(tournamentinfo)
        // end them
        tournament.end()

        await updateTourDB(id,tournament)

        // after done, remove the tournament fetch data
        removeTourFetch()

        res.redirect('/tournamentinfo')
    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
})
router.get('/updateTour', async (req,res)=>{
    try{
        let { id } = req.query
        tournamentinfo = await tourinfo.findOne({id : id});

        res.render('stage-one-progress.ejs',{ tournament : tournamentinfo })

    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
})

router.get('/startTour', async (req,res)=>{
    // inside try...catch
    try{
        // get the id of the certain tournament
        const { id } = req.query
        tournamentinfo = await tourinfo.findOne({ id : id });

        try {
            // reload the tournament fetch by the tournamentinfo DB
            tournament = findTourFetch(tournamentinfo)

            // start the tournament
            tournament.start();

            // update the tournamentinfo DB
            tournamentinfo = await updateTourDB(id, tournament)

            // after done, remove the tournament fetch data
            removeTourFetch()

            //redirect user to matches progress
            res.render('stage-one-progress.ejs',{ tournament : tournamentinfo })

        } catch (e) {
            console.error(e);
            return;
        }
        
    }catch(error){
        res.status(500).json({ message: error.message });
    }

})

//later when the user clicks on the update button for certain tournament, it will redirect user to update page
//the way it works is that the user clicks, the id is grabbed, then we find the tournament based on the id
// PUT endpoint to update tournament information
// PUT endpoint to update tournament information

router
    .route('/:id')
    .get(async (req,res)=>{
        try{
            // Used to access parameters defined within the route path, such as /tournamentinfo/:id.
            // The parameters are part of the route URL itself.
            // They are accessed using the key-value pairs in the req.params object.
            
            tournamentinfo = await tourinfo.findOne({id : req.tournamentId})

            res.render('fulltourinfo.ejs',{tournament: tournamentinfo})

        }catch(error){
            res.status(500).json({message: error.message})
        }
    })
    .put(async (req, res) => {
        try {
            const updatedTournamentData = req.body; // Extract the updated tournament data from the request body

            // Perform the updateOne operation using the tournament ID and updated data
            await tourinfo.updateOne({ id : req.tournamentId }, updatedTournamentData, { new: true });
            
            res.redirect('/tournamentinfo')

        } catch (error) {
            res.status(500).send('Error updating tournament');
        }
    })
    .delete(async (req, res) => {
        try {
            // Perform the delete operation using the tournament ID
            await tourinfo.deleteOne({id : req.tournamentId});

            removeTourFetch()

            res.redirect('/tournamentinfo')

        } catch (error) {
            res.status(500).send('Error deleting tournament');
        }
})

router.param("id",async (req,res,next,id) => {
    try {
        req.tournamentId = id; // Store the id in the request object to make it accessible in other middleware functions
        next(); // Call next to move to the next middleware function
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router