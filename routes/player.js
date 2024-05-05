import express from "express"
const router = express.Router()
import { tourinfo } from '../config.js'
import { findTourFetch, removeTourFetch, updateTourDB } from "../server.js";
let tournament
let tournamentinfo

// Create a form to add new players into the tournament (send the tour id to the page)
// use player = tournament.createPlayer(name,id)
// save the new players into the database as well

router.get('/',async (req,res)=>{
    try{
        const { id } = req.query;
        tournamentinfo = await tourinfo.findOne({ id: id });
        res.render('registerplayer.ejs',{tournament: tournamentinfo, error: req.query.error })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.post('/',async (req,res)=>{
    //take the id tournament to distinguish which tournament that should be updated
    try{
        const { id } = req.query
        tournamentinfo = await tourinfo.findOne({ id: id });

        const playerCount = req.body['player-count'];

        // Now you have the value of playerCount, you can use it as needed
        console.log("Player count:", playerCount);

        //take the body of the players by email and name req.body by grabbing them by name HTML FORM
        const playerEmails = req.body['player-email[]'];
        const playerNames = req.body['player-name[]'];

        // checking if the email already being inserted into tournament already or not
        const existingPlayers = await tourinfo.findOne({ 
            id: id, 
            'setting.players': { $elemMatch: { id: { $in: playerEmails } } } 
        });
        
        if (existingPlayers) {
            // If any of the emails already exist, redirect the user to the registration page with an error message
            return res.render('registerplayer.ejs',{error:'email-exists',tournament:tournamentinfo});
        }        
        
        console.log("Player email:", playerEmails," Length:",playerEmails.length);
        //we create an empty array
        const players = []
        if(playerCount<2){
            const onePlayer = {
                id: playerEmails,
                name: playerNames
            };
            players.push(onePlayer);
        }else{
            for (let i = 0; i < playerCount; i++) {
                const playerinfo = {
                id: playerEmails[i],
                name: playerNames[i]
                };
                players.push(playerinfo)
            }
        }
        console.log("New player(s) inserted "+players.length)
        
        //find the tournament fetch
        //create new players into setup tournament one-by-one
        tournament = findTourFetch(tournamentinfo)
        players.forEach(player=>{
            tournament.createPlayer(player.name,player.id)
        })

        // we then update the tournament data into tournamentinfo DB
        await updateTourDB(id,tournament)

        // after done, remove the tournament fetch data
        removeTourFetch()

        // redirect user to the tournamentinfo page 
        res.redirect('/tournamentinfo')

    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
});

export default router