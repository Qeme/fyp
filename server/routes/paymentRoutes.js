// call the express router
import express from 'express'
import requireAuth from '../middleware/requireAuth.js'
const router = express.Router()

// import the functions from the controller
import {
    getAllPayments,
    getAPayment,
    deletePayment,
    verifyPayment
} from '../controllers/paymentController.js'

// use middleware to call the Auth
router.use(requireAuth)

// put the router API for get('/api/payments/') all
router.get('/',getAllPayments)

// put the router API for get('/api/payments/:id') single
router.get('/:id',getAPayment)

// put the router API for delete('/api/payments/:id')
router.delete('/:id', deletePayment)

// put the router API for get('/api/payments/:id') single
router.patch('/:id',verifyPayment)

// export the router to be used inside index.js
export default router;