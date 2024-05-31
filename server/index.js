import express from 'express'
const app = express()
import http from 'http' // import http from express built-in package
import cors from 'cors'
import { Server } from 'socket.io' //import the class or interface Server from socket.io package
import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
import ExpressFormidable from 'express-formidable';
import TournamentOrganizer from 'tournament-organizer';
export const org = new TournamentOrganizer()

// call the tournaments router into the index.js
import tournamentRoutes from './routes/tournamentRoutes.js'
import userRoutes from './routes/userRoutes.js'
import teamRoutes from './routes/teamRoutes.js'
import gameRoutes from './routes/gameRoutes.js'
import venueRoutes from './routes/venueRoutes.js'
import roundRoutes from './routes/roundRoutes.js'
import fileRoutes from './routes/fileRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

// Connect to the TournamentDB database
mongoose.connect(process.env.MONGOURI);

const conn = mongoose.connection;

conn.once('open', () => {
    console.log('Connection to database established');
});

// get the data body from client side as JSON format
app.use(express.json());
// user cors to link our backend to React front end
app.use(cors());

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
app.use('/api/files',ExpressFormidable(),fileRoutes)
app.use('/api/payments',paymentRoutes)

const server = http.createServer(app);

// create a server connection
const io = new Server(server, {
    cors: {
        origin: process.env.ORIGIN // Change to your frontend URL
      }
})

// everytime io is on
io.on("connection", (socket) => {
    console.log(`A user has connected (${socket.id})`)

    // if user has disconnected or closing tab
    socket.on("disconnect", () => {
        console.log(`A user has disconnected (${socket.id})`)
    })
})

// apply server by change app with server
server.listen(process.env.PORT, () => 
    {console.log(`Server started on port ${process.env.PORT}`)
})