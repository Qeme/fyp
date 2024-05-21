import mongoose from 'mongoose'
const Schema = mongoose.Schema

// add second argument 'timestamp: true' to make sure if any new object created, the time will be recorded as well
const tournamentSchema = new Schema({
    tour_id: {
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
            required: false,
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
            required: false,
            default: false
        },
        sorting:{
            type: String,
            enum: ["none" , "ascending" , "descending"],
            required: false,
            default: "none"
        },
        scoring:{
            bestOf: {
                type: Number,
                required: false,
                default: 1
            },
            bye: {
                type: Number,
                required: false,
                default: 1
            },
            draw: {
                type: Number,
                required: false,
                default: 0.5
            },
            loss: {
                type: Number,
                required: false,
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
                required: false,
                default: 1
            } 
        }
    },
    meta:{
        organizer_id:{
            type: String,
            required: false
        },
        game_id:{
            type: String,
            required: false
        },
        venue_id:{
            type: String,
            required: false  
        },
        register:{
            open:{
                type: Date,
                required: false
            },
            close:{
                type: Date,
                required: false
            }
        },
        running:{
            start:{
                type: Date,
                required: false
            },
            end:{
                type: Date,
                required: false
            }
        },
        checkin:{
            type: Number,
            required: false,
            default: 0
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
                required: false,
                default: 0
            },
            viewer:{
                type: Number,
                required: false,
                default: 0
            }
        },
        representative:{
            repType:{
                type: String,
                required: false,
                default: "individual"
            },
            numPlayers:{
                type: Number,
                required: false,
                default: 1
            }
        },
        referee_id: [{
            type: String,
            required: false
        }]
    }
},{timestamps: true})

// tournaments is the name of the collection in DB
// tournamentSchema is the name of the Schema
const tournamentDB = mongoose.model('tournaments',tournamentSchema)
export default tournamentDB;