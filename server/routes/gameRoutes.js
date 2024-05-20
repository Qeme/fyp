// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    createGame,
    getAllGames,
    getAGame,
    deleteGame,
    updateGame
} from '../controllers/gameController.js'

// put the router API for get('/api/games/') all
router.get('/',getAllGames)

// put the router API for get('/api/games/:id') single
router.get('/:id',getAGame)

// put the router API for post('/api/games/')
router.post('/', createGame)

// put the router API for delete('/api/games/')
router.delete('/:id', deleteGame)

// put the router API for patch('/api/games/')
router.patch('/:id', updateGame)

// export the router to be used inside index.js
export default router;