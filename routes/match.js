import express from "express"
const router = express.Router()
import { userinfo, tourinfo } from '../config.js'
import { org, showTour, updateTourDB } from "../server.js";
let tournament
let tournamentinfo

router.post('/insert', async (req, res) => {
    try {
        // get the match information by query it through URL
        const { id, matchId } = req.query
        tournamentinfo = await tourinfo.findById(id)
        tournamentinfo.setting.matches.forEach(match=>{
            if(match.id===matchId){
                res.render('insert-result.ejs',{id: id, match : match})
            }
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/insert-complete', async (req, res) => {
    
    const { player1score, player2score, draw } = req.body

    try {
        // get the match information by query it through URL
        const { id, matchId } = req.query

        // update the match point for p1 and p2 (tournament)
        for(let x = 0; x<org.tournaments.length; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                tournament.enterResult(matchId,parseInt(player1score,10),parseInt(player2score,10),parseInt(draw,10)) //parseInt so that it can chaneg the String to Number if any
                tournament.matches.forEach(match => console.log("MatchID=>",match.id,"Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

                // update the match point for p1 and p2 (tourinfo)
                tournamentinfo = await updateTourDB(id,tournament)
                res.render('stage-one-progress.ejs',{ tournament : tournamentinfo })
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/clear', async (req, res) => {
    try {
        const { id, matchId } = req.query

        for(let x = 0; x<org.tournaments.length; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                tournament.clearResult(matchId)
                tournament.matches.forEach(match => console.log("MatchID=>",match.id,"Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

                // update the match point for p1 and p2 (tourinfo)
                tournamentinfo = await updateTourDB(id,tournament)
                res.render('stage-one-progress.ejs',{ tournament : tournamentinfo })
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router