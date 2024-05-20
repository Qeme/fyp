// call the express router
import express from 'express'
const router = express.Router()

// import the functions from the controller
import {
    createUser,
    getAllUsers,
    getAUser,
    deleteUser,
    updateUser
} from '../controllers/userController.js'

// put the router API for get('/api/users/') all
router.get('/',getAllUsers)

// put the router API for get('/api/users/:id') single
router.get('/:id',getAUser)

// put the router API for post('/api/users/')
router.post('/', createUser)

// put the router API for delete('/api/users/')
router.delete('/:id', deleteUser)

// put the router API for patch('/api/users/')
router.patch('/:id', updateUser)

// export the router to be used inside index.js
export default router;