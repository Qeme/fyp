const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

// call the workouts router into the index.js
const workoutRoutes = require('./routes/workouts')

mongoose.connect('mongodb://localhost:27017/merntutorial')
    .then(()=>{
        // save the port number inside .env file and use dotenv to call the PORT data
        app.listen(process.env.PORT, ()=>{
            console.log("Server is running at port",process.env.PORT)
        });
    })
    .catch((error)=>{
        console.log(error)
    });

// get the data body from client side as JSON format
app.use(express.json());
// user cors to link our backend to React front end
app.use(cors({
    origin: 'http://localhost:3000' // Change to your frontend URL
  }));

// add global middleware function for the API ; it is useful for user authentication later on
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next() // need to do this to make sure after the middleware is executed ,it can next() go to the targeted API
})

// use the router by replacing the get('/') from /api/workouts
app.use('/api/workouts',workoutRoutes)