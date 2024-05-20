// call the venues collection
import venueDB from '../models/venueModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

// get all venues
export const getAllVenues = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const venues = await venueDB.find({}).sort({createdAt: -1})
        res.status(200).json(venues)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a venue
export const getAVenue = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such venue in database"})
    }

    const venue = await venueDB.findById(id)

    // if no venue found by that id, we need to return the function so that it will not proceed
    if(!venue){
        return res.status(404).json({error: "No such venue in database"})
    }

    res.status(200).json(venue)
}


// post new venue
export const createVenue = async (req,res)=>{
    /* later make a component for the name 
        name = building name + floor level + room number
    */
    const {block, floorLevel, roomNumber, place, postcode, state, country } = req.body;

    // check the field that is empty
    let emptyFields = []

    // so for each field that empty, push the field properties to the array
    if(!place){
        emptyFields.push('place')
    }
    if(!postcode){
        emptyFields.push('postcode')
    }
    if(!state){
        emptyFields.push('state')
    }
    if(!country){
        emptyFields.push('country')
    }
    if(emptyFields.length > 0){
        // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    const building = `${block ? `${block}` : ''}${floorLevel ? `-${floorLevel}` : ''}${roomNumber ? `-${roomNumber}` : ''}`;

    try{
        // use .create() to generate and save the data
        const venue = await venueDB.create({ 
            building, place, postcode, state, country
        })

        res.status(200).json(venue)
    }catch(error){
        res.status(400).json({error: error.message})
    }

}

// delete a venue
export const deleteVenue = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such venue in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const venue = await venueDB.findOneAndDelete({_id: id})

    // if no venue found by that id, we need to return the function so that it will not proceed
    if(!venue){
        return res.status(404).json({error: "No such venue in database"})
    }

    res.status(200).json(venue)
}

// patch a venue
export const updateVenue = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params
    // get the json body to update as well

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such venue in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    // second argument is the value/body that you want to pass and update
    const venue = await venueDB.findOneAndUpdate({_id: id},{
        /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
        ...req.body
    })

    // if no venue found by that id, we need to return the function so that it will not proceed
    if(!venue){
        return res.status(404).json({error: "No such venue in database"})
    }

    res.status(200).json(venue)
}