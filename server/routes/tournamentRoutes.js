// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    createTournament,
    getAllTournaments,
    getATournament,
    deleteTournament,
    updateTournament
} from '../controllers/tournamentController.js'

// put the router API for get('/api/tournaments/') all
router.get('/',getAllTournaments)

// put the router API for get('/api/tournaments/:id') single
router.get('/:id',getATournament)

// put the router API for post('/api/tournaments/')
router.post('/', createTournament)

// put the router API for delete('/api/tournaments/')
router.delete('/:id', deleteTournament)

// put the router API for patch('/api/tournaments/')
router.patch('/:id', updateTournament)

// export the router to be used inside index.js
export default router;