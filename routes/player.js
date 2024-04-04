import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, tournament, player } from "../global-variables.js";

// Create a form to add new players into the tournament (send the tour id to the page)
// use player = tournament.createPlayer(name,id)
// save the new players into the database as well

router.get('/',async (req,res)=>{
    try{
        const { id } = req.query;
        const tournament = await tourinfo.findById(id);
        res.render('registerplayer.ejs',{tournament: tournament})
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.post('/',async (req,res)=>{
    //take the id tournament to distinguish which tournament that should be updated
    try{
        const { id } = req.query

        const playerCount = req.body['player-count'];

        // Now you have the value of playerCount, you can use it as needed
        console.log("Player count:", playerCount);

        //take the body of the players by email and name req.body by grabbing them by name HTML FORM
        const playerEmails = req.body['player-email[]'];
        const playerNames = req.body['player-name[]'];

        console.log("Player email:", playerEmails," Length:",playerEmails.length);
        //we create an empty array
        const players = []
        if(playerCount<2){
            const onePlayer = {
                email: playerEmails,
                name: playerNames
            };
            players.push(onePlayer);
        }else{
            for (let i = 0; i < playerCount; i++) {
                const playerinfo = {
                email: playerEmails[i],
                name: playerNames[i]
                };
                players.push(playerinfo)
            }
        }
        console.log("New player(s) inserted "+players.length)
        

        //we append or match the data with the attributes inside collection Tournament
        //we update in mongodb by using updateOne()
        //search by id tournament, update contents, options

        const result = await tourinfo.updateOne(
            { _id: id },
            { $push: { 'setting.players': players }}
            // $set is used to replace the existing variables value
            // $push is used add more variables value into existing 
        );
        console.log('Document updated successfully:', result);
          
        //find the tournament inside org.tournament by using id
        //append the player info inside the array of tournament

        for(let x = 0; x< org.tournaments.length ; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                for(let y = 0; y< players.length; y++)
                    req.addPlayer(players[y].name,players[y].email)
            }
        }

        // show the tournament info array
        req.showTour()

    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
});

export default router