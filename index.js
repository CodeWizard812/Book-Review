import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
