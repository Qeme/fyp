// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    getAllMatches,
    getAMatch,
    deleteMatch,
    updateMatch,
    keyInMatch
} from '../controllers/matchController.js'

// put the router API for get('/api/matches/') all
router.get('/',getAllMatches)

// put the router API for get('/api/matches/:id') single
router.get('/:id',getAMatch)

// put the router API for post('/api/matches/:tourid/:id')
router.post('/:tourid/:id', keyInMatch)

// put the router API for delete('/api/matches/')
router.delete('/:id', deleteMatch)

// put the router API for patch('/api/matches/')
router.patch('/:id', updateMatch)

// export the router to be used inside index.js
export default router;