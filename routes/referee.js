import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { findTourFetch, removeTourFetch, updateTourDB } from "../server.js";
let tournament
let tournamentinfo

// Create a form to add new players into the tournament (send the tour id to the page)
// use player = tournament.createPlayer(name,id)
// save the new players into the database as well

router.get('/',async (req,res)=>{
    try{
        const { id } = req.query;
        const user = await req.user
        tournamentinfo = await tourinfo.findOne({ id: id });

        const playerEmails = tournamentinfo.setting.players.map(player => player.id);
        const refereeEmails = tournamentinfo.meta.referee.map(player => player);

        // find the list of the potential user to become referee other than the organizer and players
        let referee_list = await userinfo.find({
            email : { $nin: [user.email, ...playerEmails, ...refereeEmails] },
        });

        res.render('registerreferee.ejs',{tournament: tournamentinfo, referees: referee_list.map(user => user.email) })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})

router.post('/',async (req,res)=>{
    //take the id tournament to distinguish which tournament that should be updated
    try{
        const { id } = req.query

        //take the body of the referee by email by grabbing them by name HTML FORM
        let refereeEmails = req.body['refereeEmails[]'];
        
        // Convert to array if it's not because like if u input one value, it might got confused
        if (!Array.isArray(refereeEmails)) {
            refereeEmails = [refereeEmails];  
        }

        console.log("Player email:", refereeEmails," Length: ", refereeEmails.length)

        // see the datatype of the array
        console.log(typeof refereeEmails[0]);

        for (const ref of refereeEmails) {
            // update the user as manager of the team
            await tourinfo.updateOne(
                { id: id },
                { $push: { 'meta.referee': ref } }
            );
        }

        // redirect user to the tournamentinfo page 
        res.redirect('/tournamentinfo')

    }catch(error){
        res.status(500).json({ message: error.message });
    }
    
});

export default router