import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const gameSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    platform:{
        type: String,
        enum: ["online" , "physical" , "hybrid" ,"to be announced"],
        required: false,
        default: "to be announced"
    }
},{timestamps: true})

// games is the name of the collection in DB
// gameSchema is the name of the Schema
const gameDB = mongoose.model('games',gameSchema)
export default gameDB;