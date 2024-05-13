const mongoose = require('mongoose');
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const workoutSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    reps:{
        type: Number,
        required: true
    },
    load:{
        type: Number,
        required: true
    }
},{timestamps: true})

// workouts is the name of the collection in DB
// workoutSchema is the name of the Schema
module.exports= mongoose.model('workouts',workoutSchema)