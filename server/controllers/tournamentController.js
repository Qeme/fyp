// call the tournaments collection
import tournamentDB  from '../models/tournamentModel.js'
// call the Tournament Module
import TournamentOrganizer from 'tournament-organizer';
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

const org = new TournamentOrganizer()

// get all tournaments
export const getAllTournaments = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const tournaments = await tournamentDB.find({}).sort({createdAt: -1})
        res.status(200).json(tournaments)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a tournament
export const getATournament = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such tournament in database"})
    }

    const tournament = await tournamentDB.findById(id)

    // if no tournament found by that id, we need to return the function so that it will not proceed
    if(!tournament){
        return res.status(404).json({error: "No such tournament in database"})
    }

    res.status(200).json(tournament)
}


// post new tournament
export const createTournament = async (req,res)=>{
    const {name} = req.body;

    // check the field that is empty
    let emptyFields = []

    // so for each field that empty, push the field properties to the array
    if(!name){
        emptyFields.push('name')
    }
    if(emptyFields.length > 0){
        // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    try{
        // use Tournament module to create the tournament, then pass the id to mongodb database
        const tour = org.createTournament(name)

        // use .create() to generate and save the data
        const tournament = await tournamentDB.create({ 
            tour_id: tour.id,
            name: tour.name,
            setting:{
                stageOne: tour.stageOne,
                stageTwo: tour.stageTwo,
                colored: tour.colored,
                sorting: tour.sorting,
                scoring: tour.scoring,
                status: tour.status,
                round: tour.round,
                players: tour.players,
                matches: tour.matches
            },
            meta: tour.meta 
        })
        res.status(200).json(tournament)
    }catch(error){
        res.status(400).json({error: error.message})
    }

}

// delete a tournament
export const deleteTournament = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such tournament in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const tournament = await tournamentDB.findOneAndDelete({_id: id})

    // if no tournament found by that id, we need to return the function so that it will not proceed
    if(!tournament){
        return res.status(404).json({error: "No such tournament in database"})
    }

    res.status(200).json(tournament)
}

// patch a tournament
export const updateTournament = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params
    // get the json body to update as well

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such tournament in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    // second argument is the value/body that you want to pass and update
    const tournament = await tournamentDB.findOneAndUpdate({_id: id},{
        /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
        ...req.body
    })

    // if no tournament found by that id, we need to return the function so that it will not proceed
    if(!tournament){
        return res.status(404).json({error: "No such tournament in database"})
    }

    res.status(200).json(tournament)
}