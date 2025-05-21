import { pool } from '../config/db.js';

export const addReview = async (req, res) => {
  try {
    const { id: bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    // Check existing review
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE book_id = $1 AND user_id = $2',
      [bookId, userId]
    );
    if (existing.rows.length) {
      return res.status(400).json({ error: 'You already reviewed this book' });
    }

    // Create review
    const { rows } = await pool.query(
      `INSERT INTO reviews (book_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [bookId, userId, rating, comment]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    const { rows } = await pool.query(
      `UPDATE reviews SET rating = $1, comment = $2 
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [rating, comment, id, userId]
    );

    if (!rows.length) return res.status(404).json({ error: 'Review not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const { rowCount } = await pool.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (!rowCount) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
