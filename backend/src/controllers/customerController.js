const { validationResult } = require('express-validator');
const pool = require('../config/db');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    return true;
  }
  return false;
}

async function getCustomers(req, res, next) {
  try {
    const { search, archived = 'false' } = req.query;
    const showArchived = archived === 'true';
    let query = 'SELECT * FROM customers WHERE is_archived = $1';
    const params = [showArchived];

    if (search && search.trim()) {
      query += ` AND (full_name ILIKE $2 OR contact_number ILIKE $2 OR address ILIKE $2 OR internet_plan ILIKE $2)`;
      params.push(`%${search.trim()}%`);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { full_name, contact_number, address, internet_plan, status } = req.body;

    const result = await pool.query(
      `INSERT INTO customers (full_name, contact_number, address, internet_plan, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [full_name, contact_number, address, internet_plan, status]
    );

    res.status(201).json({ success: true, message: 'Customer created', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { full_name, contact_number, address, internet_plan, status } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET full_name = $1, contact_number = $2, address = $3, internet_plan = $4, status = $5, updated_at = NOW()
       WHERE id = $6 AND is_archived = false
       RETURNING *`,
      [full_name, contact_number, address, internet_plan, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Active customer not found' });
    }

    res.json({ success: true, message: 'Customer updated', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function archiveCustomer(req, res, next) {
  try {
    const result = await pool.query(
      `UPDATE customers
       SET is_archived = true, archived_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND is_archived = false
       RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Active customer not found' });
    }

    res.json({ success: true, message: 'Customer archived' });
  } catch (error) {
    next(error);
  }
}

async function restoreCustomer(req, res, next) {
  try {
    const result = await pool.query(
      `UPDATE customers
       SET is_archived = false, archived_at = NULL, updated_at = NOW()
       WHERE id = $1 AND is_archived = true
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Archived customer not found' });
    }

    res.json({ success: true, message: 'Customer restored', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  archiveCustomer,
  restoreCustomer,
};
