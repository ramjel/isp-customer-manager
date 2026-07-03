const pool = require('../config/db');

async function getStats(req, res, next) {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE status = 'active')::int AS active,
        COUNT(*) FILTER (WHERE status = 'inactive')::int AS inactive
      FROM customers
      WHERE is_archived = false
    `);

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
