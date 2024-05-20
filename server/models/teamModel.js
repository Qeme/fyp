import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const teamSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    manager:{
        type: String,
        required: true
    },
    players: [{
        _id:false,
        email: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        }
    }]
},{timestamps: true})

// teams is the name of the collection in DB
// teamSchema is the name of the Schema
const teamDB = mongoose.model('teams',teamSchema)
export default teamDB;