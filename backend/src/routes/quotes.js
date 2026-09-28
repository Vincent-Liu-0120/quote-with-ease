import express from 'express'
import {
  getQuotes,
  createQuote,
  updateQuote,
  deleteQuote,
} from '../controllers/quoteController.js'

const router = express.Router()

router.get('/', getQuotes)
router.post('/', createQuote)
router.delete('/:id', deleteQuote)
router.put('/:id', updateQuote)

export default router