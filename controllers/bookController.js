import { pool } from '../config/db.js';

export const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO books (title, author, genre, description, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, author, genre, description, req.userId]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM books';
    const params = [];

    if (author || genre) {
      query += ' WHERE ';
      const conditions = [];
      if (author) {
        conditions.push(`author ILIKE $${params.length + 1}`);
        params.push(`%${author}%`);
      }
      if (genre) {
        conditions.push(`genre = $${params.length + 1}`);
        params.push(genre);
      }
      query += conditions.join(' AND ');
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Book details
    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (!bookQuery.rows.length) return res.status(404).json({ error: 'Book not found' });

    // Average rating
    const avgQuery = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) AS average FROM reviews WHERE book_id = $1',
      [id]
    );

    // Reviews
    const reviewsQuery = await pool.query(
      `SELECT r.*, u.username FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE book_id = $1 LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    res.json({
      ...bookQuery.rows[0],
      averageRating: Number(avgQuery.rows[0].average).toFixed(1),
      reviews: reviewsQuery.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    const { rows } = await pool.query(
      `SELECT * FROM books 
       WHERE title ILIKE $1 OR author ILIKE $1`,
      [`%${q}%`]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
