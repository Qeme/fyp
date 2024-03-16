import mongoose from "mongoose"
const connect = mongoose.connect("mongodb://localhost:27017/esms")

//check the connection if is it connected or not
connect.then(()=>{
    console.log("Database is connected succesfully")
}).catch(()=>{
    console.log("Database is failed to connect")
})

//create a Schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true 
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String], // Array of strings
        default: ['normal-user'] // Default value
    },
    tournaments: {
        type: [String],
        default: [null]
    }
})

//create the Collection part
const collection = new mongoose.model("users",LoginSchema)

//export the module to be used inside server.js
export default collection