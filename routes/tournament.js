import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, showTour } from "../server.js";
let tournament

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
        const { id } = req.query;
        const tournamentinfo = await tourinfo.findById(id);
        res.render('editTourForm.ejs', { tournament : tournamentinfo });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ending the tournament
router.get('/completeTour',async (req,res)=>{
    try{
        const { id } = req.query;
        for(let x = 0; x< org.tournaments.length ; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                console.log(tournament.status)
                tournament.end()
            }
        }
        await tourinfo.findByIdAndUpdate(id,{'setting.status':tournament.status},{new:true})
        console.log(tournament.id+tournament.status)
        res.render('status.ejs',{tournament: tournament})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
})

router.post('/startTour', (req,res)=>{
    // inside try...catch
    try{
        // get the id of the certain tournament
        let { id } = req.query

        // iterate loop to find the tournament based on the id
        // assign it to tournament variable
        tournament = org.tournaments.find(tournament => tournament.id === id);

        // call the start tournament function 
        tournament.start()

        // print the tournament output on how it goes now
        console.log(tournament)

        // update the status of the tournament from setup to stageOne for mongodb

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
            let newTourUpdate = await tourinfo.findByIdAndUpdate(req.tournamentId, updatedTournamentData, { new: true });
            let arrayAttribute = {
                name: newTourUpdate.name,
                stageOne:{
                    format: newTourUpdate.setting.stageOne.format
                },
                stageTwo:{
                    format: newTourUpdate.setting.stageTwo.format
                },
                round: newTourUpdate.setting.round,
                colored: newTourUpdate.setting.colored,
                sorting: newTourUpdate.setting.sorting,
                scoring: newTourUpdate.setting.scoring,
                meta: newTourUpdate.meta,
                players: newTourUpdate.setting.players,
                matches: newTourUpdate.setting.matches,
                status: newTourUpdate.setting.status,
                id: req.tournamentId};

            //this segment is necessary to update the content back to the array
            for(let x=0;x<org.tournaments.length;x++){
                if(org.tournaments[x].id===req.tournamentId){
                    org.tournaments[x] = arrayAttribute
                }
            }

            //showTour()

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
            
            //showTour()

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