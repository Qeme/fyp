import express from "express"
const router = express.Router()
import { userinfo, tourinfo, teaminfo } from '../config.js'
import { org, showTour, generateRandomId, Player } from "../server.js";
let tournament
let player

router.get('/', async (req, res) => {
    // get all the tournaments 
    try {
        const user = await req.user
        const tournaments = await tourinfo.find();
        res.render('tourJoin.ejs', { user: user, tournaments: tournaments });
    } catch (error) {
        // Handle error
        console.error('Error fetching tournament data:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/register', async (req, res) => {
    try{
        const { id } = req.query
        let tournamentinfo = await tourinfo.findById(id)
        res.render("insert-join.ejs",{tournament: tournamentinfo})

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

        let tournamentinfo = await tourinfo.findById(id)

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
            const randomId = `${teamName}-${firstEmailPart}-${generateRandomId(10)}`;

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

            // create the team as player into tournament directly
            const teamXplayer = new Player(newTeam.id,newTeam.name)
            console.log(teamXplayer)

            await tourinfo.updateOne(
                { _id : id },
                { $push : { 'setting.players' : teamXplayer }}
            )

            // update the user as manager of the team
            const updatedUser = await userinfo.updateOne(
                { _id: user.id },
                { $push: { team: newTeam.id }}
                // $set is used to replace the existing variables value
                // $push is used add more variables value into existing 
            );

            console.log(updatedUser);
        }
        
        // res.redirect('/')

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
            
            let tournamentinfo = await tourinfo.findById(req.tournamentId)

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