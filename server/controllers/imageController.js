// call the images collection
import venueDB from '../models/venueModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import Grid from 'gridfs-stream'

// Initialize GridFS stream when MongoDB connection is open
let gfs;
mongoose.connection.once('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});

// get all images
export const getAllImages = async (req,res)=>{
    try{
        // use .find({}) empty parantheses to find all the data
        // then .sort({createdAt: -1}) by descending order means from newest to oldest
        const images = await venueDB.find({}).sort({createdAt: -1})
        res.status(200).json(images)
    }catch(error){
        res.status(400).json({error: error.message})
    }
}

// get an image
export const getAnImage = async (req,res)=>{
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


// post upload new image
export const uploadImage = (req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(201).send({
        file: req.file,
        message: 'File uploaded successfully.'
    });
}

// delete an image
export const deleteImage = async (req,res)=>{
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