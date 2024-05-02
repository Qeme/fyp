import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, showTour } from "../server.js";
let tournament
let player

router.get('/',(req,res)=>{
    res.render('tourCreate.ejs')
})

router.post('/',async (req,res)=>{

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

    const newTournament = new tourinfo({
        name: tname,
        setting:{
            stageOne: { 
                format: format1
            },
            stageTwo: {
                format: format2
            },
            colored: colored,
            sorting: sorting,
            scoring:{
                bestOf: bestOf,
                bye: bye,
                draw: draw,
                loss: loss,
                tiebreaks: tiebreaks,
                win: win
            }
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

        
    });

    newTournament.save()
        .then(savedTournament => {
            //console.log('Tournament created successfully!',savedTournament);
            //create tournament based on the organizer identity
            tournament = org.createTournament(savedTournament.name,
                {
                stageOne:{
                    format: savedTournament.setting.stageOne.format
                },
                stageTwo:{
                    format: savedTournament.setting.stageTwo.format
                },
                colored: savedTournament.setting.colored,
                sorting: savedTournament.setting.sorting,
                scoring:savedTournament.setting.scoring,
                meta: savedTournament.meta
                },
                savedTournament.id)

            showTour()
            res.status(200).send('Tournament created successfully');
        })
        .catch(error => {
            console.error('Error creating tournament:', error);
            res.status(500).send('Error creating tournament');
        });
    
})

export default router