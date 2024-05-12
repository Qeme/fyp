const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const UserModel = require('./models/users');
require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/merntutorial')

// get the data body from client side as JSON format
app.use(express.json());
// user cors to link our backend to React front end
app.use(cors())

// add global middleware function for the API ; it is useful for user authentication later on
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next() // need to do this to make sure after the middleware is executed ,it can next() go to the targeted API
})

app.get('/', (req,res)=>{
    res.send("Welcome to MERN")
})

app.get('/getUsers', async (req, res) => {
    try {
        const users = await UserModel.find({}); // Using await to asynchronously wait for the query to complete
        res.status(200).json(users); // Sending all users as response
    } catch (err) {
        console.error('Error retrieving users:', err);
        res.status(500).json({ error: 'Internal server error' }); // Sending appropriate error response
    }
});

app.post('/createUser',async (req,res) => {
    try{
        const user = req.body
        const newUser = new UserModel(user)
        await newUser.save()
    } catch(error){
        console.error('Error creating new user:', err);
        res.status(500).json({ error: 'Internal server error' }); // Sending appropriate error response
    }
})

// save the port number inside .env file and use dotenv to call the PORT data
app.listen(process.env.PORT, ()=>{
    console.log("Server is running at port",process.env.PORT)
});