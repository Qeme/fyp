// call the tournaments collection
import tournamentDB  from '../models/tournamentModel.js'
// call the Tournament Module
import TournamentOrganizer from 'tournament-organizer';
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

const org = new TournamentOrganizer()

// function to find the fetch tournament
function findTourFetch(tournament){

    const tourney ={
        id: tournament.tour_id,
        name: tournament.name,
        stageOne: tournament.setting.stageOne,
        stageTwo: tournament.setting.stageTwo,
        round: tournament.setting.round,
        colored: tournament.setting.colored,
        sorting: tournament.setting.sorting,
        scoring: tournament.setting.scoring,
        players: tournament.setting.players,
        matches: tournament.setting.matches,
        meta: tournament.meta,
        status: tournament.setting.status
    }
    
    return org.reloadTournament(tourney);

}

// function to remove any fetch tournament remaining
function removeTourFetch(){
    //do nested loop -> do remove the tournament inside the array of org.tournaments by using org.removeTournament()

    while(org.tournaments.length!=0){
        org.tournaments.forEach(tournament => {
            console.log("Deleting..."+tournament.id)
            org.removeTournament(tournament.id)
        })
    }

}

// update the tournament db from the current fetch tournament
async function updateTourDB(id, tour){

    const updateDetail = {
        'setting.players' : tour.players,
        'setting.matches' : tour.matches,
        'setting.status' : tour.status,
        'setting.stageOne' : tour.stageOne,
        'setting.stageTwo' : tour.stageTwo,
        'setting.round' : tour.round,
        'setting.colored' : tour.colored,
        'setting.sorting' : tour.sorting,
        'setting.scoring' : tour.scoring,
        'meta.organizer_id' : tour.meta.organizer_id,
        'meta.game_id' : tour.meta.game_id,
        'meta.venue_id' : tour.meta.venue_id,
        'meta.register' : tour.meta.register,
        'meta.running' : tour.meta.running,
        'meta.checkin' : tour.meta.checkin,
        'meta.notification' : tour.meta.notification,
        'meta.ticket' : tour.meta.ticket,
        'meta.representative' : tour.meta.representative,
        'meta.referee_id' : tour.meta.referee_id
};

    return await tournamentDB.findOneAndUpdate({ tour_id : id }, { $set: updateDetail }, { new: true });
}

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
    const {name, game_id, venue_id, stageOne, stageTwo, register, running, checkin, notification, ticket, representative, referee_id, colored, sorting, scoring} = req.body;

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
        const tour = org.createTournament(name,{
            stageOne,
            stageTwo,
            colored,
            sorting,
            scoring,
            meta: {
                game_id,
                venue_id,
                register,
                running,
                checkin,
                notification,
                ticket,
                representative,
                referee_id
            }
        })

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

        // clean up the fetch tour
        removeTourFetch()

        res.status(200).json(tournament)
    }catch(error){
        res.status(400).json({error: error.message})
    }

}

// assign players/...referee to the tournament that recently created
export const assignTournament = async (req,res) => {
    const {id} = req.params
    const {players, referees} = req.body

    const tournament = await tournamentDB.findById(id)

    try{
        // update referees
        for (const referee of referees) {
            await tournamentDB.updateOne(
                { _id: id },
                { $push: { 'meta.referee_id': referee.email } }
            );
        }

        const tour = findTourFetch(tournament)
    
        // create player to the tour
        players.map((player)=>{
            tour.createPlayer(player.name, player.email)
        })

        // update the tournament DB
        const updatedTournament = await updateTourDB(tour.id, tour)

        // after done, remove the tournament fetch data
        removeTourFetch()
            
        res.status(200).json(updatedTournament)
    }catch(error){
        res.status(400).json({error: "Deny Permission: Assign"})
    }

}

// start a tournament
export const startTournament = async (req,res) => {
    const {id} = req.params

    const tournament = await tournamentDB.findById(id)

    try{
        // reload the tour fetch by the tournamentinfo DB
        const tour = findTourFetch(tournament)

        // start the tour
        tour.start();

        // update the tournament DB
        const updatedTournament = await updateTourDB(tour.id, tour)

        // after done, remove the tournament fetch data
        removeTourFetch()
        
        res.status(200).json(updatedTournament)
    }catch(error){
        res.status(400).json({error: "Deny Permission: Start"})
    }
    
}

// end a tournament
export const endTournament = async (req,res) => {
    const {id} = req.params

    const tournament = await tournamentDB.findById(id)

    try{
        // reload the tour fetch by the tournamentinfo DB
        const tour = findTourFetch(tournament)

        // end the tour
        tour.end();

        // update the tournament DB
        const updatedTournament = await updateTourDB(tour.id, tour)

        // after done, remove the tournament fetch data
        removeTourFetch()
        
        res.status(200).json(updatedTournament)
    }catch(error){
        res.status(400).json({error: "Deny Permission: End"})
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