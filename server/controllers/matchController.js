// call the matches collection
import matchDB from '../models/matchModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

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


// post new match
export const createMatch = async (req,res)=>{
    const {match_id, p1, p2, scoreP1, scoreP2} = req.body;

    // check the field that is empty
    let emptyFields = []

    // so for each field that empty, push the field properties to the array
    if(!p1){
        emptyFields.push('p1')
    }
    if(!p2){
        emptyFields.push('p2')
    }
    if(emptyFields.length > 0){
        // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    try{
        // use .create() to generate and save the data
        const match = await matchDB.create({ 
            match_id, p1, p2, scoreP1, scoreP2
        })

        res.status(200).json(match)
    }catch(error){
        res.status(400).json({error: error.message})
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