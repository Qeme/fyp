import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, showTour } from "../server.js";
let tournament
// let player

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
    // when user click on the register button
    // u also sending the tournament id, ticket price for comp and viewer and the QR banking

    // just open the pop up

    // let the user choose the amount of ticket needed

    // do some calculation Price = Nc(Comp Ticket Price) + Nv(Viewer Ticket Price)

    // then user insert either picture of receipt or reference number

    // then submit
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