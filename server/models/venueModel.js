import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const venueSchema = new Schema({
    building: {
        type: String,
        required: false,
    },
    place: {
        type: String,
        required: false
    },
    postcode: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    }
},{timestamps: true})

// venues is the name of the collection in DB
// venueSchema is the name of the Schema
const venueDB = mongoose.model('venues',venueSchema)
export default venueDB;