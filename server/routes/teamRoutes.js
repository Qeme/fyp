// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    createTeam,
    getAllTeams,
    getATeam,
    deleteTeam,
    updateTeam
} from '../controllers/teamController.js'

// put the router API for get('/api/teams/') all
router.get('/',getAllTeams)

// put the router API for get('/api/teams/:id') single
router.get('/:id',getATeam)

// put the router API for post('/api/teams/')
router.post('/', createTeam)

// put the router API for delete('/api/teams/')
router.delete('/:id', deleteTeam)

// put the router API for patch('/api/teams/')
router.patch('/:id', updateTeam)

// export the router to be used inside index.js
export default router;