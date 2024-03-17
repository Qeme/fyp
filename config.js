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

const TournamentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    game:{
        type: String,
        required: true
    },
    platform:{
        type: String,
        required: true  
    },
    venue:{
        type: String,
        required: false  
    },
    stageOne: {
        consolation: {
            type: Boolean,
            required: false
        },
        format: {
            type: String,
            enum: ["single-elimination", "double-elimination", "stepladder", "swiss", "round-robin", "double-round-robin"],
            required: false
        },
        initialRound: {
            type: Number,
            required: false
        },
        maxPlayers: {
            type: Number,
            required: false
        },
        rounds: {
            type: Number,
            required: false
        }
    },
    stageTwo:{
        consolation:{
            type: Boolean,
            required: false
        },
        format:{
            type: String,
            enum: ["single-elimination", "double-elimination", "stepladder"],
            required: false
        },
        advance:{
            method:{
                type: String,
                enum: ["points", "rank", "all"],
                required: false
            },
            value:{
                type: Number,
                required: false
            }
        }
    },
    register:{
        open:{
            type: Date,
            required: true
        },
        close:{
            type: Date,
            required: true
        }
    },
    running:{
        start:{
            type: Date,
            required: true
        },
        end:{
            type: Date,
            required: true
        }
    },
    checkin:{
        type: Number,
        required: true
    },
    notification:{
        rules:{
            type: String,
            required: false
        },
        regulation:{
            type: String,
            required: false
        }
    },
    ticket:{
        competitor:{
            type: Number,
            required: true
        },
        viewer:{
            type: Number,
            required: true
        }
    }
    
})

//create the Collection part
const userinfo = new mongoose.model("users",LoginSchema)
const tourinfo = new mongoose.model("tournaments",TournamentSchema)


//export the module to be used inside server.js
export {userinfo,tourinfo}