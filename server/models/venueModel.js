import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const venueSchema = new Schema({
    block:{
        type: String,
        required: true
    },
    floorLevel:{
        type: Number,
        required: false
    },
    roomNumber:{
        type: Number,
        required: false
    },
    building: {
        type: String,
        required: false,
    },
    place: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
},{timestamps: true})

// venues is the name of the collection in DB
// venueSchema is the name of the Schema
const venueDB = mongoose.model('venues',venueSchema)
export default venueDB;