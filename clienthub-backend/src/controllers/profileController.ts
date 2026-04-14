import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, avatar_url } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await query(
      'UPDATE users SET name = COALESCE($1, name), avatar_url = COALESCE($2, avatar_url) WHERE id = $3 RETURNING id, email, name, role, avatar_url',
      [name || null, avatar_url || null, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
