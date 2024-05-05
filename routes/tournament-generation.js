import express from "express"
const router = express.Router()
import { tourinfo } from '../config.js'
import { org, removeTourFetch } from "../server.js";
let tournament

router.get('/',(req,res)=>{
    res.render('tourCreate.ejs')
})

router.post('/',async (req,res)=>{

    // get the information from the tournament creation form page
    const {
        tname,
        game,
        platform,
        venue,
        format1,
        format2,
        regitime,
        closetime,
        starttour,
        endtour,
        checkIn,
        rules,
        regulation,
        competitor,
        viewer,
        colored,
        sorting,
        bestOf,
        bye,
        draw,
        loss,
        tiebreaks,
        win,
        preference,
        playerCount
    } = req.body;

    //get the info of the user details like email
    const user = await req.user

    //create tournament based on the organizer identity
    tournament = org.createTournament(tname,
        {
        stageOne:{
            format: format1
        },
        stageTwo:{
            format: format2
        },
        colored: colored,
        sorting: sorting,
        scoring: {
            bestOf: bestOf,
            bye: bye,
            draw: draw,
            loss: loss,
            tiebreaks: tiebreaks,
            win: win
        },
        meta: {
            organizer: user.email,
            game: game,
            platform: platform,
            venue: venue,
            register: {
                open: regitime,
                close: closetime
            },
            running: {
                start: starttour,
                end: endtour
            },
            checkin: checkIn,
            notification: {
                rules: rules,
                regulation: regulation
            },
            ticket: {
                competitor: competitor,
                viewer: viewer
            },
            representative: {
                repType: preference,
                numPlayers: playerCount
            }
        }
        },)

    // the newly object structure of tourinfo collection
    const newTournament = new tourinfo({
        id: tournament.id,
        name: tournament.name,
        setting:{
            stageOne: tournament.stageOne,
            stageTwo: tournament.stageTwo,
            colored: tournament.colored,
            sorting: tournament.sorting,
            scoring: tournament.scoring,
            status: tournament.status,
            round: tournament.round,
            players: tournament.players,
            matches: tournament.matches
        },
        meta: tournament.meta
        
    });

    // save the newly created tournament into tourinfo collection database
    newTournament.save()

    // remove the tournament fetch data
    removeTourFetch()

    // redirect user to the list of tournament page
    res.redirect('/tournamentinfo')
    
})

export default router