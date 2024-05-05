import express from "express"
const router = express.Router()
import { userinfo, tourinfo, teaminfo } from '../config.js'
import { generateRandomId, updateTourDB, findTourFetch, removeTourFetch } from "../server.js";
let tournament
let tournamentinfo

router.get('/', async (req, res) => {
    // get all the tournaments 
    try {
        const user = await req.user

        // .find() can put condition where you give the properties that equal to value that you want
        //  $ne means not equal to
        //  $elemMatch makes the setting.players array contains at least one object where the id (player.id) property matches the user's email
        //  $nin means not in (it requires an array value to check)

        let teamIds = user.team.map(team => team.id); // Extract team IDs if user.team is an array

        // tournaments_new is to sort the tournament that is new, status = setup and the user not yet register to the tournament either as individual/team
        let tournaments_new = await tourinfo.find({
            'meta.organizer': { $ne: user.email },
            'setting.status': 'setup',
            'setting.players.id': { 
                $nin: [user.email, ...teamIds] // Spread operator to include all team IDs
            }
        });

        // tournaments_join is to sort the tournament that is status = setup/stageOne/stageTwo/complete and the user had registered to the tournament either as individual/team
        let tournaments_join = await tourinfo.find({
            'meta.organizer': { $ne: user.email },
            '$or': [
                { 'setting.players': { $elemMatch: { id: user.email } } }, // Matches if the user's email is among the players
                { 'setting.players': { $elemMatch: { id: { $in: teamIds } } } } // Matches if any of the user's team IDs are among the players
            ]
        });

        res.render('tourJoin.ejs', { user: user, tournaments_new : tournaments_new, tournaments_join : tournaments_join });
    } catch (error) {
        // Handle error
        console.error('Error fetching tournament data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/register', async (req, res) => {
    try{
        const { id } = req.query
        tournamentinfo = await tourinfo.findOne({ id : id })
        res.render("insert-join.ejs",{ tournament : tournamentinfo })

        // later in the development, grab the team from the user collection to make sure user not put back the name of the team back into registreation
    }catch(error){
        res.status(500).json({message: error.message})
    }
});

router.post('/register-complete', async (req, res) => {
    // get the register information and store it into database
    try{
        const { id } = req.query
        const user = await req.user // use to save the id of the user to the team

        tournamentinfo = await tourinfo.findOne({ id : id })

        // if the tournament representative is for team only
        if(tournamentinfo.meta.representative.repType === 'team'){
            const teamName = req.body.teamName;
            const playerEmails = req.body['playerEmail[]'];
            const playerNames = req.body['playerName[]'];

            const players = playerEmails.map((email, index) => ({
                email: email,
                name: playerNames[index]
            }));            

            // Extract the first part of the first player's email
            const firstEmailPart = user.email[0].split('@')[0];

            // Generate a random ID based on the team name, email part, and a random string
            const randomId = `${teamName}${firstEmailPart}${generateRandomId(10)}`;

            const newTeam = new teaminfo({
                // id auto generate by stricting its pattern
                id: randomId,
                name: teamName,
                manager: user.email,
                players : players
            })
            
            console.log(newTeam);

            // save the tournament info into database
            newTeam.save()
                .then(() => console.log("Team created successfully"))
                .catch(err => console.error("Error creating team:", err));

            // call the tournament fetch
            tournament = findTourFetch(tournamentinfo)

            // createPlayer() for the team as player
            tournament.createPlayer(newTeam.name,newTeam.id)

            // save the new updated players into tournamentinfo DB
            await updateTourDB(id,tournament)

            // update the user as manager of the team
            const updatedUser = await userinfo.updateOne(
                { _id: user.id },
                { $push: { team: {id : newTeam.id} }}
                // $set is used to replace the existing variables value
                // $push is used add more variables value into existing 
            );

            console.log(updatedUser);

            // after done, remove the tournament fetch data
            removeTourFetch()
            
        }else if(tournamentinfo.meta.representative.repType === 'individual'){
            // call the tournament fetch
            tournament = findTourFetch(tournamentinfo)

            // createPlayer() for the team as player
            tournament.createPlayer(user.name,user.email)

            await updateTourDB(id,tournament)

            // after done, remove the tournament fetch data
            removeTourFetch()
        }
        
        res.redirect('/joinTour')

    }catch(error){
        res.status(500).json({message: error.message})
    }
});

router
    .route('/:id')
    .get(async (req,res)=>{
        try{
            // Used to access parameters defined within the route path, such as /joinTour/:id.
            // The parameters are part of the route URL itself.
            // They are accessed using the key-value pairs in the req.params object.
            
            tournamentinfo = await tourinfo.findOne({id : req.tournamentId})

            res.render('fulljoininfo.ejs',{tournament: tournamentinfo})

        }catch(error){
            res.status(500).json({message: error.message})
        }
    })

// params
router.param("id",async (req,res,next,id) => {
    try {
        req.tournamentId = id; // Store the id in the request object to make it accessible in other middleware functions
        next(); // Call next to move to the next middleware function
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export default router