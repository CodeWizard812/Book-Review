import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createBook, getBooks} from '../controllers/bookController.js';

const router = express.Router();

router.post('/', authMiddleware, createBook);
router.get('/', getBooks);

export default router;
