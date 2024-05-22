// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    getAllMatches,
    getAMatch,
    keyInMatch,
    clearMatch,
    stageOne,
    stageTwo,
    advanceBracket
} from '../controllers/matchController.js'

// put the router API for get('/api/matches/') all
router.get('/',getAllMatches)

// put the router API for get('/api/matches/:id') single
router.get('/:id',getAMatch)

// put the router API for get('/api/matches/stageone/:tourid')
router.get('/stageone/:tourid', stageOne)

// put the router API for post('/api/matches/advance/:tourid')
router.post('/advance/:tourid', advanceBracket)

// put the router API for get('/api/matches/stagetwo/:tourid')
router.get('/stagetwo/:tourid', stageTwo)

// put the router API for post('/api/matches/:tourid/:id')
router.post('/:tourid/:id', keyInMatch)

// put the router API for post('/api/matches/:tourid/:id')
router.delete('/:tourid/:id', clearMatch)

// export the router to be used inside index.js
export default router;