import { pool } from '../config/db.js';

export const createBook = async (req, res) => {
  try {
    const { title, author, genre, description } = req.body;
    const result = await pool.query(
      'INSERT INTO books (title, author, genre, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, genre, description, req.userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM books';
    const params = [];
    
    if (author || genre) {
      query += ' WHERE';
      if (author) {
        query += ' author ILIKE $1';
        params.push(`%${author}%`);
      }
      if (genre) {
        if (author) query += ' AND';
        query += ` genre = $${params.length + 1}`;
        params.push(genre);
      }
    }
    
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
