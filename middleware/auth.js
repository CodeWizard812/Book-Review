import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication required');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [decoded.userId]);
    
    if (!user.rows[0]) throw new Error('User not found');
    req.userId = user.rows[0].id;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
