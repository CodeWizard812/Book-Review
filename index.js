import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import reviewRoutes from './routes/reviews.js';
import { searchBooks } from './controllers/bookController.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection check
pool.connect((err) => {
  if (err) throw err;
  console.log('Connected to PostgreSQL');
});

// Routes
app.use('', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.get('/search', searchBooks);

// Health check
app.get('/', (req, res) => res.send('Book Review API'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
