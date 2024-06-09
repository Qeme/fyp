// call the express router
import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
const router = express.Router()

// import the functions from the controller
import {
    createVenue,
    getAllVenues,
    getAVenue,
    deleteVenue,
    updateVenue
} from '../controllers/venueController.js'

// call for the requireAuth middleware where only admin can acess
router.use(requireAuth)

// put the router API for get('/api/venues/') all
router.get('/',getAllVenues)

// put the router API for get('/api/venues/:id') single
router.get('/:id',getAVenue)

// put the router API for post('/api/venues/')
router.post('/', createVenue)

// put the router API for delete('/api/venues/')
router.delete('/:id', deleteVenue)

// put the router API for patch('/api/venues/')
router.patch('/:id', updateVenue)

// export the router to be used inside index.js
export default router;