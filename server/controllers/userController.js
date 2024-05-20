// call the users collection
import userDB from '../models/userModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'

// get all users
export const getAllUsers = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const users = await userDB.find({}).sort({createdAt: -1})
        res.status(200).json(users)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get a user
export const getAUser = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such user in database"})
    }

    const user = await userDB.findById(id)

    // if no user found by that id, we need to return the function so that it will not proceed
    if(!user){
        return res.status(404).json({error: "No such user in database"})
    }

    res.status(200).json(user)
}


// post new user
export const createUser = async (req,res)=>{
    const {name, email, password} = req.body;

    // check the field that is empty
    let emptyFields = []

    // so for each field that empty, push the field properties to the array
    if(!name){
        emptyFields.push('name')
    }
    if(!email){
        emptyFields.push('email')
    }
    if(!password){
        emptyFields.push('password')
    }
    if(emptyFields.length > 0){
        // if the emptyFields have value, we return universal error message means we avoid the system from continuing/proceeding
        return res.status(400).json({ error: 'Please fill in all the fields', emptyFields})
    }

    try{
        // use .create() to generate and save the data
        const user = await userDB.create({ 
            name, email, password
        })

        res.status(200).json(user)
    }catch(error){
        res.status(400).json({error: error.message})
    }

}

// delete a user
export const deleteUser = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such user in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const user = await userDB.findOneAndDelete({_id: id})

    // if no user found by that id, we need to return the function so that it will not proceed
    if(!user){
        return res.status(404).json({error: "No such user in database"})
    }

    res.status(200).json(user)
}

// patch a user
export const updateUser = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params
    // get the json body to update as well

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such user in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    // second argument is the value/body that you want to pass and update
    const user = await userDB.findOneAndUpdate({_id: id},{
        /*
        req.body typically refers to the body of a request in an Express.js application. 
        When you use req.body, you're accessing the body of the HTTP request that the client sends to your server.

        On the other hand, ...req.body is a JavaScript syntax for object spreading. It spreads the properties of req.body into a new object. 
        This can be useful if you want to clone or merge the properties of req.body into another object. It will not affect the original req.body
        */
        ...req.body
    })

    // if no user found by that id, we need to return the function so that it will not proceed
    if(!user){
        return res.status(404).json({error: "No such user in database"})
    }

    res.status(200).json(user)
}