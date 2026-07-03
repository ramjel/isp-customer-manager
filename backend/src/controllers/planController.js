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

async function getPlans(req, res, next) {
  try {
    const result = await pool.query('SELECT * FROM internet_plans ORDER BY is_predefined DESC, name ASC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
}

async function createPlan(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { name, speed_mbps } = req.body;

    const result = await pool.query(
      `INSERT INTO internet_plans (name, speed_mbps, is_predefined)
       VALUES ($1, $2, false)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [name, speed_mbps || null]
    );

    res.status(201).json({ success: true, message: 'Plan saved', data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getPlans, createPlan };
