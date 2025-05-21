import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { addReview, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();
router.post('/books/:id/reviews', authMiddleware, addReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);
export default router;
