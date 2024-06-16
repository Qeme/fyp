// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import paymentDB from '../models/paymentModel.js';
import tournamentDB from '../models/tournamentModel.js';
import teamDB from '../models/teamModel.js';
import userDB from '../models/userModel.js';
import { addFetchTournament } from '../functions/addFetchTournament.js';
import { updateFetchToDatabase } from '../functions/updateFetchToDatabase.js';
import { removeFetchTournament } from '../functions/removeFetchTournament.js';


// get all payments
export const getAllPayments = async (req, res) => {
    const {status} = req.body;
    try {
        // Determine the query based on the status request
        const query = status ? { 'status': status } : {};
        const payments = await paymentDB.find(query).sort({createdAt: -1})
        res.status(200).json(payments)
    }catch(error){
        res.status(400).json({error: `An error occurred while fetching all payments. Additional information: ${error.message}`})
    }
};


// get a payment
export const getAPayment = async (req,res)=>{
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such id payment in database"})
    }

    const payment = await paymentDB.findById(id)

    // if no venue found by that id, we need to return the function so that it will not proceed
    if(!payment){
        return res.status(404).json({error: "No such payment in database"})
    }

    res.status(200).json(payment)
}

// delete an payment
export const deletePayment = async (req, res) => {
    // there is a params value which is id
    const {id} = req.params

    // check if the id inserted inside params are actually followed the _id format, return if it is invalid
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No such id venue in database"})
    }

    // use .findOneAndDelete and put the parameter as _id that equal to id
    const payment = await paymentDB.findOneAndDelete({_id: id})

    // if no venue found by that id, we need to return the function so that it will not proceed
    if(!payment){
        return res.status(404).json({error: `An error occurred while removing the payment. Additional information: ${error.message}`})
    }

    res.status(200).json(payment)
}


// patch status payment either accepted or rejected
export const verifyPayment = async (req, res) => {
    const { id } = req.params;

    // Check if the id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such id payment in database" });
    }

    try {
        // Find and update the payment status, returning the updated document
        const payment = await paymentDB.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true } // new: true will gave the latest updated payment record to work with
        );

        // If no payment found, return
        if (!payment) {
            return res.status(404).json({ error: "No such payment in database" });
        }

        const tournament = await tournamentDB.findById(payment.tournamentid);
        const tour = addFetchTournament(tournament);
        const user = await userDB.findById(payment.payerid);

        if (payment.status === "accepted") {
            let NAME;
            let ID;

            if(payment.payertype === 'competitor'){
                if (tournament.meta.representative.repType === 'individual') {
                    NAME = user.name;
                    ID = user._id;
                } else if (tournament.meta.representative.repType === 'team') {
                    try {
                        const team = await teamDB.findById(payment.teamid);
                        if (!team) {
                            return res.status(400).json({ error: "The team does not exist" });
                        }
                        NAME = team.name;
                        ID = team._id;
                    } catch (error) {
                        return res.status(400).json({ error: "The team does not exist" });
                    }
                }

                // Create new player into the tournament
                tour.createPlayer(NAME, ID);

                // Update the tournament DB
                await updateFetchToDatabase(tour.id, tour);

                // Remove the tournament fetch data
                removeFetchTournament();

                return res.status(200).json("Payment Accepted Successfully! Player / Team has been registered");
            }else if(payment.payertype === 'spectator'){
                
                // Update the tournament by pushing the user email to spectator_id
                await tournamentDB.findByIdAndUpdate(
                    payment.tournamentid,
                    { $push: { 'meta.spectator_id': { id: user.email } } }
                );
        
                return res.status(200).json("Payment Accepted Successfully! Spectator has been registered");
            }
        } else if (payment.status === "rejected") {
            return res.status(200).json("Payment Rejected Successfully");
        } else {
            return res.status(400).json({ error: "Invalid payment status" });
        }

    } catch (error) {
        return res.status(400).json({ error: `An error occurred while verifying the payment. Additional information: ${error.message}` });
    }
};
