// call the games collection
import gameDB from '../models/gameModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

// get all games
export const getAllGames = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const games = await gameDB.find({}).sort({createdAt: -1})
        res.status(200).json(games)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a game
export const getAGame = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such game in database"})
    }

    const game = await gameDB.findById(id)

    // if no game found by that id, we need to return the function so that it will not proceed
    if(!game){
        return res.status(404).json({error: "No such game in database"})
    }

    res.status(200).json(game)
}


// post new game
export const createGame = async (req,res)=>{
    const {name, platform} = req.body;

    // check the field that is empty
    let emptyFields = []

    // so for each field that empty, push the field properties to the array
    if(!name){
        emptyFields.push('name')
    }
    if(!platform){
        emptyFields.push('platform')
    }
    if(emptyFields.length > 0){
        // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    try{
        // use .create() to generate and save the data
        const game = await gameDB.create({ 
            name, platform
        })

        res.status(200).json(game)
    }catch(error){
        res.status(400).json({error: error.message})
    }

}

// delete a game
export const deleteGame = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such game in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const game = await gameDB.findOneAndDelete({_id: id})

    // if no game found by that id, we need to return the function so that it will not proceed
    if(!game){
        return res.status(404).json({error: "No such game in database"})
    }

    res.status(200).json(game)
}

// patch a game
export const updateGame = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params
    // get the json body to update as well

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such game in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    // second argument is the value/body that you want to pass and update
    const game = await gameDB.findOneAndUpdate({_id: id},{
        /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
        ...req.body
    })

    // if no game found by that id, we need to return the function so that it will not proceed
    if(!game){
        return res.status(404).json({error: "No such game in database"})
    }

    res.status(200).json(game)
}