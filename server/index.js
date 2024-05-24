import express from 'express'
const app = express()
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
import TournamentOrganizer from 'tournament-organizer';

export const org = new TournamentOrganizer()

// call the tournaments router into the index.js
import tournamentRoutes from './routes/tournamentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import venueRoutes from './routes/venueRoutes.js'
import roundRoutes from './routes/roundRoutes.js'

mongoose.connect('mongodb://localhost:27017/ESMS-DB')
    .then(()=>{
        // save the port number inside .env file and use dotenv to call the PORT data
        app.listen(process.env.PORT, ()=>{
            console.log("Server is running at port",process.env.PORT)
        });
    })
    .catch((error)=>{
        console.log(error)
    });

// get the data body from client side as JSON format
app.use(express.json());
// user cors to link our backend to React front end
app.use(cors({
    origin: 'http://localhost:3000' // Change to your frontend URL
  }));

// add global middleware function for the API ; it is useful for user authentication later on
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next() // need to do this to make sure after the middleware is executed ,it can next() go to the targeted API
})

// use the router by replacing the get('/') from /api/tournaments
app.use('/api/tournaments',tournamentRoutes)
app.use('/api/users',userRoutes)
app.use('/api/teams',teamRoutes)
app.use('/api/games',gameRoutes)
app.use('/api/venues',venueRoutes)
app.use('/api/rounds',roundRoutes)