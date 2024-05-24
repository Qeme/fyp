// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    createTournament,
    assignTournament,
    startTournament,
    endTournament,
    getAllTournaments,
    getATournament,
    getPublishTournaments,
    publishTournament,
    deleteTournament,
    updateTournament
} from '../controllers/tournamentController.js'

// put the router API for get('/api/tournaments/') all
router.get('/',getAllTournaments)

// put the router API for get('/api/tournaments/publish') 
router.get('/publish',getPublishTournaments)

// put the router API for get('/api/tournaments/:id') single
router.get('/:id',getATournament)

// put the router API for post('/api/tournaments/create')
router.post('/create', createTournament)

// put the router API for post('/api/tournaments/publish/:id') single
router.post('/publish/:id',publishTournament)

// put the router API for post('/api/tournaments/assign/')
router.post('/assign/:id', assignTournament)

// put the router API for post('/api/tournaments/start/')
router.post('/start/:id', startTournament)

// put the router API for post('/api/tournaments/end/')
router.post('/end/:id', endTournament)

// put the router API for delete('/api/tournaments/')
router.delete('/:id', deleteTournament)

// put the router API for patch('/api/tournaments/')
router.patch('/:id', updateTournament)

// export the router to be used inside index.js
export default router;