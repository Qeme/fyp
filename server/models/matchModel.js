import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const matchSchema = new Schema({
    match_id:{
        type: String,
        required: true,
        unique: true // if you want the ID to be unique
    },
    p1:{
        type: String,
        required: false
    },
    p2:{
        type: String,
        required: false
    },
    scoreP1: [{
        type: Number,
        required: false
    }],
    scoreP2: [{
        type: Number,
        required: false
    }]
},{timestamps: true})

// matches is the name of the collection in DB
// matchSchema is the name of the Schema
const matchDB = mongoose.model('matches',matchSchema)
export default matchDB;