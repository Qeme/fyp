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

// get all files
export const getAllFiles = async (req, res) => {
    try {
        const files = await gfs.files.find().toArray();
        
        // If no files found
        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files exist' });
        }

        // If files exist, return them as JSON
        res.status(200).json(files);
    } catch (error) {
        // Handle any errors that occurred during the query
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
}


// get a file
export const getAFile = async (req,res)=>{
    const {filename} = req.params
    try {
        const file = await gfs.files.findOne({filename: filename});
        
        // If no files found
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'No file exist' });
        }

        // If files exist, return them as JSON
        res.status(200).json(file);
    } catch (error) {
        // Handle any errors that occurred during the query
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
}


// get an image
export const getAnImage = async (req,res)=>{
    const {filename} = req.params
    gfs.createReadStream()
    try {
        const file = await gfs.files.findOne({filename: filename});
        
        // If no files found
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'No file exist' });
        }

        if (file.contentType === "image/jpeg" || file.contentType === "image/png"){
            const readstream = gfs.createReadStream({filename: filename});
            readstream.pipe(res);
        }else{
            res.status(404).json({ error: 'Not an image' })
        }

    } catch (error) {
        // Handle any errors that occurred during the query
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
    
}


// post upload new file
export const uploadFile = (req,res)=>{
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(201).send({
        file: req.file,
        message: 'File uploaded successfully.'
    });
}


// delete an file
export const deleteFile = async (req,res)=>{
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