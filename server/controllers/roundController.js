// call the roundes collection
import roundDB from '../models/roundModel.js'
import tournamentDB from '../models/tournamentModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import { addFetchTournament } from '../functions/addFetchTournament.js'
import { removeFetchTournament } from '../functions/removeFetchTournament.js'
import { updateFetchToDatabase } from '../functions/updateFetchToDatabase.js'

// get all rounds
export const getAllRounds = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const rounds = await roundDB.find({}).sort({createdAt: -1})
        res.status(200).json(rounds)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a round
export const getARound = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    const round = await roundDB.findOne({match_id: id})

    // if no round found by that id, we need to return the function so that it will not proceed
    if(!round){
        return res.status(404).json({error: "No such round in database"})
    }

    res.status(200).json(round)
}

// get stageOne bracket that consist of many matches
export const stageOne = async (req,res)=>{
    const {tourid} = req.params

        // include refresh roundes as well
    try{
        const tournament = await tournamentDB.findById(tourid)
        const divider = tournament.setting.stageOne.rounds
        const stageOneMatches = tournament.setting.matches.filter(match => match.round <= divider);
        
        res.status(200).json(stageOneMatches)
    }catch(error){
        res.status(400).json({error: "Deny Permission: Stage One"})
    }
}

// post advanceBracket from stageOne to stageTwo
export const advanceBracket = async (req,res)=>{
    const {tourid} = req.params
    
    try{
        const tournament = await tournamentDB.findById(tourid)
        const tour = addFetchTournament(tournament)

        // ...only permit the advance button to round-robin and swiss format && all the matches has been scored
        try{
            tour.next()
        }catch(error){
            res.status(400).json({error: "Advancing to next stage is not permitted"})
            return;
        }
        

        // update the tour to tournament db
        const updatedTournament = await updateFetchToDatabase(tour.id, tour);

        // after done, remove the tournament fetch data
        removeFetchTournament()

        res.status(200).json(updatedTournament)
        
    }catch(error){
        res.status(400).json({error: "Deny Permission: Advance Bracket"})
    }
}

// get stageTwo bracket that consist of many roundes
export const stageTwo = async (req,res)=>{
    const {tourid} = req.params
    
    // include refresh roundes as well
    try{
        const tournament = await tournamentDB.findById(tourid)
        const divider = tournament.setting.stageOne.rounds
        const stageTwoMatches = tournament.setting.matches.filter(match => match.round > divider);
        
        res.status(200).json(stageTwoMatches)
    }catch(error){
        res.status(400).json({error: "Deny Permission: Stage Two"})
    }
}

// post Match record by inserting individual rounds
export const keyInMatch = async (req,res)=>{
    const {tourid, id} = req.params;
    const {p1score, p2score} = req.body
    
    try{

        // get the latest id of the players from the matches + rounds in db
        const tournament = await tournamentDB.findOne({ _id : tourid })
        
        tournament.setting.matches.map(async m => {
            if (m.id === id) {
                const round = await roundDB.findOne({ match_id : id })
                const bestOf = tournament.setting.scoring.bestOf;
                    if (round === null) {
                        // use .create() to generate and save the data
                        await roundDB.create({ 
                            match_id: m.id,
                            bestOf: tournament.setting.scoring.bestOf,
                            p1: m.player1.id,
                            p2: m.player2.id,
                            scoreP1: new Array(bestOf).fill(0),
                            scoreP2: new Array(bestOf).fill(0),
                            status: "unlocked"
                        })
                    }
                    else if(round.status === "locked"){
                        return res.status(400).json({ error: "Deny Permission. Clear Score First!" });
                    }
                // update the round collection from database
                await roundDB.updateOne(
                    { match_id: id },
                    { $set: { p1: m.player1.id, p2: m.player2.id, scoreP1: p1score, scoreP2: p2score, status: "locked" } }
                );

                // do simple calculation to identify the winner, loser and draw point
                let p1win = 0, p2win = 0, draw = 0; // Declare variables outside of the loop

                for (let x = 0; x < bestOf; x++) {
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

                // update the round point for p1 and p2 (tournament)
                const tour = addFetchTournament(tournament)
                
                // Define limit and continue values based on tournament settings
                const limit = tour.stageOne.rounds;
                const continueLimit = tour.players.length / 2;
                
                // enterResult for the round for that certain round
                try{
                    // Enter result for a round
                    tour.enterResult(id, p1win, p2win, draw);

                    // Check if the tournament format is one of the specified formats
                    if (["round-robin", "double-round-robin", "swiss"].includes(tour.stageOne.format)) {
                        // Find the match with the specified id
                        const match = tour.matches.find(match => match.id === id);

                        // If round is found and conditions are met, proceed to the next stage
                        if (match && match.round < limit && match.match === continueLimit) {
                            tour.next();
                        }
                    }

                }catch(error){
                    res.status(400).json({ message: "Unable to key in the result" });
                }

                // update the tournament DB based on tournament
                const updatedTournament = await updateFetchToDatabase(tour.id, tour);

                // after done, remove the tournament fetch data
                removeFetchTournament()

                res.status(200).json(updatedTournament)
            }

        });
        
    }catch(error){
        res.status(400).json({error: "Deny Permission: Key In"})
    }

}

// clear the match record
export const clearMatch = async (req,res) => {
    const {tourid, id} = req.params;

    try{
        // find tournament and round inside db
        const tournament = await tournamentDB.findOne({ _id : tourid })
        const round = await roundDB.findOne({ match_id : id })

        // find the tour inside fetch data
        const tour = addFetchTournament(tournament)

        // clear the round record
        tour.clearResult(id)

        // update the tournament DB based on tour
        const updatedTournament = await updateFetchToDatabase(tour.id, tour);

        const bestOf = round.bestOf
        const P1score = new Array(bestOf).fill(0)
        const P2score = new Array(bestOf).fill(0)

        for (const match of updatedTournament.setting.matches) {
            // Update the player names
            await roundDB.updateOne(
                { match_id: match.id },
                { $set: { p1: match.player1.id, p2: match.player2.id } }
            );
        
            // Check if the match.id is equal to id 
            if (match.id === id) {
                // Update the score to 0
                await roundDB.updateOne(
                    { match_id: id },
                    { $set: { scoreP1: P1score, scoreP2: P2score, status: "unlocked" } }
                );
            }
        }

        // after done, remove the tournament fetch data
        removeFetchTournament()

        res.status(200).json(updatedTournament)

    }catch(error){
        res.status(400).json({error: "Deny Permission: Clear"})
    }
}