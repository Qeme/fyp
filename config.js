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
    setting:{
        stageOne: {
            consolation: {
                type: Boolean,
                required: false,
                default: false
            },
            format: {
                type: String,
                enum: ["single-elimination", "double-elimination", "stepladder", "swiss", "round-robin", "double-round-robin"],
                required: false,
                default: "double-elimination"
            },
            initialRound: {
                type: Number,
                required: false,
                default: 1
            },
            maxPlayers: {
                type: Number,
                required: false,
                default: 2
            },
            rounds: {
                type: Number,
                required: false,
                default: 0
            }
        },
        stageTwo:{
            consolation:{
                type: Boolean,
                required: false,
                default: false
            },
            format:{
                type: String,
                enum: ["single-elimination", "double-elimination", "stepladder"],
                required: false,
                default: null
            },
            advance:{
                method:{
                    type: String,
                    enum: ["points", "rank", "all"],
                    required: false,
                    default: "all"
                },
                value:{
                    type: Number,
                    required: false,
                    default: 0
                }
            }
        },
        status:{
            type: String,
            enum: ["setup" , "stage-one" , "stage-two" , "complete"],
            required: true,
            default: "setup"
        },
        round:{
            type: Number,
            required: true,
            default: 0
        },
        players:{
            id:{
                type:[String],
                required: false,
                default: []
            },
            name:{
                type:[String],
                required: false,
                default: []
            }
        },
        matches:{
            id:{
                type:[String],
                required: false,
                default: []
            },
            round:{
                type:[Number],
                required: false,
                default: []
            },
            match:{
                type:[Number],
                required: false,
                default: []
            }
        },
        colored:{
            type: Boolean,
            required: true,
            default: false
        },
        sorting:{
            type: String,
            enum: ["none" , "ascending" , "descending"],
            required: true,
            default: "none"
        },
        scoring:{
            bestOf: {
                type: Number,
                required: true,
                default: 1
            },
            bye: {
                type: Number,
                required: true,
                default: 1
            },
            draw: {
                type: Number,
                required: true,
                default: 0.5
            },
            loss: {
                type: Number,
                required: true,
                default: 0
            },
            tiebreaks: [{
                type: String,
                enum: ["median buchholz", "solkoff", "sonneborn berger", "cumulative", "versus", "game win percentage", "opponent game win percentage", "opponent match win percentage", "opponent opponent match win percentage"],
                required: false,
                default: []
            }],
            win: {
                type: Number,
                required: true,
                default: 1
            } 
        }
    },
    meta:{
        organizer:{
            type: String,
            required: true,
            default: null
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
    }
  
})

//create the Collection part
const userinfo = new mongoose.model("users",LoginSchema)
const tourinfo = new mongoose.model("tournaments",TournamentSchema)


//export the module to be used inside server.js
export {userinfo,tourinfo}