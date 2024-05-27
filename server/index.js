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
import imageRoutes from './routes/imageRoutes.js'

// Connect to the TournamentDB database
mongoose.connect(process.env.MONGOURI);

const conn = mongoose.connection;

conn.once('open', () => {
    console.log('Connection to database established');
});

// get the data body from client side as JSON format
app.use(express.json());
// user cors to link our backend to React front end
app.use(cors({
    origin: process.env.ORIGIN // Change to your frontend URL
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
app.use('/api/images',imageRoutes)

app.listen(process.env.PORT, () => 
    {console.log(`Server started on port ${process.env.PORT}`)
})