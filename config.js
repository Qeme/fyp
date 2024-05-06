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
    team: [{
        _id: false,
        id: {
            type: String,
            ref: 'teams'
        }
    }]
})

const TournamentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true, // or false if not required
        unique: true // if you want the ID to be unique
    },
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
                default: "single-elimination"
            },
            initialRound: {
                type: Number,
                required: false,
                default: 1
            },
            maxPlayers: {
                type: Number,
                required: false,
                default: 0
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
            required: false,
            default: 0
        },
        players: [{
            _id: false, // to stop the _id from autogenerate
            id:{
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false,
                default: ""
            },
            active:{
                type: Boolean,
                required: false,
                default: true
            },
            value:{
                type: Number,
                required: false,
                default: 0
            },
            matches: [{
                _id: false, // similar to the players where we need to remove auto generated id
                bye: {
                    type: Boolean,
                    required: false,
                },
                color:{
                    type: String,
                    enum: ["w" , "b"],
                    required: false
                },
                draw:{
                    type: Number,
                    required: false,
                    default: 0
                },
                loss:{
                    type:Number,
                    required:false,
                    default:0
                },
                win:{
                    type:Number,
                    required:false,
                    default:0
                },
                id:{
                    type: String,
                    required: false
                },
                opponent:{
                    type: String,
                    required: false
                },
                pairUpDown:{
                    type: Boolean,
                    required: false
                }
            }],
            meta:{

            }//will be announce later
        }],
        // those players and matches should be in array object, not the attributes in array
        matches:[{
            _id: false, // avoid from the _id from auto generated
            id:{
                type:String,
                required: false,
                default: ""
            },
            round:{
                type:Number,
                required: false,
                default: ""
            },
            match:{
                type:Number,
                required: false,
                default: ""
            },
            active:{
                type: Boolean,
                required: false
            },
            bye:{
                type: Boolean,
                required: false
            },
            path:{
                loss:{
                    type: String,
                    required: false
                },
                win:{
                    type: String,
                    required: false
                }
            },
            player1:{
                draw:{
                    type: Number,
                    required: false
                },
                id:{
                    type: String,
                    required: false
                },
                loss:{
                    type: Number,
                    required: false
                },
                win:{
                    type: Number,
                    required: false
                }
            },
            player2:{
                draw:{
                    type: Number,
                    required: false
                },
                id:{
                    type: String,
                    required: false
                },
                loss:{
                    type: Number,
                    required: false
                },
                win:{
                    type: Number,
                    required: false
                }
            },
            meta:{
                // define later ...
            }
        }],
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
                //is it necessary to provide the user to not insert anything?????
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
        },
        representative:{
            repType:{
                type: String,
                required: true
            },
            numPlayers:{
                type: Number,
                required: false
            }
        },referee:[{
            type: String,
            required: false
        }]
    }
  
})

// team
const TeamSchema = new mongoose.Schema({
    id:{
        type: String,
        required: false
    },
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
})

// games inside each matches
const GameSchema = new mongoose.Schema({
    match_id:{
        type: String,
        ref: 'tournaments'
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
})

//create the Collection part
const userinfo = new mongoose.model("users",LoginSchema)
const tourinfo = new mongoose.model("tournaments",TournamentSchema)
const teaminfo = new mongoose.model("teams",TeamSchema)
const gameinfo = new mongoose.model("games",GameSchema)

//export the module to be used inside server.js
export {userinfo,tourinfo,teaminfo,gameinfo}