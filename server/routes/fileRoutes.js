// call the express router
import express from 'express'
import crypto from 'crypto'
import path from 'path'
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage'
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router()

// import the functions from the controller
import {
    getAllFiles,
    getAFile,
    getAnImage,
    uploadFile,
    deleteFile
} from '../controllers/fileController.js'

// Create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGOURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

// put the router API for get('/api/files/') all
router.get('/',getAllFiles)

// put the router API for get('/api/files/file/:filename') single
router.get('/file/:filename',getAFile)

// put the router API for get('/api/files/image/:filename') single
router.get('/image/:filename',getAnImage)

// put the router API for post('/api/files/') -> 'file' depends on the name="file" in the form input
router.post('/', uploadFile)

// put the router API for delete('/api/files/del/:_id')
router.delete('/del/:_id', deleteFile)

// export the router to be used inside index.js
export default router;