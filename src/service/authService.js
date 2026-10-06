const pool = require("../config/db");

// FIND USER BY EMAIL
const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT
            id,
            name,
            email,
            password,
            role,
            created_at
         FROM users
         WHERE email = $1`,
    [email],
  );

  return result.rows[0];
};

// CREATE USER
const createUser = async ({ name, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users
            (name, email, password, role)
         VALUES
            ($1, $2, $3, $4)
         RETURNING
            id,
            name,
            email,
            role,
            created_at`,
    [name, email, password, "USER"],
  );

  return result.rows[0];
};

// CHECK WHETHER ADMIN ALREADY EXISTS
const adminExists = async () => {
  const result = await pool.query(
    `SELECT id
         FROM users
         WHERE role = 'ADMIN'
         LIMIT 1`,
  );

  return result.rows.length > 0;
};

// CREATE ADMIN
const createAdmin = async ({ name, email, password }) => {
  const result = await pool.query(
    `INSERT INTO users
            (name, email, password, role)
         VALUES
            ($1, $2, $3, $4)
         RETURNING
            id,
            name,
            email,
            role,
            created_at`,
    [name, email, password, "ADMIN"],
  );

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  adminExists,
  createAdmin,
};
