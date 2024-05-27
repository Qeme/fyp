// call the images collection
import venueDB from '../models/venueModel.js'
// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import fileSystem from 'fs'
import { ObjectId } from 'mongodb';

// Initialize GridFS stream when MongoDB connection is open
let gfs;
mongoose.connection.once('open', () => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads'
    });
    gfs = bucket;
});

// get all files
export const getAllFiles = async (req, res) => {
    try {
        const filesCursor = gfs.find(); // This retrieves all files in the bucket
        const files = await filesCursor.toArray(); // Convert the cursor to an array of files

        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files exist' });
        }

        // Mapping over files to get necessary data
        const filesInfo = files.map(file => ({
            filename: file.filename,
            fileId: file._id,
            contentType: file.contentType,
            size: file.length,
            uploadDate: file.uploadDate
        }));

        res.json(filesInfo); // Send the file information as JSON
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
};



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

// get an image (to render them - fetch)
export const getAnImage = async (req, res) => {
    const { filename } = req.params;
    try {
        // Checking if file exists in GridFS
        const file = await gfs.find({ filename: filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'No file exist' });
        }

        // Checking the content type
        if (file[0].metadata.type === "image/jpeg" || file[0].metadata.type === "image/png") {
            // Creating a read stream
            const readstream = gfs.openDownloadStream(file[0]._id);
            readstream.pipe(res);
        } else {
            res.status(404).json({ error: 'Not an image' });
        }
    } catch (error) {
        console.error('Error occurred: ', error);
        res.status(500).json({ error: 'An error occurred while fetching files' });
    }
};

// post upload new file
export const uploadFile = (req,res)=>{
    const file = req.files.file
    const filePath = (new Date().getTime()) + "-" + file.name

    fileSystem.createReadStream(file.path)
        .pipe(gfs.openUploadStream(filePath, {
            chunkSizeBytes: 1048576,
            metadata: {
                name: file.name,
                size: file.size,
                type: file.type
            }
        }))
        .on("finish", function () {
            res.status(200).json("Terbaik")
        })
}


// delete an file
export const deleteFile = async (req, res) => {
    const {_id} = req.params;
    try {
        await gfs.delete(ObjectId(_id)); // Ensure _id is converted to an ObjectId
        res.status(200).json({ message: 'Successfully deleted the file' });
    } catch (error) {
        console.error('Error deleting file:', error); // Good for debugging
        res.status(500).json({ error: 'An error occurred while deleting the file' });
    }
}