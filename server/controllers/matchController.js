// call the matches collection
import matchDB from '../models/matchModel.js'
import tournamentDB from '../models/tournamentModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import { addFetchTournament } from '../functions/addFetchTournament.js'
import { removeFetchTournament } from '../functions/removeFetchTournament.js'
import { updateFetchToDatabase } from '../functions/updateFetchToDatabase.js'

// get all matches
export const getAllMatches = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const matches = await matchDB.find({}).sort({createdAt: -1})
        res.status(200).json(matches)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a match
export const getAMatch = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such match in database"})
    }

    const match = await matchDB.findById(id)

    // if no match found by that id, we need to return the function so that it will not proceed
    if(!match){
        return res.status(404).json({error: "No such match in database"})
    }

    res.status(200).json(match)
}


// post match record
export const keyInMatch = async (req,res)=>{
    const {tourid, id} = req.params;
    const {p1score, p2score} = req.body
    
    try{
        
        let player1_id = ""
        let player2_id = ""

        // get the latest id of the players from the matches
        const tournament = await tournamentDB.findOne({ _id : tourid })
        tournament.setting.matches.forEach(match=>{
            if(match.id === id){
                player1_id = match.player1.id
                player2_id = match.player2.id
            }
        })

        // update the match collection from database
        await matchDB.updateOne(
            { match_id: id },
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
        const tour = addFetchTournament(tournament)

        // enterResult for the match for that certain round
        try{
            tour.enterResult(id, p1win, p2win, draw);
        }catch(error){
            res.status(400).json({ message: "Unable to key in the result" });
        }

        // update the tournament DB based on tournament
        const updatedTournament = await updateFetchToDatabase(tour.id, tour);

        // after done, remove the tournament fetch data
        removeFetchTournament()

        res.status(200).json(updatedTournament)
        
    }catch(error){
        res.status(400).json({error: "Deny Permission: Key In"})
    }

}

// delete a match
export const deleteMatch = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such match in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const match = await matchDB.findOneAndDelete({_id: id})

    // if no match found by that id, we need to return the function so that it will not proceed
    if(!match){
        return res.status(404).json({error: "No such match in database"})
    }

    res.status(200).json(match)
}

// patch a match
export const updateMatch = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params
    // get the json body to update as well

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such match in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    // second argument is the value/body that you want to pass and update
    const match = await matchDB.findOneAndUpdate({_id: id},{
        /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
        ...req.body
    })

    // if no match found by that id, we need to return the function so that it will not proceed
    if(!match){
        return res.status(404).json({error: "No such match in database"})
    }

    res.status(200).json(match)
}