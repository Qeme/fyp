import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const roundSchema = new Schema({
    match_id:{
        type: String,
        required: true,
        unique: true // if you want the ID to be unique
    },
    bestOf:{
        type: Number,
        required: false
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

// rounds is the name of the collection in DB
// roundSchema is the name of the Schema
const roundDB = mongoose.model('rounds',roundSchema)
export default roundDB;