const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
    return true;
  }
  return false;
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    },
  );
}

/**
 * REGISTER
 */
async function register(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { username, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, role, created_at`,
      [username, email, passwordHash],
    );

    const user = result.rows[0];
    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }
    next(error);
  }
}

/**
 * LOGIN
 */
async function login(req, res, next) {
  try {
    if (handleValidation(req, res)) return;

    const { username, password } = req.body;

    const result = await pool.query(
      `SELECT id, username, email, password_hash, role, created_at 
       FROM users 
       WHERE username = $1`,
      [username],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const dbUser = result.rows[0];

    const isMatch = await bcrypt.compare(password, dbUser.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // clean user object (IMPORTANT FIX)
    const user = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      role: dbUser.role,
      created_at: dbUser.created_at,
    };

    const token = createToken(user);

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET ME
 */
async function getMe(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, username, email, role, created_at 
       FROM users 
       WHERE id = $1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getMe,
};
