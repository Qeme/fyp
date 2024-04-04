import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, tournament, player } from "../global-variables.js";

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
            
            let tournamentinfo = await tourinfo.findById(req.tournamentId)

            // // this is testing phase for reloadTournament
            // for(let x=0;x<org.tournaments.length;x++){
            //     if(org.tournaments[x].id===req.tournamentId){
            //         tournament = org.reloadTournament(org.tournaments[x])
            //         console.log(tournament.name)
            //     }
            // }

            res.render('fulltourinfo.ejs',{tournament: tournamentinfo})
        }catch(error){
            res.status(500).json({message: error.message})
        }
    })
    .put(async (req, res) => {
        try {
            const updatedTournamentData = req.body; // Extract the updated tournament data from the request body

            // Perform the update operation using the tournament ID and updated data
            await tourinfo.findByIdAndUpdate(req.tournamentId, updatedTournamentData, { new: true });

            res.redirect('/tournamentinfo')
        } catch (error) {
            res.status(500).send('Error updating tournament');
        }
    })
    .delete(async (req, res) => {
        try {
            // Perform the delete operation using the tournament ID
            await tourinfo.findByIdAndDelete(req.tournamentId);
            org.removeTournament(req.tournamentId)
            
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