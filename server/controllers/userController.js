// call the users collection
import tournamentDB from '../models/tournamentModel.js'
import userDB from '../models/userModel.js'
import teamDB from '../models/teamModel.js'
import paymentDB from '../models/paymentModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { addFetchTournament } from '../functions/addFetchTournament.js'
import { updateFetchToDatabase } from '../functions/updateFetchToDatabase.js'
import { removeFetchTournament } from '../functions/removeFetchTournament.js'


//create a function to create the token whenever the user login/signup
// we take the _id as argument to be part of the token
const createToken = (_id) => {
    /* 
      1. use jwt.sign , we pass _id as payload information (dont put any sensitive data)
      2. second argument, the secret string that you only know
      3. the expired time taken for the token to exist and deceased
    */
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
  };


// get all users
export const getAllUsers = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const users = await userDB.find({}).select("-password").sort({createdAt: -1})
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
    const {name, email, password, role} = req.body;

    try {
        // now apply the userDB.signup here
        const user = await userDB.createuser(name, email, password, role);
    
        // pass the user information for testing
        res.status(200).json(user);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }

}

// post user compete inside the tournament
export const competeTournament = async (req,res) => {
    const {tourid} = req.params
    const {teamid, id} = req.body

    try{
        const tournament = await tournamentDB.findById(tourid)
        const user = await userDB.findById(id)

        if(tournament.meta.ticket.competitor === 0){
            const tour = addFetchTournament(tournament)

            var NAME;
            var ID;

            if(tournament.meta.representative.repType === 'individual'){
                NAME = user.name
                ID = user._id
            }
            if(tournament.meta.representative.repType === 'team'){
                try{
                    const team = await teamDB.findById(teamid)
                    NAME = team.name
                    ID = team._id
                }catch(error){
                    return res.status(400).json({error: `The team is not exist ` })
                }
            }
            
            // create the user as player for that particular tournament
            tour.createPlayer(NAME, ID)

            // update the tournament DB
            const updatedTournament = await updateFetchToDatabase(tour.id, tour)

            // after done, remove the tournament fetch data
            removeFetchTournament()
                
            res.status(200).json(updatedTournament)
            }else{
                // Check if the user has uploaded a receipt
                const payment = await paymentDB.findOne({ payerid: id, tournamentid: tourid, status: "pending" });

                if (!payment) {
                    return res.status(400).json({ error: "Receipt is required for registration" });
                }

                // should send to the organizer to verifyPayment later ................
                res.status(200).json("Your registration will be evaluated! Will update sooner")
            }
        
    }catch(error){
        res.status(400).json({error: `Deny Permission: Compete ` })
    }

}

// post user view inside the tournament
export const viewTournament = async (req,res) => {
    const {tourid} = req.params
    const {id} = req.body

    try {
        const tournament = await tournamentDB.findById(tourid);
        const user = await userDB.findById(id)
    
        if(tournament.meta.ticket.viewer === 0){
            // Check if the current user is a spectator
            if (!tournament.meta.spectator_id.includes(user._id)) {
                // Update the tournament by pushing the user id to spectator_id
                const updatedTournament = await tournamentDB.findByIdAndUpdate(
                    tourid,
                    { $push: { 'meta.spectator_id': { id: user._id } } },
                    { new: true } // This option returns the updated document
                );
        
                res.status(200).json(updatedTournament);
            } else {
                res.status(403).json({ error: "Deny Permission: Spectator ID already exist inside tournament" });
            }
        }else{
            // Check if the user has uploaded a receipt
            const payment = await paymentDB.findOne({ payerid: id, tournamentid: tourid, status: "pending" });

            if (!payment) {
                return res.status(400).json({ error: "Receipt is required for registration" });
            }

            res.status(200).json("Your registration will be evaluated! Will update sooner")
        }
        
    } catch (error) {
        res.status(400).json({ error: "Deny Permission: view" });
    }

}

// post user monitor inside the tournament
export const monitorTournament = async (req,res) => {
    const {tourid} = req.params
    const {id} = req.body

    const user = await userDB.findById(id)

    try {
        const tournament = await tournamentDB.findById(tourid);
    
        // Check if the current user is a referee
        if (!tournament.meta.referee_id.includes(user._id)) {
            // Update the tournament by pushing the user id to referee_id
            const updatedTournament = await tournamentDB.findByIdAndUpdate(
                tourid,
                { $push: { 'meta.referee_id': { id: user._id } } },
                { new: true } // This option returns the updated document
            );
    
            res.status(200).json(updatedTournament);
        } else {
            res.status(403).json({ error: "Deny Permission: Referee ID already exist inside tournament" });
        }
    } catch (error) {
        res.status(400).json({ error: "Deny Permission: Monitor" });
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
    },{new: true}) //give the latest

    // if no user found by that id, we need to return the function so that it will not proceed
    if(!user){
        return res.status(404).json({error: "No such user in database"})
    }

    res.status(200).json(user)
}

// post signup
export const signupUser = async (req,res)=>{
    const { name, email, password } = req.body
    try {
        // now apply the userDB.signup here
        const user = await userDB.signup(name, email, password);

         // create a token by passing the user._id
        const token = createToken(user._id) //maybe we need to pass the role as well
    
        // pass the user information for testing
        res.status(200).json({email, _id: user._id, role: user.role, token}); //pass the role into the json for frontend
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

// post login
export const loginUser = async (req,res)=>{
    const { email, password } = req.body

    try{
        const user = await userDB.login(email, password);

        // create token
        const token = createToken(user._id)

        res.status(200).json({email, _id: user._id, role: user.role, token}); //pass the role into the json for frontend
    }catch(error){
        res.status(400).json({error: error.message})
    }
}