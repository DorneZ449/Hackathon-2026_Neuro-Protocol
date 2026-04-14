import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import pool from '../database/db';

export const getAllData = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);

    if (!userResult.rows[0] || userResult.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const usersResult = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    const clientsResult = await pool.query('SELECT * FROM clients ORDER BY created_at DESC');
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    const interactionsResult = await pool.query('SELECT * FROM interactions ORDER BY created_at DESC');

    res.json({
      users: usersResult.rows,
      clients: clientsResult.rows,
      orders: ordersResult.rows,
      interactions: interactionsResult.rows
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
