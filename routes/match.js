import express from "express"
const router = express.Router()
import { userinfo, tourinfo, gameinfo } from '../config.js'
import { org, showTour, updateTourDB } from "../server.js";
let tournament
let game
let tournamentinfo

router.post('/insert', async (req, res) => {
    try {
        // Get the match information by querying it through URL
        const { id, matchId } = req.query;
        const tournamentinfo = await tourinfo.findById(id);
        const bestOf = tournamentinfo.setting.scoring.bestOf;
        let gameToUpdate; // Declare gameToUpdate variable to store the game object
    
        // Mapping each match to an asynchronous function
        const promises = tournamentinfo.setting.matches.map(async match => {
            if (match.id === matchId) {
                const game = await gameinfo.find({ match_id: match.id });
                if (!game.length) {
                    // If game does not exist, create and save it
                    gameToUpdate = new gameinfo({
                        match_id: match.id,
                        p1: match.player1.id,
                        p2: match.player2.id,
                        scoreP1: new Array(bestOf).fill(0),
                        scoreP2: new Array(bestOf).fill(0)
                    });
                    await gameToUpdate.save();
                } else {
                    gameToUpdate = game[0]; // Store the found game object
                }
                console.log(gameToUpdate);
            }
        });
    
        // Wait for all promises to resolve
        await Promise.all(promises);
        
        // Render the result page outside of the map function
        res.render('insert-result.ejs', { id: id, bestOf, game: gameToUpdate });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.post('/insert-complete', async (req, res) => {

    try {
        // get the match information by querying it through URL
        const { id, matchId } = req.query;
    
        // get the score for each players
        const p1score = req.body['p1score[]'];
        const p2score = req.body['p2score[]'];
    
        let player1_id = ""
        let player2_id = ""
        // get the latest id of the players from the matches
        tournamentinfo = await tourinfo.findById(id)
        tournamentinfo.setting.matches.forEach(match=>{
            if(match.id === matchId){
                player1_id = match.player1.id
                player2_id = match.player2.id
            }
        })
        // update the database for the game
        game = await gameinfo.updateOne(
            { match_id: matchId },
            { $set: { p1: player1_id, p2: player2_id, scoreP1: p1score, scoreP2: p2score } }
        );
    
        // do simple calculation to identify the winner, loser and draw point
        let p1win = 0, p2win = 0, draw = 0; // Declare variables outside of the loop
    
        for (let x = 0; x < p1score.length; x++) {
            if (p1score[x] !== 0 && p2score[x] !== 0) {
                if (p1score[x] > p2score[x]) {
                    p1win++;
                } else if (p1score[x] < p2score[x]) {
                    p2win++;
                } else {
                    draw++;
                }
            }
        }

        // update the match point for p1 and p2 (tournament)
        for (let x = 0; x < org.tournaments.length; x++) {
            if (org.tournaments[x].id === id) {
                tournament = org.tournaments[x];
                tournament.enterResult(matchId, p1win, p2win, draw);
                tournament.matches.forEach(match => console.log("MatchID=>", match.id, "Match :", match.match, " Round :", match.round, " P1 [", match.player1.id, "] (", match.player1.win, ") VS P2 [", match.player2.id, "] (", match.player2.win, ")"));
    
                // update the match point for p1 and p2 (tournamentinfo)
                tournamentinfo = await updateTourDB(id, tournament);
                res.render('stage-one-progress.ejs', { tournament: tournamentinfo });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
});

router.post('/clear', async (req, res) => {
    try {
        const { id, matchId } = req.query

        // clear the games record
        for(let x = 0; x<org.tournaments.length; x++){
            if(org.tournaments[x].id === id){
                tournament = org.tournaments[x]
                tournament.clearResult(matchId)
                tournament.matches.forEach(match => console.log("MatchID=>",match.id,"Match :",match.match," Round :",match.round," P1 [",match.player1.id,"] (",match.player1.win,") VS P2 [",match.player2.id,"] (",match.player2.win,")"))

                // update the match point for p1 and p2 (tourinfo)
                tournamentinfo = await updateTourDB(id,tournament)

                // do looping for all matches inside that tournament to update the name of the players - usually turns to null
                for (const match of tournamentinfo.setting.matches) {
                    await gameinfo.updateOne(
                        { match_id: match.id },
                        { $set: { p1: match.player1.id, p2: match.player2.id } }
                    );
                }

                // now change the specific match to replace current score to 0
                let bestOf = tournamentinfo.setting.scoring.bestOf
                let P1score = new Array(bestOf).fill(0)
                let P2score = new Array(bestOf).fill(0)

                await gameinfo.updateOne({ match_id: matchId }, { $set: {scoreP1 : P1score, scoreP2 : P2score} }, { new: true });

                res.render('stage-one-progress.ejs',{ tournament : tournamentinfo })
            }
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router