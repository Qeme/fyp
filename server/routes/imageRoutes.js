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
    getAllImages,
    getAnImage,
    uploadImage,
    deleteImage
} from '../controllers/imageController.js'

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

// put the router API for get('/api/images/') all
router.get('/',getAllImages)

// put the router API for get('/api/images/:id') single
router.get('/:id',getAnImage)

// put the router API for post('/api/images/') -> 'file' depends on the name="file" in the form input
router.post('/', upload.single('file'), uploadImage)

// put the router API for delete('/api/images/')
router.delete('/:id', deleteImage)

// export the router to be used inside index.js
export default router;