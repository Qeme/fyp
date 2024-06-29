// call the express router
import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
const router = express.Router()

// import the functions from the controller
import {
    getAllRounds,
    getARound,
    keyInMatch,
    clearMatch,
    stageOne,
    stageTwo,
    advanceBracket,
    nextRound
} from '../controllers/roundController.js'

// apply middleware
router.use(requireAuth)

// not that id === match_id and round_id ... there all unique

// put the router API for get('/api/rounds/') all
router.get('/',getAllRounds)

// put the router API for get('/api/rounds/:id') single
router.get('/:id',getARound)

// put the router API for get('/api/rounds/stageone/:tourid')
router.get('/stageone/:tourid', stageOne)

// put the router API for post('/api/rounds/advance/:tourid')
router.post('/advance/:tourid', advanceBracket)

// put the router API for get('/api/rounds/stagetwo/:tourid')
router.get('/stagetwo/:tourid', stageTwo)

// put the router API for post('/api/rounds/next/:tourid')
router.post('/next/:tourid', nextRound)

// put the router API for post('/api/rounds/:tourid/:id')
router.post('/:tourid/:id', keyInMatch)

// put the router API for post('/api/rounds/:tourid/:id')
router.delete('/:tourid/:id', clearMatch)

// export the router to be used inside index.js
export default router;