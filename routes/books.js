import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createBook, getBooks, getBookDetails } from '../controllers/bookController.js';
import { addReview} from '../controllers/reviewController.js';

const router = express.Router();
router.post('/', authMiddleware, createBook);
router.get('/', getBooks);
router.get('/:id', getBookDetails);
router.post('/:id/reviews', authMiddleware, addReview);
export default router;
