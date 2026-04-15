import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { query } from '../database/db';

export const getClients = async (req: AuthRequest, res: Response) => {
  try {
    const { search, tag, company, page = '1', limit = '20' } = req.query;

    // Validate and cap limit (max 100)
    const MAX_LIMIT = 100;
    let limitNum = parseInt(limit as string);
    if (isNaN(limitNum) || limitNum < 1) limitNum = 20;
    if (limitNum > MAX_LIMIT) limitNum = MAX_LIMIT;

    const pageNum = parseInt(page as string);
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ error: 'Неверный формат page' });
    }

    // Build WHERE clause
    const baseFrom = `FROM clients c LEFT JOIN users u ON c.created_by = u.id WHERE 1=1`;
    let whereClause = '';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (tag) {
      whereClause += ` AND c.tags ILIKE $${paramIndex}`;
      params.push(`%${tag}%`);
      paramIndex++;
    }

    if (company) {
      whereClause += ` AND c.company ILIKE $${paramIndex}`;
      params.push(`%${company}%`);
      paramIndex++;
    }

    // Run count and data queries in parallel
    const offset = (pageNum - 1) * limitNum;
    const [countResult, dataResult] = await Promise.all([
      query(`SELECT COUNT(*) ${baseFrom}${whereClause}`, params),
      query(
        `SELECT c.*, u.name as creator_name ${baseFrom}${whereClause} ORDER BY c.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limitNum, offset]
      )
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      clients: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Ошибка получения клиентов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const getClientById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Parallel queries for better performance
    const [clientResult, ordersResult, interactionsResult, commentsResult] = await Promise.all([
      query(
        `SELECT c.*, u.name as creator_name
         FROM clients c
         LEFT JOIN users u ON c.created_by = u.id
         WHERE c.id = $1`,
        [clientId]
      ),
      query(
        'SELECT * FROM orders WHERE client_id = $1 ORDER BY order_date DESC',
        [clientId]
      ),
      query(
        `SELECT i.*, u.name as creator_name
         FROM interactions i
         LEFT JOIN users u ON i.created_by = u.id
         WHERE i.client_id = $1
         ORDER BY i.interaction_date DESC`,
        [clientId]
      ),
      query(
        `SELECT c.*, u.name as creator_name
         FROM comments c
         LEFT JOIN users u ON c.created_by = u.id
         WHERE c.client_id = $1
         ORDER BY c.created_at DESC`,
        [clientId]
      )
    ]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден' });
    }

    res.json({
      client: clientResult.rows[0],
      orders: ordersResult.rows,
      interactions: interactionsResult.rows,
      comments: commentsResult.rows
    });
  } catch (error) {
    console.error('Ошибка получения клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const createClient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, email, company, tags, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Имя клиента обязательно' });
    }

    // Validate name length (max 255)
    if (name.length > 255) {
      return res.status(400).json({ error: 'Имя не может превышать 255 символов' });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный формат email' });
      }
    }

    // Validate notes length (max 5000)
    if (notes && notes.length > 5000) {
      return res.status(400).json({ error: 'Заметки не могут превышать 5000 символов' });
    }

    const result = await query(
      `INSERT INTO clients (name, phone, email, company, tags, notes, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, phone, email, company, tags, notes, req.user?.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка создания клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, company, tags, notes } = req.body;

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Validate name length (max 255)
    if (name && name.length > 255) {
      return res.status(400).json({ error: 'Имя не может превышать 255 символов' });
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Неверный формат email' });
      }
    }

    // Validate notes length (max 5000)
    if (notes && notes.length > 5000) {
      return res.status(400).json({ error: 'Заметки не могут превышать 5000 символов' });
    }

    // Use role from JWT (no extra DB query needed)
    const isAdmin = req.user?.role === 'admin';

    // Update with ownership check (admin can update any client)
    const result = await query(
      `UPDATE clients
       SET name = $1, phone = $2, email = $3, company = $4, tags = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND (created_by = $8 OR $9 = true)
       RETURNING *`,
      [name, phone, email, company, tags, notes, clientId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден или у вас нет прав на его изменение' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка обновления клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    const clientId = parseInt(id);
    if (isNaN(clientId)) {
      return res.status(400).json({ error: 'Неверный формат ID' });
    }

    // Use role from JWT (no extra DB query needed)
    const isAdmin = req.user?.role === 'admin';

    // Delete with ownership check (admin can delete any client)
    const result = await query(
      'DELETE FROM clients WHERE id = $1 AND (created_by = $2 OR $3 = true) RETURNING *',
      [clientId, req.user?.id, isAdmin]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Клиент не найден или у вас нет прав на его удаление' });
    }

    res.json({ message: 'Клиент удален' });
  } catch (error) {
    console.error('Ошибка удаления клиента:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};
