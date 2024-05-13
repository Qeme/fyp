// call the express router
const express = require('express');
const router = express.Router()

const workoutdb = require('../models/workoutModel')

// put the router API for get('/api/workouts/') all
router.get('/',(req,res)=>{
    res.json({mssg: "GET all the workouts information"})
})

// put the router API for get('/api/workouts/:id') single
router.get('/:id',(req,res)=>{
    res.json({mssg: "GET single workout information"})
})

// put the router API for post('/api/workouts/')
router.post('/', async (req,res)=>{
    const {title, reps, load} = req.body;

    try{
        // use .create() to generate and save the data
        const workout = await workoutdb.create({title, reps, load})
        res.status(200).json(workout)
    }catch(error){
        res.status(400).json({error: error.message})
    }

    res.json({mssg: "POST a new workout information"})
})

// put the router API for delete('/api/workouts/')
router.delete('/:id',(req,res)=>{
    res.json({mssg: "DELETE single workout information"})
})

// put the router API for patch('/api/workouts/')
router.patch('/id',(req,res)=>{
    res.json({mssg: "PATCH single workout information"})
})

// export the router to be used inside index.js
module.exports = router