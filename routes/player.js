import express from "express"
const router = express.Router()
import { tourinfo, userinfo } from '../config.js'
import { findTourFetch, removeTourFetch, updateTourDB } from "../server.js";
let tournament
let tournamentinfo

// Create a form to add new players into the tournament (send the tour id to the page)
// use player = tournament.createPlayer(name,id)
// save the new players into the database as well

router.get('/',async (req,res)=>{
    try{
        const { id } = req.query;
        // get the organizer data information first
        const user = await req.user
        
        tournamentinfo = await tourinfo.findOne({ id: id });

        // get the list emails of current players & referees that associated with the tournament
        const playerEmails = tournamentinfo.setting.players.map(player => player.id);
        const refereeEmails = tournamentinfo.meta.referee.map(player => player);

        // find the list of the potential user to become referee other than the organizer and players
        let player_list = await userinfo.find({
            email : { $nin: [user.email, ...playerEmails, ...refereeEmails] },
        });

        res.render('registerplayer.ejs',{tournament: tournamentinfo, repType: tournamentinfo.meta.representative.repType, potentialplayer: player_list.map(user => user.email) })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.post('/',async (req,res)=>{
    //take the id tournament to distinguish which tournament that should be updated
    try{
        const { id } = req.query
        tournamentinfo = await tourinfo.findOne({ id: id });

        // get the total number of free roam player/team to be registered
        const playerCount = req.body['player-count'];

        //take the body of the offical players by email by grabbing them by name HTML FORM
        let offplayerEmails = req.body['offplayerEmails[]'];
        let playerNames = req.body['player-name[]'];  

        // Convert to array if it's not because like if u input one value, it might got confused
        if (!Array.isArray(offplayerEmails)) {
            offplayerEmails = [offplayerEmails];  
        }

        if (!Array.isArray(playerNames)) {
            playerNames = [playerNames];  
        }

        // Now you have the value of playerCount, you can use it as needed
        console.log("Player count:", playerCount);

        console.log("Player name:", playerNames," Length:",playerNames.length);
        //we create an empty array
        const players = []
        
        // declare for the free roam name array to have undefined value for email (because this user will not be tracked)
        for (let i = 0; i < playerCount; i++) {
            const playerinfo = {
            email: undefined,
            name: playerNames[i]
            };
            players.push(playerinfo)
        }

        // this loop is used for inserting any offical player
        for (let i = 0; i < offplayerEmails.length; i++) {
            let offplayer = await userinfo.findOne({email: offplayerEmails[i]});

            const offplayerinfo = {
                email: offplayer.email,
                name: offplayer.name
                };

            players.push(offplayerinfo)
        }

        console.log("New player(s) inserted "+players.length)
        
        //find the tournament fetch
        //create new players into setup tournament one-by-one
        tournament = findTourFetch(tournamentinfo)
        players.forEach(player=>{
            tournament.createPlayer(player.name, player.email)
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