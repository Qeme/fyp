// to handle _id format (if u use it), need to import back mongoose
import mongoose from 'mongoose'
import fileSystem from 'fs'
import paymentDB from '../models/paymentModel.js';
const { ObjectId } = mongoose.Types;

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
    const {topic} = req.fields;
    try {
        // Determine the query based on the presence of imageType
        const query = topic ? { 'metadata.topic': topic } : {};

        const filesCursor = gfs.find(query); // This retrieves all files in the bucket
        const files = await filesCursor.toArray(); // Convert the cursor to an array of files

        if (!files || files.length === 0) {
            return res.status(404).json({ error: topic ? `No ${topic} files exist` : 'No files exist' });
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
        const file = await gfs.find({ filename: filename }).toArray();
        
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
export const uploadFile = (req, res) => {
    const file = req.files.file;
    const user = req.user
    const { payertype, tournamentid, teamid, topic } = req.fields; 
    /* 
        userid -> the person that upload the file into database
        topic -> which file does it belongs to ['tour_banner','tour_bg','tour_qr','receipt']
    */

    const filePath = (new Date().getTime()) + "-" + file.name;

    const stream = fileSystem.createReadStream(file.path);
    const uploadStream = gfs.openUploadStream(filePath, {
        chunkSizeBytes: 1048576,
        metadata: {
            name: file.name,
            size: file.size,
            type: file.type,
            uploader: user._id, 
            tournamentid: tournamentid,
            topic: topic 
        }
    });

    // Pipe the read stream to the upload stream
    stream.pipe(uploadStream);

    uploadStream.on('finish', async function () {
        // Use uploadStream.id to get the file ID from GridFS
        const fileId = uploadStream.id;

        if (topic === "receipt") {
            try {
                const payment = await paymentDB.create({ 
                    receiptid: fileId, 
                    payerid: user._id,
                    payertype: payertype,
                    teamid: teamid,
                    tournamentid: tournamentid,
                    status: "pending"
                });
                res.status(200).json(payment);
            } catch (error) {
                console.error('Error creating payment:', error);
                res.status(500).json({ error: 'An error occurred while creating payment' });
            }
        } else {
            res.status(200).json("File uploaded successfully");
        }
    }).on('error', function (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'An error occurred while uploading the file' });
    });

};


// edit the file........


// delete an file
export const deleteFile = async (req, res) => {
    const {id} = req.params;
    try {
        await gfs.delete(new ObjectId(id)); // Ensure _id is converted to an ObjectId
        res.status(200).json({ message: 'Successfully deleted the file' });

        // if file is receipt, delete payment inside paymentDB

    } catch (error) {
        console.error('Error deleting file:', error); // Good for debugging
        res.status(500).json({ error: 'An error occurred while deleting the file' });
    }
}